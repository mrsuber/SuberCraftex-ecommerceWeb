import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma, BookingStatus } from '@prisma/client'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { sendEmail } from '@/lib/email/mailer'
import { getBookingConfirmationTemplate } from '@/lib/email/templates/booking-confirmation'
import { getWalkInBookingConfirmationTemplate } from '@/lib/email/templates/walk-in-booking-confirmation'
import { createBookingCalendarEvent } from '@/lib/email/calendar-invite'
import { format } from 'date-fns'

// Duration mapping in minutes
const DURATION_MINUTES: Record<string, number> = {
  half_hour: 30,
  one_hour: 60,
  two_hours: 120,
  half_day: 240,
  full_day: 480,
}

function generateBookingNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `BK-${timestamp}-${random}`
}

function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hour, minute] = startTime.split(':').map(Number)
  const startMinutes = hour * 60 + minute
  const endMinutes = startMinutes + durationMinutes
  const endHour = Math.floor(endMinutes / 60)
  const endMinute = endMinutes % 60
  return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
}

async function sendBookingConfirmationEmail(booking: any) {
  try {
    // Check if this is a walk-in booking (custom production or collect/repair without scheduled date/time)
    const isWalkInBooking = !booking.scheduledDate || !booking.scheduledTime

    if (isWalkInBooking) {
      // Send walk-in booking confirmation (no calendar invite needed)
      const { html, text } = getWalkInBookingConfirmationTemplate({
        bookingNumber: booking.bookingNumber,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        serviceName: booking.service.name,
        serviceCategory: booking.service.category?.name,
        serviceType: booking.serviceType,
        desiredOutcome: booking.desiredOutcome,
        customerNotes: booking.customerNotes,
      })

      await sendEmail({
        to: booking.customerEmail,
        subject: `Booking Received #${booking.bookingNumber} - ${booking.service.name}`,
        html,
        text,
      })

      console.log(`✉️ Walk-in booking confirmation sent for ${booking.bookingNumber}`)
    } else {
      // Send scheduled booking confirmation with calendar invite
      const calendarInvite = createBookingCalendarEvent({
        bookingNumber: booking.bookingNumber,
        serviceName: booking.service.name,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        duration: booking.duration,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
      })

      const { html, text } = getBookingConfirmationTemplate({
        bookingNumber: booking.bookingNumber,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        serviceName: booking.service.name,
        serviceCategory: booking.service.category?.name,
        scheduledDate: format(new Date(booking.scheduledDate), 'MMMM d, yyyy'),
        scheduledTime: booking.scheduledTime,
        endTime: booking.endTime,
        duration: booking.duration,
        price: Number(booking.price),
        customerNotes: booking.customerNotes,
        calendarInvite,
      })

      await sendEmail({
        to: booking.customerEmail,
        subject: `Booking Confirmed #${booking.bookingNumber} - ${booking.service.name}`,
        html,
        text,
      })

      console.log(`✉️ Scheduled booking confirmation sent for ${booking.bookingNumber}`)
    }
  } catch (error) {
    console.error('Error sending booking confirmation email:', error)
    throw error
  }
}

// GET /api/bookings - List user's bookings
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)

    if (!auth.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const upcoming = searchParams.get('upcoming') === 'true'

    const where: any = {}

    // Only filter by userId for regular customers
    // Admins and tailors can see all bookings
    if (auth.user.role !== 'admin' && auth.user.role !== 'tailor') {
      where.userId = auth.user.id
    }

    if (status) {
      where.status = status
    }

    if (upcoming) {
      where.scheduledDate = {
        gte: new Date(),
      }
    }

    const bookings = await db.serviceBooking.findMany({
      where,
      include: {
        service: {
          include: {
            category: true,
          },
        },
        // Include enhanced relations for listing
        quote: {
          select: {
            id: true,
            status: true,
            totalCost: true,
            downPaymentAmount: true,
          }
        },
        materials: {
          select: {
            id: true,
            quantity: true,
            isAcquired: true,
          }
        },
        progressUpdates: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1, // Only latest progress update
        },
      },
      orderBy: [
        { scheduledDate: 'asc' },
        { createdAt: 'desc' }
      ],
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    const body = await request.json()

    const {
      serviceId,
      scheduledDate,
      scheduledTime,
      customerName,
      customerEmail,
      customerPhone,
      customerNotes,
      // Enhanced fields
      serviceType = 'onsite',
      collectionMethod,
      requirementPhotos = [],
      desiredOutcome,
      customerProvidedMaterials = false,
      materials = [], // Array of { materialId, quantity }
    } = body

    // Validate required fields
    if (!serviceId || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceId, customerName, customerEmail' },
        { status: 400 }
      )
    }

    // Validate service type
    const validServiceTypes = ['onsite', 'custom_production', 'collect_repair']
    if (!validServiceTypes.includes(serviceType)) {
      return NextResponse.json(
        { error: `Invalid service type. Must be one of: ${validServiceTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // For onsite services, date and time are required
    if (serviceType === 'onsite' && (!scheduledDate || !scheduledTime)) {
      return NextResponse.json(
        { error: 'Scheduled date and time are required for on-site services' },
        { status: 400 }
      )
    }

    // For collect/repair, collection method is required
    if (serviceType === 'collect_repair' && !collectionMethod) {
      return NextResponse.json(
        { error: 'Collection method is required for collect & repair services' },
        { status: 400 }
      )
    }

    // Parse and validate date if provided
    let bookingDate = null
    if (scheduledDate) {
      bookingDate = new Date(scheduledDate)
      if (isNaN(bookingDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        )
      }

      // Don't allow booking in the past
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (bookingDate < today) {
        return NextResponse.json(
          { error: 'Cannot book services in the past' },
          { status: 400 }
        )
      }
    }

    // Use Prisma transaction for atomicity and double-booking prevention
    const booking = await db.$transaction(async (tx) => {
      // Fetch service details
      const service = await tx.service.findUnique({
        where: { id: serviceId },
      })

      if (!service || !service.isActive) {
        throw new Error('Service not found or inactive')
      }

      // Calculate duration and end time (only for scheduled services)
      const durationMinutes =
        service.duration === 'custom'
          ? service.customDuration || 60
          : DURATION_MINUTES[service.duration] || 60

      const endTime = scheduledTime ? calculateEndTime(scheduledTime, durationMinutes) : null

      // Only check for conflicts and max bookings for onsite services with scheduled date/time
      if (serviceType === 'onsite' && bookingDate && scheduledTime) {
        const conflictingBooking = await tx.serviceBooking.findFirst({
          where: {
            serviceId,
            scheduledDate: bookingDate,
            scheduledTime,
            status: {
              in: ['pending', 'confirmed', 'in_progress'],
            },
          },
        })

        if (conflictingBooking) {
          throw new Error('This time slot is no longer available')
        }

        // Check max bookings per day limit
        if (service.maxBookingsPerDay) {
          const bookingsOnDay = await tx.serviceBooking.count({
            where: {
              serviceId,
              scheduledDate: bookingDate,
              status: {
                in: ['pending', 'confirmed', 'in_progress'],
              },
            },
          })

          if (bookingsOnDay >= service.maxBookingsPerDay) {
            throw new Error('Maximum bookings reached for this day')
          }
        }
      }

      // Determine initial status based on service type
      let initialStatus: BookingStatus = 'pending'
      if (serviceType === 'custom_production' || serviceType === 'collect_repair') {
        initialStatus = 'quote_pending' // Requires quote before payment
      }

      // Determine initial price based on service type
      // For custom production and collect/repair, price is determined after quote
      // For regular onsite services, use the service base price
      let initialPrice = service.price
      if (serviceType === 'custom_production' || serviceType === 'collect_repair') {
        initialPrice = new Prisma.Decimal(0) // Price will be set when admin creates and approves quote
      }

      // Create booking
      const newBooking = await tx.serviceBooking.create({
        data: {
          bookingNumber: generateBookingNumber(),
          serviceId,
          userId: auth.user?.id,
          scheduledDate: bookingDate,
          scheduledTime: scheduledTime || null,
          endTime: scheduledTime ? endTime : null,
          duration: durationMinutes,
          customerName,
          customerEmail,
          customerPhone,
          customerNotes,
          price: initialPrice,
          status: initialStatus,
          // Enhanced fields
          serviceType,
          collectionMethod: collectionMethod || null,
          requirementPhotos,
          desiredOutcome: desiredOutcome || null,
          customerProvidedMaterials,
        },
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      })

      // Create booking materials if provided (for custom production)
      if (materials && materials.length > 0) {
        for (const mat of materials) {
          const material = await tx.material.findUnique({
            where: { id: mat.materialId }
          })

          if (!material) {
            throw new Error(`Material ${mat.materialId} not found`)
          }

          await tx.bookingMaterial.create({
            data: {
              bookingId: newBooking.id,
              materialId: mat.materialId,
              quantity: mat.quantity,
              priceAtBooking: material.price,
              isAcquired: false, // Not acquired until quote approved
            }
          })
        }
      }

      return newBooking
    })

    // Send confirmation email (non-blocking - don't wait for it)
    sendBookingConfirmationEmail(booking).catch((error) => {
      console.error('Failed to send booking confirmation email:', error)
      // Don't fail the request if email fails
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error: any) {
    console.error('Error creating booking:', error)

    if (error.message === 'Service not found or inactive') {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    if (
      error.message === 'This time slot is no longer available' ||
      error.message === 'Maximum bookings reached for this day'
    ) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
