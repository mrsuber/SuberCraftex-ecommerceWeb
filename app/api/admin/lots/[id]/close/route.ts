import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { isSuperAdmin } from '@/lib/auth/session'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { closeLot } from '@/lib/investors/lots'

// POST /api/admin/lots/[id]/close - { how: buy_back | collect | stock_loss, note }
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  if (!['buy_back', 'collect', 'stock_loss'].includes(body.how)) return NextResponse.json({ error: 'Choose buy_back, collect or stock_loss' }, { status: 400 })
  if (body.how === 'stock_loss' && !isSuperAdmin(user)) return NextResponse.json({ error: 'Only a super admin can record goods lost in our care' }, { status: 403 })
  if (body.how === 'stock_loss' && !String(body.note ?? '').trim()) return NextResponse.json({ error: 'Say what happened to the goods' }, { status: 400 })
  try {
    await db.$transaction((tx) => closeLot(tx, id, body.how, user.id, body.note))
    await audit({ actor: user, action: `lot.${body.how}`, targetType: 'lot', targetId: id, details: { note: body.note } })
    return NextResponse.json({ closed: true })
  } catch (error) {
    return businessError(error)
  }
}
