import { NextRequest, NextResponse } from 'next/server'
import { CollectionPurpose } from '@prisma/client'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { db } from '@/lib/db'
import { CollectionError, publicCollection, startCollection } from '@/lib/payments'
import { checkPaymentToken } from '@/lib/payments/token'
import { MoneyInputError, toXaf, Xaf } from '@/lib/money'
import { getSetting } from '@/lib/settings'
import { bookingBalance, repairBalance } from '@/lib/services/booking-payments'
import { clientIp, rateLimit } from '@/lib/rate-limit'

type Purpose = 'order' | 'pos_order' | 'booking' | 'repair'

class StartError extends Error {
  constructor(message: string, public status = 400) {
    super(message)
  }
}

interface Plan {
  purpose: CollectionPurpose
  targetId: string
  amount: Xaf
  description: string
  expiresInMinutes: number
  metadata?: Record<string, unknown>
}

const STAFF = ['admin', 'cashier', 'tailor', 'technician']

/**
 * POST /api/payments/mobile-money - Send a Mobile Money prompt to a phone.
 * Body: { purpose: order | pos_order | booking | repair, id, phone, token? }
 * The amount is always worked out here, never taken from the request.
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request)
    const body = await request.json().catch(() => ({}))
    const purpose = body.purpose as Purpose
    const id = typeof body.id === 'string' ? body.id : ''
    if (!id) throw new StartError('Missing id')

    const limitKey = user ? `momo:user:${user.id}` : `momo:ip:${clientIp(request)}`
    if (!rateLimit(limitKey, 10, 10 * 60 * 1000)) throw new StartError('Too many payment attempts. Please wait a few minutes.', 429)

    const hold = await getSetting('checkout.paymentHoldMinutes')
    let plan: Plan

    if (purpose === 'order' || purpose === 'pos_order') {
      const order = await db.order.findUnique({ where: { id }, include: { cashier: true } })
      if (!order) throw new StartError('Order not found', 404)
      if (purpose === 'pos_order') {
        if (!user || !['admin', 'cashier'].includes(user.role) || !order.isPosOrder) throw new StartError('Not allowed', 403)
        if (user.role === 'cashier' && order.cashier?.userId !== user.id) throw new StartError('This sale belongs to another cashier', 403)
      } else {
        const owner = order.userId ? user?.id === order.userId : checkPaymentToken('order', order.id, body.token)
        if (!owner && !(user && STAFF.includes(user.role))) throw new StartError('Not allowed', 403)
      }
      if (order.paymentStatus === 'paid') throw new StartError('This order is already paid')
      if (order.orderStatus === 'cancelled') throw new StartError('This order was cancelled. Please place a new order.')
      let minutes = hold
      if (order.paymentDueAt) {
        const left = Math.floor((order.paymentDueAt.getTime() - Date.now()) / 60_000)
        if (left < 1) throw new StartError('The time to pay for this order has passed. Please place a new order.')
        minutes = Math.min(hold, left)
      }
      if (order.paymentMethod !== 'mobile_payment') {
        await db.order.update({ where: { id: order.id }, data: { paymentMethod: 'mobile_payment' } })
      }
      plan = {
        purpose,
        targetId: order.id,
        amount: toXaf(order.totalAmount),
        description: `SuberCraftex order ${order.orderNumber}`,
        expiresInMinutes: minutes,
      }
    } else if (purpose === 'booking') {
      const booking = await db.serviceBooking.findUnique({ where: { id } })
      if (!booking) throw new StartError('Booking not found', 404)
      if (!user || (booking.userId !== user.id && !STAFF.includes(user.role))) throw new StartError('Not allowed', 403)
      const balance = await bookingBalance(db, booking.id)
      if (!balance.next) throw new StartError('Nothing is due on this booking right now')
      plan = {
        purpose,
        targetId: booking.id,
        amount: balance.next.amount,
        description: `SuberCraftex booking ${booking.bookingNumber}`,
        expiresInMinutes: hold,
        metadata: { paymentType: balance.next.type },
      }
    } else if (purpose === 'repair') {
      const repair = await db.repairRequest.findUnique({ where: { id } })
      if (!repair) throw new StartError('Repair not found', 404)
      if (!user || (repair.customerId !== user.id && !STAFF.includes(user.role))) throw new StartError('Not allowed', 403)
      const balance = await repairBalance(db, repair.id)
      if (balance.remaining === 0n) throw new StartError('Nothing is due on this repair')
      plan = {
        purpose,
        targetId: repair.id,
        amount: balance.remaining,
        description: `SuberCraftex repair ${repair.ticketNumber}`,
        expiresInMinutes: hold,
        metadata: { paymentType: balance.paid > 0n ? 'final_payment' : 'deposit' },
      }
    } else {
      throw new StartError('Unknown payment purpose')
    }

    const collection = await startCollection({ ...plan, userId: user?.id ?? null, phone: body.phone })
    return NextResponse.json(publicCollection(collection), { status: 201 })
  } catch (error) {
    if (error instanceof StartError) return NextResponse.json({ error: error.message }, { status: error.status })
    if (error instanceof CollectionError || error instanceof MoneyInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error('Error starting Mobile Money payment:', error)
    return NextResponse.json({ error: 'Could not start the payment. Please try again.' }, { status: 500 })
  }
}
