import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminOrResponse } from '@/lib/http/admin'

// GET /api/admin/purchases/products - Products and variants to choose from when recording a purchase
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  const products = await db.product.findMany({
    select: { id: true, name: true, variants: { select: { id: true, name: true }, orderBy: { name: 'asc' } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(products)
}
