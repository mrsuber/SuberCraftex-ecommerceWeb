import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { Decimal } from '@prisma/client/runtime/library'

// POST /api/admin/investors/[id]/remove-allocation - Remove/reverse a product allocation
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
    const { allocationId } = body

    if (!allocationId) {
      return NextResponse.json(
        { error: 'Missing required field: allocationId' },
        { status: 400 }
      )
    }

    // Find the allocation
    const allocation = await db.investorProductAllocation.findUnique({
      where: { id: allocationId },
      include: {
        product: { select: { name: true, sku: true, trackInventory: true } },
        variant: { select: { name: true, sku: true } },
      },
    })

    if (!allocation) {
      return NextResponse.json(
        { error: 'Allocation not found' },
        { status: 404 }
      )
    }

    if (allocation.investorId !== id) {
      return NextResponse.json(
        { error: 'Allocation does not belong to this investor' },
        { status: 400 }
      )
    }

    // Only allow removal if no units have been sold
    if (allocation.quantitySold > 0) {
      return NextResponse.json(
        { error: `Cannot remove allocation: ${allocation.quantitySold} units have already been sold. Only allocations with no sales can be removed.` },
        { status: 400 }
      )
    }

    // Remove allocation and restore inventory + cash in a transaction
    const result = await db.$transaction(async (tx) => {
      // Delete the allocation
      await tx.investorProductAllocation.delete({
        where: { id: allocationId },
      })

      // Restore inventory
      if (allocation.variantId) {
        await tx.productVariant.update({
          where: { id: allocation.variantId },
          data: {
            inventoryCount: { increment: allocation.quantity },
          },
        })
      } else if (allocation.product.trackInventory) {
        await tx.product.update({
          where: { id: allocation.productId },
          data: {
            inventoryCount: { increment: allocation.quantity },
          },
        })
      }

      // Refund investor cash balance
      const updatedInvestor = await tx.investor.update({
        where: { id: investor.id },
        data: {
          cashBalance: { increment: allocation.totalInvestment },
        },
      })

      // Create reversal transaction record
      await tx.investorTransaction.create({
        data: {
          investorId: investor.id,
          type: 'refund',
          amount: allocation.totalInvestment,
          balanceAfter: updatedInvestor.cashBalance,
          profitAfter: updatedInvestor.profitBalance,
          productId: allocation.productId,
          description: `Allocation reversed: ${allocation.product.name}${allocation.variant ? ` - ${allocation.variant.name}` : ''} (${allocation.quantity} units @ ${allocation.purchasePrice.toString()} each)`,
          notes: `Reversed by admin`,
          createdBy: user.id,
        },
      })

      return { updatedInvestor }
    })

    console.log(`✅ Allocation reversed: ${investor.investorNumber} <- ${allocation.product.name} (${allocation.quantity} units)`)

    return NextResponse.json({
      success: true,
      message: `Allocation removed. ${allocation.quantity} units returned to stock and ${allocation.totalInvestment.toString()} FCFA refunded.`,
      investor: result.updatedInvestor,
    })
  } catch (error: any) {
    console.error('Error removing allocation:', error)
    return NextResponse.json(
      { error: `Failed to remove allocation: ${error.message}` },
      { status: 500 }
    )
  }
}
