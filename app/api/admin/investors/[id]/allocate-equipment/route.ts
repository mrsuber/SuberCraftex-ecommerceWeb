import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { Decimal } from '@prisma/client/runtime/library'

// POST /api/admin/investors/[id]/allocate-equipment - Allocate investor funds to equipment purchase
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
      equipmentId,
      amountAllocated,
      notes,
    } = body

    if (!equipmentId || !amountAllocated) {
      return NextResponse.json(
        { error: 'Missing required fields: equipmentId, amountAllocated' },
        { status: 400 }
      )
    }

    const amount = new Decimal(amountAllocated)

    // Check if investor has sufficient cash balance
    if (new Decimal(investor.cashBalance).lt(amount)) {
      return NextResponse.json(
        { error: 'Insufficient cash balance' },
        { status: 400 }
      )
    }

    // Verify equipment exists
    const equipment = await db.equipment.findUnique({
      where: { id: equipmentId },
    })

    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      )
    }

    // Calculate total already allocated to this equipment
    const existingAllocations = await db.investorEquipmentAllocation.findMany({
      where: { equipmentId, hasExited: false },
    })

    const totalAllocated = existingAllocations.reduce(
      (sum, alloc) => sum.add(alloc.amountAllocated),
      new Decimal(0)
    ).add(amount)

    // Calculate investment percentage
    const investmentPercentage = amount.div(equipment.purchasePrice).mul(100)
    const profitShare = investmentPercentage // Profit share matches investment percentage

    // Create allocation and update balances in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create equipment allocation
      const allocation = await tx.investorEquipmentAllocation.create({
        data: {
          investorId: investor.id,
          equipmentId,
          amountAllocated: amount,
          investmentPercentage,
          profitShare,
          notes: notes || null,
        },
        include: {
          equipment: {
            select: {
              name: true,
              equipmentNumber: true,
              purchasePrice: true,
              currentValue: true,
              status: true,
            },
          },
        },
      })

      // Update investor cash balance
      const updatedInvestor = await tx.investor.update({
        where: { id: investor.id },
        data: {
          cashBalance: {
            decrement: amount,
          },
        },
      })

      // Create transaction record
      await tx.investorTransaction.create({
        data: {
          investorId: investor.id,
          type: 'allocation_equipment',
          amount,
          balanceAfter: updatedInvestor.cashBalance,
          profitAfter: updatedInvestor.profitBalance,
          equipmentId,
          description: `Allocated to ${equipment.name} (${investmentPercentage.toFixed(2)}% ownership)`,
          notes: notes || null,
          createdBy: user.id,
        },
      })

      return { allocation, updatedInvestor }
    })

    console.log(`✅ Equipment allocation: ${investor.investorNumber} -> ${equipment.name} (${investmentPercentage.toFixed(2)}%)`)

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error allocating equipment:', error)
    return NextResponse.json(
      { error: 'Failed to allocate equipment' },
      { status: 500 }
    )
  }
}
