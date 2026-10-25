import { NextRequest } from 'next/server'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { parseXaf } from '@/lib/money'
import { paySalaryInCash } from '@/lib/payroll'

// POST /api/admin/payroll/wallets/[userId]/cash - { amount, from: safe | bank, note? }: salary handed over outside Mobile Money
export async function POST(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { userId } = await params
  try {
    const body = await request.json()
    const amount = parseXaf(body.amount)
    const out = await paySalaryInCash({ userId, amount, from: String(body.from), admin: user, note: body.note })
    await audit({ actor: user, action: 'payroll.paid_cash', targetType: 'user', targetId: userId, details: { amount: Number(amount), from: body.from, note: body.note } })
    return json(out)
  } catch (error) {
    return businessError(error)
  }
}
