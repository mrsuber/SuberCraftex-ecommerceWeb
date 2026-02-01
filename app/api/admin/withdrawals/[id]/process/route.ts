import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// POST /api/admin/withdrawals/[id]/process - Process withdrawal request
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getSession()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const withdrawal = await db.withdrawalRequest.findUnique({
      where: { id },
      include: {
        investor: true,
      },
    })

    if (!withdrawal) {
      return NextResponse.json(
        { error: 'Withdrawal request not found' },
        { status: 404 }
      )
    }

    // Allow processing pending, approved, and disputed withdrawals
    if (!['pending', 'approved', 'disputed'].includes(withdrawal.status)) {
      return NextResponse.json(
        { error: `Withdrawal request cannot be processed in status: ${withdrawal.status}` },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { action, adminNotes, approvedAmount, rejectionReason, adminReceiptUrl } = body

    if (!action || !['approve', 'reject', 'complete'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be approve, reject, or complete' },
        { status: 400 }
      )
    }

    // Require receipt URL for complete action on cash/profit withdrawals
    if (action === 'complete' && ['cash', 'profit'].includes(withdrawal.type) && !adminReceiptUrl) {
      return NextResponse.json(
        { error: 'Payment receipt URL is required to complete cash/profit withdrawals' },
        { status: 400 }
      )
    }

    // Process based on action
    const result = await db.$transaction(async (tx) => {
      if (action === 'reject') {
        const updated = await tx.withdrawalRequest.update({
          where: { id },
          data: {
            status: 'rejected',
            adminNotes: adminNotes || null,
            rejectionReason: rejectionReason || null,
            reviewedBy: user.id,
            reviewedAt: new Date(),
          },
        })

        return { withdrawal: updated }
      }

      if (action === 'approve') {
        const updated = await tx.withdrawalRequest.update({
          where: { id },
          data: {
            status: 'approved',
            approvedAmount: approvedAmount || withdrawal.amount,
            adminNotes: adminNotes || null,
            reviewedBy: user.id,
            reviewedAt: new Date(),
          },
        })

        return { withdrawal: updated }
      }

      // Complete withdrawal - set to awaiting investor confirmation
      if (action === 'complete') {
        // For cash/profit withdrawals, admin sends money and uploads receipt
        // Investor then confirms receipt before balance is deducted
        const updated = await tx.withdrawalRequest.update({
          where: { id },
          data: {
            status: 'awaiting_investor_confirmation',
            adminReceiptUrl: adminReceiptUrl || null,
            processedBy: user.id,
            processedAt: new Date(),
            adminNotes: adminNotes || null,
          },
        })

        return { withdrawal: updated }
      }

      return {}
    })

    console.log(`✅ Withdrawal ${action}d: ${withdrawal.requestNumber} - ${withdrawal.type}`)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error processing withdrawal:', error)
    return NextResponse.json(
      { error: 'Failed to process withdrawal' },
      { status: 500 }
    )
  }
}
