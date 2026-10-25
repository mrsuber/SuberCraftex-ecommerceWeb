import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cashAccountForStaff } from '@/lib/commerce/order-payments'
import { toXaf } from '@/lib/money'
import { recordBookingPayment } from '@/lib/services/booking-payments'
import { getCurrentUser } from '@/lib/session'

/**
 * POST /api/bookings/[id]/payments/[paymentId]/confirm
 * Confirm a payment (simulate Stripe webhook in real implementation)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; paymentId: string }> }
) {
  try {
    const { id, paymentId } = await params

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get payment with booking
    const payment = await db.bookingPayment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            quote: true,
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Verify payment belongs to this booking
    if (payment.bookingId !== id) {
      return NextResponse.json(
        { error: 'Payment does not belong to this booking' },
        { status: 400 }
      )
    }

    // Only staff confirm money they received (cash at the shop). Customers never confirm
    // their own payment: Mobile Money payments are confirmed by PayWithCAMSOL.
    if (!['admin', 'tailor', 'cashier'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Only SuberCraftex staff can confirm a payment' },
        { status: 403 }
      )
    }

    // Check if already confirmed
    if (payment.status === 'completed') {
      return NextResponse.json(
        { error: 'Payment already confirmed' },
        { status: 400 }
      )
    }

    // A pending payment left by the old payment page: staff confirm the cash they received
    const result = await db.$transaction(async (tx) => {
      const { account } = await cashAccountForStaff(tx, user.id)
      const claimed = await tx.bookingPayment.updateMany({
        where: { id: paymentId, status: 'pending' },
        data: { status: 'cancelled', notes: 'Replaced by the cash payment recorded by staff' },
      })
      if (claimed.count !== 1) throw new Error('Payment already confirmed')
      const recorded = await recordBookingPayment(tx, {
        bookingId: id,
        type: payment.paymentType,
        amount: toXaf(payment.amount),
        method: 'cash',
        into: account,
        confirmedById: user.id,
      })
      const booking = await tx.serviceBooking.findUniqueOrThrow({ where: { id } })
      return { payment: recorded, booking }
    })

    console.log(
      `✅ Payment confirmed for booking ${payment.booking.bookingNumber} - ` +
      `Type: ${payment.paymentType}, Amount: ${Number(payment.amount)} FCFA, ` +
      `New Status: ${result.booking.status}`
    )

    // Serialize Decimal fields
    const serialized = {
      ...result.payment,
      amount: Number(result.payment.amount),
    }

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}
