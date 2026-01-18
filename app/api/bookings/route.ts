import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma, BookingStatus } from '@prisma/client'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { sendEmail } from '@/lib/email/mailer'
import { getBookingConfirmationTemplate } from '@/lib/email/templates/booking-confirmation'
import { getWalkInBookingConfirmationTemplate } from '@/lib/email/templates/walk-in-booking-confirmation'
import { createBookingCalendarEvent } from '@/lib/email/calendar-invite'
import { format } from 'date-fns'

// Transform booking to snake_case for mobile app compatibility
function transformBookingToSnakeCase(booking: any) {
  return {
    id: booking.id,
    booking_number: booking.bookingNumber,
    service_id: booking.serviceId,
    user_id: booking.userId,
    order_id: booking.orderId,
    status: booking.status,
    service_type: booking.serviceType,
    collection_method: booking.collectionMethod,
    scheduled_date: booking.scheduledDate,
    scheduled_time: booking.scheduledTime,
    end_time: booking.endTime,
    duration: booking.duration,
    customer_name: booking.customerName,
    customer_email: booking.customerEmail,
    customer_phone: booking.customerPhone,
    customer_notes: booking.customerNotes,
    requirement_photos: booking.requirementPhotos,
    desired_outcome: booking.desiredOutcome,
    admin_notes: booking.adminNotes,
    price: Number(booking.price),
    final_price: booking.finalPrice ? Number(booking.finalPrice) : null,
    cancellation_reason: booking.cancellationReason,
    completed_at: booking.completedAt,
    cancelled_at: booking.cancelledAt,
    created_at: booking.createdAt,
    updated_at: booking.updatedAt,
    customer_provided_materials: booking.customerProvidedMaterials,
    // Transform nested service
    service: booking.service ? {
      id: booking.service.id,
      name: booking.service.name,
      slug: booking.service.slug,
      sku: booking.service.sku,
      description: booking.service.description,
      short_description: booking.service.shortDescription,
      price: Number(booking.service.price),
      compare_at_price: booking.service.compareAtPrice ? Number(booking.service.compareAtPrice) : null,
      category_id: booking.service.categoryId,
      images: booking.service.images,
      featured_image: booking.service.featuredImage,
      duration: booking.service.duration,
      custom_duration: booking.service.customDuration,
      buffer_time: booking.service.bufferTime,
      max_bookings_per_day: booking.service.maxBookingsPerDay,
      supports_onsite: booking.service.supportsOnsite,
      supports_custom_production: booking.service.supportsCustomProduction,
      supports_collect_repair: booking.service.supportsCollectRepair,
      is_active: booking.service.isActive,
      is_featured: booking.service.isFeatured,
      tags: booking.service.tags,
      metadata: booking.service.metadata,
      created_at: booking.service.createdAt,
      updated_at: booking.service.updatedAt,
      category: booking.service.category ? {
        id: booking.service.category.id,
        name: booking.service.category.name,
        slug: booking.service.category.slug,
        description: booking.service.category.description,
        image_url: booking.service.category.imageUrl,
        icon: booking.service.category.icon,
        sort_order: booking.service.category.sortOrder,
        is_active: booking.service.category.isActive,
      } : null,
    } : undefined,
    // Transform nested quote
    quote: booking.quote ? {
      id: booking.quote.id,
      booking_id: booking.quote.bookingId,
      material_cost: Number(booking.quote.materialCost),
      labor_cost: Number(booking.quote.laborCost),
      labor_hours: booking.quote.laborHours,
      total_cost: Number(booking.quote.totalCost),
      down_payment_amount: Number(booking.quote.downPaymentAmount),
      notes: booking.quote.notes,
      status: booking.quote.status,
      valid_until: booking.quote.validUntil,
      created_at: booking.quote.createdAt,
      updated_at: booking.quote.updatedAt,
    } : undefined,
    // Transform nested materials
    materials: booking.materials?.map((m: any) => ({
      id: m.id,
      booking_id: m.bookingId,
      material_id: m.materialId,
      quantity: m.quantity,
      price_at_booking: m.priceAtBooking ? Number(m.priceAtBooking) : null,
      is_acquired: m.isAcquired,
      created_at: m.createdAt,
    })),
    // Transform nested progress updates
    progress_updates: booking.progressUpdates?.map((p: any) => ({
      id: p.id,
      booking_id: p.bookingId,
      status: p.status,
      description: p.description,
      photos: p.photos,
      created_by: p.createdBy,
      created_at: p.createdAt,
    })),
  }
}

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

    // Check if request is from mobile app (Bearer token) or web dashboard
    const authHeader = request.headers.get('Authorization')
    const isMobileApp = authHeader && authHeader.startsWith('Bearer ')

    // Check if this is a dashboard request (has 'all' param and user is admin/tailor)
    const showAll = searchParams.get('all') === 'true'
    const canSeeAll = (auth.user.role === 'admin' || auth.user.role === 'tailor') && showAll && !isMobileApp

    const where: any = {}

    // For mobile app: always filter by userId (like /bookings page on web)
    // For web dashboard with 'all' param: admins/tailors can see all bookings
    if (!canSeeAll) {
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

    // Transform bookings to snake_case for mobile app compatibility
    const transformedBookings = bookings.map(transformBookingToSnakeCase)

    return NextResponse.json(transformedBookings)
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

    console.log('📝 Booking request received:', {
      hasAuth: !!auth.user,
      userId: auth.user?.id,
      serviceType: body.serviceType,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      materialsCount: body.materials?.length || 0,
      photosCount: body.requirementPhotos?.length || 0,
    })

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
      console.log('❌ Missing required fields:', { serviceId: !!serviceId, customerName: !!customerName, customerEmail: !!customerEmail })
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

    // Transform booking to snake_case for mobile app compatibility
    return NextResponse.json(transformBookingToSnakeCase(booking), { status: 201 })
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
