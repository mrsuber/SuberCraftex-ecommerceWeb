import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
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
 * Create a new payment (down payment, partial, or final)
 */
export async function POST(
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

    const body = await request.json()
    const { amount, paymentType, paymentMethod = 'stripe' } = body

    // Validate required fields
    if (!amount || !paymentType) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, paymentType' },
        { status: 400 }
      )
    }

    // Get booking to check authorization and quote
    const booking = await db.serviceBooking.findUnique({
      where: { id: id },
      include: {
        quote: true,
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check authorization (must be booking owner)
    if (booking.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Validate payment amount
    if (paymentType === 'down_payment' && booking.quote) {
      const expectedAmount = Number(booking.quote.downPaymentAmount)
      if (Math.abs(Number(amount) - expectedAmount) > 0.01) {
        return NextResponse.json(
          { error: `Down payment amount must be $${expectedAmount.toFixed(2)}` },
          { status: 400 }
        )
      }
    }

    // Create payment record
    // In a real implementation, this would create a Stripe PaymentIntent
    const payment = await db.bookingPayment.create({
      data: {
        bookingId: id,
        amount,
        paymentType,
        paymentMethod,
        status: 'pending', // Will be updated to 'completed' after confirmation
        notes: `Payment initiated by ${user.email}`,
      }
    })

    console.log(`💳 Payment created for booking ${booking.bookingNumber} - Amount: $${Number(amount).toFixed(2)}`)

    // Serialize Decimal fields
    const serialized = {
      ...payment,
      amount: Number(payment.amount),
    }

    return NextResponse.json(serialized, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
