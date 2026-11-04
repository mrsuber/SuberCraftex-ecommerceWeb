import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { toXaf } from '@/lib/money'
import { bookingBalance } from './booking-payments'
import { shopToday } from './booking-schedule'

/**
 * The lists people work from: today's jobs, what is coming, jobs done but not billed, and
 * invoices not yet paid. Used by "My jobs" and the admin overview.
 */

const DAY = 86_400_000
const OPEN = ['pending', 'confirmed', 'quote_approved', 'awaiting_payment', 'payment_partial', 'in_progress', 'awaiting_collection', 'rescheduled'] as const

export type JobScope = { assignedToId: string } | { unassigned: true } | 'all'

function scopeWhere(scope: JobScope): Prisma.ServiceBookingWhereInput {
  if (scope === 'all') return {}
  if ('unassigned' in scope) return { assignedToId: null }
  return { assignedToId: scope.assignedToId }
}

const jobSelect = {
  id: true,
  bookingNumber: true,
  status: true,
  serviceType: true,
  scheduledDate: true,
  scheduledTime: true,
  endTime: true,
  customerName: true,
  customerPhone: true,
  serviceAddress: true,
  source: true,
  createdAt: true,
  service: { select: { name: true } },
  assignedTo: { select: { id: true, fullName: true, email: true } },
} satisfies Prisma.ServiceBookingSelect

export type JobRow = Prisma.ServiceBookingGetPayload<{ select: typeof jobSelect }>

export function jobJson(j: JobRow) {
  return {
    id: j.id,
    bookingNumber: j.bookingNumber,
    status: j.status,
    serviceType: j.serviceType,
    service: j.service.name,
    date: j.scheduledDate ? j.scheduledDate.toISOString().slice(0, 10) : null,
    time: j.scheduledTime,
    endTime: j.endTime,
    customer: j.customerName,
    phone: j.customerPhone,
    address: j.serviceAddress,
    assignedTo: j.assignedTo ? (j.assignedTo.fullName ?? j.assignedTo.email) : null,
  }
}
export type JobJson = ReturnType<typeof jobJson>

const byTime = (a: JobRow, b: JobRow) =>
  (a.scheduledDate?.getTime() ?? 0) - (b.scheduledDate?.getTime() ?? 0) || (a.scheduledTime ?? '99').localeCompare(b.scheduledTime ?? '99')

export async function jobBoard(scope: JobScope, now = new Date()) {
  const today = shopToday(now)
  const where = scopeWhere(scope)
  const [todays, upcoming, undated, toInvoice] = await Promise.all([
    db.serviceBooking.findMany({ where: { ...where, scheduledDate: today, status: { in: [...OPEN] } }, select: jobSelect }),
    db.serviceBooking.findMany({
      where: { ...where, scheduledDate: { gt: today, lte: new Date(today.getTime() + 7 * DAY) }, status: { in: [...OPEN] } },
      select: jobSelect,
      take: 100,
    }),
    // Under way or waiting without a date, and jobs whose date has passed but are not finished
    db.serviceBooking.findMany({
      where: {
        ...where,
        status: { in: [...OPEN] },
        OR: [{ scheduledDate: null }, { scheduledDate: { lt: today } }],
      },
      select: jobSelect,
      take: 100,
    }),
    // Done, but no issued invoice yet
    db.serviceBooking.findMany({
      where: { ...where, status: 'completed', invoices: { none: { status: 'issued' } } },
      select: jobSelect,
      orderBy: { completedAt: 'desc' },
      take: 100,
    }),
  ])
  return {
    today: todays.sort(byTime).map(jobJson),
    upcoming: upcoming.sort(byTime).map(jobJson),
    open: undated.sort(byTime).map(jobJson),
    toInvoice: toInvoice.map(jobJson),
  }
}

/** Issued invoices not fully paid, oldest first, with what is still due and how late. */
export async function unpaidInvoices(scope: JobScope = 'all', now = new Date(), take = 50) {
  const invoices = await db.serviceInvoice.findMany({
    where: { status: 'issued', paidAt: null, booking: scopeWhere(scope) },
    orderBy: { issuedAt: 'asc' },
    take,
    include: { booking: { select: { id: true, bookingNumber: true, service: { select: { name: true } } } } },
  })
  const today = shopToday(now)
  const rows = await Promise.all(
    invoices.map(async (inv) => {
      const balance = await bookingBalance(db, inv.bookingId)
      const total = toXaf(inv.total)
      const due = total > balance.paid ? total - balance.paid : 0n
      const dueDate = inv.dueDate ?? (inv.issuedAt ? shopToday(inv.issuedAt) : today)
      return {
        id: inv.id,
        number: inv.number,
        bookingId: inv.booking.id,
        customer: inv.customerName,
        phone: inv.customerPhone,
        service: inv.booking.service.name,
        total: Number(total),
        due: Number(due),
        issuedAt: inv.issuedAt?.toISOString() ?? null,
        daysLate: Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / DAY)),
      }
    }),
  )
  return rows.filter((r) => r.due > 0)
}
