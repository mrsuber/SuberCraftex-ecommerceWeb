import { BookingStatus } from '@prisma/client'

/**
 * The life of a service job, and who may move it.
 *
 *   booked ─▶ (quote) ─▶ confirmed ─▶ in_progress ─▶ awaiting_collection ─▶ completed
 *                                          └──────────────────────────────▶ completed
 *   cancelled and no_show end a job that never happened; completed ends one that did.
 *
 * Payment does not gate the work: a trusted customer may pay after the job. What is owed
 * is followed on the invoice and its balance, not by holding the job's status back.
 */

export const STAFF_ROLES = ['admin', 'tailor', 'technician', 'cashier']
/** Staff who carry out jobs and may move them along */
export const WORK_ROLES = ['admin', 'tailor', 'technician']

const FINISHED: BookingStatus[] = ['completed', 'cancelled', 'no_show']

/** Before the work starts, a customer may still cancel their own booking */
const CUSTOMER_CANCELLABLE: BookingStatus[] = [
  'pending',
  'quote_pending',
  'quote_sent',
  'quote_rejected',
  'quote_approved',
  'awaiting_payment',
  'confirmed',
  'rescheduled',
]

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Booked',
  quote_pending: 'Waiting for quote',
  quote_sent: 'Quote sent',
  quote_approved: 'Quote approved',
  quote_rejected: 'Quote declined',
  awaiting_payment: 'Awaiting payment',
  payment_partial: 'Part paid',
  confirmed: 'Confirmed',
  in_progress: 'Work in progress',
  awaiting_collection: 'Ready for collection',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No show',
  rescheduled: 'Rescheduled',
}

export class WorkflowError extends Error {}

/** Throws a WorkflowError when `role` may not move a booking from `from` to `to`. */
export function checkTransition(role: string, isOwner: boolean, from: BookingStatus, to: BookingStatus) {
  if (from === to) return
  if (!(to in STATUS_LABELS)) throw new WorkflowError(`Unknown status "${to}"`)
  if (FINISHED.includes(from)) {
    // Only an admin can reopen a job, e.g. one marked completed by mistake
    if (role === 'admin' && from !== 'cancelled') return
    throw new WorkflowError(`This booking is ${STATUS_LABELS[from].toLowerCase()} and can no longer change`)
  }
  if (WORK_ROLES.includes(role)) return
  if (isOwner && to === 'cancelled') {
    if (CUSTOMER_CANCELLABLE.includes(from)) return
    throw new WorkflowError('Work has already started on this booking. Please call us to cancel it.')
  }
  throw new WorkflowError('Only SuberCraftex staff can change this booking')
}
