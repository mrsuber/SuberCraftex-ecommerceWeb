import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { sendEmail } from '@/lib/email/mailer'
import { getBookingRescheduleTemplate } from '@/lib/email/templates/booking-reschedule'
import { getBookingCancellationTemplate } from '@/lib/email/templates/booking-cancellation'
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

function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hour, minute] = startTime.split(':').map(Number)
  const startMinutes = hour * 60 + minute
  const endMinutes = startMinutes + durationMinutes
  const endHour = Math.floor(endMinutes / 60)
  const endMinute = endMinutes % 60
  return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
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

    // Only allow user to see their own bookings (or admin)
    if (!auth.user || (auth.user.id !== booking.userId && auth.user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

// PATCH /api/bookings/[id] - Update booking (reschedule or update status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request)
    const { id } = await params
    const body = await request.json()

    // Fetch existing booking
    const existingBooking = await db.serviceBooking.findUnique({
      where: { id },
      include: { service: true },
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check permissions
    const isOwner = auth.user?.id === existingBooking.userId
    const isAdmin = auth.user?.role === 'admin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Handle reschedule
    if (body.scheduledDate || body.scheduledTime) {
      const newDate = body.scheduledDate
        ? new Date(body.scheduledDate)
        : existingBooking.scheduledDate
      const newTime = body.scheduledTime || existingBooking.scheduledTime

      // Validate new date is not in the past
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (newDate < today) {
        return NextResponse.json(
          { error: 'Cannot reschedule to a past date' },
          { status: 400 }
        )
      }

      // Use transaction to check availability and update
      const updatedBooking = await db.$transaction(async (tx) => {
        // Check for conflicts (excluding current booking)
        const conflict = await tx.serviceBooking.findFirst({
          where: {
            serviceId: existingBooking.serviceId,
            scheduledDate: newDate,
            scheduledTime: newTime,
            status: {
              in: ['pending', 'confirmed', 'in_progress'],
            },
            id: {
              not: id,
            },
          },
        })

        if (conflict) {
          throw new Error('This time slot is no longer available')
        }

        // Calculate new end time
        const durationMinutes =
          existingBooking.service.duration === 'custom'
            ? existingBooking.service.customDuration || 60
            : DURATION_MINUTES[existingBooking.service.duration] || 60

        const endTime = calculateEndTime(newTime, durationMinutes)

        // Update booking
        return await tx.serviceBooking.update({
          where: { id },
          data: {
            scheduledDate: newDate,
            scheduledTime: newTime,
            endTime,
            rescheduledFrom: existingBooking.id,
            status: body.status || existingBooking.status,
            ...(body.adminNotes && { adminNotes: body.adminNotes }),
          },
          include: {
            service: {
              include: {
                category: true,
              },
            },
          },
        })
      })

      // Send reschedule email (non-blocking)
      sendRescheduleEmail(
        updatedBooking,
        existingBooking.scheduledDate,
        existingBooking.scheduledTime
      ).catch((error) => {
        console.error('Failed to send reschedule email:', error)
      })

      return NextResponse.json(updatedBooking)
    }

    // Handle status update (admin only for most statuses)
    if (body.status) {
      if (!isAdmin && !['cancelled'].includes(body.status)) {
        return NextResponse.json(
          { error: 'Only admins can update booking status' },
          { status: 403 }
        )
      }

      const updateData: any = {
        status: body.status,
      }

      if (body.status === 'cancelled') {
        updateData.cancelledAt = new Date()
        updateData.cancellationReason = body.cancellationReason || null
      }

      if (body.status === 'completed') {
        updateData.completedAt = new Date()
      }

      if (body.adminNotes !== undefined) {
        updateData.adminNotes = body.adminNotes
      }

      const updatedBooking = await db.serviceBooking.update({
        where: { id },
        data: updateData,
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      })

      // Send cancellation email if status changed to cancelled
      if (body.status === 'cancelled') {
        sendCancellationEmail(updatedBooking).catch((error) => {
          console.error('Failed to send cancellation email:', error)
        })
      }

      return NextResponse.json(updatedBooking)
    }

    return NextResponse.json(
      { error: 'No valid update fields provided' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Error updating booking:', error)

    if (error.message === 'This time slot is no longer available') {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
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

    // Cannot cancel already cancelled or completed bookings
    if (['cancelled', 'completed'].includes(booking.status)) {
      return NextResponse.json(
        { error: `Cannot cancel ${booking.status} booking` },
        { status: 400 }
      )
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
      booking: cancelledBooking,
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}
