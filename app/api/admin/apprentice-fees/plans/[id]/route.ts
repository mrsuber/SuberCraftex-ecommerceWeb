import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { json } from '@/lib/http/json'
import { MoneyInputError } from '@/lib/money'
import { planData } from '@/lib/apprentices/plans'

// PUT /api/admin/apprentice-fees/plans/[id] - Change a plan. Apprentices already on it keep their own schedule.
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  try {
    const plan = await db.apprenticeFeePlan.update({ where: { id }, data: planData(await request.json()) })
    await audit({ actor: user, action: 'apprentice_fees.plan_changed', targetType: 'fee_plan', targetId: id })
    return json(plan)
  } catch (error) {
    if (error instanceof MoneyInputError) return NextResponse.json({ error: error.message }, { status: 400 })
    throw error
  }
}
