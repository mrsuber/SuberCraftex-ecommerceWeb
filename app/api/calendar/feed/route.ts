import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/auth/api-auth'
import { calendarFeed } from '@/lib/calendar/feed'

export const dynamic = 'force-dynamic'

// GET /api/calendar/feed?from=ISO&to=ISO - Everything on my calendar between two dates (web and app)
export async function GET(request: NextRequest) {
  const user = await requireApiAuth()
  if (!user) return NextResponse.json({ error: 'Sign in' }, { status: 401 })
  const q = request.nextUrl.searchParams
  const from = new Date(q.get('from') ?? '')
  const to = new Date(q.get('to') ?? '')
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return NextResponse.json({ error: 'Give from and to dates' }, { status: 400 })
  try {
    return NextResponse.json(await calendarFeed(user, from, to))
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}
