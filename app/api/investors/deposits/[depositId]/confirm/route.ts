import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// POST /api/investors/deposits/[depositId]/confirm - Investor confirms or disputes a deposit
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ depositId: string }> }
) {
  try {
    const { depositId } = await params
    const user = await getSession()

    if (!user || user.role !== 'investor') {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in as an investor.' },
        { status: 401 }
      )
    }

    // Get investor profile
    const investor = await db.investor.findUnique({
      where: { userId: user.id },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor profile not found' },
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

    // Verify this deposit belongs to the investor
    if (deposit.investorId !== investor.id) {
      return NextResponse.json(
        { error: 'This deposit does not belong to you' },
        { status: 403 }
      )
    }

    // Check if already confirmed or disputed
    if (deposit.confirmationStatus !== 'pending_confirmation') {
      return NextResponse.json(
        { error: `Deposit has already been ${deposit.confirmationStatus}` },
        { status: 400 }
      )
    }

    const body = await request.json()
    // Support both formats:
    // Old: { action: 'confirm' | 'dispute', notes: string }
    // New: { confirmed: boolean, feedback: string }
    const { action, notes, confirmed, feedback } = body

    // Normalize to action format
    const normalizedAction = action || (confirmed === true ? 'confirm' : confirmed === false ? 'dispute' : null)
    const normalizedNotes = notes || feedback

    if (!normalizedAction || !['confirm', 'dispute'].includes(normalizedAction)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "confirm" or "dispute", or use confirmed: true/false' },
        { status: 400 }
      )
    }

    if (normalizedAction === 'confirm') {
      // Confirm the deposit and add funds to investor's balance
      const result = await db.$transaction(async (tx) => {
        // Update deposit status
        const updatedDeposit = await tx.investorDeposit.update({
          where: { id: depositId },
          data: {
            confirmationStatus: 'confirmed',
            confirmedAt: new Date(),
            investorNotes: normalizedNotes || null,
          },
        })

        // Update investor balances
        const updatedInvestor = await tx.investor.update({
          where: { id: investor.id },
          data: {
            cashBalance: {
              increment: deposit.amount,
            },
            totalInvested: {
              increment: deposit.amount,
            },
          },
        })

        // Create transaction record
        await tx.investorTransaction.create({
          data: {
            investorId: investor.id,
            type: 'deposit',
            amount: deposit.amount,
            balanceAfter: updatedInvestor.cashBalance,
            profitAfter: updatedInvestor.profitBalance,
            description: `Deposit confirmed - ${deposit.paymentMethod}${deposit.referenceNumber ? ` (Ref: ${deposit.referenceNumber})` : ''}`,
            notes: `Gross: ${deposit.grossAmount}, Charges: ${deposit.charges}, Net: ${deposit.amount}`,
            createdBy: user.id,
          },
        })

        return { deposit: updatedDeposit, investor: updatedInvestor }
      })

      console.log(`✅ Deposit confirmed by investor: ${investor.investorNumber} - ${deposit.amount}`)

      return NextResponse.json({
        message: 'Deposit confirmed successfully. Funds have been added to your balance.',
        deposit: result.deposit,
        newBalance: result.investor.cashBalance.toString(),
      })
    } else {
      // Dispute the deposit
      if (!normalizedNotes) {
        return NextResponse.json(
          { error: 'Please provide a reason for disputing this deposit' },
          { status: 400 }
        )
      }

      const updatedDeposit = await db.investorDeposit.update({
        where: { id: depositId },
        data: {
          confirmationStatus: 'disputed',
          investorNotes: normalizedNotes,
        },
      })

      console.log(`⚠️ Deposit disputed by investor: ${investor.investorNumber} - ${deposit.amount} - Reason: ${normalizedNotes}`)

      return NextResponse.json({
        message: 'Deposit disputed. Our team will review and contact you.',
        deposit: updatedDeposit,
      })
    }
  } catch (error) {
    console.error('Error processing deposit confirmation:', error)
    return NextResponse.json(
      { error: 'Failed to process confirmation' },
      { status: 500 }
    )
  }
}
