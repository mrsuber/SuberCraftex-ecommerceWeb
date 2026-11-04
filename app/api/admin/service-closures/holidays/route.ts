import { NextRequest, NextResponse } from 'next/server'
import { adminOr403 } from '@/lib/http/admin-guard'
import { addPublicHolidays } from '@/lib/services/service-hours'

/** POST /api/admin/service-closures/holidays — add Cameroon's fixed public holidays as yearly shop closures */
export async function POST(request: NextRequest) {
  const { user, denied } = await adminOr403(request)
  if (denied) return denied
  return NextResponse.json({ added: await addPublicHolidays(user) })
}
