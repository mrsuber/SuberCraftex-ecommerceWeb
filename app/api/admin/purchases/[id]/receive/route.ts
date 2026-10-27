import { NextRequest } from 'next/server'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { parseXaf, parseXafOrZero } from '@/lib/money'
import { receivePurchase } from '@/lib/finance/purchases'

// POST /api/admin/purchases/[id]/receive - { lines: [{ productId, variantId?, quantity, lineTotal }], transport, changeInto?, receiptUrls?, note? }
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  try {
    const body = await request.json()
    const purchase = await receivePurchase({
      purchaseId: id,
      lines: (Array.isArray(body.lines) ? body.lines : []).map((l: any) => ({
        productId: String(l.productId ?? ''),
        variantId: l.variantId ? String(l.variantId) : null,
        quantity: Number(l.quantity),
        lineTotal: parseXaf(l.lineTotal, 'price paid'),
      })),
      transport: parseXafOrZero(body.transport, 'transport'),
      changeInto: body.changeInto ? String(body.changeInto) : null,
      receiptUrls: Array.isArray(body.receiptUrls) ? body.receiptUrls.map(String).filter((u: string) => u.startsWith('/api/uploads/purchase-receipts/')) : [],
      note: body.note ? String(body.note) : null,
      admin: user,
    })
    return json(purchase)
  } catch (error) {
    return businessError(error)
  }
}
