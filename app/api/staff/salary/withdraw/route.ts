import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { audit } from '@/lib/audit'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { parseXaf } from '@/lib/money'
import { withdrawSalary } from '@/lib/payroll'
import { rateLimit } from '@/lib/rate-limit'

// POST /api/staff/salary/withdraw - { amount, phone? }: send salary to Mobile Money
export async function POST(request: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Sign in' }, { status: 401 })
  if (!rateLimit(`salary-withdraw:${user.id}`, 5, 60_000)) return NextResponse.json({ error: 'Too many attempts. Wait a minute.' }, { status: 429 })
  try {
    const body = await request.json()
    const payout = await withdrawSalary({ userId: user.id, amount: parseXaf(body.amount), phone: body.phone })
    await audit({ actor: user, action: 'payroll.withdrawal_requested', targetType: 'payout', targetId: payout.id, details: { amount: Number(payout.amount) } })
    return json({ id: payout.id, status: payout.status, amount: payout.amount, fee: payout.fee, feePaidByCompany: payout.feePaidByCompany }, { status: 201 })
  } catch (error) {
    return businessError(error)
  }
}
