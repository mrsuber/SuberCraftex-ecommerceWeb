import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { db } from '@/lib/db'

/** The signed-in investor (web cookie or app token), or a ready error response. */
export async function investorOrResponse(request: NextRequest) {
  const { user } = await verifyAuth(request)
  if (!user || user.role !== 'investor') {
    return { response: NextResponse.json({ error: 'Unauthorized. Investor access required.' }, { status: 401 }) }
  }
  const investor = await db.investor.findUnique({ where: { userId: user.id } })
  if (!investor) return { response: NextResponse.json({ error: 'Investor profile not found' }, { status: 404 }) }
  return { user, investor }
}
