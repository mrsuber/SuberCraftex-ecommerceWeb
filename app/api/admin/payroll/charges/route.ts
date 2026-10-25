import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { parseXaf } from '@/lib/money'
import { proposeCharge } from '@/lib/payroll'

// GET /api/admin/payroll/charges - Charges proposed to staff, and their answers
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  return json(await db.staffCharge.findMany({ orderBy: { createdAt: 'desc' }, take: 200, include: { user: { select: { fullName: true, email: true } } } }))
}

// POST /api/admin/payroll/charges - { userId, kind: driver_shortage | damage | other, amount, reason }
export async function POST(request: NextRequest) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  try {
    const body = await request.json()
    if (!['driver_shortage', 'damage', 'other'].includes(body.kind)) return NextResponse.json({ error: 'Choose a kind' }, { status: 400 })
    const charge = await proposeCharge({ userId: String(body.userId), kind: body.kind, amount: parseXaf(body.amount), reason: String(body.reason ?? ''), admin: user })
    await audit({ actor: user, action: 'payroll.charge_proposed', targetType: 'user', targetId: charge.userId, details: { kind: body.kind, amount: Number(charge.amount), reason: charge.reason } })
    return json(charge, { status: 201 })
  } catch (error) {
    return businessError(error)
  }
}
