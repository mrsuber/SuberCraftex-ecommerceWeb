import { randomBytes } from 'crypto'
import { BookingStatus, ServiceType } from '@prisma/client'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { toDecimal, toXaf } from '@/lib/money'
import { addMinutes, parseShopDate, serviceMinutes, toMinutes } from './booking-schedule'
import { WORK_ROLES } from './booking-workflow'

/**
 * Staff record a job for a customer who called, walked in, or was served on the spot.
 *
 * This is how most service work really arrives: by phone or in person. The job is recorded
 * at whatever stage it has reached (agreed, being done, already done) so it can be invoiced
 * and paid like any other booking. Staff choose the date freely — they agreed it with the
 * customer — and the price agreed, which the invoice later confirms.
 */

export class StaffBookingError extends Error {}

export const STAFF_START_STATUSES: BookingStatus[] = ['confirmed', 'in_progress', 'completed']

export interface StaffBookingInput {
  serviceId: string
  serviceType?: ServiceType
  customerName: string
  customerPhone?: string | null
  customerEmail?: string | null
  serviceAddress?: string | null
  /** "2026-11-05" (shop day); defaults to today when the job is already under way or done */
  scheduledDate?: string | null
  scheduledTime?: string | null
  /** Price agreed with the customer, whole FCFA; defaults to the service price */
  price?: number | string | null
  status?: BookingStatus
  customerNotes?: string | null
  adminNotes?: string | null
  /** Who does the job; technicians and tailors recording a job get it themselves by default */
  assignedToId?: string | null
}

function bookingNumber() {
  return `BK-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`
}

const clean = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '') || null

export async function createStaffBooking(input: StaffBookingInput, actor: { id: string; email?: string | null; role?: string }) {
  const service = await db.service.findUnique({ where: { id: String(input.serviceId ?? '') } })
  if (!service) throw new StaffBookingError('Choose a service')

  const customerName = clean(input.customerName, 200)
  if (!customerName) throw new StaffBookingError("Enter the customer's name")
  const customerPhone = clean(input.customerPhone, 50)
  const customerEmail = clean(input.customerEmail, 200)?.toLowerCase() ?? null
  if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) throw new StaffBookingError('That email address does not look right')
  if (!customerPhone && !customerEmail) throw new StaffBookingError('Enter a phone number or an email, so the customer can be reached')

  const serviceType: ServiceType = input.serviceType ?? 'onsite'
  if (!['onsite', 'custom_production', 'collect_repair'].includes(serviceType)) throw new StaffBookingError('Unknown service type')
  const status: BookingStatus = input.status ?? 'confirmed'
  if (!STAFF_START_STATUSES.includes(status)) throw new StaffBookingError('A new job starts as confirmed, in progress or completed')

  let scheduledDate = input.scheduledDate ? parseShopDate(input.scheduledDate) : null
  if (input.scheduledDate && !scheduledDate) throw new StaffBookingError('The date is not valid')
  const scheduledTime = clean(input.scheduledTime, 5)
  if (scheduledTime) {
    try {
      toMinutes(scheduledTime)
    } catch {
      throw new StaffBookingError('The time must look like 14:30')
    }
  }
  if (!scheduledDate && status !== 'confirmed') scheduledDate = parseShopDate(new Date().toISOString())
  if (scheduledTime && !scheduledDate) throw new StaffBookingError('Give the date of the visit too')

  let price = toXaf(service.price)
  if (input.price !== undefined && input.price !== null && input.price !== '') {
    const text = String(input.price).trim()
    if (!/^\d+$/.test(text)) throw new StaffBookingError('The price must be a whole number of FCFA')
    price = BigInt(text)
  }

  // Who does it: an admin picks anyone who does jobs; other staff record jobs for themselves
  let assignedToId: string | null = clean(input.assignedToId, 64)
  if (actor.role && actor.role !== 'admin') assignedToId = WORK_ROLES.includes(actor.role) ? actor.id : null
  if (assignedToId) {
    const who = await db.user.findUnique({ where: { id: assignedToId }, select: { role: true, isSuspended: true } })
    if (!who || !WORK_ROLES.includes(who.role) || who.isSuspended) throw new StaffBookingError('Jobs can only go to an active technician, tailor or admin')
  }

  // A customer who already has an account sees the job, the invoice and can pay online
  const account = customerEmail ? await db.user.findUnique({ where: { email: customerEmail }, select: { id: true } }) : null

  const duration = serviceMinutes(service)
  const booking = await db.serviceBooking.create({
    data: {
      bookingNumber: bookingNumber(),
      serviceId: service.id,
      userId: account?.id ?? null,
      status,
      serviceType,
      collectionMethod: serviceType === 'collect_repair' ? 'customer_brings' : null,
      scheduledDate,
      scheduledTime,
      endTime: scheduledTime ? addMinutes(scheduledTime, duration) : null,
      duration,
      customerName,
      customerEmail,
      customerPhone,
      customerNotes: clean(input.customerNotes, 2000),
      adminNotes: clean(input.adminNotes, 2000),
      serviceAddress: clean(input.serviceAddress, 500),
      source: 'staff',
      createdById: actor.id,
      assignedToId,
      assignedAt: assignedToId ? new Date() : null,
      price: toDecimal(price),
      completedAt: status === 'completed' ? new Date() : null,
    },
    include: { service: true },
  })
  await audit({ actor, action: 'booking.recorded_by_staff', targetType: 'booking', targetId: booking.id, details: { status, price } })
  return booking
}
