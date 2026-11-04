import { NextRequest, NextResponse } from 'next/server'
import { adminOr403 } from '@/lib/http/admin-guard'
import { HoursError, listClosures, saveServiceHours, serviceHours } from '@/lib/services/service-hours'

type Ctx = { params: Promise<{ id: string }> }

/** GET /api/admin/services/[id]/hours — hours (own or shop), booking rules, closures */
export async function GET(request: NextRequest, { params }: Ctx) {
  const { denied } = await adminOr403(request)
  if (denied) return denied
  const { id } = await params
  try {
    return NextResponse.json({ ...(await serviceHours(id)), closures: await listClosures({ serviceId: id }) })
  } catch (error) {
    if (error instanceof HoursError) return NextResponse.json({ error: error.message }, { status: 404 })
    throw error
  }
}

/** PUT /api/admin/services/[id]/hours — { mode: "shop" | "custom", week?, rules? } */
export async function PUT(request: NextRequest, { params }: Ctx) {
  const { user, denied } = await adminOr403(request)
  if (denied) return denied
  const { id } = await params
  try {
    const body = await request.json()
    return NextResponse.json(await saveServiceHours(id, body, user))
  } catch (error) {
    if (error instanceof HoursError) return NextResponse.json({ error: error.message }, { status: 400 })
    console.error('Error saving service hours:', error)
    return NextResponse.json({ error: 'Failed to save the hours' }, { status: 500 })
  }
}
