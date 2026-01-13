import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { Decimal } from '@prisma/client/runtime/library'

// POST /api/admin/orders/[id]/complete - Complete order and distribute investor profits
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const user = await getSession()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.orderStatus === 'delivered') {
      return NextResponse.json(
        { error: 'Order already completed' },
        { status: 400 }
      )
    }

    // Process profit distribution in a transaction
    const result = await db.$transaction(async (tx) => {
      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: 'delivered',
          deliveredAt: new Date(),
        },
      })

      const distributions = []

      // Process each order item
      for (const item of order.orderItems) {
        // Find investor allocations for this product
        const allocations = await tx.investorProductAllocation.findMany({
          where: {
            productId: item.productId,
            variantId: item.variantId,
            quantityRemaining: { gt: 0 },
          },
          include: {
            investor: true,
          },
          orderBy: { allocatedAt: 'asc' }, // FIFO - First allocated, first sold
        })

        let remainingQuantity = item.quantity

        for (const allocation of allocations) {
          if (remainingQuantity <= 0) break

          // Calculate how many units from this allocation to process
          const quantityToProcess = Math.min(remainingQuantity, allocation.quantityRemaining)

          if (quantityToProcess <= 0) continue

          // Calculate profit for these units
          const salePrice = new Decimal(item.price)
          const costPrice = allocation.purchasePrice
          const unitProfit = salePrice.sub(costPrice)

          if (unitProfit.gt(0)) {
            const totalProfit = unitProfit.mul(quantityToProcess)
            const companyShare = totalProfit.div(2)
            const investorShare = totalProfit.div(2)

            // Calculate capital to return
            const capitalReturned = costPrice.mul(quantityToProcess)

            // Update investor balances
            const updatedInvestor = await tx.investor.update({
              where: { id: allocation.investorId },
              data: {
                cashBalance: {
                  increment: capitalReturned, // Return capital
                },
                profitBalance: {
                  increment: investorShare, // Add profit
                },
                totalProfit: {
                  increment: investorShare,
                },
              },
            })

            // Update allocation
            await tx.investorProductAllocation.update({
              where: { id: allocation.id },
              data: {
                quantitySold: {
                  increment: quantityToProcess,
                },
                quantityRemaining: {
                  decrement: quantityToProcess,
                },
                profitGenerated: {
                  increment: investorShare,
                },
                capitalReturned: {
                  increment: capitalReturned,
                },
              },
            })

            // Create profit distribution record
            await tx.profitDistribution.create({
              data: {
                investorId: allocation.investorId,
                orderId,
                productId: item.productId,
                saleRevenue: salePrice.mul(quantityToProcess),
                saleCost: costPrice.mul(quantityToProcess),
                grossProfit: totalProfit,
                companyShare,
                investorShare,
                capitalReturned,
                description: `Sale of ${quantityToProcess} x ${item.productName}`,
                notes: `Order: ${order.orderNumber}`,
              },
            })

            // Create capital return transaction
            await tx.investorTransaction.create({
              data: {
                investorId: allocation.investorId,
                type: 'profit_credit',
                amount: capitalReturned.add(investorShare),
                balanceAfter: updatedInvestor.cashBalance,
                profitAfter: updatedInvestor.profitBalance,
                productId: item.productId,
                orderId,
                description: `Sale: ${quantityToProcess} x ${item.productName} - Capital: ${capitalReturned}, Profit: ${investorShare}`,
                notes: `Order: ${order.orderNumber}`,
                createdBy: user.id,
              },
            })

            distributions.push({
              investor: allocation.investor,
              product: item.productName,
              quantity: quantityToProcess,
              capitalReturned,
              profitShare: investorShare,
              totalReturned: capitalReturned.add(investorShare),
            })
          }

          remainingQuantity -= quantityToProcess
        }
      }

      return { order: updatedOrder, distributions }
    })

    if (result.distributions.length > 0) {
      console.log(`✅ Order completed: ${order.orderNumber} - Profit distributed to ${result.distributions.length} investor allocations`)
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error completing order:', error)
    return NextResponse.json(
      { error: 'Failed to complete order' },
      { status: 500 }
    )
  }
}
