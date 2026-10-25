import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'

// PATCH /api/admin/equipment/[id] - Depreciation and shared-cost settings for a machine
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const num = (v: unknown, min: number, max: number, label: string) => {
    if (v === undefined) return undefined
    if (v === null || v === '') return null
    const x = Number(v)
    if (!Number.isFinite(x) || x < min || x > max) throw new Error(`${label} must be between ${min} and ${max}`)
    return x
  }
  try {
    const data = {
      usefulLifeMonths: num(body.usefulLifeMonths, 1, 600, 'Useful life (months)'),
      residualValue: num(body.residualValue, 0, 1e10, 'Value left at the end'),
      powerKw: num(body.powerKw, 0, 1000, 'Power (kW)'),
      floorAreaM2: num(body.floorAreaM2, 0, 10000, 'Floor area (m²)'),
      depreciationStart: body.depreciationStart === undefined ? undefined : body.depreciationStart ? new Date(body.depreciationStart) : null,
    }
    const periods = await db.equipmentPeriod.count({ where: { equipmentId: id } })
    if (periods > 0 && (data.usefulLifeMonths !== undefined || data.residualValue !== undefined || data.depreciationStart !== undefined)) {
      return NextResponse.json({ error: 'Depreciation cannot change once a month has been closed for this machine' }, { status: 400 })
    }
    const equipment = await db.equipment.update({
      where: { id },
      data: Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)) as any,
    })
    await audit({ actor: user, action: 'equipment.settings_changed', targetType: 'equipment', targetId: id, details: data })
    return NextResponse.json({ id: equipment.id })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
