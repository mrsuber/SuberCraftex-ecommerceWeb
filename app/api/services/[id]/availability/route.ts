import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { availableSlots, dayKey, parseShopDate, serviceMinutes } from '@/lib/services/booking-schedule'

const MAX_RANGE_DAYS = 62
const DAY = 86_400_000

/**
 * GET /api/services/[id]/availability
 *   ?date=2026-11-05                       → { date, availableSlots: ["08:00", …] }
 *   ?startDate=2026-11-05&endDate=2026-11-12 → { availability: { "2026-11-05": [...] , … } }
 * Days are shop days (Cameroon time). A service with no weekly schedule uses the default
 * opening hours, so it can always be booked.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: serviceId } = await params
    const { searchParams } = new URL(request.url)

    const service = await db.service.findUnique({ where: { id: serviceId } })
    if (!service || !service.isActive) {
      return NextResponse.json({ error: 'Service not found or inactive' }, { status: 404 })
    }
    const base = {
      serviceId,
      serviceName: service.name,
      duration: service.duration,
      durationMinutes: serviceMinutes(service),
      bufferTime: service.bufferTime,
    }

    const single = searchParams.get('date')
    if (single) {
      const date = parseShopDate(single)
      if (!date) return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
      return NextResponse.json({ ...base, date: dayKey(date), availableSlots: await availableSlots(db, service, date) })
    }

    const start = parseShopDate(searchParams.get('startDate'))
    const end = parseShopDate(searchParams.get('endDate'))
    if (!start || !end) {
      return NextResponse.json({ error: 'Pass ?date=YYYY-MM-DD, or ?startDate=…&endDate=…' }, { status: 400 })
    }
    if (end < start || (end.getTime() - start.getTime()) / DAY > MAX_RANGE_DAYS) {
      return NextResponse.json({ error: `Ask for at most ${MAX_RANGE_DAYS} days, ending after the start` }, { status: 400 })
    }
    const availability: Record<string, string[]> = {}
    for (let t = start.getTime(); t <= end.getTime(); t += DAY) {
      const day = new Date(t)
      const slots = await availableSlots(db, service, day)
      if (slots.length) availability[dayKey(day)] = slots
    }
    return NextResponse.json({ ...base, availability })
  } catch (error) {
    console.error('Error fetching service availability:', error)
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }
}
