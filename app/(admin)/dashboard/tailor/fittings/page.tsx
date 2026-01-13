import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { FittingsTable } from '@/components/tailor/FittingsTable'
import { NewFittingDialog } from '@/components/tailor/NewFittingDialog'

export const metadata: Metadata = {
  title: 'Fitting Appointments | Tailor Dashboard',
  description: 'Manage fitting appointments',
}

export default async function FittingsPage() {
  const user = await getSession()

  if (!user || user.role !== 'tailor') {
    redirect('/dashboard')
  }

  const tailor = await db.tailor.findUnique({
    where: { userId: user.id },
  })

  if (!tailor) {
    return <div>Tailor profile not found</div>
  }

  // Get all fittings for this tailor
  const fittings = await db.fittingAppointment.findMany({
    where: {
      tailorId: tailor.id,
    },
    include: {
      booking: {
        select: {
          id: true,
          bookingNumber: true,
          customerName: true,
          customerEmail: true,
          customerPhone: true,
          service: {
            select: {
              name: true,
            },
          },
        },
      },
      tailor: {
        select: {
          fullName: true,
        },
      },
    },
    orderBy: [
      { scheduledDate: 'desc' },
      { scheduledTime: 'desc' },
    ],
  })

  // Serialize fittings
  const serializedFittings = fittings.map((fitting) => ({
    ...fitting,
    scheduledDate: fitting.scheduledDate.toISOString(),
    calledAt: fitting.calledAt?.toISOString() || null,
    attendedAt: fitting.attendedAt?.toISOString() || null,
    createdAt: fitting.createdAt.toISOString(),
    updatedAt: fitting.updatedAt.toISOString(),
  }))

  // Calculate stats
  const upcoming = fittings.filter(
    (f) =>
      f.scheduledDate >= new Date() &&
      (f.status === 'scheduled' || f.status === 'customer_called')
  ).length

  const completed = fittings.filter((f) => f.status === 'completed').length
  const noShows = fittings.filter((f) => f.status === 'no_show').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fitting Appointments</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track customer fitting appointments
          </p>
        </div>
        <NewFittingDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Upcoming Fittings</div>
          <div className="text-2xl font-bold mt-1 text-blue-600">{upcoming}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Completed</div>
          <div className="text-2xl font-bold mt-1 text-green-600">{completed}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">No Shows</div>
          <div className="text-2xl font-bold mt-1 text-red-600">{noShows}</div>
        </div>
      </div>

      {/* Table */}
      <FittingsTable initialFittings={serializedFittings as any} />
    </div>
  )
}
