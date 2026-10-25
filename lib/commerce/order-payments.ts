import { Order, Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { AccountRef, Accounts, credit, debit, post, Posting, Tx } from '@/lib/ledger'
import { toDecimal, toXaf, Xaf } from '@/lib/money'
import { releaseStock } from './pricing'

export class OrderPaymentError extends Error {}

/** What an order sale credits in the ledger: products (after discount) and delivery. */
export function orderSaleCredits(order: Pick<Order, 'totalAmount' | 'shippingCost'>): Posting[] {
  const total = toXaf(order.totalAmount)
  const shipping = toXaf(order.shippingCost)
  return [credit(Accounts.productSales(), total - shipping), credit(Accounts.shippingIncome(), shipping)]
}

/**
 * Where cash taken by a staff member goes: the drawer of their open POS session, or the
 * shop safe when they have none.
 */
export async function cashAccountForStaff(tx: Tx, userId: string): Promise<{ account: AccountRef; sessionId: string | null }> {
  const cashier = await tx.cashier.findUnique({ where: { userId } })
  if (cashier) {
    const session = await tx.pOSSession.findFirst({ where: { cashierId: cashier.id, status: 'open' } })
    if (session) return { account: Accounts.drawer(session.id, session.sessionNumber), sessionId: session.id }
  }
  return { account: Accounts.safe(), sessionId: null }
}

/** Lock the order row and return it fresh. */
export async function lockOrder(tx: Tx, orderId: string) {
  await tx.$queryRaw`SELECT id FROM orders WHERE id = ${orderId} FOR UPDATE`
  return tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { posSession: true } })
}

export interface MarkPaidOptions {
  /** Where the money is now. Omit when the ledger was already posted (Mobile Money). */
  into?: AccountRef
  actorId?: string | null
  note?: string
}

/**
 * Mark an order paid, once. POS orders are handed over at the till, so they are also
 * delivered; their session and cashier totals move with the payment.
 */
export async function markOrderPaid(tx: Tx, orderId: string, options: MarkPaidOptions = {}): Promise<Order> {
  const order = await lockOrder(tx, orderId)
  if (order.paymentStatus === 'paid') return order
  if (order.orderStatus === 'cancelled' || order.orderStatus === 'refunded') {
    throw new OrderPaymentError(`Order ${order.orderNumber} is ${order.orderStatus}`)
  }
  const total = toXaf(order.totalAmount)
  if (options.into) {
    await post(tx, {
      type: 'order_paid',
      reference: `order_paid:${order.id}`,
      description: `Order ${order.orderNumber} paid in cash`,
      createdById: options.actorId,
      metadata: { orderId: order.id, note: options.note },
      postings: [debit(options.into, total), ...orderSaleCredits(order)],
    })
  }
  const now = new Date()
  const data: Prisma.OrderUpdateInput = { paymentStatus: 'paid', paidAt: now, paymentDueAt: null }
  if (order.isPosOrder) {
    data.orderStatus = 'delivered'
    data.deliveredAt = now
  } else if (order.orderStatus === 'pending') {
    data.orderStatus = 'processing'
  }
  const paid = await tx.order.update({ where: { id: order.id }, data })

  // A till sale is handed over at once: share it with the investors whose stock it sold
  if (order.isPosOrder) {
    const { distributeOrderToInvestors } = await import('@/lib/investors/sales')
    await distributeOrderToInvestors(tx, order.id, options.actorId ?? null)
  }

  if (order.isPosOrder && order.posSession) {
    const amount = toDecimal(total)
    const zero = toDecimal(0n)
    await tx.pOSSession.update({
      where: { id: order.posSession.id },
      data: {
        totalSales: { increment: amount },
        totalOrders: { increment: 1 },
        expectedCash: { increment: order.paymentMethod === 'cash' ? amount : zero },
        totalCash: { increment: order.paymentMethod === 'cash' ? amount : zero },
        totalMobile: { increment: order.paymentMethod === 'mobile_payment' ? amount : zero },
      },
    })
    if (order.cashierId) {
      await tx.cashier.update({
        where: { id: order.cashierId },
        data: { totalSales: { increment: amount }, totalOrders: { increment: 1 } },
      })
    }
  }
  return paid
}

/**
 * Cancel an order nobody paid for and put its stock back. Does nothing if it was paid or
 * already cancelled, so a late payment and the expiry can never both win.
 */
export async function cancelUnpaidOrder(tx: Tx, orderId: string, reason: string): Promise<boolean> {
  const order = await lockOrder(tx, orderId)
  if (order.paymentStatus === 'paid' || order.orderStatus === 'cancelled') return false
  const items = await tx.orderItem.findMany({ where: { orderId } })
  await tx.order.update({
    where: { id: orderId },
    data: {
      orderStatus: 'cancelled',
      paymentStatus: 'failed',
      cancelledAt: new Date(),
      paymentDueAt: null,
      adminNotes: order.adminNotes ? `${order.adminNotes}\n${reason}` : reason,
    },
  })
  await releaseStock(tx, items, { orderId, userId: null, notes: `${reason} (${order.orderNumber})` })
  return true
}

/**
 * A Mobile Money payment arrived after its order had been cancelled. The money is real, so
 * it is never lost: the order is revived if its stock is still free, otherwise the amount
 * goes to the customer's store credit and admins are told to refund or fulfil it.
 */
export async function handleLateOrderPayment(tx: Tx, orderId: string, amount: Xaf): Promise<'revived' | 'credited'> {
  const order = await lockOrder(tx, orderId)
  const items = await tx.orderItem.findMany({ where: { orderId } })
  const revivable = await Promise.all(
    items.map(async (item) => {
      const product = await tx.product.findUnique({ where: { id: item.productId } })
      return !product?.trackInventory || product.inventoryCount >= item.quantity
    })
  )
  // Only an order that expired unpaid comes back; one an admin cancelled stays cancelled
  const expiredUnpaid = order.orderStatus === 'cancelled' && order.paymentStatus === 'failed'
  if (expiredUnpaid && revivable.every(Boolean)) {
    for (const item of items) {
      const product = await tx.product.findUniqueOrThrow({ where: { id: item.productId } })
      if (!product.trackInventory) continue
      await tx.product.update({ where: { id: item.productId }, data: { inventoryCount: { decrement: item.quantity } } })
      if (item.variantId) {
        await tx.productVariant.update({ where: { id: item.variantId }, data: { inventoryCount: { decrement: item.quantity } } })
      }
    }
    await tx.order.update({
      where: { id: orderId },
      data: { orderStatus: 'pending', paymentStatus: 'pending', cancelledAt: null },
    })
    await markOrderPaid(tx, orderId)
    return 'revived'
  }
  // Keep the money for the customer: move it out of sales into what we owe them
  const owed = order.userId ? Accounts.customerCredit(order.userId) : Accounts.refundDue(orderId)
  const sale = orderSaleCredits(order)
  const saleTotal = sale.reduce((sum, p) => sum - p.amount, 0n)
  await post(tx, {
    type: 'late_payment_credit',
    reference: `late_payment_credit:${orderId}`,
    description: `Late payment for cancelled order ${order.orderNumber} kept for the customer`,
    postings: [
      ...sale.map((p) => ({ ...p, amount: -p.amount })),
      credit(owed, amount),
      // If the amount paid differs from the order total, the difference stays in sales
      ...(saleTotal !== amount ? [credit(Accounts.productSales(), saleTotal - amount)] : []),
    ],
  })
  await tx.notification.create({
    data: {
      type: 'order_paid',
      priority: 'urgent',
      title: 'Payment received for a cancelled order',
      message: `${order.orderNumber}: ${Number(amount)} FCFA arrived after the order expired and its stock was sold. ${
        order.userId ? 'It is in the customer’s store credit.' : 'The customer was a guest: refund them.'
      }`,
      referenceId: orderId,
      referenceType: 'order',
      actionUrl: `/dashboard/orders?order=${orderId}`,
    },
  })
  return 'credited'
}

export async function getOrder(orderId: string) {
  return db.order.findUnique({ where: { id: orderId } })
}
