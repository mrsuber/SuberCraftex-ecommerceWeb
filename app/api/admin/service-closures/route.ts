import { NextRequest, NextResponse } from 'next/server'
import { adminOr403 } from '@/lib/http/admin-guard'
import { addClosure, HoursError } from '@/lib/services/service-hours'

/** POST /api/admin/service-closures — { serviceId? (none = whole shop), from, to?, reason?, yearly? } */
export async function POST(request: NextRequest) {
  const { user, denied } = await adminOr403(request)
  if (denied) return denied
  try {
    const closure = await addClosure(await request.json(), user)
    return NextResponse.json({ id: closure.id }, { status: 201 })
  } catch (error) {
    if (error instanceof HoursError) return NextResponse.json({ error: error.message }, { status: 400 })
    console.error('Error adding closure:', error)
    return NextResponse.json({ error: 'Failed to add the closure' }, { status: 500 })
  }
}
