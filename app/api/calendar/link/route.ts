import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/auth/api-auth'
import { calendarToken } from '@/lib/calendar/feed'

// GET /api/calendar/link - My private link for Google Calendar, Apple Calendar or Outlook
export async function GET(request: NextRequest) {
  const user = await requireApiAuth()
  if (!user) return NextResponse.json({ error: 'Sign in' }, { status: 401 })
  const base = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
  const url = `${base}/api/calendar/ics?token=${calendarToken(user.id)}`
  return NextResponse.json({ url, webcal: url.replace(/^https?:/, 'webcal:') })
}
