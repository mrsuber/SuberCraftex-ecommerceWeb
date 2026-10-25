import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { preparePayrollRun } from '@/lib/payroll'

// GET /api/admin/payroll/runs - Every month's pay run
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  return json(await db.payrollRun.findMany({ orderBy: { periodStart: 'desc' }, take: 36, include: { _count: { select: { lines: true } } } }))
}

// POST /api/admin/payroll/runs - { month: YYYY-MM }: prepare (or refresh) the draft
export async function POST(request: NextRequest) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  try {
    const { month } = await request.json()
    const run = await preparePayrollRun(String(month), user.id)
    await audit({ actor: user, action: 'payroll.prepared', targetType: 'payroll_run', targetId: run.id, details: { month } })
    return json(run, { status: 201 })
  } catch (error) {
    return businessError(error)
  }
}
