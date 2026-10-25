import { NextRequest, NextResponse } from 'next/server'
import { adminOrResponse } from '@/lib/http/admin'
import { PayoutError, rejectPayout } from '@/lib/payments/payouts'

// POST /api/admin/payouts/[id]/reject - { reason }: the money goes back to the wallet
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  try {
    const payout = await rejectPayout(id, user, String(body.reason ?? '').slice(0, 500))
    return NextResponse.json({ ...payout, amount: Number(payout.amount), fee: Number(payout.fee) })
  } catch (error) {
    if (error instanceof PayoutError) return NextResponse.json({ error: error.message }, { status: 400 })
    throw error
  }
}
