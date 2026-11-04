import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { STAFF_ROLES } from '@/lib/services/booking-workflow'
import { createStaffBooking, StaffBookingError } from '@/lib/services/staff-bookings'

/**
 * POST /api/admin/bookings — staff record a phone, walk-in or already-done job:
 * { serviceId, serviceType?, customerName, customerPhone?, customerEmail?, serviceAddress?,
 *   scheduledDate?, scheduledTime?, price?, status?: confirmed|in_progress|completed, customerNotes?, adminNotes? }
 */
export async function POST(request: NextRequest) {
  const { user } = await verifyAuth(request)
  if (!user || !STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ error: 'Only SuberCraftex staff can record jobs' }, { status: 403 })
  }
  try {
    const body = await request.json()
    const booking = await createStaffBooking(body, user)
    return NextResponse.json({ id: booking.id, bookingNumber: booking.bookingNumber, status: booking.status }, { status: 201 })
  } catch (error) {
    if (error instanceof StaffBookingError) return NextResponse.json({ error: error.message }, { status: 400 })
    console.error('Error recording staff booking:', error)
    return NextResponse.json({ error: 'Failed to record the job' }, { status: 500 })
  }
}
