import { NextRequest, NextResponse } from 'next/server'
import { isSuperAdmin } from '@/lib/auth/session'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { closeLotNow } from '@/lib/investors/exits'

// POST /api/admin/lots/[id]/close - { how: buy_back | collect | stock_loss, units?, note }: all of the lot, or some whole units
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  if (!['buy_back', 'collect', 'stock_loss'].includes(body.how)) return NextResponse.json({ error: 'Choose buy_back, collect or stock_loss' }, { status: 400 })
  if (body.how === 'stock_loss' && !isSuperAdmin(user)) return NextResponse.json({ error: 'Only a super admin can record goods lost in our care' }, { status: 403 })
  if (body.how === 'stock_loss' && !String(body.note ?? '').trim()) return NextResponse.json({ error: 'Say what happened to the goods' }, { status: 400 })
  try {
    const units = body.units === undefined || body.units === null || body.units === '' ? null : Number(body.units)
    const exit = await closeLotNow({ lotId: id, how: body.how, units, note: body.note ? String(body.note).slice(0, 1000) : null, admin: user })
    return NextResponse.json({ closed: true, exitId: exit.id, collectedUnits: exit.collectedUnits, boughtBackUnits: Number(exit.boughtBackMilli ?? 0n) / 1000 })
  } catch (error) {
    return businessError(error)
  }
}
