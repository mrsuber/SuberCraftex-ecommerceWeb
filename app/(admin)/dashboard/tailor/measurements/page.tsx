import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MeasurementsTable } from '@/components/tailor/MeasurementsTable'

export const metadata: Metadata = {
  title: 'Measurements | Tailor Dashboard',
  description: 'Record and manage customer measurements',
}

export default async function MeasurementsPage() {
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

  // Bookings needing measurements
  const needingMeasurements = await db.serviceBooking.findMany({
    where: {
      status: {
        in: ['quote_approved', 'in_progress', 'quote_pending', 'pending'],
      },
      serviceType: {
        in: ['custom_production', 'collect_repair'],
      },
      measurement: null,
    },
    include: {
      service: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Bookings with measurements
  const withMeasurements = await db.serviceBooking.findMany({
    where: {
      serviceType: {
        in: ['custom_production', 'collect_repair'],
      },
      measurement: {
        isNot: null,
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
          takenAt: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 50,
  })

  // Serialize dates
  const serializedNeeding = needingMeasurements.map((booking) => ({
    ...booking,
    price: Number(booking.price),
    finalPrice: booking.finalPrice ? Number(booking.finalPrice) : null,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    scheduledDate: booking.scheduledDate?.toISOString() || null,
    completedAt: booking.completedAt?.toISOString() || null,
    cancelledAt: booking.cancelledAt?.toISOString() || null,
  }))

  const serializedWith = withMeasurements.map((booking) => ({
    ...booking,
    price: Number(booking.price),
    finalPrice: booking.finalPrice ? Number(booking.finalPrice) : null,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    scheduledDate: booking.scheduledDate?.toISOString() || null,
    completedAt: booking.completedAt?.toISOString() || null,
    cancelledAt: booking.cancelledAt?.toISOString() || null,
    measurement: booking.measurement
      ? {
          takenAt: booking.measurement.takenAt.toISOString(),
        }
      : null,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Measurements</h1>
        <p className="text-muted-foreground mt-1">
          Record and manage customer measurements
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">
              {needingMeasurements.length}
            </div>
            <p className="text-sm text-muted-foreground">Needs Measurement</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {withMeasurements.length}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <Tabs defaultValue="needs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="needs">
            Needs Measurement ({needingMeasurements.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({withMeasurements.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="needs">
          <MeasurementsTable bookings={serializedNeeding as any} showAction />
        </TabsContent>
        <TabsContent value="completed">
          <MeasurementsTable bookings={serializedWith as any} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
