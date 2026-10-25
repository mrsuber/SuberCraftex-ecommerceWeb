import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { cancelPayrollRun } from '@/lib/payroll'

// GET /api/admin/payroll/runs/[id] - The run with every payslip
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  const run = await db.payrollRun.findUnique({ where: { id }, include: { lines: { orderBy: { fullName: 'asc' } } } })
  if (!run) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return json(run)
}

// DELETE /api/admin/payroll/runs/[id] - Cancel a draft
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  try {
    const run = await cancelPayrollRun(id)
    await audit({ actor: user, action: 'payroll.cancelled', targetType: 'payroll_run', targetId: id })
    return json(run)
  } catch (error) {
    return businessError(error)
  }
}
