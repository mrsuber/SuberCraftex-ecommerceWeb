import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { bookingBalance } from '@/lib/services/booking-payments'
import { STAFF_ROLES } from '@/lib/services/booking-workflow'
import { invoiceJson } from '@/lib/services/invoice-json'
import { invoiceLink, InvoiceError, invoiceSummary, openInvoice, saveDraft, suggestedLines } from '@/lib/services/service-invoices'

type Ctx = { params: Promise<{ id: string }> }

/**
 * GET /api/bookings/[id]/invoice
 * Staff: the current invoice (draft or issued), voided ones, the booking balance, and
 * suggested lines to start a draft from. The customer: their issued invoice only.
 */
export async function GET(request: NextRequest, { params }: Ctx) {
  const { id } = await params
  const { user } = await verifyAuth(request)
  if (!user) return NextResponse.json({ error: 'Please sign in' }, { status: 401 })
  const booking = await db.serviceBooking.findUnique({
    where: { id },
    select: { id: true, userId: true, customerName: true, customerEmail: true, customerPhone: true, serviceAddress: true },
  })
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  const staff = STAFF_ROLES.includes(user.role)
  if (!staff && booking.userId !== user.id) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })

  const current = await openInvoice(db, id)
  if (!staff) {
    if (!current || current.status !== 'issued') return NextResponse.json({ invoice: null })
    return NextResponse.json({ invoice: { ...invoiceJson(current, await invoiceSummary(db, current)), link: invoiceLink(current) } })
  }

  const balance = await bookingBalance(db, id)
  const voided = await db.serviceInvoice.findMany({
    where: { bookingId: id, status: 'void' },
    orderBy: { voidedAt: 'desc' },
    include: { lines: { orderBy: { sortOrder: 'asc' } } },
  })
  return NextResponse.json({
    invoice: current
      ? { ...invoiceJson(current, current.status === 'issued' ? await invoiceSummary(db, current) : null), link: invoiceLink(current) }
      : null,
    voided: voided.map((v) => invoiceJson(v)),
    balance: { total: Number(balance.total), paid: Number(balance.paid), remaining: Number(balance.remaining) },
    suggestedLines: current ? null : await suggestedLines(db, id),
    // Who a new invoice is billed to, unless staff change it
    customerDefaults: {
      name: booking.customerName,
      email: booking.customerEmail,
      phone: booking.customerPhone,
      address: booking.serviceAddress,
    },
  })
}

/** PUT /api/bookings/[id]/invoice — staff save the draft: { lines, discount?, notes?, dueDate?, customer… } */
export async function PUT(request: NextRequest, { params }: Ctx) {
  const { id } = await params
  const { user } = await verifyAuth(request)
  if (!user || !STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ error: 'Only SuberCraftex staff can prepare invoices' }, { status: 403 })
  }
  try {
    const body = await request.json()
    const invoice = await saveDraft(id, body, user)
    return NextResponse.json({ invoice: invoiceJson(invoice) })
  } catch (error) {
    if (error instanceof InvoiceError) return NextResponse.json({ error: error.message }, { status: 400 })
    console.error('Error saving invoice draft:', error)
    return NextResponse.json({ error: 'Failed to save the invoice' }, { status: 500 })
  }
}
