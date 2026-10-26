import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { CalendarError, cancelEvent, updateEvent } from '@/lib/calendar/events'

// GET /api/schedule/events/[id] - One staff event with its attendees (admin)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  const event = await db.scheduleEvent.findUnique({ where: { id }, include: { attendees: { include: { user: { select: { fullName: true, email: true } } } } } })
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(event)
}

// PUT /api/schedule/events/[id] - Change an event (same fields as creating)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  try {
    const out = await updateEvent(id, await request.json())
    await audit({ actor: user, action: 'calendar.event_changed', targetType: 'schedule_event', targetId: id })
    return NextResponse.json(out)
  } catch (e) {
    if (e instanceof CalendarError) return NextResponse.json({ error: e.message }, { status: 400 })
    throw e
  }
}

// DELETE /api/schedule/events/[id] - Cancel it (kept for the record)
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  await cancelEvent(id)
  await audit({ actor: user, action: 'calendar.event_cancelled', targetType: 'schedule_event', targetId: id })
  return NextResponse.json({ cancelled: true })
}
