import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { BookingsListClient } from './BookingsListClient'

export const metadata: Metadata = {
  title: 'My Bookings | SuberCraftex',
  description: 'View and manage your service bookings',
}

export default async function BookingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's bookings
  const bookings = await db.serviceBooking.findMany({
    where: {
      userId: user.id,
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          slug: true,
          featuredImage: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      quote: {
        select: {
          id: true,
          status: true,
          totalCost: true,
          downPaymentAmount: true,
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
    orderBy: [
      { createdAt: 'desc' },
    ],
  })

  // Serialize bookings
  const serializedBookings = bookings.map((booking) => ({
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    status: booking.status,
    serviceType: booking.serviceType,
    scheduledDate: booking.scheduledDate?.toISOString() || null,
    scheduledTime: booking.scheduledTime,
    price: Number(booking.price),
    finalPrice: booking.finalPrice ? Number(booking.finalPrice) : null,
    createdAt: booking.createdAt.toISOString(),
    service: {
      id: booking.service.id,
      name: booking.service.name,
      slug: booking.service.slug,
      featuredImage: booking.service.featuredImage,
      category: booking.service.category
        ? {
            id: booking.service.category.id,
            name: booking.service.category.name,
            slug: booking.service.category.slug,
          }
        : null,
    },
    quote: booking.quote
      ? {
          id: booking.quote.id,
          status: booking.quote.status,
          totalCost: Number(booking.quote.totalCost),
          downPaymentAmount: Number(booking.quote.downPaymentAmount),
        }
      : null,
    latestProgress: booking.progressUpdates[0] || null,
  }))

  return <BookingsListClient bookings={serializedBookings} />
}
