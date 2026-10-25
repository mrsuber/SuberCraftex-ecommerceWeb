import { NextRequest, NextResponse } from 'next/server'
import { adminOrResponse } from '@/lib/http/admin'
import { approvePayout, PayoutError } from '@/lib/payments/payouts'

// POST /api/admin/payouts/[id]/approve - Send it, after checking the PayWithCAMSOL balance covers it
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  try {
    const payout = await approvePayout(id, user)
    return NextResponse.json({ ...payout, amount: Number(payout.amount), fee: Number(payout.fee) })
  } catch (error) {
    if (error instanceof PayoutError) return NextResponse.json({ error: error.message }, { status: 400 })
    throw error
  }
}
