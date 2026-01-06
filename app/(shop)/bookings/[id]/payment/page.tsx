import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { PaymentPageClient } from './PaymentPageClient'

interface PaymentPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PaymentPageProps): Promise<Metadata> {
  const { id } = await params

  return {
    title: 'Payment | SuberCraftex',
    description: 'Complete your booking payment',
  }
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch booking with quote
  const booking = await db.serviceBooking.findUnique({
    where: { id },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          featuredImage: true,
        },
      },
      quote: {
        include: {
          history: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      },
      payments: {
        where: {
          paymentType: 'down_payment',
          status: 'completed',
        },
      },
    },
  })

  if (!booking) {
    notFound()
  }

  // Check authorization
  if (user.id !== booking.userId) {
    notFound()
  }

  // Check if quote exists and is approved
  if (!booking.quote || booking.quote.status !== 'approved') {
    redirect(`/bookings/${id}`)
  }

  // Check if already paid
  if (booking.payments.length > 0) {
    redirect(`/bookings/${id}`)
  }

  // Check if booking is in correct status
  if (booking.status !== 'awaiting_payment') {
    redirect(`/bookings/${id}`)
  }

  // Serialize data
  const serializedData = {
    booking: {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      service: {
        id: booking.service.id,
        name: booking.service.name,
        featuredImage: booking.service.featuredImage,
      },
    },
    quote: {
      id: booking.quote.id,
      totalCost: Number(booking.quote.totalCost),
      downPaymentAmount: Number(booking.quote.downPaymentAmount),
      materialCost: Number(booking.quote.materialCost),
      laborCost: Number(booking.quote.laborCost),
    },
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
  }

  return <PaymentPageClient data={serializedData} />
}
