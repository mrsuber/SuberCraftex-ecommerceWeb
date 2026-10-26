import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { json } from '@/lib/http/json'
import { MoneyInputError } from '@/lib/money'
import { planData } from '@/lib/apprentices/plans'

// GET /api/admin/apprentice-fees/plans - Fee plans
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  return json(await db.apprenticeFeePlan.findMany({ orderBy: [{ isActive: 'desc' }, { name: 'asc' }], include: { _count: { select: { schedules: true } } } }))
}

// POST /api/admin/apprentice-fees/plans - { name, serviceTrack?, registrationFee, tuition, instalments, intervalMonths, description? }
export async function POST(request: NextRequest) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  try {
    const plan = await db.apprenticeFeePlan.create({ data: planData(await request.json()) })
    await audit({ actor: user, action: 'apprentice_fees.plan_created', targetType: 'fee_plan', targetId: plan.id, details: { name: plan.name, tuition: Number(plan.tuition) } })
    return json(plan, { status: 201 })
  } catch (error) {
    if (error instanceof MoneyInputError) return NextResponse.json({ error: error.message }, { status: 400 })
    throw error
  }
}
