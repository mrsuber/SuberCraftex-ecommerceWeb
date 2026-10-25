import { BookingStatus, PaymentType } from '@prisma/client'
import { db } from '@/lib/db'
import { AccountRef, Accounts, credit, debit, post, Tx } from '@/lib/ledger'
import { toDecimal, toXaf, Xaf } from '@/lib/money'

export class BookingPaymentError extends Error {}

type Client = Tx | typeof db

export interface BookingBalance {
  total: Xaf
  paid: Xaf
  remaining: Xaf
  /** What the customer should pay next, and as what */
  next: { type: PaymentType; amount: Xaf } | null
}

/**
 * What a booking costs, what was paid and what is due next. The price is the approved
 * quote (finalPrice) or the service price. With a quote, the down payment comes first.
 */
export async function bookingBalance(client: Client, bookingId: string): Promise<BookingBalance> {
  const booking = await client.serviceBooking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { quote: true, payments: true },
  })
  const total = toXaf(booking.finalPrice ?? booking.price)
  const completed = booking.payments.filter((p) => p.status === 'completed')
  const paid = completed.reduce((sum, p) => sum + (p.paymentType === 'refund' ? -toXaf(p.amount) : toXaf(p.amount)), 0n)
  const remaining = total > paid ? total - paid : 0n
  if (remaining === 0n || ['cancelled', 'quote_pending', 'quote_sent', 'quote_rejected'].includes(booking.status)) {
    return { total, paid, remaining, next: null }
  }
  const down = booking.quote ? toXaf(booking.quote.downPaymentAmount) : 0n
  if (booking.quote && paid === 0n && down > 0n && down < remaining) {
    return { total, paid, remaining, next: { type: 'down_payment', amount: down } }
  }
  return { total, paid, remaining, next: { type: 'final_payment', amount: remaining } }
}

function statusAfter(type: PaymentType, current: BookingStatus, fullyPaid: boolean): BookingStatus {
  if (fullyPaid && ['pending', 'awaiting_payment', 'payment_partial', 'quote_approved'].includes(current)) return 'confirmed'
  if (type === 'down_payment' && ['pending', 'awaiting_payment', 'quote_approved'].includes(current)) return 'confirmed'
  if (type === 'partial_payment') return 'payment_partial'
  return current
}

export interface RecordBookingPayment {
  bookingId: string
  type: PaymentType
  amount: Xaf
  method: 'mobile_money' | 'cash'
  /** Where the money is now. Omit when the ledger was already posted (Mobile Money). */
  into?: AccountRef
  collectionReference?: string
  confirmedById?: string | null
}

/** Record a received booking payment and move the booking on. Runs inside a transaction. */
export async function recordBookingPayment(tx: Tx, input: RecordBookingPayment) {
  await tx.$queryRaw`SELECT id FROM service_bookings WHERE id = ${input.bookingId} FOR UPDATE`
  const booking = await tx.serviceBooking.findUniqueOrThrow({ where: { id: input.bookingId } })
  if (input.collectionReference) {
    const existing = await tx.bookingPayment.findUnique({ where: { collectionReference: input.collectionReference } })
    if (existing) return existing
  }
  const payment = await tx.bookingPayment.create({
    data: {
      bookingId: booking.id,
      amount: toDecimal(input.amount),
      paymentType: input.type,
      paymentMethod: input.method,
      status: 'completed',
      collectionReference: input.collectionReference ?? null,
      confirmedById: input.confirmedById ?? null,
      notes: input.method === 'cash' ? 'Cash received at the shop' : 'Paid by Mobile Money',
    },
  })
  if (input.into) {
    await post(tx, {
      type: 'booking_paid',
      reference: `booking_payment:${payment.id}`,
      description: `Booking ${booking.bookingNumber} ${input.type.replace('_', ' ')} in cash`,
      createdById: input.confirmedById,
      metadata: { bookingId: booking.id, paymentId: payment.id },
      postings: [debit(input.into, input.amount), credit(Accounts.serviceIncome(), input.amount)],
    })
  }
  const balance = await bookingBalance(tx, booking.id)
  const next = statusAfter(input.type, booking.status, balance.remaining === 0n)
  if (next !== booking.status) {
    await tx.serviceBooking.update({ where: { id: booking.id }, data: { status: next } })
  }
  return payment
}

// ---------------------------------------------------------------- repairs

export async function repairBalance(client: Client, repairId: string) {
  const repair = await client.repairRequest.findUniqueOrThrow({ where: { id: repairId }, include: { payments: true } })
  const total = toXaf(repair.finalCost ?? repair.totalQuote ?? 0)
  const paid = repair.payments.reduce((sum, p) => sum + toXaf(p.amount), 0n)
  return { total, paid, remaining: total > paid ? total - paid : 0n }
}

export interface RecordRepairPayment {
  repairId: string
  amount: Xaf
  paymentType: string
  method: 'mobile_money' | 'cash'
  into?: AccountRef
  collectionReference?: string
  createdBy: string
  reference?: string | null
}

export async function recordRepairPayment(tx: Tx, input: RecordRepairPayment) {
  await tx.$queryRaw`SELECT id FROM repair_requests WHERE id = ${input.repairId} FOR UPDATE`
  const repair = await tx.repairRequest.findUniqueOrThrow({ where: { id: input.repairId } })
  if (input.collectionReference) {
    const existing = await tx.repairPayment.findUnique({ where: { collectionReference: input.collectionReference } })
    if (existing) return existing
  }
  const payment = await tx.repairPayment.create({
    data: {
      repairRequestId: repair.id,
      amount: toDecimal(input.amount),
      paymentType: input.paymentType,
      paymentMethod: input.method,
      reference: input.reference ?? null,
      collectionReference: input.collectionReference ?? null,
      createdBy: input.createdBy,
    },
  })
  if (input.into) {
    await post(tx, {
      type: 'repair_paid',
      reference: `repair_payment:${payment.id}`,
      description: `Repair ${repair.ticketNumber} ${input.paymentType.replace('_', ' ')} in cash`,
      createdById: input.createdBy,
      metadata: { repairId: repair.id, paymentId: payment.id },
      postings: [debit(input.into, input.amount), credit(Accounts.repairIncome(), input.amount)],
    })
  }
  const balance = await repairBalance(tx, repair.id)
  const paymentStatus = balance.total > 0n && balance.remaining === 0n ? 'paid' : balance.paid > 0n ? 'partial' : 'pending'
  await tx.repairRequest.update({ where: { id: repair.id }, data: { paymentStatus } })
  return payment
}
