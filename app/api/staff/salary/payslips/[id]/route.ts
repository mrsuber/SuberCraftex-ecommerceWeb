import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { json } from '@/lib/http/json'

// GET /api/staff/salary/payslips/[id] - One payslip: its owner, or an admin
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Sign in' }, { status: 401 })
  const { id } = await params
  const line = await db.payrollLine.findUnique({ where: { id }, include: { run: true } })
  if (!line || (line.userId !== user.id && user.role !== 'admin')) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (line.run.status !== 'approved' && user.role !== 'admin') return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return json(line)
}
