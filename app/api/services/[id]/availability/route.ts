import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Duration mapping in minutes
const DURATION_MINUTES: Record<string, number> = {
  half_hour: 30,
  one_hour: 60,
  two_hours: 120,
  half_day: 240,
  full_day: 480,
}

// GET /api/services/[id]/availability - Get available time slots for a date range
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: serviceId } = await params
    const { searchParams } = new URL(request.url)

    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    if (!startDateParam || !endDateParam) {
      return NextResponse.json(
        { error: 'Missing required parameters: startDate, endDate' },
        { status: 400 }
      )
    }

    const startDate = new Date(startDateParam)
    const endDate = new Date(endDateParam)

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Don't allow booking in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (startDate < today) {
      return NextResponse.json(
        { error: 'Cannot get availability for past dates' },
        { status: 400 }
      )
    }

    // Fetch service details
    const service = await db.service.findUnique({
      where: { id: serviceId },
      include: {
        availability: {
          where: { isActive: true },
        },
        blockouts: {
          where: {
            OR: [
              {
                startDate: {
                  lte: endDate,
                },
                endDate: {
                  gte: startDate,
                },
              },
            ],
          },
        },
      },
    })

    if (!service || !service.isActive) {
      return NextResponse.json(
        { error: 'Service not found or inactive' },
        { status: 404 }
      )
    }

    // Get service duration in minutes
    const durationMinutes =
      service.duration === 'custom'
        ? service.customDuration || 60
        : DURATION_MINUTES[service.duration] || 60

    // Get existing bookings in the date range
    const existingBookings = await db.serviceBooking.findMany({
      where: {
        serviceId,
        scheduledDate: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          in: ['pending', 'confirmed', 'in_progress'],
        },
      },
      select: {
        scheduledDate: true,
        scheduledTime: true,
        endTime: true,
      },
    })

    // Calculate available slots for each day in the range
    const availabilityMap: Record<string, string[]> = {}

    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const dayOfWeek = currentDate.getDay()

      // Find availability for this day of week
      const dayAvailability = service.availability.find(
        (a) => a.dayOfWeek === dayOfWeek
      )

      if (!dayAvailability) {
        // No availability for this day
        currentDate.setDate(currentDate.getDate() + 1)
        continue
      }

      // Check if this date is blocked out
      const isBlockedOut = service.blockouts.some((blockout) => {
        const blockStart = new Date(blockout.startDate)
        const blockEnd = new Date(blockout.endDate)
        blockStart.setHours(0, 0, 0, 0)
        blockEnd.setHours(23, 59, 59, 999)
        return currentDate >= blockStart && currentDate <= blockEnd
      })

      if (isBlockedOut) {
        currentDate.setDate(currentDate.getDate() + 1)
        continue
      }

      // Parse start and end times
      const [startHour, startMinute] = dayAvailability.startTime.split(':').map(Number)
      const [endHour, endMinute] = dayAvailability.endTime.split(':').map(Number)

      const dayStart = startHour * 60 + startMinute // minutes from midnight
      const dayEnd = endHour * 60 + endMinute

      // Generate 30-minute time slots
      const slots: string[] = []
      let currentSlot = dayStart

      while (currentSlot + durationMinutes <= dayEnd) {
        const slotHour = Math.floor(currentSlot / 60)
        const slotMinute = currentSlot % 60
        const slotTime = `${slotHour.toString().padStart(2, '0')}:${slotMinute.toString().padStart(2, '0')}`

        // Calculate end time for this slot
        const slotEndMinutes = currentSlot + durationMinutes
        const endHour = Math.floor(slotEndMinutes / 60)
        const endMinute = slotEndMinutes % 60
        const slotEndTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`

        // Check if this slot conflicts with existing bookings
        const hasConflict = existingBookings.some((booking) => {
          if (booking.scheduledDate.toISOString().split('T')[0] !== dateStr) {
            return false
          }

          // Parse booking times
          const [bookingStartHour, bookingStartMinute] = booking.scheduledTime.split(':').map(Number)
          const [bookingEndHour, bookingEndMinute] = booking.endTime.split(':').map(Number)

          const bookingStart = bookingStartHour * 60 + bookingStartMinute
          const bookingEnd = bookingEndHour * 60 + bookingEndMinute

          const slotStart = currentSlot
          const slotEnd = slotEndMinutes

          // Check for overlap (including buffer time)
          const bufferMinutes = service.bufferTime || 0
          return (
            (slotStart >= bookingStart - bufferMinutes && slotStart < bookingEnd + bufferMinutes) ||
            (slotEnd > bookingStart - bufferMinutes && slotEnd <= bookingEnd + bufferMinutes) ||
            (slotStart <= bookingStart && slotEnd >= bookingEnd)
          )
        })

        if (!hasConflict) {
          // Check max bookings per day limit
          if (service.maxBookingsPerDay) {
            const bookingsOnThisDay = existingBookings.filter(
              (b) => b.scheduledDate.toISOString().split('T')[0] === dateStr
            ).length

            if (bookingsOnThisDay >= service.maxBookingsPerDay) {
              break // No more slots available for this day
            }
          }

          slots.push(slotTime)
        }

        // Move to next slot (30-minute increments)
        currentSlot += 30
      }

      if (slots.length > 0) {
        availabilityMap[dateStr] = slots
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return NextResponse.json({
      serviceId,
      serviceName: service.name,
      duration: service.duration,
      durationMinutes,
      bufferTime: service.bufferTime,
      availability: availabilityMap,
    })
  } catch (error) {
    console.error('Error fetching service availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
