import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { parseXafOrZero } from '@/lib/money'

const monthOf = (v: unknown) => {
  const m = typeof v === 'string' ? v.match(/^(\d{4})-(\d{2})$/) : null
  return m ? new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, 1)) : null
}

// GET /api/admin/shared-costs?month=YYYY-MM - The electricity bill and workshop rent of a month
export async function GET(request: NextRequest) {
  const { response } = await adminOrResponse()
  if (response) return response
  const month = monthOf(request.nextUrl.searchParams.get('month'))
  const rows = await db.sharedCost.findMany({ where: month ? { periodStart: month } : {}, orderBy: { periodStart: 'desc' }, take: 48 })
  return NextResponse.json(rows.map((r) => ({ ...r, amount: Number(r.amount), totalKwh: r.totalKwh ? Number(r.totalKwh) : null, totalAreaM2: r.totalAreaM2 ? Number(r.totalAreaM2) : null })))
}

// PUT /api/admin/shared-costs - { kind: electricity | rent, month, amount, totalKwh? | totalAreaM2?, notes? }
export async function PUT(request: NextRequest) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const body = await request.json().catch(() => ({}))
  const month = monthOf(body.month)
  if (!month || !['electricity', 'rent'].includes(body.kind)) return NextResponse.json({ error: 'Give kind (electricity or rent) and month (YYYY-MM)' }, { status: 400 })
  try {
    const amount = parseXafOrZero(body.amount)
    if (body.kind === 'electricity' && !(Number(body.totalKwh) > 0)) throw new Error('Enter the kWh on the electricity bill')
    if (body.kind === 'rent' && !(Number(body.totalAreaM2) > 0)) throw new Error('Enter the total rented area in m²')
    const closed = await db.equipmentPeriod.count({ where: { periodStart: month } })
    if (closed > 0) throw new Error('A machine has already closed this month; its shared costs can no longer change')
    const row = await db.sharedCost.upsert({
      where: { kind_periodStart: { kind: body.kind, periodStart: month } },
      update: { amount, totalKwh: body.kind === 'electricity' ? Number(body.totalKwh) : null, totalAreaM2: body.kind === 'rent' ? Number(body.totalAreaM2) : null, notes: body.notes ?? null },
      create: { kind: body.kind, periodStart: month, amount, totalKwh: body.kind === 'electricity' ? Number(body.totalKwh) : null, totalAreaM2: body.kind === 'rent' ? Number(body.totalAreaM2) : null, notes: body.notes ?? null, createdById: user.id },
    })
    await audit({ actor: user, action: 'shared_cost.saved', targetType: 'shared_cost', targetId: row.id, details: { kind: body.kind, month: body.month, amount } })
    return NextResponse.json({ id: row.id })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
