import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { sendEmail } from '@/lib/email/mailer'
import { getBookingRescheduleTemplate } from '@/lib/email/templates/booking-reschedule'
import { getBookingCancellationTemplate } from '@/lib/email/templates/booking-cancellation'
import { createBookingCalendarEvent } from '@/lib/email/calendar-invite'
import { format } from 'date-fns'
import { BookingStatus, Prisma } from '@prisma/client'
import { audit } from '@/lib/audit'
import { addMinutes, assertSlotFree, parseShopDate, ScheduleError, serviceMinutes, shopToday } from '@/lib/services/booking-schedule'
import { checkTransition, WORK_ROLES, WorkflowError } from '@/lib/services/booking-workflow'

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
    // Transform nested user
    user: booking.user ? {
      id: booking.user.id,
      email: booking.user.email,
      full_name: booking.user.fullName,
    } : undefined,
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
    // Transform nested quote with history
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
      history: booking.quote.history?.map((h: any) => ({
        id: h.id,
        quote_id: h.quoteId,
        version: h.version,
        material_cost: Number(h.materialCost),
        labor_cost: Number(h.laborCost),
        total_cost: Number(h.totalCost),
        notes: h.notes,
        created_at: h.createdAt,
      })),
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
      material: m.material ? {
        id: m.material.id,
        sku: m.material.sku,
        name: m.material.name,
        description: m.material.description,
        price: Number(m.material.price),
        stock_quantity: m.material.stockQuantity,
        unit: m.material.unit,
        images: m.material.images,
        is_active: m.material.isActive,
      } : undefined,
    })),
    // Transform material requests
    material_requests: booking.materialRequests?.map((mr: any) => ({
      id: mr.id,
      booking_id: mr.bookingId,
      description: mr.description,
      reference_url: mr.referenceUrl,
      reference_photos: mr.referencePhotos,
      status: mr.status,
      admin_notes: mr.adminNotes,
      created_at: mr.createdAt,
      updated_at: mr.updatedAt,
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
    // Transform timeline
    timeline: booking.timeline?.map((t: any) => ({
      id: t.id,
      booking_id: t.bookingId,
      event_type: t.eventType,
      title: t.title,
      description: t.description,
      metadata: t.metadata,
      created_by: t.createdBy,
      created_at: t.createdAt,
    })),
    // Transform payments
    payments: booking.payments?.map((p: any) => ({
      id: p.id,
      booking_id: p.bookingId,
      amount: Number(p.amount),
      payment_type: p.paymentType,
      payment_method: p.paymentMethod,
      status: p.status,
      stripe_payment_id: p.stripePaymentId,
      notes: p.notes,
      created_at: p.createdAt,
    })),
  }
}

async function sendRescheduleEmail(booking: any, oldDate: Date, oldTime: string) {
  try {
    const calendarInvite = createBookingCalendarEvent({
      bookingNumber: booking.bookingNumber,
      serviceName: booking.service.name,
      scheduledDate: booking.scheduledDate,
      scheduledTime: booking.scheduledTime,
      duration: booking.duration,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
    })

    const { html, text } = getBookingRescheduleTemplate({
      bookingNumber: booking.bookingNumber,
      customerName: booking.customerName,
      serviceName: booking.service.name,
      oldDate: format(oldDate, 'MMMM d, yyyy'),
      oldTime,
      newDate: format(new Date(booking.scheduledDate), 'MMMM d, yyyy'),
      newTime: booking.scheduledTime,
      endTime: booking.endTime,
      duration: booking.duration,
      price: Number(booking.price),
      calendarInvite,
    })

    await sendEmail({
      to: booking.customerEmail,
      subject: `Booking Rescheduled #${booking.bookingNumber} - ${booking.service.name}`,
      html,
      text,
    })
  } catch (error) {
    console.error('Error sending reschedule email:', error)
    throw error
  }
}

async function sendCancellationEmail(booking: any) {
  try {
    const { html, text } = getBookingCancellationTemplate({
      bookingNumber: booking.bookingNumber,
      customerName: booking.customerName,
      serviceName: booking.service.name,
      scheduledDate: format(new Date(booking.scheduledDate), 'MMMM d, yyyy'),
      scheduledTime: booking.scheduledTime,
      cancellationReason: booking.cancellationReason,
    })

    await sendEmail({
      to: booking.customerEmail,
      subject: `Booking Cancelled #${booking.bookingNumber} - ${booking.service.name}`,
      html,
      text,
    })
  } catch (error) {
    console.error('Error sending cancellation email:', error)
    throw error
  }
}

// GET /api/bookings/[id] - Get booking details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request)
    const { id } = await params

    const booking = await db.serviceBooking.findUnique({
      where: { id },
      include: {
        service: {
          include: {
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        // Enhanced relations
        quote: {
          include: {
            history: {
              orderBy: {
                createdAt: 'desc'
              }
            }
          }
        },
        materials: {
          include: {
            material: true
          }
        },
        materialRequests: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        progressUpdates: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        timeline: true,
        payments: {
          orderBy: {
            createdAt: 'desc'
          }
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Only allow user to see their own bookings (or admin/tailor)
    if (!auth.user || (auth.user.id !== booking.userId && auth.user.role !== 'admin' && auth.user.role !== 'tailor')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Transform to snake_case for mobile app compatibility
    return NextResponse.json(transformBookingToSnakeCase(booking))
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

// PATCH /api/bookings/[id] - Reschedule, or move the job along (see lib/services/booking-workflow)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request)
    const { id } = await params
    const body = await request.json()

    const existingBooking = await db.serviceBooking.findUnique({
      where: { id },
      include: { service: true },
    })
    if (!existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const role = auth.user?.role ?? ''
    const isOwner = !!auth.user && auth.user.id === existingBooking.userId
    const isStaff = WORK_ROLES.includes(role)
    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // ---------------------------------------------------------------- reschedule
    if (body.scheduledDate || body.scheduledTime) {
      const newDate = body.scheduledDate ? parseShopDate(body.scheduledDate) : existingBooking.scheduledDate
      const newTime: string | null = body.scheduledTime || existingBooking.scheduledTime
      if (!newDate || !newTime) {
        return NextResponse.json({ error: 'Give both a valid date and a time' }, { status: 400 })
      }
      if (!isStaff && newDate < shopToday()) {
        return NextResponse.json({ error: 'Cannot reschedule to a past date' }, { status: 400 })
      }
      if (!isStaff && !['pending', 'confirmed', 'rescheduled', 'quote_approved', 'awaiting_payment'].includes(existingBooking.status)) {
        return NextResponse.json({ error: 'This booking can no longer be moved online. Please call us.' }, { status: 400 })
      }

      const updatedBooking = await db.$transaction(async (tx) => {
        // Staff may place a job anywhere (they agreed it with the customer); customers need a free slot
        if (!isStaff) {
          await assertSlotFree(tx, existingBooking.service, newDate, newTime, { excludeBookingId: id })
        }
        return tx.serviceBooking.update({
          where: { id },
          data: {
            scheduledDate: newDate,
            scheduledTime: newTime,
            endTime: addMinutes(newTime, existingBooking.duration || serviceMinutes(existingBooking.service)),
            ...(isStaff && body.adminNotes !== undefined ? { adminNotes: body.adminNotes } : {}),
          },
          include: { service: { include: { category: true } } },
        })
      })

      if (existingBooking.scheduledDate && existingBooking.scheduledTime) {
        sendRescheduleEmail(updatedBooking, existingBooking.scheduledDate, existingBooking.scheduledTime).catch((error) => {
          console.error('Failed to send reschedule email:', error)
        })
      }
      return NextResponse.json(transformBookingToSnakeCase(updatedBooking))
    }

    // ---------------------------------------------------------------- status / notes
    if (body.status || (isStaff && body.adminNotes !== undefined)) {
      const to = (body.status || existingBooking.status) as BookingStatus
      checkTransition(role, isOwner, existingBooking.status, to)

      const updateData: Prisma.ServiceBookingUpdateInput = { status: to }
      if (to === 'cancelled' && existingBooking.status !== 'cancelled') {
        updateData.cancelledAt = new Date()
        updateData.cancellationReason = body.cancellationReason || null
      }
      if (to === 'completed' && existingBooking.status !== 'completed') updateData.completedAt = new Date()
      if (existingBooking.status === 'completed' && to !== 'completed') updateData.completedAt = null
      if (isStaff && body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes

      const updatedBooking = await db.serviceBooking.update({
        where: { id },
        data: updateData,
        include: { service: { include: { category: true } } },
      })
      if (auth.user && to !== existingBooking.status) {
        await audit({
          actor: auth.user,
          action: 'booking.status',
          targetType: 'booking',
          targetId: id,
          details: { from: existingBooking.status, to },
        })
      }

      if (to === 'cancelled' && existingBooking.status !== 'cancelled') {
        sendCancellationEmail(updatedBooking).catch((error) => {
          console.error('Failed to send cancellation email:', error)
        })
      }
      return NextResponse.json(transformBookingToSnakeCase(updatedBooking))
    }

    return NextResponse.json({ error: 'No valid update fields provided' }, { status: 400 })
  } catch (error: any) {
    if (error instanceof WorkflowError) return NextResponse.json({ error: error.message }, { status: 400 })
    if (error instanceof ScheduleError) return NextResponse.json({ error: error.message }, { status: 409 })
    console.error('Error updating booking:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

// DELETE /api/bookings/[id] - Cancel booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request)
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const reason = body.reason

    // Fetch booking with materials
    const booking = await db.serviceBooking.findUnique({
      where: { id },
      include: {
        materials: {
          include: {
            material: true
          }
        },
        service: true,
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check permissions
    const isOwner = auth.user?.id === booking.userId
    const isAdmin = auth.user?.role === 'admin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Same rules as a status change: customers only before work starts, nothing once finished
    if (['cancelled', 'completed'].includes(booking.status)) {
      return NextResponse.json({ error: `Cannot cancel ${booking.status} booking` }, { status: 400 })
    }
    try {
      checkTransition(auth.user?.role ?? '', isOwner, booking.status, 'cancelled')
    } catch (e) {
      if (e instanceof WorkflowError) return NextResponse.json({ error: e.message }, { status: 400 })
      throw e
    }

    // Use transaction to cancel booking and restore materials
    const cancelledBooking = await db.$transaction(async (tx) => {
      // Update booking status to cancelled
      const updated = await tx.serviceBooking.update({
        where: { id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancellationReason: reason || 'Cancelled by user',
        },
        include: {
          service: true,
        },
      })

      // Restore material inventory if materials were reserved (not yet acquired)
      if (booking.materials && booking.materials.length > 0) {
        for (const bookingMaterial of booking.materials) {
          // Only restore if material hasn't been acquired yet
          if (!bookingMaterial.isAcquired) {
            await tx.material.update({
              where: { id: bookingMaterial.materialId },
              data: {
                stockQuantity: {
                  increment: bookingMaterial.quantity
                }
              }
            })

            console.log(
              `📦 Restored ${bookingMaterial.quantity} units of ${bookingMaterial.material.name} to inventory`
            )
          }
        }
      }

      return updated
    })

    // Send cancellation email (non-blocking)
    sendCancellationEmail(cancelledBooking).catch((error) => {
      console.error('Failed to send cancellation email:', error)
    })

    return NextResponse.json({
      message: 'Booking cancelled successfully',
      booking: transformBookingToSnakeCase(cancelledBooking),
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}
