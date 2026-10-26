import { createHmac, timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'
import { getSetting } from '@/lib/settings'

/**
 * One calendar for everyone. Each viewer sees, in one list, what concerns them:
 * - staff events (shifts, meetings, training, leave, machine maintenance), by attendee or role
 * - apprentice timetable and personal events (their own; a mentor sees their apprentices')
 * - service bookings and repair drop-offs (the customer's own; staff see the shop's)
 * - fittings (the tailor's), deliveries (the driver's)
 * - money dates: pay day, apprentice fee due dates, investor exit notice ends
 * Admins see everything except apprentices' personal events.
 */

export interface CalendarItem {
  id: string
  source: 'event' | 'timetable' | 'apprentice' | 'booking' | 'fitting' | 'repair' | 'delivery' | 'payday' | 'fee' | 'exit'
  title: string
  start: string
  end: string
  allDay: boolean
  location?: string | null
  detail?: string | null
  href?: string | null
  /** For staff events: the kind, and the viewer's answer if invited */
  kind?: string
  response?: string | null
  editable?: boolean
}

export interface Viewer {
  id: string
  role: string
}

const MAX_RANGE_DAYS = 400
/** The shop is in Cameroon (UTC+1, no daylight saving) */
const SHOP_OFFSET_HOURS = 1

/** A date from the database plus a "14:00" typed at the shop, as a real instant. */
export function atShopTime(date: Date, hhmm: string | null | undefined) {
  const m = hhmm?.match(/^(\d{1,2}):(\d{2})/)
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), m ? Number(m[1]) - SHOP_OFFSET_HOURS : 0, m ? Number(m[2]) : 0))
  return { at: d, timed: !!m }
}

const iso = (d: Date) => d.toISOString()
const hour = 3_600_000
const dayAllDay = (d: Date) => {
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  return { start: iso(start), end: iso(new Date(start.getTime() + 24 * hour)), allDay: true }
}

export async function calendarFeed(viewer: Viewer, from: Date, to: Date): Promise<CalendarItem[]> {
  if (!(to > from)) throw new Error('The end must be after the start')
  if (to.getTime() - from.getTime() > MAX_RANGE_DAYS * 24 * hour) throw new Error(`Ask for at most ${MAX_RANGE_DAYS} days at a time`)
  const admin = viewer.role === 'admin'
  const overlaps = { startTime: { lt: to }, endTime: { gt: from } }
  const items: CalendarItem[] = []

  // ------------------------------------------------ staff events
  const events = await db.scheduleEvent.findMany({
    where: {
      ...overlaps,
      cancelledAt: null,
      ...(admin ? {} : { OR: [{ attendees: { some: { userId: viewer.id } } }, { roles: { has: viewer.role } }] }),
    },
    include: { attendees: { include: { user: { select: { fullName: true, email: true } } } } },
  })
  for (const e of events) {
    const mine = e.attendees.find((a) => a.userId === viewer.id)
    items.push({
      id: `event:${e.id}`,
      source: 'event',
      kind: e.kind,
      title: e.title,
      start: iso(e.startTime),
      end: iso(e.endTime),
      allDay: e.isAllDay,
      location: e.location,
      detail: [e.description, e.attendees.length ? `With: ${e.attendees.map((a) => a.user.fullName ?? a.user.email).join(', ')}` : null, e.roles.length ? `For: ${e.roles.join(', ')}` : null].filter(Boolean).join('\n') || null,
      response: mine?.response ?? null,
      editable: admin,
    })
  }

  // ------------------------------------------------ apprentices
  const apprentice = viewer.role === 'apprentice' ? await db.apprentice.findUnique({ where: { userId: viewer.id } }) : null
  const mentees = admin ? [] : await db.apprentice.findMany({ where: { mentorId: viewer.id }, select: { id: true, fullName: true } })
  const timetableWhere = admin
    ? {}
    : {
        OR: [
          { createdBy: viewer.id },
          ...(apprentice ? [{ attendees: { some: { apprenticeId: apprentice.id } } }, { serviceTrack: apprentice.serviceTrack, attendees: { none: {} } }] : []),
          ...(mentees.length ? [{ attendees: { some: { apprenticeId: { in: mentees.map((m) => m.id) } } } }] : []),
        ],
      }
  if (admin || apprentice || mentees.length || viewer.role !== 'customer') {
    const timetable = await db.timetableEvent.findMany({ where: { ...overlaps, status: { not: 'cancelled' }, ...timetableWhere } })
    for (const t of timetable) {
      items.push({ id: `timetable:${t.id}`, source: 'timetable', kind: t.eventType, title: t.title, start: iso(t.startTime), end: iso(t.endTime), allDay: false, location: t.location, detail: t.description })
    }
  }
  const personalFor = [...(apprentice ? [apprentice.id] : []), ...mentees.map((m) => m.id)]
  if (personalFor.length) {
    const personal = await db.calendarEvent.findMany({ where: { ...overlaps, isDeleted: false, apprenticeId: { in: personalFor } } })
    for (const c of personal) {
      const who = mentees.find((m) => m.id === c.apprenticeId)
      items.push({
        id: `apprentice:${c.id}`,
        source: 'apprentice',
        kind: c.eventType,
        title: who ? `${who.fullName}: ${c.title}` : c.title,
        start: iso(c.startTime),
        end: iso(c.endTime),
        allDay: c.isAllDay,
        location: c.location,
        detail: c.description,
        href: apprentice ? '/apprentice/dashboard/calendar' : null,
      })
    }
  }

  // ------------------------------------------------ bookings and repairs
  const staff = ['admin', 'tailor', 'cashier', 'technician'].includes(viewer.role)
  const bookings = await db.serviceBooking.findMany({
    where: {
      scheduledDate: { gte: new Date(from.getTime() - 24 * hour), lt: to },
      status: { notIn: ['cancelled', 'quote_rejected'] as any },
      ...(viewer.role === 'admin' || viewer.role === 'tailor' || viewer.role === 'cashier' ? {} : { userId: viewer.id }),
    },
    include: { service: { select: { name: true } } },
    take: 1000,
  })
  for (const b of bookings) {
    const { at, timed } = atShopTime(b.scheduledDate!, b.scheduledTime)
    const end = timed && b.endTime ? atShopTime(b.scheduledDate!, b.endTime).at : new Date(at.getTime() + hour)
    if (at >= to || (timed ? end : new Date(at.getTime() + 24 * hour)) <= from) continue
    items.push({
      id: `booking:${b.id}`,
      source: 'booking',
      title: staff ? `${b.service.name}: ${b.customerName}` : b.service.name,
      ...(timed ? { start: iso(at), end: iso(end), allDay: false } : dayAllDay(at)),
      detail: `Status: ${b.status.replace(/_/g, ' ')}`,
      href: staff ? `/dashboard/bookings/${b.id}` : `/bookings/${b.id}`,
    })
  }

  const technician = viewer.role === 'technician' ? await db.technician.findUnique({ where: { userId: viewer.id } }) : null
  if (admin || technician || viewer.role === 'customer') {
    const repairs = await db.repairRequest.findMany({
      where: {
        scheduledDropoff: { gte: from, lt: to },
        status: { not: 'cancelled' },
        ...(admin ? {} : technician ? { technicianId: technician.id } : { customerId: viewer.id }),
      },
      take: 1000,
    })
    for (const r of repairs) {
      items.push({
        id: `repair:${r.id}`,
        source: 'repair',
        title: `Repair drop-off: ${r.brand} ${r.model}`,
        start: iso(r.scheduledDropoff!),
        end: iso(new Date(r.scheduledDropoff!.getTime() + hour / 2)),
        allDay: false,
        detail: `Status: ${r.status.replace(/_/g, ' ')}`,
        href: viewer.role === 'customer' ? `/repair-requests/${r.id}` : `/dashboard/repair-requests/${r.id}`,
      })
    }
  }

  // ------------------------------------------------ fittings and deliveries
  const tailor = viewer.role === 'tailor' ? await db.tailor.findUnique({ where: { userId: viewer.id } }) : null
  if (admin || tailor) {
    const fittings = await db.fittingAppointment.findMany({
      where: { scheduledDate: { gte: from, lt: to }, ...(tailor ? { tailorId: tailor.id } : {}), status: { not: 'cancelled' as any } },
      include: { booking: { select: { customerName: true } }, tailor: { select: { fullName: true } } },
      take: 1000,
    })
    for (const f of fittings) {
      items.push({
        id: `fitting:${f.id}`,
        source: 'fitting',
        title: `Fitting: ${f.booking.customerName}${admin ? ` (${f.tailor.fullName})` : ''}`,
        start: iso(f.scheduledDate),
        end: iso(new Date(f.scheduledDate.getTime() + hour / 2)),
        allDay: false,
        href: `/dashboard/bookings/${f.bookingId}`,
      })
    }
  }
  const driver = viewer.role === 'driver' ? await db.driver.findUnique({ where: { userId: viewer.id } }) : null
  if (admin || driver) {
    const deliveries = await db.shippingTracking.findMany({
      where: { estimatedDeliveryTime: { gte: from, lt: to }, ...(driver ? { driverId: driver.id } : {}), status: { notIn: ['delivered', 'failed'] as any } },
      include: { order: { select: { orderNumber: true } }, driver: { select: { fullName: true } } },
      take: 1000,
    })
    for (const d of deliveries) {
      items.push({
        id: `delivery:${d.id}`,
        source: 'delivery',
        title: `Delivery ${d.order.orderNumber}${admin && d.driver ? ` (${d.driver.fullName})` : ''}`,
        start: iso(d.estimatedDeliveryTime!),
        end: iso(new Date(d.estimatedDeliveryTime!.getTime() + hour / 2)),
        allDay: false,
        href: '/dashboard/orders',
      })
    }
  }

  // ------------------------------------------------ money dates
  const onPayroll = admin || (await db.staffPay.count({ where: { userId: viewer.id, isActive: true } })) > 0
  if (onPayroll) {
    const payDay = await getSetting('payroll.payDay')
    for (let m = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1)); m < to; m = new Date(Date.UTC(m.getUTCFullYear(), m.getUTCMonth() + 1, 1))) {
      const day = new Date(Date.UTC(m.getUTCFullYear(), m.getUTCMonth(), payDay))
      if (day >= from && day < to) items.push({ id: `payday:${day.toISOString().slice(0, 7)}`, source: 'payday', title: admin ? 'Pay day: prepare salaries' : 'Pay day', ...dayAllDay(day), href: admin ? '/dashboard/payroll' : '/account/salary' })
    }
  }
  if (admin || apprentice) {
    const fees = await db.apprenticeFeeInstalment.findMany({
      where: { dueDate: { gte: from, lt: to }, status: { in: ['scheduled', 'invoiced'] }, ...(apprentice ? { apprenticeId: apprentice.id } : {}) },
      include: { apprentice: { select: { fullName: true } } },
      take: 1000,
    })
    for (const f of fees) {
      if (f.paid >= f.amount) continue
      items.push({
        id: `fee:${f.id}`,
        source: 'fee',
        title: `${admin ? `${f.apprentice.fullName}: ` : ''}fees due ${Number(f.amount - f.paid)} FCFA`,
        ...dayAllDay(f.dueDate),
        detail: f.label,
        href: admin ? '/dashboard/apprentice-fees' : '/apprentice/dashboard',
      })
    }
  }
  const investor = viewer.role === 'investor' ? await db.investor.findUnique({ where: { userId: viewer.id } }) : null
  if (admin || investor) {
    const exits = await db.investorExit.findMany({
      where: { noticeEndsAt: { gte: from, lt: to }, status: { in: ['requested', 'offered', 'agreed'] }, ...(investor ? { investorId: investor.id } : {}) },
    })
    const names = new Map((await db.investor.findMany({ where: { id: { in: exits.map((e) => e.investorId) } }, select: { id: true, fullName: true } })).map((i) => [i.id, i.fullName]))
    for (const e of exits) {
      items.push({ id: `exit:${e.id}`, source: 'exit', title: `${admin ? `${names.get(e.investorId) ?? 'Investor'}: ` : ''}exit notice ends`, ...dayAllDay(e.noticeEndsAt), href: admin ? '/dashboard/investor-engine' : '/investor/dashboard' })
    }
  }

  return items.sort((a, b) => a.start.localeCompare(b.start))
}

// ------------------------------------------------------------------ subscription link

function secret() {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET is not set')
  return s
}

/** A private link a phone's calendar app can subscribe to. Changing JWT_SECRET revokes all links. */
export function calendarToken(userId: string) {
  const mac = createHmac('sha256', secret()).update(`calendar:${userId}`).digest('base64url').slice(0, 32)
  return `${Buffer.from(userId).toString('base64url')}.${mac}`
}

export function userFromCalendarToken(token: string): string | null {
  const [idPart, mac] = token.split('.')
  if (!idPart || !mac) return null
  const userId = Buffer.from(idPart, 'base64url').toString()
  const expected = calendarToken(userId).split('.')[1]
  if (mac.length !== expected.length || !timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null
  return userId
}

const icsText = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
const icsTime = (s: string) => s.replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const icsDate = (s: string) => s.slice(0, 10).replace(/-/g, '')

export function toIcs(items: CalendarItem[], baseUrl: string) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SuberCraftex//Calendar//EN', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:SuberCraftex']
  const stamp = icsTime(new Date().toISOString())
  for (const i of items) {
    lines.push('BEGIN:VEVENT', `UID:${i.id}@subercraftex`, `DTSTAMP:${stamp}`)
    if (i.allDay) lines.push(`DTSTART;VALUE=DATE:${icsDate(i.start)}`, `DTEND;VALUE=DATE:${icsDate(i.end)}`)
    else lines.push(`DTSTART:${icsTime(i.start)}`, `DTEND:${icsTime(i.end)}`)
    lines.push(`SUMMARY:${icsText(i.title)}`)
    if (i.location) lines.push(`LOCATION:${icsText(i.location)}`)
    if (i.detail) lines.push(`DESCRIPTION:${icsText(i.detail)}`)
    if (i.href) lines.push(`URL:${baseUrl}${i.href}`)
    lines.push('END:VEVENT')
  }
  lines.push('END:VCALENDAR')
  // Lines over 75 octets are folded, as the format requires
  return lines.map((l) => (l.length > 74 ? l.match(/.{1,73}/g)!.join('\r\n ') : l)).join('\r\n') + '\r\n'
}
