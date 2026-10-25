import { NextRequest } from 'next/server'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { approvePayrollRun } from '@/lib/payroll'

// POST /api/admin/payroll/runs/[id]/approve - Pay the month's salaries into wallets (once)
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  try {
    const run = await approvePayrollRun(id, user)
    await audit({ actor: user, action: 'payroll.approved', targetType: 'payroll_run', targetId: id, details: { totalNet: Number(run.totalNet), totalGross: Number(run.totalGross) } })
    return json(run)
  } catch (error) {
    return businessError(error)
  }
}
