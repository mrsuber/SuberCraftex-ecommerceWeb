import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/session'
import { SendQuoteForm } from '@/components/dashboard/SendQuoteForm'

interface SendQuotePageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Send Quote | Admin Dashboard',
  description: 'Send quote to customer',
}

export default async function SendQuotePage({ params }: SendQuotePageProps) {
  await requireAdmin()
  const { id } = await params

  const booking = await db.serviceBooking.findUnique({
    where: { id },
    include: {
      service: {
        include: {
          category: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
      quote: {
        include: {
          history: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      },
      materials: {
        include: {
          material: true,
        },
      },
    },
  })

  if (!booking) {
    notFound()
  }

  if (!booking.quote) {
    redirect(`/dashboard/bookings/${id}`)
  }

  if (booking.quote.status !== 'draft') {
    redirect(`/dashboard/bookings/${id}`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Send Quote to Customer</h1>
        <p className="text-muted-foreground mt-1">
          Review and send quote for booking #{booking.bookingNumber}
        </p>
      </div>

      <SendQuoteForm
        bookingId={booking.id}
        bookingNumber={booking.bookingNumber}
        customerName={booking.customerName}
        customerEmail={booking.customerEmail}
        serviceName={booking.service.name}
        quote={{
          id: booking.quote.id,
          materialCost: Number(booking.quote.materialCost),
          laborCost: Number(booking.quote.laborCost),
          laborHours: Number(booking.quote.laborHours),
          totalCost: Number(booking.quote.totalCost),
          downPaymentAmount: Number(booking.quote.downPaymentAmount),
          notes: booking.quote.notes,
          status: booking.quote.status,
        }}
        materials={booking.materials.map((bm) => ({
          name: bm.material.name,
          quantity: bm.quantity,
          price: Number(bm.priceAtBooking),
          unit: bm.material.unit,
        }))}
      />
    </div>
  )
}
