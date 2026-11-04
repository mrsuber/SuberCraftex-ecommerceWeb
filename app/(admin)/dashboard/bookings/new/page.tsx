import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { toXaf } from '@/lib/money'
import { STAFF_ROLES } from '@/lib/services/booking-workflow'
import { assignableStaff } from '@/lib/services/job-assignment'
import { NewJobForm } from '@/components/dashboard/bookings/NewJobForm'

export const metadata: Metadata = { title: 'Record a job | Admin Dashboard' }
export const dynamic = 'force-dynamic'

export default async function NewJobPage() {
  const user = await getCurrentUser()
  if (!user || !STAFF_ROLES.includes(user.role)) redirect('/dashboard')

  const services = await db.service.findMany({
    where: { isActive: true },
    include: { category: { select: { name: true } } },
    orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
  })

  const staff = user.role === 'admin' ? await assignableStaff() : null

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Record a job</h1>
        <p className="mt-1 text-muted-foreground">
          For a customer who called, walked in, or was served on the spot. Record it at any stage — even after the work is
          done — then invoice and take payment from the job page.
        </p>
      </div>
      <NewJobForm
        staff={staff?.map((p) => ({ id: p.id, name: p.fullName ?? p.email, role: p.role })) ?? undefined}
        services={services.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category?.name ?? null,
          price: Number(toXaf(s.price)),
          supportsOnsite: s.supportsOnsite,
          supportsCollectRepair: s.supportsCollectRepair,
          supportsCustomProduction: s.supportsCustomProduction,
        }))}
      />
    </div>
  )
}
