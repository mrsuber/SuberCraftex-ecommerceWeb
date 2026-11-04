import { BookingStatus, Prisma, Service } from '@prisma/client'
import { db } from '@/lib/db'

/**
 * When a service can be booked.
 *
 * Dates follow the rest of SuberCraftex: a booking's `scheduledDate` is midnight UTC of the
 * day at the shop, and `scheduledTime` is the "14:00" read off the shop's clock. The shop is
 * in Cameroon (UTC+1, no daylight saving), so "today" and "too late today" are worked out at
 * shop time, never at the server's or the customer's.
 */

export const SHOP_OFFSET_HOURS = 1
const HOUR = 3_600_000

/** Hours used for a service that has no weekly schedule set: Monday to Saturday, 08:00 to 17:00 */
export const DEFAULT_OPENING = { days: [1, 2, 3, 4, 5, 6], start: '08:00', end: '17:00' }

/** Slots start every 30 minutes */
const SLOT_STEP = 30

/** Bookings in these states hold their time slot */
export const SLOT_HOLDING: BookingStatus[] = [
  'pending',
  'confirmed',
  'quote_approved',
  'awaiting_payment',
  'payment_partial',
  'in_progress',
]

const DURATION_MINUTES: Record<string, number> = {
  half_hour: 30,
  one_hour: 60,
  two_hours: 120,
  half_day: 240,
  full_day: 480,
}

export class ScheduleError extends Error {}

export function serviceMinutes(service: Pick<Service, 'duration' | 'customDuration'>): number {
  return service.duration === 'custom' ? service.customDuration || 60 : DURATION_MINUTES[service.duration] || 60
}

export function toMinutes(hhmm: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim())
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) throw new ScheduleError(`"${hhmm}" is not a time like 14:30`)
  return Number(m[1]) * 60 + Number(m[2])
}

export function fromMinutes(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
}

export function addMinutes(hhmm: string, minutes: number): string {
  return fromMinutes(toMinutes(hhmm) + minutes)
}

/** The shop's calendar day at `now`, as midnight UTC. */
export function shopToday(now = new Date()): Date {
  const shop = new Date(now.getTime() + SHOP_OFFSET_HOURS * HOUR)
  return new Date(Date.UTC(shop.getUTCFullYear(), shop.getUTCMonth(), shop.getUTCDate()))
}

/** Minutes since midnight on the shop's clock at `now`. */
export function shopMinutesNow(now = new Date()): number {
  const shop = new Date(now.getTime() + SHOP_OFFSET_HOURS * HOUR)
  return shop.getUTCHours() * 60 + shop.getUTCMinutes()
}

/**
 * A booking date from a client, as midnight UTC of the shop day.
 * Takes "2026-11-05", or a full timestamp (older apps send the customer's local midnight,
 * e.g. "2026-11-04T23:00:00.000Z" for the 5th in Douala), read at shop time.
 */
export function parseShopDate(input: unknown): Date | null {
  if (typeof input !== 'string' || !input.trim()) return null
  const plain = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim())
  if (plain) {
    const d = new Date(Date.UTC(Number(plain[1]), Number(plain[2]) - 1, Number(plain[3])))
    return d.getUTCDate() === Number(plain[3]) ? d : null
  }
  const at = new Date(input)
  if (isNaN(at.getTime())) return null
  return shopToday(at)
}

export const dayKey = (d: Date) => d.toISOString().slice(0, 10)

type Client = Prisma.TransactionClient | typeof db

interface Window {
  start: number
  end: number
}

/** Opening hours of a service on a day, or null when it is closed (no schedule, or blocked out). */
async function openingOn(client: Client, service: Service, date: Date): Promise<Window | null> {
  const weekday = date.getUTCDay()
  const rows = await client.serviceAvailability.findMany({ where: { serviceId: service.id } })
  let window: Window | null = null
  if (rows.length === 0) {
    if (DEFAULT_OPENING.days.includes(weekday)) window = { start: toMinutes(DEFAULT_OPENING.start), end: toMinutes(DEFAULT_OPENING.end) }
  } else {
    const row = rows.find((r) => r.isActive && r.dayOfWeek === weekday)
    if (row) window = { start: toMinutes(row.startTime), end: toMinutes(row.endTime) }
  }
  if (!window) return null
  const dayEnd = new Date(date.getTime() + 24 * HOUR)
  const blocked = await client.serviceBlockout.count({
    where: {
      OR: [{ serviceId: service.id }, { serviceId: null }],
      startDate: { lt: dayEnd },
      endDate: { gte: date },
    },
  })
  return blocked > 0 ? null : window
}

async function takenOn(client: Client, serviceId: string, date: Date, excludeBookingId?: string) {
  const rows = await client.serviceBooking.findMany({
    where: {
      serviceId,
      scheduledDate: date,
      status: { in: SLOT_HOLDING },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
    },
    select: { scheduledTime: true, endTime: true, duration: true },
  })
  const timed = rows
    .filter((r) => r.scheduledTime)
    .map((r) => {
      const start = toMinutes(r.scheduledTime!)
      return { start, end: r.endTime ? toMinutes(r.endTime) : start + r.duration }
    })
  return { count: rows.length, timed }
}

export interface SlotQuery {
  excludeBookingId?: string
  now?: Date
}

/** Start times still free for a service on a shop day. */
export async function availableSlots(client: Client, service: Service, date: Date, query: SlotQuery = {}): Promise<string[]> {
  const now = query.now ?? new Date()
  const today = shopToday(now)
  if (date < today) return []
  const window = await openingOn(client, service, date)
  if (!window) return []
  const taken = await takenOn(client, service.id, date, query.excludeBookingId)
  if (service.maxBookingsPerDay && taken.count >= service.maxBookingsPerDay) return []

  const length = serviceMinutes(service)
  const buffer = service.bufferTime || 0
  // Today, only times at least 30 minutes away can still be booked
  const earliest = date.getTime() === today.getTime() ? shopMinutesNow(now) + 30 : 0
  const slots: string[] = []
  for (let start = window.start; start + length <= window.end; start += SLOT_STEP) {
    if (start < earliest) continue
    const end = start + length
    const clash = taken.timed.some((b) => start < b.end + buffer && end + buffer > b.start)
    if (!clash) slots.push(fromMinutes(start))
  }
  return slots
}

/**
 * Check a chosen slot inside the transaction that creates or moves the booking. The service
 * row is locked first, so two customers cannot both take the last slot.
 */
export async function assertSlotFree(
  tx: Prisma.TransactionClient,
  service: Service,
  date: Date,
  time: string,
  query: SlotQuery = {},
) {
  await tx.$queryRaw`SELECT id FROM services WHERE id = ${service.id} FOR UPDATE`
  toMinutes(time)
  const free = await availableSlots(tx, service, date, query)
  if (!free.includes(time)) {
    throw new ScheduleError(
      free.length ? 'This time slot is no longer available' : 'There are no free slots on this day. Please choose another day.',
    )
  }
}
