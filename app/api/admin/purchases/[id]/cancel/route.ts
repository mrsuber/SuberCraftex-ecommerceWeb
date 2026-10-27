import { NextRequest } from 'next/server'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { cancelPurchase } from '@/lib/finance/purchases'

// POST /api/admin/purchases/[id]/cancel - { returnedTo?: safe | bank | shop_momo }: nothing was bought
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  try {
    const body = await request.json().catch(() => ({}))
    await cancelPurchase({ purchaseId: id, returnedTo: body.returnedTo ? String(body.returnedTo) : null, admin: user })
    return json({ cancelled: true })
  } catch (error) {
    return businessError(error)
  }
}
