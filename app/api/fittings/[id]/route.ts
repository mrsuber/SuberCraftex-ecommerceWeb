import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { sendEmail } from '@/lib/email/mailer'
import { getFittingRescheduledTemplate } from '@/lib/email/templates/fitting-rescheduled'
import { format } from 'date-fns'

// PATCH /api/fittings/[id] - Update fitting status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getSession()

    if (!user || user.role !== 'tailor') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const fitting = await db.fittingAppointment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
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
    })

    if (!fitting) {
      return NextResponse.json(
        { error: 'Fitting not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      status,
      customerCalled,
      attended,
      notes,
      scheduledDate,
      scheduledTime,
      durationMinutes,
    } = body

    // Track if this is a reschedule (date or time changed)
    const isRescheduled =
      (scheduledDate && new Date(scheduledDate).toDateString() !== fitting.scheduledDate.toDateString()) ||
      (scheduledTime && scheduledTime !== fitting.scheduledTime)

    const updateData: any = {}

    if (status) {
      updateData.status = status
    }

    if (typeof customerCalled === 'boolean') {
      updateData.customerCalled = customerCalled
      if (customerCalled && !fitting.customerCalled) {
        updateData.calledAt = new Date()
        updateData.calledBy = user.id
        updateData.status = 'customer_called'
      }
    }

    if (typeof attended === 'boolean') {
      updateData.attended = attended
      if (attended) {
        updateData.attendedAt = new Date()
        updateData.status = 'completed'
      } else if (attended === false) {
        updateData.status = 'no_show'
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes
    }

    if (scheduledDate) {
      updateData.scheduledDate = new Date(scheduledDate)
    }

    if (scheduledTime) {
      updateData.scheduledTime = scheduledTime
    }

    if (durationMinutes) {
      updateData.durationMinutes = durationMinutes
    }

    const updatedFitting = await db.fittingAppointment.update({
      where: { id },
      data: updateData,
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
            fullName: true,
          },
        },
      },
    })

    // Send email notification if rescheduled
    if (isRescheduled) {
      try {
        const newDate = scheduledDate ? new Date(scheduledDate) : fitting.scheduledDate
        const newTime = scheduledTime || fitting.scheduledTime
        const newDuration = durationMinutes || fitting.durationMinutes

        const oldFormattedDate = format(fitting.scheduledDate, 'EEEE, MMMM d, yyyy')
        const newFormattedDate = format(newDate, 'EEEE, MMMM d, yyyy')

        const { html, text } = getFittingRescheduledTemplate({
          bookingNumber: fitting.booking.bookingNumber,
          customerName: fitting.booking.customerName,
          customerEmail: fitting.booking.customerEmail,
          serviceName: fitting.booking.service.name,
          fittingNumber: fitting.fittingNumber,
          oldScheduledDate: oldFormattedDate,
          oldScheduledTime: fitting.scheduledTime,
          newScheduledDate: newFormattedDate,
          newScheduledTime: newTime,
          durationMinutes: newDuration,
          tailorName: fitting.tailor.fullName,
          notes: updateData.notes || fitting.notes || undefined,
        })

        await sendEmail({
          to: fitting.booking.customerEmail,
          subject: `Fitting Appointment Rescheduled - ${fitting.booking.bookingNumber}`,
          html,
          text,
        })

        console.log(`✉️ Fitting reschedule email sent to ${fitting.booking.customerEmail}`)
      } catch (emailError) {
        console.error('Failed to send fitting reschedule email:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(updatedFitting)
  } catch (error) {
    console.error('Error updating fitting:', error)
    return NextResponse.json(
      { error: 'Failed to update fitting' },
      { status: 500 }
    )
  }
}

// DELETE /api/fittings/[id] - Cancel fitting
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getSession()

    if (!user || user.role !== 'tailor') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const fitting = await db.fittingAppointment.findUnique({
      where: { id },
    })

    if (!fitting) {
      return NextResponse.json(
        { error: 'Fitting not found' },
        { status: 404 }
      )
    }

    // Soft delete by updating status to cancelled
    await db.fittingAppointment.update({
      where: { id },
      data: { status: 'cancelled' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting fitting:', error)
    return NextResponse.json(
      { error: 'Failed to cancel fitting' },
      { status: 500 }
    )
  }
}
