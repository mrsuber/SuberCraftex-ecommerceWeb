import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { getSetting, setSetting } from '@/lib/settings'
import { weekFor } from './booking-schedule'
import { HoursError, isOpenSomeDay, validateWeek, WeekHours } from './week-hours'

/**
 * Setting when services can be booked: the shop's hours, a service's own hours, its
 * booking rules, and closures (holidays, a technician away, the workshop shut for stock-taking).
 */

export { HoursError }

interface Actor {
  id: string
  email?: string | null
}

export interface BookingRules {
  /** Minutes kept free between two jobs (travel, clean-up) */
  bufferTime: number
  /** Most bookings in one day; null = no limit */
  maxBookingsPerDay: number | null
  /** How soon a customer may book: minutes from now */
  minNoticeMinutes: number
  /** How far ahead a customer may book: days */
  maxAdvanceDays: number
}

function whole(value: unknown, field: string, min: number, max: number): number {
  const n = typeof value === 'string' && value.trim() !== '' ? Number(value) : value
  if (typeof n !== 'number' || !Number.isInteger(n) || n < min || n > max) {
    throw new HoursError(`${field} must be a whole number from ${min} to ${max}`)
  }
  return n
}

export function validateRules(input: Partial<Record<keyof BookingRules, unknown>>): BookingRules {
  const max = input.maxBookingsPerDay
  return {
    bufferTime: whole(input.bufferTime ?? 0, 'Time between jobs', 0, 480),
    maxBookingsPerDay: max === null || max === undefined || max === '' || max === 0 ? null : whole(max, 'Bookings per day', 1, 200),
    minNoticeMinutes: whole(input.minNoticeMinutes ?? 30, 'Notice', 0, 14 * 24 * 60),
    maxAdvanceDays: whole(input.maxAdvanceDays ?? 60, 'Booking horizon', 1, 365),
  }
}

// ------------------------------------------------------------------ shop hours

export async function shopHours(): Promise<WeekHours> {
  return getSetting('services.defaultHours')
}

export async function saveShopHours(input: unknown, actor: Actor): Promise<WeekHours> {
  const week = validateWeek(input)
  if (!isOpenSomeDay(week)) throw new HoursError('The shop must be open at least one day. Use closures for holidays.')
  await setSetting('services.defaultHours', week)
  await audit({ actor, action: 'services.shop_hours', details: { week } })
  return week
}

// ------------------------------------------------------------------ one service

export async function serviceHours(serviceId: string) {
  const service = await db.service.findUnique({ where: { id: serviceId }, include: { category: { select: { name: true } } } })
  if (!service) throw new HoursError('Service not found')
  const { week, own } = await weekFor(db, serviceId)
  return {
    service: { id: service.id, name: service.name, category: service.category?.name ?? null, isActive: service.isActive, duration: service.duration, customDuration: service.customDuration },
    mode: own ? ('custom' as const) : ('shop' as const),
    week,
    shopWeek: await shopHours(),
    rules: {
      bufferTime: service.bufferTime,
      maxBookingsPerDay: service.maxBookingsPerDay,
      minNoticeMinutes: service.minNoticeMinutes,
      maxAdvanceDays: service.maxAdvanceDays,
    } satisfies BookingRules,
  }
}

/**
 * Save a service's hours and rules. mode "shop" follows the shop's hours (and their later
 * changes); "custom" gives the service its own week, e.g. on-site visits only in the morning.
 */
export async function saveServiceHours(
  serviceId: string,
  input: { mode: 'shop' | 'custom'; week?: unknown; rules?: Partial<Record<keyof BookingRules, unknown>> },
  actor: Actor,
) {
  if (input.mode !== 'shop' && input.mode !== 'custom') throw new HoursError('Choose shop hours or custom hours')
  const week = input.mode === 'custom' ? validateWeek(input.week) : null
  if (week && !isOpenSomeDay(week)) {
    throw new HoursError('Custom hours must open at least one day. To stop bookings, make the service inactive.')
  }
  const rules = input.rules ? validateRules(input.rules) : null
  await db.$transaction(async (tx) => {
    const service = await tx.service.findUnique({ where: { id: serviceId } })
    if (!service) throw new HoursError('Service not found')
    await tx.serviceAvailability.deleteMany({ where: { serviceId } })
    if (week) {
      await tx.serviceAvailability.createMany({
        data: week.flatMap((day, dayOfWeek) => day.map((w) => ({ serviceId, dayOfWeek, startTime: w.start, endTime: w.end, isActive: true }))),
      })
    }
    if (rules) await tx.service.update({ where: { id: serviceId }, data: rules })
    await audit({ actor, action: 'services.hours', targetType: 'service', targetId: serviceId, details: { mode: input.mode, week, rules } }, tx)
  })
  return serviceHours(serviceId)
}

// ------------------------------------------------------------------ closures

export interface ClosureInput {
  /** null = the whole shop */
  serviceId?: string | null
  /** "2026-12-24" */
  from: string
  /** "2026-12-26"; defaults to `from` */
  to?: string | null
  reason?: string | null
  /** Every year on the same dates (public holidays) */
  yearly?: boolean
}

function shopDay(input: unknown, field: string): Date {
  const m = typeof input === 'string' ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(input) : null
  const d = m ? new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))) : null
  if (!m || !d || d.getUTCDate() !== Number(m[3])) throw new HoursError(`${field} must be a date like 2026-12-25`)
  return d
}

export async function addClosure(input: ClosureInput, actor: Actor) {
  const startDate = shopDay(input.from, 'Start date')
  const endDate = input.to ? shopDay(input.to, 'End date') : startDate
  const yearly = !!input.yearly
  if (!yearly && endDate < startDate) throw new HoursError('The end date is before the start date')
  if (!yearly && (endDate.getTime() - startDate.getTime()) / 86_400_000 > 366) throw new HoursError('A closure lasts at most a year')
  const reason = String(input.reason ?? '').trim().slice(0, 200) || null
  if (input.serviceId) {
    const exists = await db.service.count({ where: { id: input.serviceId } })
    if (!exists) throw new HoursError('Service not found')
  }
  const closure = await db.serviceBlockout.create({
    data: { serviceId: input.serviceId || null, startDate, endDate, reason, isRecurring: yearly },
  })
  await audit({ actor, action: 'services.closure_added', targetType: 'service', targetId: input.serviceId ?? 'shop', details: { from: input.from, to: input.to, reason, yearly } })
  return closure
}

export async function removeClosure(id: string, actor: Actor) {
  const closure = await db.serviceBlockout.findUnique({ where: { id } })
  if (!closure) throw new HoursError('Closure not found')
  await db.serviceBlockout.delete({ where: { id } })
  await audit({ actor, action: 'services.closure_removed', targetType: 'service', targetId: closure.serviceId ?? 'shop', details: { reason: closure.reason } })
}

/** Closures that still matter: yearly ones, and dated ones not yet over. */
export async function listClosures(scope: { serviceId: string } | 'shop', today = new Date()) {
  const rows = await db.serviceBlockout.findMany({
    where: {
      serviceId: scope === 'shop' ? null : scope.serviceId,
      OR: [{ isRecurring: true }, { endDate: { gte: new Date(today.getTime() - 86_400_000) } }],
    },
    orderBy: [{ isRecurring: 'asc' }, { startDate: 'asc' }],
  })
  return rows.map((c) => ({
    id: c.id,
    serviceId: c.serviceId,
    from: c.startDate.toISOString().slice(0, 10),
    to: c.endDate.toISOString().slice(0, 10),
    reason: c.reason,
    yearly: c.isRecurring,
  }))
}

/**
 * Cameroon's public holidays on fixed dates. Movable ones (Good Friday, Ascension, Eid
 * al-Fitr, Eid al-Adha) change every year: add them as dated closures.
 */
export const CAMEROON_FIXED_HOLIDAYS = [
  { date: '01-01', reason: "New Year's Day" },
  { date: '02-11', reason: 'Youth Day' },
  { date: '05-01', reason: 'Labour Day' },
  { date: '05-20', reason: 'National Day' },
  { date: '08-15', reason: 'Assumption Day' },
  { date: '12-25', reason: 'Christmas Day' },
]

/** Add the fixed public holidays as yearly shop closures, skipping any already there. */
export async function addPublicHolidays(actor: Actor) {
  const existing = await db.serviceBlockout.findMany({ where: { serviceId: null, isRecurring: true } })
  const key = (d: Date) => `${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
  const have = new Set(existing.map((c) => key(c.startDate)))
  let added = 0
  for (const h of CAMEROON_FIXED_HOLIDAYS) {
    if (have.has(h.date)) continue
    // The year is ignored for yearly closures; 2000 is a leap year, so 29 Feb would also work
    await addClosure({ from: `2000-${h.date}`, reason: h.reason, yearly: true }, actor)
    added++
  }
  return added
}
