import { NextRequest, NextResponse } from 'next/server'
import { adminOr403 } from '@/lib/http/admin-guard'
import { HoursError, removeClosure } from '@/lib/services/service-hours'

/** DELETE /api/admin/service-closures/[id] */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, denied } = await adminOr403(request)
  if (denied) return denied
  try {
    await removeClosure((await params).id, user)
    return NextResponse.json({ removed: true })
  } catch (error) {
    if (error instanceof HoursError) return NextResponse.json({ error: error.message }, { status: 404 })
    throw error
  }
}
