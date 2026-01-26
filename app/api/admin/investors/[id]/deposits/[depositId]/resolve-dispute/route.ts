import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// POST /api/admin/investors/[id]/deposits/[depositId]/resolve-dispute
// Admin responds to a disputed deposit and resets it to pending_confirmation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; depositId: string }> }
) {
  try {
    const { id: investorId, depositId } = await params
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

    // Check if deposit is in disputed status
    if (deposit.confirmationStatus !== 'disputed') {
      return NextResponse.json(
        { error: `Deposit is not disputed. Current status: ${deposit.confirmationStatus}` },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { response } = body

    if (!response || response.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a response to the dispute' },
        { status: 400 }
      )
    }

    // Update the deposit - reset to pending_confirmation with admin's response
    const updatedDeposit = await db.investorDeposit.update({
      where: { id: depositId },
      data: {
        confirmationStatus: 'pending_confirmation',
        notes: `[Admin Response to Dispute]: ${response}\n\n[Previous Investor Dispute]: ${deposit.investorNotes || 'N/A'}`,
        investorNotes: null, // Clear the dispute reason
      },
    })

    console.log(`✅ Admin resolved dispute for deposit: ${depositId} - Investor: ${investor.investorNumber}`)

    return NextResponse.json({
      message: 'Dispute resolved. Deposit is now awaiting investor confirmation.',
      deposit: {
        id: updatedDeposit.id,
        confirmationStatus: updatedDeposit.confirmationStatus,
      },
    })
  } catch (error) {
    console.error('Error resolving deposit dispute:', error)
    return NextResponse.json(
      { error: 'Failed to resolve dispute' },
      { status: 500 }
    )
  }
}
