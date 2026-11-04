import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma, BookingStatus } from '@prisma/client'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { sendEmail } from '@/lib/email/mailer'
import { getBookingConfirmationTemplate } from '@/lib/email/templates/booking-confirmation'
import { getWalkInBookingConfirmationTemplate } from '@/lib/email/templates/walk-in-booking-confirmation'
import { createBookingCalendarEvent } from '@/lib/email/calendar-invite'
import { format } from 'date-fns'
import { addMinutes, assertSlotFree, parseShopDate, ScheduleError, serviceMinutes, shopToday } from '@/lib/services/booking-schedule'

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
    service_address: booking.serviceAddress,
    source: booking.source,
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
    design_selections: booking.designSelections,
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

function generateBookingNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `BK-${timestamp}-${random}`
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

// POST /api/bookings - A signed-in customer books a service online.
// Staff record phone and walk-in jobs with POST /api/admin/bookings.
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.user) {
      return NextResponse.json({ error: 'Please sign in to book a service' }, { status: 401 })
    }
    const body = await request.json()

    const {
      serviceId,
      scheduledDate,
      scheduledTime,
      customerNotes,
      serviceType = 'onsite',
      collectionMethod,
      requirementPhotos = [],
      desiredOutcome,
      customerProvidedMaterials = false,
      materials = [], // Array of { materialId, quantity }
      designSelections, // Array of { categoryId, categoryName, optionIds: [{optionId, optionName, imageUrl}] }
    } = body

    // The customer is the signed-in user; the form may correct the name and phone
    const customerName = String(body.customerName || auth.user.fullName || '').trim()
    const customerEmail = auth.user.email
    const customerPhone = String(body.customerPhone || auth.user.phone || '').trim() || null
    const serviceAddress = String(body.serviceAddress || '').trim() || null

    if (!serviceId) {
      return NextResponse.json({ error: 'Choose a service' }, { status: 400 })
    }
    if (!customerName) {
      return NextResponse.json({ error: 'Please give your name' }, { status: 400 })
    }

    const validServiceTypes = ['onsite', 'custom_production', 'collect_repair']
    if (!validServiceTypes.includes(serviceType)) {
      return NextResponse.json(
        { error: `Invalid service type. Must be one of: ${validServiceTypes.join(', ')}` },
        { status: 400 }
      )
    }

    if (serviceType === 'onsite') {
      if (!scheduledDate || !scheduledTime) {
        return NextResponse.json({ error: 'Choose a date and time for the visit' }, { status: 400 })
      }
      if (!serviceAddress) {
        return NextResponse.json({ error: 'Tell us where the work is (address or landmark)' }, { status: 400 })
      }
      if (!customerPhone) {
        return NextResponse.json({ error: 'Give a phone number so the technician can reach you' }, { status: 400 })
      }
    }

    if (serviceType === 'collect_repair') {
      if (!collectionMethod) {
        return NextResponse.json({ error: 'Collection method is required for collect & repair services' }, { status: 400 })
      }
      if (collectionMethod === 'admin_collects' && !serviceAddress) {
        return NextResponse.json({ error: 'Tell us where to collect the item' }, { status: 400 })
      }
    }

    // A shop day (Cameroon time), never the customer's or the server's
    let bookingDate: Date | null = null
    if (scheduledDate) {
      bookingDate = parseShopDate(scheduledDate)
      if (!bookingDate) {
        return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
      }
      if (bookingDate < shopToday()) {
        return NextResponse.json({ error: 'Cannot book services in the past' }, { status: 400 })
      }
    }

    const booking = await db.$transaction(async (tx) => {
      const service = await tx.service.findUnique({ where: { id: serviceId } })
      if (!service || !service.isActive) {
        throw new Error('Service not found or inactive')
      }

      const durationMinutes = serviceMinutes(service)
      const endTime = scheduledTime ? addMinutes(scheduledTime, durationMinutes) : null

      // Visits take a slot: check it inside the transaction, with the service locked
      if (serviceType === 'onsite' && bookingDate && scheduledTime) {
        await assertSlotFree(tx, service, bookingDate, scheduledTime)
      }

      // Workshop jobs are priced by a quote first; visits start at the service price
      const needsQuote = serviceType === 'custom_production' || serviceType === 'collect_repair'
      const initialStatus: BookingStatus = needsQuote ? 'quote_pending' : 'pending'
      const initialPrice = needsQuote ? new Prisma.Decimal(0) : service.price

      const newBooking = await tx.serviceBooking.create({
        data: {
          bookingNumber: generateBookingNumber(),
          serviceId,
          userId: auth.user!.id,
          scheduledDate: bookingDate,
          scheduledTime: scheduledTime || null,
          endTime,
          duration: durationMinutes,
          customerName,
          customerEmail,
          customerPhone,
          customerNotes,
          serviceAddress,
          source: 'online',
          price: initialPrice,
          status: initialStatus,
          serviceType,
          collectionMethod: collectionMethod || null,
          requirementPhotos,
          desiredOutcome: desiredOutcome || null,
          customerProvidedMaterials,
          designSelections: designSelections || undefined,
        },
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      })

      // Materials the customer chose (custom production)
      for (const mat of materials as { materialId: string; quantity: number }[]) {
        const material = await tx.material.findUnique({ where: { id: mat.materialId } })
        if (!material) {
          throw new Error(`Material ${mat.materialId} not found`)
        }
        await tx.bookingMaterial.create({
          data: {
            bookingId: newBooking.id,
            materialId: mat.materialId,
            quantity: mat.quantity,
            priceAtBooking: material.price,
            isAcquired: false,
          },
        })
      }

      return newBooking
    })

    sendBookingConfirmationEmail(booking).catch((error) => {
      console.error('Failed to send booking confirmation email:', error)
    })

    try {
      const { NotificationService } = await import('@/lib/services/notification-service')
      await NotificationService.notifyNewBooking({
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        serviceName: booking.service.name,
        customerName: booking.customerName,
        scheduledDate: booking.scheduledDate || undefined,
      })
    } catch (notifError) {
      console.error('⚠️  Failed to create admin notification:', notifError)
    }

    return NextResponse.json(transformBookingToSnakeCase(booking), { status: 201 })
  } catch (error: any) {
    if (error instanceof ScheduleError) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    console.error('Error creating booking:', error)
    if (error.message === 'Service not found or inactive') {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
