import { NextRequest, NextResponse } from 'next/server'
import { adminOr403 } from '@/lib/http/admin-guard'
import { HoursError, listClosures, saveShopHours, shopHours } from '@/lib/services/service-hours'

/** GET /api/admin/service-hours — the shop's booking hours and shop-wide closures */
export async function GET(request: NextRequest) {
  const { denied } = await adminOr403(request)
  if (denied) return denied
  return NextResponse.json({ week: await shopHours(), closures: await listClosures('shop') })
}

/** PUT /api/admin/service-hours — { week } */
export async function PUT(request: NextRequest) {
  const { user, denied } = await adminOr403(request)
  if (denied) return denied
  try {
    const body = await request.json()
    return NextResponse.json({ week: await saveShopHours(body.week, user) })
  } catch (error) {
    if (error instanceof HoursError) return NextResponse.json({ error: error.message }, { status: 400 })
    console.error('Error saving shop hours:', error)
    return NextResponse.json({ error: 'Failed to save the hours' }, { status: 500 })
  }
}
