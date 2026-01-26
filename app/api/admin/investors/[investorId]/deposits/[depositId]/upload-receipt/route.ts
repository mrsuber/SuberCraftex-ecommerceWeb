import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// POST /api/admin/investors/[investorId]/deposits/[depositId]/upload-receipt
// Admin uploads receipt for a deposit request, moving it to pending_confirmation status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ investorId: string; depositId: string }> }
) {
  try {
    const { investorId, depositId } = await params
    const user = await getSession()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    // Verify investor exists
    const investor = await db.investor.findUnique({
      where: { id: investorId },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor not found' },
        { status: 404 }
      )
    }

    // Get the deposit
    const deposit = await db.investorDeposit.findUnique({
      where: { id: depositId },
    })

    if (!deposit) {
      return NextResponse.json(
        { error: 'Deposit not found' },
        { status: 404 }
      )
    }

    // Verify deposit belongs to this investor
    if (deposit.investorId !== investorId) {
      return NextResponse.json(
        { error: 'Deposit does not belong to this investor' },
        { status: 403 }
      )
    }

    // Check if deposit is in awaiting_receipt status
    if (deposit.confirmationStatus !== 'awaiting_receipt') {
      return NextResponse.json(
        { error: `Deposit is not awaiting receipt. Current status: ${deposit.confirmationStatus}` },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { receiptUrl, charges, netAmount, notes } = body

    if (!receiptUrl) {
      return NextResponse.json(
        { error: 'Receipt URL is required' },
        { status: 400 }
      )
    }

    // Calculate net amount if not provided
    const grossAmount = deposit.grossAmount
    const chargesAmount = charges || 0
    const calculatedNetAmount = netAmount || (Number(grossAmount) - chargesAmount)

    // Update the deposit with receipt and move to pending_confirmation
    const updatedDeposit = await db.investorDeposit.update({
      where: { id: depositId },
      data: {
        receiptUrl,
        charges: chargesAmount,
        amount: calculatedNetAmount,
        notes: notes || deposit.notes,
        confirmationStatus: 'pending_confirmation',
        depositedAt: new Date(), // Update to when receipt was uploaded
      },
    })

    console.log(`✅ Receipt uploaded for deposit: ${depositId} - Investor: ${investor.investorNumber}`)

    return NextResponse.json({
      message: 'Receipt uploaded. Waiting for investor confirmation.',
      deposit: {
        id: updatedDeposit.id,
        grossAmount: updatedDeposit.grossAmount.toString(),
        charges: updatedDeposit.charges.toString(),
        amount: updatedDeposit.amount.toString(),
        confirmationStatus: updatedDeposit.confirmationStatus,
      },
    })
  } catch (error) {
    console.error('Error uploading receipt:', error)
    return NextResponse.json(
      { error: 'Failed to upload receipt' },
      { status: 500 }
    )
  }
}
