import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { proposeInKindLot } from '@/lib/investors/lots'
import { parseXaf } from '@/lib/money'

// POST /api/admin/investors/[id]/in-kind - { productId, variantId?, quantity, unitCost, note? }
// Propose a value for goods the investor brought. Nothing counts until they accept it.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  try {
    const body = await request.json()
    const lot = await db.$transaction((tx) =>
      proposeInKindLot(tx, {
        investorId: id,
        productId: body.productId,
        variantId: body.variantId || null,
        quantity: Number(body.quantity),
        unitCost: parseXaf(body.unitCost, 'value per unit'),
        note: body.note,
        actorId: user.id,
      })
    )
    await audit({ actor: user, action: 'investor.in_kind_proposed', targetType: 'lot', targetId: lot.id, details: { quantity: body.quantity, unitCost: body.unitCost } })
    await db.notification.create({
      data: { type: 'system', title: 'Goods valuation to accept', message: 'An investor has a valuation to accept for goods they brought.', referenceId: lot.id, referenceType: 'lot' },
    })
    return NextResponse.json({ id: lot.id, status: lot.status }, { status: 201 })
  } catch (error) {
    return businessError(error)
  }
}
