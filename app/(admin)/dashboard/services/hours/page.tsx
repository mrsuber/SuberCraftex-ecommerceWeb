import { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { describeWeek, WeekHours } from '@/lib/services/week-hours'
import { ShopHoursClient } from '@/components/dashboard/hours/ShopHoursClient'

export const metadata: Metadata = { title: 'Working hours | Admin Dashboard' }
export const dynamic = 'force-dynamic'

export default async function ShopHoursPage() {
  await requireAdmin()
  const services = await db.service.findMany({
    orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    select: { id: true, name: true, isActive: true, availability: { where: { isActive: true }, select: { dayOfWeek: true, startTime: true, endTime: true } } },
  })
  const rows = services.map((s) => {
    if (s.availability.length === 0) return { id: s.id, name: s.name, isActive: s.isActive, summary: null }
    const week: WeekHours = Array.from({ length: 7 }, () => [])
    for (const a of [...s.availability].sort((x, y) => x.startTime.localeCompare(y.startTime))) week[a.dayOfWeek]?.push({ start: a.startTime, end: a.endTime })
    return { id: s.id, name: s.name, isActive: s.isActive, summary: `Own hours: ${describeWeek(week)}` }
  })
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Working hours</h1>
        <p className="mt-1 text-muted-foreground">
          When customers can book services online, on the shop&apos;s clock (Cameroon time). Closed days and holidays are
          never offered.
        </p>
      </div>
      <ShopHoursClient services={rows} />
    </div>
  )
}
