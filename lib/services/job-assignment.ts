import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { sendEmail } from '@/lib/email/mailer'
import { SLOT_HOLDING, toMinutes } from './booking-schedule'
import { WORK_ROLES } from './booking-workflow'

/**
 * Who does a job. Admins give a job to any technician, tailor or admin (or take it back);
 * a technician or tailor can take an unassigned job themselves. The person assigned sees it
 * under "My jobs" and on their calendar, and gets an email.
 */

export class AssignmentError extends Error {}

interface Actor {
  id: string
  role: string
  email?: string | null
}

/** Staff who can be given jobs */
export async function assignableStaff() {
  return db.user.findMany({
    where: { role: { in: WORK_ROLES as any }, isSuspended: false },
    select: { id: true, fullName: true, email: true, role: true },
    orderBy: [{ role: 'asc' }, { fullName: 'asc' }],
  })
}

/** Other timed jobs of the same person that overlap this one on the same day */
export async function clashesFor(bookingId: string, assigneeId: string) {
  const job = await db.serviceBooking.findUniqueOrThrow({ where: { id: bookingId } })
  if (!job.scheduledDate || !job.scheduledTime) return []
  const start = toMinutes(job.scheduledTime)
  const end = job.endTime ? toMinutes(job.endTime) : start + job.duration
  const sameDay = await db.serviceBooking.findMany({
    where: {
      id: { not: bookingId },
      assignedToId: assigneeId,
      scheduledDate: job.scheduledDate,
      scheduledTime: { not: null },
      status: { in: SLOT_HOLDING },
    },
    include: { service: { select: { name: true } } },
  })
  return sameDay
    .filter((b) => {
      const s = toMinutes(b.scheduledTime!)
      const e = b.endTime ? toMinutes(b.endTime) : s + b.duration
      return s < end && e > start
    })
    .map((b) => ({ id: b.id, bookingNumber: b.bookingNumber, time: `${b.scheduledTime}–${b.endTime ?? ''}`, service: b.service.name, customer: b.customerName }))
}

export async function assignJob(bookingId: string, assigneeId: string | null, actor: Actor) {
  const job = await db.serviceBooking.findUnique({ where: { id: bookingId }, include: { service: true } })
  if (!job) throw new AssignmentError('Booking not found')
  if (['completed', 'cancelled', 'no_show'].includes(job.status) && actor.role !== 'admin') {
    throw new AssignmentError('This job is finished')
  }

  if (actor.role !== 'admin') {
    // Staff may only take an unassigned job for themselves, or hand back their own
    const takingFree = assigneeId === actor.id && !job.assignedToId
    const handingBack = assigneeId === null && job.assignedToId === actor.id
    if (!WORK_ROLES.includes(actor.role) || !(takingFree || handingBack)) {
      throw new AssignmentError('Only an admin can give a job to someone else')
    }
  }

  let assignee: { id: string; fullName: string | null; email: string; role: string } | null = null
  if (assigneeId) {
    assignee = await db.user.findUnique({ where: { id: assigneeId }, select: { id: true, fullName: true, email: true, role: true, isSuspended: true } })
    if (!assignee || !WORK_ROLES.includes(assignee.role) || (assignee as any).isSuspended) {
      throw new AssignmentError('Jobs can only go to an active technician, tailor or admin')
    }
  }

  const updated = await db.serviceBooking.update({
    where: { id: bookingId },
    data: { assignedToId: assigneeId, assignedAt: assigneeId ? new Date() : null },
  })
  await audit({ actor, action: 'booking.assigned', targetType: 'booking', targetId: bookingId, details: { from: job.assignedToId, to: assigneeId } })

  const clashes = assigneeId ? await clashesFor(bookingId, assigneeId) : []

  // Tell the person, unless they took it themselves
  if (assignee && assignee.id !== actor.id && assignee.id !== job.assignedToId) {
    const when = job.scheduledDate
      ? `${job.scheduledDate.toISOString().slice(0, 10)}${job.scheduledTime ? ` at ${job.scheduledTime}` : ''}`
      : 'no date set yet'
    const link = `${(process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '')}/dashboard/bookings/${job.id}`
    const lines = [
      `Hello ${assignee.fullName ?? ''},`,
      `You have been given job ${job.bookingNumber}: ${job.service.name} for ${job.customerName}.`,
      `When: ${when}`,
      job.serviceAddress ? `Where: ${job.serviceAddress}` : null,
      job.customerPhone ? `Customer phone: ${job.customerPhone}` : null,
      job.customerNotes ? `Request: ${job.customerNotes}` : null,
      `Open the job: ${link}`,
    ].filter(Boolean) as string[]
    sendEmail({
      to: assignee.email,
      subject: `New job ${job.bookingNumber}: ${job.service.name}`,
      text: lines.join('\n'),
      html: lines.map((l) => `<p>${l.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</p>`).join(''),
    }).catch((e) => console.error('Assignment email failed:', e))
  }

  return { booking: updated, assignee, clashes }
}
