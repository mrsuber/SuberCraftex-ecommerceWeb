import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { STAFF_ROLES } from '@/lib/services/booking-workflow'
import { InvoiceError, sendInvoiceEmail } from '@/lib/services/service-invoices'

/** POST /api/bookings/[id]/invoice/send — email the issued invoice again (e.g. after a payment) */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await verifyAuth(request)
  if (!user || !STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ error: 'Only SuberCraftex staff can send invoices' }, { status: 403 })
  }
  const invoice = await db.serviceInvoice.findFirst({ where: { bookingId: id, status: 'issued' } })
  if (!invoice) return NextResponse.json({ error: 'Issue the invoice first' }, { status: 400 })
  try {
    const emailed = await sendInvoiceEmail(invoice.id)
    if (!emailed) {
      return NextResponse.json({ error: 'This customer has no email address. Print the invoice or share its link.' }, { status: 400 })
    }
    return NextResponse.json({ emailed })
  } catch (error) {
    if (error instanceof InvoiceError) return NextResponse.json({ error: error.message }, { status: 400 })
    console.error('Error sending invoice:', error)
    return NextResponse.json({ error: 'The email could not be sent. Check the email settings, or share the link.' }, { status: 502 })
  }
}
