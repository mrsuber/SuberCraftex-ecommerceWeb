import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { CalendarError, createEvent } from '@/lib/calendar/events'

// GET /api/schedule/events - People who can be invited (staff, apprentices)
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  const people = await db.user.findMany({
    where: { role: { in: ['admin', 'driver', 'cashier', 'tailor', 'technician', 'apprentice'] }, isSuspended: false },
    select: { id: true, fullName: true, email: true, role: true },
    orderBy: { fullName: 'asc' },
  })
  return NextResponse.json(people)
}

// POST /api/schedule/events - { title, kind, startTime, endTime, isAllDay?, location?, description?, roles?, attendeeIds? }
export async function POST(request: NextRequest) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  try {
    const { event, warnings } = await createEvent(await request.json(), user.id)
    await audit({ actor: user, action: 'calendar.event_created', targetType: 'schedule_event', targetId: event.id, details: { title: event.title, kind: event.kind } })
    return NextResponse.json({ event, warnings }, { status: 201 })
  } catch (e) {
    if (e instanceof CalendarError) return NextResponse.json({ error: e.message }, { status: 400 })
    throw e
  }
}
