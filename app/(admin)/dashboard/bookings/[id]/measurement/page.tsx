import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { MeasurementForm } from '@/components/tailor/MeasurementForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Record Measurement | Tailor Dashboard',
  description: 'Record customer measurements',
}

export default async function MeasurementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getSession()

  if (!user || user.role !== 'tailor') {
    redirect('/dashboard')
  }

  const booking = await db.serviceBooking.findUnique({
    where: { id },
    include: {
      service: {
        include: {
          category: true,
        },
      },
      measurement: true,
    },
  })

  if (!booking) {
    notFound()
  }

  // Serialize booking data
  const serializedBooking = {
    ...booking,
    price: Number(booking.price),
    finalPrice: booking.finalPrice ? Number(booking.finalPrice) : null,
    scheduledDate: booking.scheduledDate?.toISOString() || null,
    measurement: booking.measurement
      ? {
          ...booking.measurement,
          takenAt: booking.measurement.takenAt.toISOString(),
          createdAt: booking.measurement.createdAt.toISOString(),
          updatedAt: booking.measurement.updatedAt.toISOString(),
        }
      : null,
    service: {
      ...booking.service,
      price: Number(booking.service.price),
      compareAtPrice: booking.service.compareAtPrice
        ? Number(booking.service.compareAtPrice)
        : null,
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/bookings/${booking.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Booking
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">
          {booking.measurement ? 'Update' : 'Record'} Measurements
        </h1>
        <p className="text-muted-foreground mt-1">
          Booking #{booking.bookingNumber} - {booking.customerName}
        </p>
      </div>

      <MeasurementForm booking={serializedBooking as any} />
    </div>
  )
}
