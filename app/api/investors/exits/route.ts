import { NextRequest, NextResponse } from 'next/server'
import { audit } from '@/lib/audit'
import { investorOrResponse } from '@/lib/investors/http'
import { businessError } from '@/lib/http/errors'
import { requestExit } from '@/lib/investors/exits'

// POST /api/investors/exits - { lotId, option: collect | buy_back, units?, notes? } or { holdingId, notes? }
// Ask to leave a product lot (all of it or some whole units) or a machine share.
export async function POST(request: NextRequest) {
  const { user, investor, response } = await investorOrResponse(request)
  if (response) return response
  const body = await request.json().catch(() => ({}))
  if (!body.lotId && !body.holdingId) return NextResponse.json({ error: 'Choose a product lot or a machine share' }, { status: 400 })
  try {
    const exit = await requestExit({
      investorId: investor.id,
      kind: body.lotId ? 'product' : 'machine',
      lotId: body.lotId ? String(body.lotId) : undefined,
      holdingId: body.holdingId ? String(body.holdingId) : undefined,
      option: body.lotId ? (body.option === 'buy_back' ? 'buy_back' : 'collect') : null,
      units: body.lotId && body.units != null && body.units !== '' ? Number(body.units) : null,
      notes: body.notes ? String(body.notes).slice(0, 1000) : null,
    })
    await audit({ actor: user, action: 'investor.exit_requested', targetType: 'investor_exit', targetId: exit.id, details: { option: exit.requestedOption, units: exit.unitsMilli ? Number(exit.unitsMilli) / 1000 : 'all' } })
    return NextResponse.json({ id: exit.id, valuation: Number(exit.valuation ?? 0), noticeEndsAt: exit.noticeEndsAt }, { status: 201 })
  } catch (error) {
    return businessError(error)
  }
}
