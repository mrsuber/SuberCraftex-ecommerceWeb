import { NextResponse } from 'next/server'
import { getSession, isSuperAdmin } from '@/lib/auth/session'
import { clientIp } from '@/lib/rate-limit'

export type AdminUser = NonNullable<Awaited<ReturnType<typeof getSession>>>

/** The signed-in admin, or a ready 401/403 response. */
export async function adminOrResponse(options: { superAdmin?: boolean } = {}) {
  const user = await getSession()
  if (!user || user.role !== 'admin') {
    return { response: NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 }) }
  }
  if (options.superAdmin && !isSuperAdmin(user)) {
    return { response: NextResponse.json({ error: 'Only a super admin can do this' }, { status: 403 }) }
  }
  return { user }
}

export function requestIp(request: Request) {
  const ip = clientIp(request)
  return ip === 'unknown' ? null : ip
}
