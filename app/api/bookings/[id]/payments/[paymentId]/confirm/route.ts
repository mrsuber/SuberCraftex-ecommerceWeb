import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
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

    // Check authorization
    if (payment.booking.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
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

    // Use transaction to update payment and booking status
    const result = await db.$transaction(async (tx) => {
      // Update payment status
      const updatedPayment = await tx.bookingPayment.update({
        where: { id: params.paymentId },
        data: {
          status: 'completed',
          notes: payment.notes
            ? `${payment.notes}\nPayment confirmed at ${new Date().toISOString()}`
            : `Payment confirmed at ${new Date().toISOString()}`,
        }
      })

      // Update booking status based on payment type
      let newBookingStatus = payment.booking.status

      if (payment.paymentType === 'down_payment') {
        newBookingStatus = 'in_progress'
      } else if (payment.paymentType === 'final_payment') {
        newBookingStatus = 'completed'
      } else if (payment.paymentType === 'partial_payment') {
        newBookingStatus = 'payment_partial'
      }

      const updatedBooking = await tx.serviceBooking.update({
        where: { id: params.id },
        data: {
          status: newBookingStatus,
        }
      })

      return { payment: updatedPayment, booking: updatedBooking }
    })

    console.log(
      `✅ Payment confirmed for booking ${payment.booking.bookingNumber} - ` +
      `Type: ${payment.paymentType}, Amount: $${Number(payment.amount).toFixed(2)}, ` +
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
