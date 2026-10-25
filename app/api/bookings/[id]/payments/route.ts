import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { cashAccountForStaff } from '@/lib/commerce/order-payments'
import { MoneyInputError, parseXaf } from '@/lib/money'
import { bookingBalance, recordBookingPayment } from '@/lib/services/booking-payments'
import { getCurrentUser } from '@/lib/session'

/**
 * GET /api/bookings/[id]/payments
 * Get all payments for a booking
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get booking to check authorization
    const booking = await db.serviceBooking.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check authorization (admin or booking owner)
    if (user.role !== 'admin' && booking.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get all payments
    const payments = await db.bookingPayment.findMany({
      where: { bookingId: id },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Serialize Decimal fields
    const serialized = payments.map(payment => ({
      ...payment,
      amount: Number(payment.amount),
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/bookings/[id]/payments
 * Staff record cash received at the shop: { amount?, paymentType? }. Without an amount, the
 * amount due next is recorded. Customers pay by Mobile Money (/api/payments/mobile-money).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user || !['admin', 'tailor', 'cashier'].includes(user.role)) {
      return NextResponse.json({ error: 'Only SuberCraftex staff can record a cash payment' }, { status: 403 })
    }
    const body = await request.json().catch(() => ({}))
    const balance = await bookingBalance(db, id)
    if (!balance.next) {
      return NextResponse.json({ error: 'Nothing is due on this booking' }, { status: 400 })
    }
    const amount = body.amount === undefined || body.amount === null || body.amount === ''
      ? balance.next.amount
      : parseXaf(body.amount)
    if (amount > balance.remaining) {
      return NextResponse.json({ error: `Only ${balance.remaining} FCFA is still due` }, { status: 400 })
    }
    const type = amount < balance.remaining && amount !== balance.next.amount ? 'partial_payment' : balance.next.type

    const payment = await db.$transaction(async (tx) => {
      const { account } = await cashAccountForStaff(tx, user.id)
      return recordBookingPayment(tx, {
        bookingId: id,
        type,
        amount,
        method: 'cash',
        into: account,
        confirmedById: user.id,
      })
    })
    await audit({ actor: user, action: 'booking.cash_received', targetType: 'booking', targetId: id, details: { amount, type } })
    return NextResponse.json({ ...payment, amount: Number(payment.amount) }, { status: 201 })
  } catch (error) {
    if (error instanceof MoneyInputError) return NextResponse.json({ error: error.message }, { status: 400 })
    console.error('Error recording payment:', error)
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
  }
}
