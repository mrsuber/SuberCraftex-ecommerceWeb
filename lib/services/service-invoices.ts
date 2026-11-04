import { randomBytes } from 'crypto'
import { InvoiceLineKind, Prisma, ServiceInvoice } from '@prisma/client'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { formatCurrency } from '@/lib/currency'
import { sendEmail } from '@/lib/email/mailer'
import { getServiceInvoiceTemplate } from '@/lib/email/templates/service-invoice'
import { Tx } from '@/lib/ledger'
import { MAX_AMOUNT_XAF, toDecimal, toXaf, Xaf } from '@/lib/money'
import { bookingBalance } from './booking-payments'
import { SHOP_OFFSET_HOURS } from './booking-schedule'

/**
 * Invoices for service jobs.
 *
 * Life of an invoice
 *   draft   – staff build it from what was really done (labour, parts, travel…). Editable.
 *   issued  – it gets the next number of an unbroken yearly series (INV-2026-00001), its
 *             lines are frozen and its total becomes the booking's price. Payments already
 *             taken (a deposit) count towards it; the rest is the balance due.
 *   void    – an issued invoice is never edited or deleted. If it is wrong it is voided,
 *             with a reason, and a corrected one is issued. The number stays used, so the
 *             series has no holes: that is what an accountant or tax inspector checks.
 *
 * "Paid" is not a status: it is read from the payments (cash at the shop or Mobile Money),
 * which already live on the booking and in the ledger. The invoice only remembers when it
 * became fully paid (paidAt), for lists and the PAID stamp.
 */

export class InvoiceError extends Error {}

type Client = Tx | typeof db
interface Actor {
  id: string
  email?: string | null
}

export const LINE_KINDS: InvoiceLineKind[] = ['labour', 'material', 'part', 'travel', 'fee', 'other']
const MAX_LINES = 50

export interface InvoiceLineInput {
  kind?: InvoiceLineKind
  description: string
  /** Up to two decimals, e.g. 1.5 hours */
  quantity: number | string
  /** Whole francs */
  unitPrice: number | string
}

export interface InvoiceDraftInput {
  lines: InvoiceLineInput[]
  discount?: number | string
  notes?: string | null
  /** "2026-11-20"; omitted = due on receipt */
  dueDate?: string | null
  customerName?: string
  customerEmail?: string | null
  customerPhone?: string | null
  customerAddress?: string | null
}

// ------------------------------------------------------------------ amounts

/** A quantity as hundredths (1.5 → 150), refusing more than two decimals. */
function hundredths(value: number | string): bigint {
  const text = typeof value === 'number' ? String(value) : value.trim()
  const m = /^(\d{1,7})(?:\.(\d{1,2}))?$/.exec(text)
  if (!m) throw new InvoiceError(`Quantity "${value}" must be a positive number with at most two decimals`)
  const h = BigInt(m[1]) * 100n + BigInt((m[2] ?? '').padEnd(2, '0'))
  if (h <= 0n) throw new InvoiceError('Quantities must be more than zero')
  return h
}

function wholeFrancs(value: number | string | undefined, field: string, allowZero = true): Xaf {
  if (value === undefined || value === null || value === '') {
    if (allowZero) return 0n
    throw new InvoiceError(`${field} is missing`)
  }
  const text = typeof value === 'number' ? (Number.isSafeInteger(value) ? String(value) : 'x') : value.trim()
  if (!/^\d+$/.test(text)) throw new InvoiceError(`${field} must be a whole number of FCFA`)
  const v = BigInt(text)
  if (v > MAX_AMOUNT_XAF) throw new InvoiceError(`${field} is too large`)
  if (!allowZero && v === 0n) throw new InvoiceError(`${field} must be more than zero`)
  return v
}

/** quantity × unit price, rounded half up to whole francs */
export function lineAmount(quantity: number | string, unitPrice: number | string): Xaf {
  return (hundredths(quantity) * wholeFrancs(unitPrice, 'Unit price') + 50n) / 100n
}

interface CleanLine {
  kind: InvoiceLineKind
  description: string
  quantity: Prisma.Decimal
  unitPrice: Prisma.Decimal
  amount: Prisma.Decimal
  sortOrder: number
}

function cleanLines(lines: InvoiceLineInput[]): { lines: CleanLine[]; subtotal: Xaf } {
  if (!Array.isArray(lines) || lines.length === 0) throw new InvoiceError('An invoice needs at least one line')
  if (lines.length > MAX_LINES) throw new InvoiceError(`At most ${MAX_LINES} lines`)
  let subtotal = 0n
  const clean = lines.map((line, i) => {
    const description = String(line.description ?? '').trim()
    if (!description) throw new InvoiceError(`Line ${i + 1} needs a description`)
    if (description.length > 300) throw new InvoiceError(`Line ${i + 1}: keep the description under 300 characters`)
    const kind = line.kind && LINE_KINDS.includes(line.kind) ? line.kind : 'other'
    const q = hundredths(line.quantity)
    const unit = wholeFrancs(line.unitPrice, `Line ${i + 1} unit price`)
    const amount = (q * unit + 50n) / 100n
    subtotal += amount
    return {
      kind,
      description,
      quantity: new Prisma.Decimal(q.toString()).div(100),
      unitPrice: toDecimal(unit),
      amount: toDecimal(amount),
      sortOrder: i,
    }
  })
  if (subtotal > MAX_AMOUNT_XAF) throw new InvoiceError('The invoice total is too large')
  return { lines: clean, subtotal }
}

function shopDate(input: string | null | undefined): Date | null {
  if (!input) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input)
  if (!m) throw new InvoiceError('Due date must look like 2026-11-20')
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
}

// ------------------------------------------------------------------ reading

const withLines = { lines: { orderBy: { sortOrder: 'asc' as const } } }

/** The booking's invoice that is not void (draft or issued), if any. */
export async function openInvoice(client: Client, bookingId: string) {
  return client.serviceInvoice.findFirst({
    where: { bookingId, status: { not: 'void' } },
    include: withLines,
  })
}

/**
 * A starting point for the invoice, from what the booking already knows: the approved
 * quote (labour, then each material at its booked price), or the service at its price.
 * Staff then correct it to what was actually done.
 */
export async function suggestedLines(client: Client, bookingId: string): Promise<InvoiceLineInput[]> {
  const booking = await client.serviceBooking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { service: true, quote: true, materials: { include: { material: true } } },
  })
  const lines: InvoiceLineInput[] = []
  if (booking.quote && ['approved', 'sent'].includes(booking.quote.status)) {
    const hours = Number(booking.quote.laborHours)
    lines.push({
      kind: 'labour',
      description: `${booking.service.name} — labour${hours ? ` (${hours} h)` : ''}`,
      quantity: 1,
      unitPrice: Number(toXaf(booking.quote.laborCost)),
    })
    if (booking.materials.length > 0) {
      for (const m of booking.materials) {
        lines.push({ kind: 'material', description: m.material.name, quantity: m.quantity, unitPrice: Number(toXaf(m.priceAtBooking)) })
      }
    } else if (toXaf(booking.quote.materialCost) > 0n) {
      lines.push({ kind: 'material', description: 'Materials', quantity: 1, unitPrice: Number(toXaf(booking.quote.materialCost)) })
    }
  } else {
    lines.push({
      kind: 'labour',
      description: booking.service.name,
      quantity: 1,
      unitPrice: Number(toXaf(booking.finalPrice ?? booking.price ?? booking.service.price)),
    })
  }
  return lines
}

export interface InvoiceSummary {
  total: Xaf
  /** Payments received on the booking, counted towards this invoice (never more than its total) */
  paid: Xaf
  balance: Xaf
  /** Paid beyond the total (e.g. a deposit larger than the final bill): owed back to the customer */
  credit: Xaf
}

export async function invoiceSummary(client: Client, invoice: Pick<ServiceInvoice, 'bookingId' | 'total'>): Promise<InvoiceSummary> {
  const balance = await bookingBalance(client, invoice.bookingId)
  const total = toXaf(invoice.total)
  const paid = balance.paid < total ? balance.paid : total
  return { total, paid, balance: total - paid, credit: balance.paid > total ? balance.paid - total : 0n }
}

// ------------------------------------------------------------------ writing

async function lockBooking(tx: Tx, bookingId: string) {
  await tx.$queryRaw`SELECT id FROM service_bookings WHERE id = ${bookingId} FOR UPDATE`
  const booking = await tx.serviceBooking.findUnique({ where: { id: bookingId } })
  if (!booking) throw new InvoiceError('Booking not found')
  return booking
}

/** Create or replace the draft invoice of a booking. Issued invoices cannot be edited. */
export async function saveDraft(bookingId: string, input: InvoiceDraftInput, actor: Actor) {
  const { lines, subtotal } = cleanLines(input.lines)
  const discount = wholeFrancs(input.discount, 'Discount')
  if (discount > subtotal) throw new InvoiceError('The discount cannot be more than the subtotal')
  const total = subtotal - discount
  const dueDate = shopDate(input.dueDate)

  return db.$transaction(async (tx) => {
    const booking = await lockBooking(tx, bookingId)
    if (booking.status === 'cancelled') throw new InvoiceError('This booking was cancelled')
    const existing = await openInvoice(tx, bookingId)
    if (existing?.status === 'issued') {
      throw new InvoiceError(`Invoice ${existing.number} is already issued. Void it to issue a corrected one.`)
    }
    const customerName = String(input.customerName ?? existing?.customerName ?? booking.customerName).trim()
    if (!customerName) throw new InvoiceError('The invoice needs the customer’s name')
    const pick = (value: string | null | undefined, fallback: string | null) =>
      value === undefined ? fallback : String(value ?? '').trim() || null
    const data = {
      customerName,
      customerEmail: pick(input.customerEmail, existing?.customerEmail ?? booking.customerEmail),
      customerPhone: pick(input.customerPhone, existing?.customerPhone ?? booking.customerPhone),
      customerAddress: pick(input.customerAddress, existing?.customerAddress ?? booking.serviceAddress),
      subtotal: toDecimal(subtotal),
      discount: toDecimal(discount),
      total: toDecimal(total),
      notes: input.notes === undefined ? existing?.notes ?? null : String(input.notes ?? '').trim() || null,
      dueDate,
    }
    let invoice
    if (existing) {
      await tx.serviceInvoiceLine.deleteMany({ where: { invoiceId: existing.id } })
      invoice = await tx.serviceInvoice.update({
        where: { id: existing.id },
        data: { ...data, lines: { create: lines } },
        include: withLines,
      })
    } else {
      invoice = await tx.serviceInvoice.create({
        data: {
          ...data,
          bookingId,
          status: 'draft',
          accessToken: randomBytes(24).toString('base64url'),
          createdById: actor.id,
          lines: { create: lines },
        },
        include: withLines,
      })
    }
    return invoice
  })
}

/** The next number of the yearly series, taken inside the issuing transaction (so never skipped). */
async function nextInvoiceNumber(tx: Tx, at: Date): Promise<string> {
  const year = new Date(at.getTime() + SHOP_OFFSET_HOURS * 3_600_000).getUTCFullYear()
  const key = `INV-${year}`
  const rows = await tx.$queryRaw<{ value: number }[]>`
    INSERT INTO document_sequences (key, value, updated_at) VALUES (${key}, 1, now())
    ON CONFLICT (key) DO UPDATE SET value = document_sequences.value + 1, updated_at = now()
    RETURNING value`
  return `${key}-${String(rows[0].value).padStart(5, '0')}`
}

/**
 * Issue the booking's draft invoice: number it, freeze it, and make its total the price the
 * customer owes. Deposits already paid count towards it.
 */
export async function issueInvoice(bookingId: string, actor: Actor, now = new Date()) {
  const invoice = await db.$transaction(async (tx) => {
    await lockBooking(tx, bookingId)
    const draft = await openInvoice(tx, bookingId)
    if (!draft) throw new InvoiceError('Prepare the invoice first')
    if (draft.status !== 'draft') throw new InvoiceError(`Invoice ${draft.number} is already issued`)
    if (draft.lines.length === 0) throw new InvoiceError('An invoice needs at least one line')

    const total = toXaf(draft.total)
    const { paid } = await bookingBalance(tx, bookingId)
    if (paid > total) {
      throw new InvoiceError(
        `The customer has already paid ${paid} FCFA, more than this invoice (${total} FCFA). Check the lines, or refund the difference first.`,
      )
    }
    const number = await nextInvoiceNumber(tx, now)
    await tx.serviceBooking.update({ where: { id: bookingId }, data: { finalPrice: draft.total } })
    const issued = await tx.serviceInvoice.update({
      where: { id: draft.id },
      data: {
        number,
        status: 'issued',
        issuedAt: now,
        issuedById: actor.id,
        paidAt: total === 0n || paid >= total ? now : null,
      },
      include: withLines,
    })
    await audit({ actor, action: 'invoice.issued', targetType: 'booking', targetId: bookingId, details: { number, total } }, tx)
    return issued
  })
  return invoice
}

/**
 * Void the booking's issued invoice. Its number stays used. The booking goes back to the
 * price agreed before (the approved quote, or the booking price) until a new one is issued;
 * payments stay on the booking and count towards the corrected invoice.
 */
export async function voidInvoice(bookingId: string, reason: string, actor: Actor) {
  const why = String(reason ?? '').trim()
  if (why.length < 3) throw new InvoiceError('Say why the invoice is voided')
  return db.$transaction(async (tx) => {
    await lockBooking(tx, bookingId)
    const current = await openInvoice(tx, bookingId)
    if (!current) throw new InvoiceError('There is no invoice to void')
    if (current.status === 'draft') {
      // A draft has no number and was never sent: it is simply discarded
      await tx.serviceInvoice.delete({ where: { id: current.id } })
      return null
    }
    const booking = await tx.serviceBooking.findUniqueOrThrow({ where: { id: bookingId }, include: { quote: true } })
    await tx.serviceBooking.update({
      where: { id: bookingId },
      data: { finalPrice: booking.quote?.status === 'approved' ? booking.quote.totalCost : null },
    })
    const voided = await tx.serviceInvoice.update({
      where: { id: current.id },
      data: { status: 'void', voidedAt: new Date(), voidedById: actor.id, voidReason: why },
    })
    await audit({ actor, action: 'invoice.voided', targetType: 'booking', targetId: bookingId, details: { number: current.number, reason: why } }, tx)
    return voided
  })
}

/** After a payment: stamp the booking's issued invoice as paid once nothing is left to pay. */
export async function markInvoicePaidIfSettled(tx: Client, bookingId: string, now = new Date()) {
  const invoice = await tx.serviceInvoice.findFirst({ where: { bookingId, status: 'issued', paidAt: null } })
  if (!invoice) return
  const { paid } = await bookingBalance(tx, bookingId)
  if (paid >= toXaf(invoice.total)) {
    await tx.serviceInvoice.update({ where: { id: invoice.id }, data: { paidAt: now } })
  }
}

/** Where the customer opens their invoice, without signing in. */
export function invoiceLink(invoice: Pick<ServiceInvoice, 'id' | 'accessToken'>) {
  const base = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '')
  return `${base}/invoices/${invoice.id}?t=${encodeURIComponent(invoice.accessToken)}`
}

// ------------------------------------------------------------------ sending

const fcfa = (v: Xaf | Prisma.Decimal) => formatCurrency(Number(typeof v === 'bigint' ? v : toXaf(v)))
const longDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Douala' })

/**
 * Email the issued invoice to the customer. Returns false when there is no address to send
 * to (a walk-in customer): staff then print it or share the link by WhatsApp/SMS.
 */
export async function sendInvoiceEmail(invoiceId: string): Promise<boolean> {
  const invoice = await db.serviceInvoice.findUniqueOrThrow({
    where: { id: invoiceId },
    include: { ...withLines, booking: { include: { service: true } } },
  })
  if (invoice.status !== 'issued' || !invoice.number) throw new InvoiceError('Only an issued invoice can be sent')
  if (!invoice.customerEmail) return false
  const summary = await invoiceSummary(db, invoice)
  const { html, text } = getServiceInvoiceTemplate({
    invoiceNumber: invoice.number,
    bookingNumber: invoice.booking.bookingNumber,
    customerName: invoice.customerName,
    serviceName: invoice.booking.service.name,
    issuedDate: longDate(invoice.issuedAt ?? invoice.createdAt),
    dueDate: invoice.dueDate ? longDate(invoice.dueDate) : null,
    lines: invoice.lines.map((l) => ({ description: l.description, quantity: l.quantity.toString(), amount: fcfa(l.amount) })),
    subtotal: fcfa(invoice.subtotal),
    discount: toXaf(invoice.discount) > 0n ? fcfa(invoice.discount) : null,
    total: fcfa(summary.total),
    paid: fcfa(summary.paid),
    balance: fcfa(summary.balance),
    isPaid: summary.balance === 0n,
    link: invoiceLink(invoice),
  })
  const result = await sendEmail({
    to: invoice.customerEmail,
    subject: `Invoice ${invoice.number} — ${invoice.booking.service.name}`,
    html,
    text,
  })
  if (result.success) await db.serviceInvoice.update({ where: { id: invoice.id }, data: { sentAt: new Date() } })
  return result.success
}
