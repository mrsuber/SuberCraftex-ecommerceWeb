import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { Prisma } from '@prisma/client'

/**
 * POST /api/pos/orders/[id]/payment
 * Process payment for POS order (cashier only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'cashier' && user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. Cashier or admin access required.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const cashier = await db.cashier.findUnique({
      where: { userId: user.id }
    })

    if (!cashier) {
      return NextResponse.json(
        { error: 'Cashier profile not found' },
        { status: 404 }
      )
    }

    // Get order
    const order = await db.order.findUnique({
      where: { id },
      include: {
        posSession: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (!order.isPosOrder) {
      return NextResponse.json(
        { error: 'Not a POS order' },
        { status: 400 }
      )
    }

    if (order.cashierId !== cashier.id) {
      return NextResponse.json(
        { error: 'Unauthorized. This order belongs to another cashier.' },
        { status: 403 }
      )
    }

    if (order.paymentStatus === 'paid') {
      return NextResponse.json(
        { error: 'Order already paid' },
        { status: 400 }
      )
    }

    // Process payment
    const updatedOrder = await db.$transaction(async (tx) => {
      // Update order status
      const paidOrder = await tx.order.update({
        where: { id },
        data: {
          paymentStatus: 'paid',
          orderStatus: 'delivered', // POS orders are delivered immediately
          paidAt: new Date(),
          deliveredAt: new Date(),
        }
      })

      // Update POS session totals
      if (order.posSession) {
        const paymentAmount = paidOrder.totalAmount

        await tx.pOSSession.update({
          where: { id: order.posSession.id },
          data: {
            totalSales: {
              increment: paymentAmount
            },
            totalOrders: {
              increment: 1
            },
            expectedCash: {
              increment: paidOrder.paymentMethod === 'cash' ? paymentAmount : 0
            },
            totalCash: {
              increment: paidOrder.paymentMethod === 'cash' ? paymentAmount : 0
            },
            totalCard: {
              increment: paidOrder.paymentMethod === 'card' ? paymentAmount : 0
            },
            totalMobile: {
              increment: paidOrder.paymentMethod === 'mobile_payment' ? paymentAmount : 0
            },
          }
        })
      }

      // Update cashier stats
      await tx.cashier.update({
        where: { id: cashier.id },
        data: {
          totalSales: {
            increment: paidOrder.totalAmount
          },
          totalOrders: {
            increment: 1
          }
        }
      })

      return paidOrder
    })

    console.log(`💳 Payment processed: ${order.orderNumber} - ${Number(updatedOrder.totalAmount).toFixed(2)} (${updatedOrder.paymentMethod})`)

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      order: {
        ...updatedOrder,
        subtotal: Number(updatedOrder.subtotal),
        taxAmount: Number(updatedOrder.taxAmount),
        discountAmount: Number(updatedOrder.discountAmount),
        totalAmount: Number(updatedOrder.totalAmount),
        amountTendered: updatedOrder.amountTendered ? Number(updatedOrder.amountTendered) : null,
        changeGiven: updatedOrder.changeGiven ? Number(updatedOrder.changeGiven) : null,
      }
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}
