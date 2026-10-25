import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { closeMonth, previewMonth } from '@/lib/investors/machines'

const parseMonth = (v: string | null) => {
  const m = v?.match(/^(\d{4})-(\d{2})$/)
  if (!m) return null
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, 1))
}

const serialize = (s: Record<string, unknown>) => JSON.parse(JSON.stringify(s, (_k, v) => (typeof v === 'bigint' ? Number(v) : v)))

// GET /api/admin/equipment/[id]/month?month=YYYY-MM - The month's statement, without saving it
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  const month = parseMonth(request.nextUrl.searchParams.get('month'))
  if (!month) return NextResponse.json({ error: 'month must be YYYY-MM' }, { status: 400 })
  const closed = await db.equipmentPeriod.findUnique({ where: { equipmentId_periodStart: { equipmentId: id, periodStart: month } } })
  if (closed) return NextResponse.json({ closed: true, period: serialize(closed) })
  // The preview creates nothing that matters (only SuberCraftex's holding row, if missing)
  return NextResponse.json({ closed: false, statement: serialize(await db.$transaction((tx) => previewMonth(tx, id, month)) as any) })
}

// POST /api/admin/equipment/[id]/month - { month }: close it and share it
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  const month = parseMonth((await request.json().catch(() => ({}))).month ?? null)
  if (!month) return NextResponse.json({ error: 'month must be YYYY-MM' }, { status: 400 })
  try {
    const { period } = await db.$transaction((tx) => closeMonth(tx, id, month, user.id), { timeout: 60_000 })
    await audit({ actor: user, action: 'equipment.month_closed', targetType: 'equipment', targetId: id, details: { month: month.toISOString().slice(0, 7) } })
    return NextResponse.json({ closed: true, period: serialize(period) })
  } catch (error) {
    return businessError(error)
  }
}
