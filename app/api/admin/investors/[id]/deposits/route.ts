import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// POST /api/admin/investors/[id]/deposits - Record investor deposit
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

    const investor = await db.investor.findUnique({
      where: { id },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      grossAmount,
      charges = 0,
      amount,
      paymentMethod,
      referenceNumber,
      receiptUrl,
      notes,
    } = body

    // Validate amounts
    if (!grossAmount || grossAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid gross amount' },
        { status: 400 }
      )
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid net amount' },
        { status: 400 }
      )
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      )
    }

    // Create deposit record with pending_confirmation status
    // The investor must confirm before funds are added to their balance
    const deposit = await db.investorDeposit.create({
      data: {
        investorId: investor.id,
        grossAmount,
        charges: charges || 0,
        amount,
        paymentMethod,
        referenceNumber: referenceNumber || null,
        receiptUrl: receiptUrl || null,
        notes: notes || null,
        confirmationStatus: 'pending_confirmation',
        depositedAt: new Date(),
      },
    })

    console.log(`✅ Deposit recorded (pending confirmation): ${investor.investorNumber} - Gross: ${grossAmount}, Charges: ${charges}, Net: ${amount}`)

    return NextResponse.json({
      deposit,
      message: 'Deposit recorded. Waiting for investor confirmation before funds are credited.',
    }, { status: 201 })
  } catch (error) {
    console.error('Error recording deposit:', error)
    return NextResponse.json(
      { error: 'Failed to record deposit' },
      { status: 500 }
    )
  }
}
