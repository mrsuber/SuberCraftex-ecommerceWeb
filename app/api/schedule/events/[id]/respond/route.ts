import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/auth/api-auth'
import { CalendarError, respondToEvent } from '@/lib/calendar/events'

// POST /api/schedule/events/[id]/respond - { response: accepted | declined }
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiAuth()
  if (!user) return NextResponse.json({ error: 'Sign in' }, { status: 401 })
  const { id } = await params
  try {
    const { response } = await request.json()
    return NextResponse.json(await respondToEvent(id, user.id, String(response)))
  } catch (e) {
    if (e instanceof CalendarError) return NextResponse.json({ error: e.message }, { status: 400 })
    throw e
  }
}
