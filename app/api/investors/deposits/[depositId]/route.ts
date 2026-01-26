import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// GET /api/investors/deposits/[depositId] - Get a single deposit
export async function GET(
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

    // Transform to camelCase for API response
    const response = {
      id: deposit.id,
      depositNumber: `DEP-${deposit.id.slice(0, 8).toUpperCase()}`,
      grossAmount: deposit.grossAmount.toString(),
      charges: deposit.charges.toString(),
      amount: deposit.amount.toString(),
      // Calculate admin fee percentage for display
      adminFeePercentage: deposit.grossAmount.gt(0)
        ? ((Number(deposit.charges) / Number(deposit.grossAmount)) * 100).toFixed(1)
        : '0',
      adminFeeAmount: deposit.charges.toString(),
      netAmount: deposit.amount.toString(),
      paymentMethod: deposit.paymentMethod,
      referenceNumber: deposit.referenceNumber,
      receiptUrl: deposit.receiptUrl,
      receiptImage: deposit.receiptUrl, // Alias for mobile app
      notes: deposit.notes,
      confirmationStatus: deposit.confirmationStatus,
      confirmedAt: deposit.confirmedAt?.toISOString() || null,
      investorNotes: deposit.investorNotes,
      investorFeedback: deposit.investorNotes, // Alias for mobile app
      depositedAt: deposit.depositedAt.toISOString(),
      createdAt: deposit.createdAt.toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching deposit:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deposit' },
      { status: 500 }
    )
  }
}
