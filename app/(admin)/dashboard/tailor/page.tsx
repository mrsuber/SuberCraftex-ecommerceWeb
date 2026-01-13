import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { TailorDashboardClient } from '@/components/tailor/TailorDashboardClient'
import { startOfDay, endOfDay } from 'date-fns'

export const metadata: Metadata = {
  title: 'Tailor Dashboard | SuberCraftex',
  description: 'Manage your tailoring work, appointments, and measurements',
}

export default async function TailorDashboardPage() {
  const user = await getSession()

  if (!user || user.role !== 'tailor') {
    redirect('/dashboard')
  }

  const tailor = await db.tailor.findUnique({
    where: { userId: user.id },
  })

  if (!tailor) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Tailor Profile Not Found</h1>
          <p className="text-muted-foreground">
            Please contact an administrator to set up your tailor profile.
          </p>
        </div>
      </div>
    )
  }

  const today = new Date()
  const startOfToday = startOfDay(today)
  const endOfToday = endOfDay(today)

  // Fetch today's fittings
  const todaysFittings = await db.fittingAppointment.findMany({
    where: {
      tailorId: tailor.id,
      scheduledDate: {
        gte: startOfToday,
        lte: endOfToday,
      },
      status: {
        in: ['scheduled', 'customer_called'],
      },
    },
    include: {
      booking: {
        select: {
          id: true,
          bookingNumber: true,
          customerName: true,
          customerPhone: true,
          service: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      scheduledTime: 'asc',
    },
  })

  // Fetch upcoming fittings (next 7 days)
  const upcomingFittings = await db.fittingAppointment.findMany({
    where: {
      tailorId: tailor.id,
      scheduledDate: {
        gt: endOfToday,
      },
      status: {
        in: ['scheduled', 'customer_called'],
      },
    },
    include: {
      booking: {
        select: {
          id: true,
          bookingNumber: true,
          customerName: true,
          service: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: [{ scheduledDate: 'asc' }, { scheduledTime: 'asc' }],
    take: 5,
  })

  // Fetch active bookings that need attention
  const activeBookings = await db.serviceBooking.findMany({
    where: {
      status: {
        in: ['quote_approved', 'in_progress', 'quote_pending', 'pending'],
      },
    },
    include: {
      service: {
        select: {
          name: true,
        },
      },
      measurement: {
        select: {
          id: true,
        },
      },
      quote: {
        select: {
          id: true,
          status: true,
          totalCost: true,
        },
      },
      progressUpdates: {
        select: {
          id: true,
          status: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  })

  // Fetch overall statistics
  const stats = {
    totalFittings: await db.fittingAppointment.count({
      where: {
        tailorId: tailor.id,
      },
    }),
    completedFittings: await db.fittingAppointment.count({
      where: {
        tailorId: tailor.id,
        status: 'completed',
      },
    }),
    totalMeasurements: await db.measurement.count({
      where: {
        tailorId: tailor.id,
      },
    }),
    activePendingBookings: await db.serviceBooking.count({
      where: {
        status: {
          in: ['quote_approved', 'in_progress'],
        },
      },
    }),
  }

  // Serialize dates
  const serializedTodaysFittings = todaysFittings.map((fitting) => ({
    ...fitting,
    scheduledDate: fitting.scheduledDate.toISOString(),
    calledAt: fitting.calledAt?.toISOString() || null,
    attendedAt: fitting.attendedAt?.toISOString() || null,
    createdAt: fitting.createdAt.toISOString(),
    updatedAt: fitting.updatedAt.toISOString(),
  }))

  const serializedUpcomingFittings = upcomingFittings.map((fitting) => ({
    ...fitting,
    scheduledDate: fitting.scheduledDate.toISOString(),
    calledAt: fitting.calledAt?.toISOString() || null,
    attendedAt: fitting.attendedAt?.toISOString() || null,
    createdAt: fitting.createdAt.toISOString(),
    updatedAt: fitting.updatedAt.toISOString(),
  }))

  const serializedActiveBookings = activeBookings.map((booking) => ({
    ...booking,
    price: Number(booking.price),
    finalPrice: booking.finalPrice ? Number(booking.finalPrice) : null,
    scheduledDate: booking.scheduledDate?.toISOString() || null,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    quote: booking.quote
      ? {
          ...booking.quote,
          totalCost: Number(booking.quote.totalCost),
        }
      : null,
  }))

  return (
    <TailorDashboardClient
      tailorName={tailor.fullName}
      todaysFittings={serializedTodaysFittings as any}
      upcomingFittings={serializedUpcomingFittings as any}
      activeBookings={serializedActiveBookings as any}
      stats={stats}
    />
  )
}
