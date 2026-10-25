import { NextRequest } from 'next/server'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { parseXafOrZero } from '@/lib/money'
import { updatePayrollLine } from '@/lib/payroll'

// PATCH /api/admin/payroll/lines/[id] - { unpaidDays?, bonus?, bonusNote? } on a draft payslip
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  try {
    const body = await request.json()
    const line = await updatePayrollLine(id, {
      unpaidDays: body.unpaidDays === undefined ? undefined : Number(body.unpaidDays),
      bonus: body.bonus === undefined ? undefined : parseXafOrZero(body.bonus, 'bonus'),
      bonusNote: body.bonusNote,
    })
    await audit({ actor: user, action: 'payroll.line_changed', targetType: 'payroll_line', targetId: id, details: body })
    return json(line)
  } catch (error) {
    return businessError(error)
  }
}
