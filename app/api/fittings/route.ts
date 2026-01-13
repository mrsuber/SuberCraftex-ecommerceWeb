import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { sendEmail } from '@/lib/email/mailer'
import { getFittingAppointmentTemplate } from '@/lib/email/templates/fitting-appointment'
import { format } from 'date-fns'

// POST /api/fittings - Create a fitting appointment
export async function POST(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user || user.role !== 'tailor') {
      return NextResponse.json(
        { error: 'Unauthorized. Only tailors can schedule fittings.' },
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
    const {
      bookingId,
      scheduledDate,
      scheduledTime,
      durationMinutes = 30,
      notes,
    } = body

    if (!bookingId || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, scheduledDate, scheduledTime' },
        { status: 400 }
      )
    }

    // Verify booking exists and get service details
    const booking = await db.serviceBooking.findUnique({
      where: { id: bookingId },
      include: {
        service: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Count existing fittings for this booking to determine fitting number
    const existingFittingsCount = await db.fittingAppointment.count({
      where: { bookingId },
    })

    const fittingNumber = existingFittingsCount + 1

    // Create fitting appointment
    const fitting = await db.fittingAppointment.create({
      data: {
        bookingId,
        tailorId: tailor.id,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        durationMinutes,
        fittingNumber,
        notes: notes || null,
        status: 'scheduled',
      },
      include: {
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            customerName: true,
            customerEmail: true,
            customerPhone: true,
          },
        },
        tailor: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    })

    // Send email notification to customer
    try {
      const formattedDate = format(new Date(scheduledDate), 'EEEE, MMMM d, yyyy')

      const { html, text } = getFittingAppointmentTemplate({
        bookingNumber: booking.bookingNumber,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        serviceName: booking.service.name,
        fittingNumber,
        scheduledDate: formattedDate,
        scheduledTime,
        durationMinutes,
        tailorName: tailor.fullName,
        notes: notes || undefined,
      })

      await sendEmail({
        to: booking.customerEmail,
        subject: `Fitting Appointment Scheduled - ${booking.bookingNumber}`,
        html,
        text,
      })

      console.log(`✉️ Fitting appointment email sent to ${booking.customerEmail}`)
    } catch (emailError) {
      console.error('Failed to send fitting appointment email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(fitting, { status: 201 })
  } catch (error) {
    console.error('Error creating fitting:', error)
    return NextResponse.json(
      { error: 'Failed to create fitting appointment' },
      { status: 500 }
    )
  }
}

// GET /api/fittings - Get all fittings for tailor
export async function GET(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user || user.role !== 'tailor') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const tailor = await db.tailor.findUnique({
      where: { userId: user.id },
    })

    if (!tailor) {
      return NextResponse.json(
        { error: 'Tailor profile not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const upcoming = searchParams.get('upcoming') === 'true'

    const where: any = {
      tailorId: tailor.id,
    }

    if (status) {
      where.status = status
    }

    if (upcoming) {
      where.scheduledDate = {
        gte: new Date(),
      }
    }

    const fittings = await db.fittingAppointment.findMany({
      where,
      include: {
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            customerName: true,
            customerEmail: true,
            customerPhone: true,
            service: {
              select: {
                name: true,
              },
            },
          },
        },
        tailor: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: [
        { scheduledDate: 'asc' },
        { scheduledTime: 'asc' },
      ],
    })

    return NextResponse.json(fittings)
  } catch (error) {
    console.error('Error fetching fittings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fittings' },
      { status: 500 }
    )
  }
}
