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
      amount,
      paymentMethod,
      referenceNumber,
      receiptUrl,
      notes,
    } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid deposit amount' },
        { status: 400 }
      )
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      )
    }

    // Create deposit record and update investor balances in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create deposit record
      const deposit = await tx.investorDeposit.create({
        data: {
          investorId: investor.id,
          amount,
          paymentMethod,
          referenceNumber: referenceNumber || null,
          receiptUrl: receiptUrl || null,
          notes: notes || null,
          depositedAt: new Date(),
        },
      })

      // Update investor balances
      const updatedInvestor = await tx.investor.update({
        where: { id: investor.id },
        data: {
          cashBalance: {
            increment: amount,
          },
          totalInvested: {
            increment: amount,
          },
        },
      })

      // Create transaction record
      await tx.investorTransaction.create({
        data: {
          investorId: investor.id,
          type: 'deposit',
          amount,
          balanceAfter: updatedInvestor.cashBalance,
          profitAfter: updatedInvestor.profitBalance,
          description: `Deposit via ${paymentMethod}${referenceNumber ? ` (Ref: ${referenceNumber})` : ''}`,
          notes: notes || null,
          createdBy: user.id,
        },
      })

      return { deposit, updatedInvestor }
    })

    console.log(`✅ Deposit recorded: ${investor.investorNumber} - ${amount}`)

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error recording deposit:', error)
    return NextResponse.json(
      { error: 'Failed to record deposit' },
      { status: 500 }
    )
  }
}
