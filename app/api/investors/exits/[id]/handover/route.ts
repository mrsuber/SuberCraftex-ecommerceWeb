import { NextRequest, NextResponse } from 'next/server'
import { audit } from '@/lib/audit'
import { investorOrResponse } from '@/lib/investors/http'
import { businessError } from '@/lib/http/errors'
import { confirmHandover } from '@/lib/investors/exits'

// POST /api/investors/exits/[id]/handover - { received: true } or { received: false, note }
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, investor, response } = await investorOrResponse(request)
  if (response) return response
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  try {
    const exit = await confirmHandover({ exitId: id, investorId: investor.id, received: body.received === true, note: body.note })
    await audit({ actor: user, action: body.received === true ? 'investor.handover_confirmed' : 'investor.handover_disputed', targetType: 'investor_exit', targetId: id, details: { note: body.note } })
    return NextResponse.json({ confirmed: !!exit.investorConfirmedAt, disputed: !!exit.investorDisputeNote })
  } catch (error) {
    return businessError(error)
  }
}
