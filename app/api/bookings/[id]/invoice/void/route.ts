import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { InvoiceError, voidInvoice } from '@/lib/services/service-invoices'

/**
 * POST /api/bookings/[id]/invoice/void — { reason }
 * Admins void a wrong issued invoice (its number stays used) or discard a draft.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await verifyAuth(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Only an admin can void an invoice' }, { status: 403 })
  }
  try {
    const body = await request.json().catch(() => ({}))
    const result = await voidInvoice(id, body.reason, user)
    return NextResponse.json({ voided: !!result, discardedDraft: !result })
  } catch (error) {
    if (error instanceof InvoiceError) return NextResponse.json({ error: error.message }, { status: 400 })
    console.error('Error voiding invoice:', error)
    return NextResponse.json({ error: 'Failed to void the invoice' }, { status: 500 })
  }
}
