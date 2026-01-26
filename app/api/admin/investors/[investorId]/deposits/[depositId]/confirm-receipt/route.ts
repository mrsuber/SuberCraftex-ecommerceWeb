import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// POST /api/admin/investors/[investorId]/deposits/[depositId]/confirm-receipt
// Admin confirms investor's uploaded receipt and sets charges
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

    // Check if deposit is in awaiting_admin_confirmation status
    if (deposit.confirmationStatus !== 'awaiting_admin_confirmation') {
      return NextResponse.json(
        { error: `Deposit is not awaiting admin confirmation. Current status: ${deposit.confirmationStatus}` },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { charges, notes, action } = body

    if (action === 'reject') {
      // Admin rejects the receipt
      const updatedDeposit = await db.investorDeposit.update({
        where: { id: depositId },
        data: {
          confirmationStatus: 'awaiting_payment', // Back to step 1
          notes: notes || 'Receipt rejected. Please resubmit.',
          investorReceiptUrl: null, // Clear the rejected receipt
        },
      })

      console.log(`⚠️ Admin rejected deposit receipt: ${depositId} - Investor: ${investor.investorNumber}`)

      return NextResponse.json({
        message: 'Receipt rejected. Investor will need to resubmit.',
        deposit: {
          id: updatedDeposit.id,
          confirmationStatus: updatedDeposit.confirmationStatus,
        },
      })
    }

    // Admin confirms the receipt
    const chargesAmount = parseFloat(charges) || 0
    const grossAmount = Number(deposit.grossAmount)
    const netAmount = grossAmount - chargesAmount

    if (netAmount <= 0) {
      return NextResponse.json(
        { error: 'Net amount must be greater than zero' },
        { status: 400 }
      )
    }

    // Update the deposit - move to pending_confirmation for investor final confirmation
    const updatedDeposit = await db.investorDeposit.update({
      where: { id: depositId },
      data: {
        charges: chargesAmount,
        amount: netAmount,
        notes: notes || null,
        confirmationStatus: 'pending_confirmation',
        adminConfirmedAt: new Date(),
      },
    })

    console.log(`✅ Admin confirmed deposit receipt: ${depositId} - Investor: ${investor.investorNumber} - Charges: ${chargesAmount}`)

    return NextResponse.json({
      message: 'Receipt confirmed. Waiting for investor final confirmation.',
      deposit: {
        id: updatedDeposit.id,
        grossAmount: updatedDeposit.grossAmount.toString(),
        charges: updatedDeposit.charges.toString(),
        amount: updatedDeposit.amount.toString(),
        confirmationStatus: updatedDeposit.confirmationStatus,
      },
    })
  } catch (error) {
    console.error('Error confirming deposit receipt:', error)
    return NextResponse.json(
      { error: 'Failed to confirm receipt' },
      { status: 500 }
    )
  }
}
