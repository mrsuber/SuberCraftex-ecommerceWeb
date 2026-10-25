import { Accounts, Tx } from '@/lib/ledger'
import { distributeOrderToInvestors, SaleDistribution } from '@/lib/investors/sales'
import { cashAccountForStaff, lockOrder, markOrderPaid } from './order-payments'

export interface CompleteOrderOptions {
  actorId: string | null
  actorRole?: string
  /** The driver who handed it over: cash on delivery stays with them until handed in */
  driverId?: string | null
  note?: string | null
}

/**
 * An order reaches its customer. Every path that delivers an order (admin, driver, POS)
 * comes through here, so it happens the same way everywhere and only once:
 * - the order is marked delivered,
 * - cash on delivery is recorded where it now is (driver, drawer or safe),
 * - investors who funded its products get their share.
 */
export async function completeOrder(tx: Tx, orderId: string, options: CompleteOrderOptions) {
  const order = await lockOrder(tx, orderId)
  if (order.orderStatus === 'delivered') return { order, distributions: [] as SaleDistribution[], already: true }
  if (order.orderStatus === 'cancelled' || order.orderStatus === 'refunded') {
    throw new Error(`Order ${order.orderNumber} is ${order.orderStatus}`)
  }

  if (order.paymentStatus !== 'paid') {
    if (order.paymentMethod !== 'cash') {
      throw new Error(`Order ${order.orderNumber} is not paid yet`)
    }
    let driverId = options.driverId ?? null
    if (!driverId && options.actorRole === 'driver' && options.actorId) {
      driverId = (await tx.driver.findUnique({ where: { userId: options.actorId } }))?.id ?? null
    }
    const driver = driverId ? await tx.driver.findUnique({ where: { id: driverId } }) : null
    const into = driver
      ? Accounts.driverCash(driver.id, driver.fullName)
      : options.actorId
        ? (await cashAccountForStaff(tx, options.actorId)).account
        : Accounts.safe()
    await markOrderPaid(tx, order.id, { into, actorId: options.actorId, note: options.note ?? undefined })
  }

  const delivered = await tx.order.update({
    where: { id: order.id },
    data: { orderStatus: 'delivered', deliveredAt: order.deliveredAt ?? new Date() },
  })
  const distributions = await distributeOrderToInvestors(tx, order.id, options.actorId)
  return { order: delivered, distributions, already: false }
}

/**
 * Cancel an order, or refund one already delivered. Stock goes back on sale, money already
 * paid becomes the customer's store credit (a refund owed for guests, paid out from the
 * finance page), and for a delivered order the investors' share of the sale is undone.
 */
export async function cancelOrRefundOrder(
  tx: Tx,
  orderId: string,
  options: { mode: 'cancel' | 'refund'; actorId: string | null; reason?: string | null }
) {
  const order = await lockOrder(tx, orderId)
  if (order.orderStatus === 'cancelled' || order.orderStatus === 'refunded') return order
  if (options.mode === 'cancel' && order.orderStatus === 'delivered') {
    throw new Error('A delivered order is refunded, not cancelled')
  }
  const items = await tx.orderItem.findMany({ where: { orderId } })

  if (order.orderStatus === 'delivered') {
    const { returnOrderSales } = await import('@/lib/investors/lots')
    const { investorLedgerLive } = await import('@/lib/investors/live')
    if (await investorLedgerLive(tx)) await returnOrderSales(tx, orderId, options.actorId)
  }

  const { releaseStock } = await import('./pricing')
  await releaseStock(tx, items, {
    orderId,
    userId: options.actorId,
    notes: `${options.mode === 'refund' ? 'Returned' : 'Released'}: order ${order.orderNumber} ${options.mode === 'refund' ? 'refunded' : 'cancelled'}`,
  })

  if (order.paymentStatus === 'paid') {
    const { Accounts, post } = await import('@/lib/ledger')
    const { orderSaleCredits } = await import('./order-payments')
    const { toXaf } = await import('@/lib/money')
    const owed = order.userId ? Accounts.customerCredit(order.userId) : Accounts.refundDue(order.id)
    const total = toXaf(order.totalAmount)
    await post(tx, {
      type: 'order_refunded',
      reference: `order_refund:${order.id}`,
      description: `Order ${order.orderNumber} ${options.mode === 'refund' ? 'refunded' : 'cancelled after payment'}: money owed to the customer`,
      createdById: options.actorId,
      metadata: { reason: options.reason },
      postings: [...orderSaleCredits(order).map((p) => ({ ...p, amount: -p.amount })), { account: owed, amount: -total }],
    })
  }

  return tx.order.update({
    where: { id: orderId },
    data: {
      orderStatus: options.mode === 'refund' ? 'refunded' : 'cancelled',
      paymentStatus: order.paymentStatus === 'paid' ? 'refunded' : order.paymentStatus,
      cancelledAt: new Date(),
      adminNotes: options.reason ? `${order.adminNotes ? `${order.adminNotes}\n` : ''}${options.reason}` : order.adminNotes,
    },
  })
}
