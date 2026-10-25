import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminOrResponse } from '@/lib/http/admin'
import { liveCamsol } from '@/lib/payments/camsol'
import { payoutsToSend } from '@/lib/payments/payouts'

const serialize = (p: any) => ({ ...p, amount: Number(p.amount), fee: Number(p.fee) })

// GET /api/admin/payouts - Payouts waiting for approval, what they need, and recent ones
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  const { waiting, total } = await payoutsToSend()
  const recent = await db.payout.findMany({
    where: { status: { not: 'awaiting_approval' } },
    orderBy: { updatedAt: 'desc' },
    take: 50,
  })
  const users = await db.user.findMany({
    where: { id: { in: [...waiting, ...recent].map((p) => p.userId) } },
    select: { id: true, fullName: true, email: true, role: true },
  })
  const gateway = await liveCamsol()
  const camsolBalance = gateway ? await gateway.getBalance() : null
  return NextResponse.json({
    waiting: waiting.map(serialize),
    recent: recent.map(serialize),
    totalNeeded: Number(total),
    camsolBalance,
    users: Object.fromEntries(users.map((u) => [u.id, u])),
  })
}
