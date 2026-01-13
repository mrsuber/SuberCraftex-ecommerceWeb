import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { Decimal } from '@prisma/client/runtime/library'

// GET /api/investors/withdrawals - Get investor's withdrawal requests
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

    const withdrawals = await db.withdrawalRequest.findMany({
      where: { investorId: investor.id },
      orderBy: { requestedAt: 'desc' },
    })

    return NextResponse.json(withdrawals)
  } catch (error) {
    console.error('Error fetching withdrawals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch withdrawals' },
      { status: 500 }
    )
  }
}

// POST /api/investors/withdrawals - Create withdrawal request
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

    if (investor.status !== 'active') {
      return NextResponse.json(
        { error: 'Investor account is not active' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      type,
      amount,
      productId,
      variantId,
      equipmentId,
      quantity,
      requestReason,
      investorNotes,
    } = body

    if (!type) {
      return NextResponse.json(
        { error: 'Withdrawal type is required' },
        { status: 400 }
      )
    }

    // Validate based on withdrawal type
    if (type === 'cash') {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { error: 'Valid amount is required for cash withdrawal' },
          { status: 400 }
        )
      }

      if (new Decimal(investor.cashBalance).lt(amount)) {
        return NextResponse.json(
          { error: 'Insufficient cash balance' },
          { status: 400 }
        )
      }
    } else if (type === 'profit') {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { error: 'Valid amount is required for profit withdrawal' },
          { status: 400 }
        )
      }

      if (new Decimal(investor.profitBalance).lt(amount)) {
        return NextResponse.json(
          { error: 'Insufficient profit balance' },
          { status: 400 }
        )
      }
    } else if (type === 'product') {
      if (!productId || !quantity || quantity <= 0) {
        return NextResponse.json(
          { error: 'Product ID and quantity are required' },
          { status: 400 }
        )
      }

      // Verify investor has this product allocation
      const allocation = await db.investorProductAllocation.findFirst({
        where: {
          investorId: investor.id,
          productId,
          variantId: variantId || null,
          quantityRemaining: { gte: quantity },
        },
      })

      if (!allocation) {
        return NextResponse.json(
          { error: 'Product allocation not found or insufficient quantity' },
          { status: 400 }
        )
      }
    } else if (type === 'equipment_share') {
      if (!equipmentId) {
        return NextResponse.json(
          { error: 'Equipment ID is required' },
          { status: 400 }
        )
      }

      // Verify investor has allocation in this equipment
      const allocation = await db.investorEquipmentAllocation.findFirst({
        where: {
          investorId: investor.id,
          equipmentId,
          hasExited: false,
        },
      })

      if (!allocation) {
        return NextResponse.json(
          { error: 'Equipment allocation not found or already exited' },
          { status: 400 }
        )
      }
    }

    // Generate withdrawal request number
    const year = new Date().getFullYear()
    const count = await db.withdrawalRequest.count()
    const requestNumber = `WDR-${year}-${String(count + 1).padStart(4, '0')}`

    const withdrawal = await db.withdrawalRequest.create({
      data: {
        investorId: investor.id,
        requestNumber,
        type,
        amount: amount || 0,
        productId: productId || null,
        variantId: variantId || null,
        equipmentId: equipmentId || null,
        quantity: quantity || null,
        requestReason: requestReason || null,
        investorNotes: investorNotes || null,
        requestedBy: user.id,
        status: 'pending',
      },
    })

    console.log(`✅ Withdrawal request created: ${requestNumber} - ${type}`)

    return NextResponse.json(withdrawal, { status: 201 })
  } catch (error) {
    console.error('Error creating withdrawal:', error)
    return NextResponse.json(
      { error: 'Failed to create withdrawal request' },
      { status: 500 }
    )
  }
}
