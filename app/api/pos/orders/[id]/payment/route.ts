import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { Accounts } from '@/lib/ledger'
import { markOrderPaid, OrderPaymentError } from '@/lib/commerce/order-payments'

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

    const body = await request.json().catch(() => ({}))
    if (body.method === 'cash' && order.paymentMethod === 'mobile_payment') {
      // The customer pays cash instead of Mobile Money: only if no prompt is still waiting
      const waiting = await db.paymentCollection.count({ where: { targetId: order.id, status: 'pending' } })
      if (waiting > 0) {
        return NextResponse.json(
          { error: 'A Mobile Money prompt is still waiting on the customer\'s phone. Wait for it to fail or expire first.' },
          { status: 400 }
        )
      }
      const tendered = Number(body.amountTendered) || null
      await db.order.update({
        where: { id: order.id },
        data: {
          paymentMethod: 'cash',
          amountTendered: tendered,
          changeGiven: tendered !== null ? Number(tendered) - Number(order.totalAmount) : null,
        },
      })
      order.paymentMethod = 'cash'
    }

    if (order.paymentMethod !== 'cash') {
      // Mobile Money sales are paid when PayWithCAMSOL confirms the prompt on the customer's phone
      return NextResponse.json(
        { error: 'Mobile Money sales are confirmed by PayWithCAMSOL. Send the payment prompt to the customer\'s phone.' },
        { status: 400 }
      )
    }

    // Cash goes into this session's drawer in the ledger
    const updatedOrder = await db.$transaction(async (tx) => {
      const session = order.posSession ?? (await tx.pOSSession.findFirst({ where: { cashierId: cashier.id, status: 'open' } }))
      if (!session || session.status !== 'open') throw new OrderPaymentError('Open a till session before taking cash')
      return markOrderPaid(tx, order.id, { into: Accounts.drawer(session.id, session.sessionNumber), actorId: user.id })
    })

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
