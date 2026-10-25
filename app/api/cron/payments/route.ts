import { NextRequest, NextResponse } from 'next/server'
import { isCronRequest } from '@/lib/cron-auth'
import { db } from '@/lib/db'
import { sweepCollections } from '@/lib/payments'
import { cancelUnpaidOrder } from '@/lib/commerce/order-payments'

export const dynamic = 'force-dynamic'

/**
 * POST /api/cron/payments - Run every 5 minutes by the server's crontab.
 * Re-checks waiting Mobile Money payments (and late ones), expires those not approved in
 * time, cancels Mobile Money orders whose payment window closed, and checks payouts.
 */
export async function POST(request: NextRequest) {
  if (!isCronRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const collections = await sweepCollections(100)

  // Orders that waited for Mobile Money and never got a successful payment
  const overdue = await db.order.findMany({
    where: { paymentMethod: 'mobile_payment', paymentStatus: 'pending', isPosOrder: false, paymentDueAt: { lt: new Date() }, orderStatus: 'pending' },
    select: { id: true },
    take: 100,
  })
  let cancelled = 0
  for (const order of overdue) {
    const waiting = await db.paymentCollection.count({ where: { targetId: order.id, status: 'pending' } })
    if (waiting > 0) continue
    const done = await db.$transaction((tx) =>
      cancelUnpaidOrder(tx, order.id, 'Cancelled: Mobile Money payment not received in time')
    )
    if (done) cancelled += 1
  }

  // Mobile Money sales left open at a till for two hours: give the stock back
  const abandoned = await db.order.findMany({
    where: { isPosOrder: true, paymentMethod: 'mobile_payment', paymentStatus: 'pending', orderStatus: 'pending', createdAt: { lt: new Date(Date.now() - 2 * 3600_000) } },
    select: { id: true },
    take: 100,
  })
  for (const order of abandoned) {
    const waiting = await db.paymentCollection.count({ where: { targetId: order.id, status: 'pending' } })
    if (waiting > 0) continue
    if (await db.$transaction((tx) => cancelUnpaidOrder(tx, order.id, 'Cancelled: till sale never paid'))) cancelled += 1
  }

  let payouts = { checked: 0 }
  try {
    const { sweepPayouts } = await import('@/lib/payments/payouts')
    payouts = await sweepPayouts()
  } catch (error) {
    console.warn(`[payments] payout sweep failed: ${(error as Error).message}`)
  }

  return NextResponse.json({ collections, cancelledOrders: cancelled, payouts })
}
