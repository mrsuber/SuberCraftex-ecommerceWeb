import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth/verify-auth'

/** The signed-in admin, or a ready 403 response. */
export async function adminOr403(request: NextRequest) {
  const { user } = await verifyAuth(request)
  if (!user || user.role !== 'admin') {
    return { user: null, denied: NextResponse.json({ error: 'Only an admin can do this' }, { status: 403 }) }
  }
  return { user, denied: null }
}
