import { NextRequest, NextResponse } from 'next/server'
import { findSessionUser } from '@/lib/auth/session'
import { calendarFeed, toIcs, userFromCalendarToken } from '@/lib/calendar/feed'

export const dynamic = 'force-dynamic'

const DAY = 86_400_000

// GET /api/calendar/ics?token=... - The calendar as an .ics feed, for phone calendar apps
export async function GET(request: NextRequest) {
  const userId = userFromCalendarToken(request.nextUrl.searchParams.get('token') ?? '')
  const user = userId ? await findSessionUser(userId) : null
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const now = Date.now()
  const items = await calendarFeed(user, new Date(now - 30 * DAY), new Date(now + 180 * DAY))
  const base = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
  return new NextResponse(toIcs(items, base), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'private, max-age=900' },
  })
}
