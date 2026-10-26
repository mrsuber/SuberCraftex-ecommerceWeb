import { NextRequest, NextResponse } from 'next/server'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { refundAdvance } from '@/lib/apprentices/fees'

// POST /api/admin/apprentices/[id]/fees/refund - { how: mobile_money | cash | keep, reason?, phone? }
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  if (!['mobile_money', 'cash', 'keep'].includes(body.how)) return NextResponse.json({ error: 'Choose mobile_money, cash or keep' }, { status: 400 })
  try {
    const out = await refundAdvance({ apprenticeId: id, how: body.how, reason: body.reason, phone: body.phone, admin: user })
    await audit({ actor: user, action: `apprentice_fees.refund_${body.how}`, targetType: 'apprentice', targetId: id, details: { amount: Number(out.amount), reason: body.reason } })
    return json(out)
  } catch (error) {
    return businessError(error)
  }
}
