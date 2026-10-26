import { ScheduleEventKind } from '@prisma/client'
import { db } from '@/lib/db'

export class CalendarError extends Error {}

const KINDS = Object.values(ScheduleEventKind)
const ROLES = ['admin', 'driver', 'cashier', 'tailor', 'technician', 'apprentice', 'investor']

export interface EventInput {
  title?: unknown
  description?: unknown
  kind?: unknown
  startTime?: unknown
  endTime?: unknown
  isAllDay?: unknown
  location?: unknown
  roles?: unknown
  attendeeIds?: unknown
  equipmentId?: unknown
}

function parse(input: EventInput) {
  const title = String(input.title ?? '').trim().slice(0, 200)
  if (!title) throw new CalendarError('Give the event a title')
  const start = new Date(String(input.startTime ?? ''))
  const end = new Date(String(input.endTime ?? ''))
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) throw new CalendarError('Start and end must be dates')
  if (end <= start) throw new CalendarError('The end must be after the start')
  if (end.getTime() - start.getTime() > 92 * 86_400_000) throw new CalendarError('An event can last at most 92 days')
  const kind = KINDS.includes(input.kind as ScheduleEventKind) ? (input.kind as ScheduleEventKind) : 'other'
  const roles = Array.isArray(input.roles) ? input.roles.map(String).filter((r) => ROLES.includes(r)) : []
  const attendeeIds = Array.isArray(input.attendeeIds) ? [...new Set(input.attendeeIds.map(String))].slice(0, 200) : []
  return {
    data: {
      title,
      description: input.description ? String(input.description).slice(0, 5000) : null,
      kind,
      startTime: start,
      endTime: end,
      isAllDay: input.isAllDay === true,
      location: input.location ? String(input.location).slice(0, 200) : null,
      roles,
      equipmentId: input.equipmentId ? String(input.equipmentId) : null,
    },
    attendeeIds,
  }
}

/** People already busy then (a shift, leave or meeting), to warn before saving. */
export async function clashes(userIds: string[], start: Date, end: Date, ignoreEventId?: string) {
  if (!userIds.length) return []
  const rows = await db.scheduleEventAttendee.findMany({
    where: {
      userId: { in: userIds },
      response: { not: 'declined' },
      event: { cancelledAt: null, startTime: { lt: end }, endTime: { gt: start }, ...(ignoreEventId ? { id: { not: ignoreEventId } } : {}) },
    },
    include: { event: true, user: { select: { fullName: true, email: true } } },
  })
  return rows.map((r) => ({ userId: r.userId, name: r.user.fullName ?? r.user.email, event: r.event.title, kind: r.event.kind, start: r.event.startTime, end: r.event.endTime }))
}

export async function createEvent(input: EventInput, actorId: string) {
  const { data, attendeeIds } = parse(input)
  const found = await db.user.count({ where: { id: { in: attendeeIds } } })
  if (found !== attendeeIds.length) throw new CalendarError('Some people were not found')
  const warnings = await clashes(attendeeIds, data.startTime, data.endTime)
  const event = await db.scheduleEvent.create({
    data: { ...data, createdById: actorId, attendees: { create: attendeeIds.map((userId) => ({ userId })) } },
    include: { attendees: true },
  })
  return { event, warnings }
}

export async function updateEvent(id: string, input: EventInput) {
  const existing = await db.scheduleEvent.findUnique({ where: { id }, include: { attendees: true } })
  if (!existing || existing.cancelledAt) throw new CalendarError('Event not found')
  const { data, attendeeIds } = parse(input)
  const warnings = await clashes(attendeeIds, data.startTime, data.endTime, id)
  const keep = new Set(attendeeIds)
  const moved = existing.startTime.getTime() !== data.startTime.getTime() || existing.endTime.getTime() !== data.endTime.getTime()
  const event = await db.$transaction(async (tx) => {
    await tx.scheduleEventAttendee.deleteMany({ where: { eventId: id, userId: { notIn: [...keep] } } })
    for (const userId of attendeeIds) {
      await tx.scheduleEventAttendee.upsert({
        where: { eventId_userId: { eventId: id, userId } },
        create: { eventId: id, userId },
        // A new time needs a new answer
        update: moved ? { response: 'invited' } : {},
      })
    }
    return tx.scheduleEvent.update({ where: { id }, data, include: { attendees: true } })
  })
  return { event, warnings }
}

export async function cancelEvent(id: string) {
  return db.scheduleEvent.update({ where: { id }, data: { cancelledAt: new Date() } })
}

export async function respondToEvent(id: string, userId: string, response: string) {
  if (!['accepted', 'declined'].includes(response)) throw new CalendarError('Answer accepted or declined')
  const row = await db.scheduleEventAttendee.findUnique({ where: { eventId_userId: { eventId: id, userId } } })
  if (!row) throw new CalendarError('You are not invited to this event')
  return db.scheduleEventAttendee.update({ where: { id: row.id }, data: { response } })
}
