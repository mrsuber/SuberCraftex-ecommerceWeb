import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { json } from '@/lib/http/json'
import { parseXaf } from '@/lib/money'
import { Accounts, balanceOf } from '@/lib/ledger'

const STAFF_ROLES = ['admin', 'driver', 'cashier', 'tailor', 'technician'] as const

// GET /api/admin/payroll/staff - Everyone who works for SuberCraftex, with their salary and wallet
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  const users = await db.user.findMany({
    where: { OR: [{ role: { in: [...STAFF_ROLES] } }, { staffPay: { isNot: null } }] },
    select: { id: true, fullName: true, email: true, phone: true, role: true, isSuspended: true, staffPay: true },
    orderBy: { fullName: 'asc' },
  })
  const rows = await Promise.all(users.map(async (u) => ({ ...u, wallet: u.staffPay ? await balanceOf(db, Accounts.salaryWallet(u.id)) : 0n })))
  return json(rows)
}

// PUT /api/admin/payroll/staff - { userId, jobTitle, monthlySalary, payoutPhone?, deductionCodes?, incomeTax?, isActive?, startedAt?, endedAt?, notes? }
export async function PUT(request: NextRequest) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const body = await request.json().catch(() => ({}))
  const target = body.userId ? await db.user.findUnique({ where: { id: String(body.userId) } }) : null
  if (!target) return NextResponse.json({ error: 'Choose a person' }, { status: 400 })
  if (target.role === 'customer' || target.role === 'investor') {
    return NextResponse.json({ error: 'Give this person a staff role first (Users page)' }, { status: 400 })
  }
  const jobTitle = String(body.jobTitle ?? '').trim().slice(0, 100)
  if (!jobTitle) return NextResponse.json({ error: 'Give a job title' }, { status: 400 })
  let monthlySalary: bigint
  try {
    monthlySalary = parseXaf(body.monthlySalary, 'monthly salary')
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
  const date = (v: unknown) => (v ? new Date(String(v)) : null)
  const startedAt = date(body.startedAt)
  const endedAt = date(body.endedAt)
  if ((startedAt && Number.isNaN(startedAt.getTime())) || (endedAt && Number.isNaN(endedAt.getTime()))) {
    return NextResponse.json({ error: 'Dates are not valid' }, { status: 400 })
  }
  const data = {
    jobTitle,
    monthlySalary,
    payoutPhone: body.payoutPhone ? String(body.payoutPhone).trim().slice(0, 20) : null,
    deductionCodes: Array.isArray(body.deductionCodes) ? body.deductionCodes.map(String).slice(0, 20) : [],
    incomeTax: body.incomeTax !== false,
    isActive: endedAt ? false : body.isActive !== false,
    endedAt,
    notes: body.notes ? String(body.notes).slice(0, 1000) : null,
    ...(startedAt ? { startedAt } : {}),
  }
  const before = await db.staffPay.findUnique({ where: { userId: target.id } })
  const pay = await db.staffPay.upsert({ where: { userId: target.id }, update: data, create: { userId: target.id, ...data } })
  await audit({
    actor: user,
    action: before ? 'payroll.salary_changed' : 'payroll.salary_set',
    targetType: 'user',
    targetId: target.id,
    details: { from: before ? Number(before.monthlySalary) : null, to: Number(monthlySalary), jobTitle, active: data.isActive },
  })
  return json(pay)
}
