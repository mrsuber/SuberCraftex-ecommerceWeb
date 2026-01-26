import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// GET /api/investors/deposits - Get investor's deposits
export async function GET(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user || user.role !== 'investor') {
      return NextResponse.json(
        { error: 'Unauthorized. Investor access required.' },
        { status: 401 }
      )
    }

    const investor = await db.investor.findUnique({
      where: { userId: user.id },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor profile not found' },
        { status: 404 }
      )
    }

    const deposits = await db.investorDeposit.findMany({
      where: { investorId: investor.id },
      orderBy: { createdAt: 'desc' },
    })

    // Transform to camelCase for API response
    const transformedDeposits = deposits.map(deposit => ({
      id: deposit.id,
      depositNumber: `DEP-${deposit.id.slice(0, 8).toUpperCase()}`,
      grossAmount: deposit.grossAmount.toString(),
      charges: deposit.charges.toString(),
      amount: deposit.amount.toString(),
      paymentMethod: deposit.paymentMethod,
      referenceNumber: deposit.referenceNumber,
      investorReceiptUrl: deposit.investorReceiptUrl, // Investor uploaded receipt
      receiptUrl: deposit.receiptUrl, // Admin receipt
      notes: deposit.notes,
      confirmationStatus: deposit.confirmationStatus,
      confirmedAt: deposit.confirmedAt?.toISOString() || null,
      adminConfirmedAt: deposit.adminConfirmedAt?.toISOString() || null,
      investorNotes: deposit.investorNotes,
      depositedAt: deposit.depositedAt.toISOString(),
      createdAt: deposit.createdAt.toISOString(),
    }))

    return NextResponse.json(transformedDeposits)
  } catch (error) {
    console.error('Error fetching deposits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deposits' },
      { status: 500 }
    )
  }
}

// POST /api/investors/deposits - Request a new deposit
export async function POST(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user || user.role !== 'investor') {
      return NextResponse.json(
        { error: 'Unauthorized. Investor access required.' },
        { status: 401 }
      )
    }

    const investor = await db.investor.findUnique({
      where: { userId: user.id },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor profile not found' },
        { status: 404 }
      )
    }

    // Check if agreement is accepted
    if (!investor.agreementAccepted) {
      return NextResponse.json(
        { error: 'Please accept the investment agreement first' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { amount, paymentMethod, notes } = body

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      )
    }

    if (amount < 1000) {
      return NextResponse.json(
        { error: 'Minimum deposit amount is 1,000 FCFA' },
        { status: 400 }
      )
    }

    // Validate payment method
    if (!paymentMethod || !['cash', 'mobile_money'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Valid payment method is required (cash or mobile_money)' },
        { status: 400 }
      )
    }

    // Create the deposit request
    // Status flow for mobile money:
    // 1. awaiting_payment - Investor needs to send money
    // 2. awaiting_admin_confirmation - Investor uploaded receipt, admin needs to confirm
    // 3. pending_confirmation - Admin confirmed, investor needs to confirm
    // 4. confirmed - Complete
    // For cash: awaiting_receipt -> pending_confirmation -> confirmed
    const initialStatus = paymentMethod === 'mobile_money' ? 'awaiting_payment' : 'awaiting_receipt'

    const deposit = await db.investorDeposit.create({
      data: {
        investorId: investor.id,
        grossAmount: amount,
        charges: 0, // Will be updated by admin when they confirm
        amount: amount, // Net amount, will be recalculated after charges
        paymentMethod,
        notes: notes || null,
        confirmationStatus: initialStatus,
      },
    })

    const depositNumber = `DEP-${deposit.id.slice(0, 8).toUpperCase()}`

    console.log(`✅ Deposit request created by investor: ${investor.investorNumber} - ${amount} ${paymentMethod}`)

    return NextResponse.json({
      id: deposit.id,
      depositNumber,
      grossAmount: deposit.grossAmount.toString(),
      amount: deposit.amount.toString(),
      paymentMethod: deposit.paymentMethod,
      confirmationStatus: deposit.confirmationStatus,
      message: paymentMethod === 'cash'
        ? 'Deposit request submitted. Please hand the cash to the admin.'
        : 'Deposit request created. Please send the mobile money to the number shown, then upload your receipt.',
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating deposit request:', error)
    return NextResponse.json(
      { error: 'Failed to create deposit request' },
      { status: 500 }
    )
  }
}
