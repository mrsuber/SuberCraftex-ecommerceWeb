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
