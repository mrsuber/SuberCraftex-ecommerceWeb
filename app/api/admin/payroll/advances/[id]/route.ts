import { NextRequest } from 'next/server'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { decideAdvance } from '@/lib/payroll'

// POST /api/admin/payroll/advances/[id] - { approve, paidBy: mobile_money | cash, note? }
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  try {
    const body = await request.json()
    const advance = await decideAdvance({ advanceId: id, approve: body.approve === true, paidBy: body.paidBy, note: body.note, admin: user })
    await audit({ actor: user, action: body.approve ? 'payroll.advance_approved' : 'payroll.advance_rejected', targetType: 'salary_advance', targetId: id, details: { paidBy: body.paidBy, amount: Number(advance.amount) } })
    return json(advance)
  } catch (error) {
    return businessError(error)
  }
}
