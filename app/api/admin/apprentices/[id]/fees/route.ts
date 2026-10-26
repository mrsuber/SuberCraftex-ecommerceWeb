import { NextRequest } from 'next/server'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { parseXafOrZero } from '@/lib/money'
import { apprenticeFees, assignFeePlan } from '@/lib/apprentices/fees'

// GET /api/admin/apprentices/[id]/fees - Schedules, instalments, receipts and standing
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  return json(await apprenticeFees(id))
}

// POST /api/admin/apprentices/[id]/fees - { planId, startDate, discount?, discountReason?, enrollmentId? }
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  try {
    const body = await request.json()
    const schedule = await assignFeePlan({
      apprenticeId: id,
      planId: String(body.planId ?? ''),
      enrollmentId: body.enrollmentId || null,
      startDate: new Date(body.startDate ?? Date.now()),
      discount: parseXafOrZero(body.discount, 'discount'),
      discountReason: body.discountReason,
      admin: user,
    })
    await audit({ actor: user, action: 'apprentice_fees.plan_given', targetType: 'apprentice', targetId: id, details: { planId: body.planId, discount: body.discount ?? 0 } })
    return json(schedule, { status: 201 })
  } catch (error) {
    return businessError(error)
  }
}
