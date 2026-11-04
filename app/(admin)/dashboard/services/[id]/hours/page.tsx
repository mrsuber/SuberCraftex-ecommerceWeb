import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { ServiceHoursClient } from '@/components/dashboard/hours/ServiceHoursClient'

export const metadata: Metadata = { title: 'Service hours | Admin Dashboard' }
export const dynamic = 'force-dynamic'

export default async function ServiceHoursPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const service = await db.service.findUnique({ where: { id }, select: { id: true, name: true } })
  if (!service) notFound()
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href="/dashboard/services/hours" className="text-sm text-muted-foreground hover:underline">
          ← All working hours
        </Link>
        <h1 className="mt-1 text-3xl font-bold">{service.name}: hours</h1>
        <p className="mt-1 text-muted-foreground">When customers can book this service, and the rules for booking it.</p>
      </div>
      <ServiceHoursClient serviceId={service.id} />
    </div>
  )
}
