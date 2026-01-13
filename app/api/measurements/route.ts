import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// POST /api/measurements - Create or update measurement
export async function POST(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user || user.role !== 'tailor') {
      return NextResponse.json(
        { error: 'Unauthorized. Only tailors can record measurements.' },
        { status: 401 }
      )
    }

    // Get tailor profile
    const tailor = await db.tailor.findUnique({
      where: { userId: user.id },
    })

    if (!tailor) {
      return NextResponse.json(
        { error: 'Tailor profile not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { bookingId, measurements, notes, customerSignatureUrl } = body

    if (!bookingId || !measurements) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, measurements' },
        { status: 400 }
      )
    }

    // Verify booking exists and is in correct status
    const booking = await db.serviceBooking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if booking is in a valid status for measurements
    const validStatuses = ['quote_approved', 'in_progress', 'quote_pending', 'pending', 'quote_sent']
    if (!validStatuses.includes(booking.status)) {
      return NextResponse.json(
        {
          error: 'Measurements can only be taken for active bookings (not cancelled or completed)',
        },
        { status: 400 }
      )
    }

    // Check if measurement already exists (update) or create new
    const existingMeasurement = await db.measurement.findUnique({
      where: { bookingId },
    })

    let measurement

    if (existingMeasurement) {
      // Update existing measurement
      measurement = await db.measurement.update({
        where: { bookingId },
        data: {
          measurements,
          notes: notes || null,
          customerSignatureUrl: customerSignatureUrl || null,
          takenAt: new Date(),
        },
      })
    } else {
      // Create new measurement
      measurement = await db.measurement.create({
        data: {
          bookingId,
          tailorId: tailor.id,
          measurements,
          notes: notes || null,
          customerSignatureUrl: customerSignatureUrl || null,
        },
      })

      // Update booking status to in_progress if it's still quote_approved
      if (booking.status === 'quote_approved') {
        await db.serviceBooking.update({
          where: { id: bookingId },
          data: { status: 'in_progress' },
        })
      }
    }

    return NextResponse.json(measurement, { status: existingMeasurement ? 200 : 201 })
  } catch (error) {
    console.error('Error creating/updating measurement:', error)
    return NextResponse.json(
      { error: 'Failed to save measurement' },
      { status: 500 }
    )
  }
}
