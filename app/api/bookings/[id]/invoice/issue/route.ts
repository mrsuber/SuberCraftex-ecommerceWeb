import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { STAFF_ROLES } from '@/lib/services/booking-workflow'
import { invoiceJson } from '@/lib/services/invoice-json'
import { invoiceLink, InvoiceError, invoiceSummary, issueInvoice, sendInvoiceEmail } from '@/lib/services/service-invoices'

/**
 * POST /api/bookings/[id]/invoice/issue — { send?: boolean (default true) }
 * Number and freeze the draft, then email it to the customer when they have an address.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await verifyAuth(request)
  if (!user || !STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ error: 'Only SuberCraftex staff can issue invoices' }, { status: 403 })
  }
  try {
    const body = await request.json().catch(() => ({}))
    const invoice = await issueInvoice(id, user)
    let emailed = false
    if (body.send !== false) {
      emailed = await sendInvoiceEmail(invoice.id).catch((e) => {
        console.error('Invoice email failed:', e)
        return false
      })
    }
    const fresh = await db.serviceInvoice.findUniqueOrThrow({ where: { id: invoice.id }, include: { lines: { orderBy: { sortOrder: 'asc' } } } })
    return NextResponse.json(
      { invoice: { ...invoiceJson(fresh, await invoiceSummary(db, fresh)), link: invoiceLink(fresh) }, emailed },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof InvoiceError) return NextResponse.json({ error: error.message }, { status: 400 })
    console.error('Error issuing invoice:', error)
    return NextResponse.json({ error: 'Failed to issue the invoice' }, { status: 500 })
  }
}
