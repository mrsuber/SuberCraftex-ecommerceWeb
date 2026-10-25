import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { bookingBalance } from '@/lib/services/booking-payments'
import { PaymentPageClient } from './PaymentPageClient'

interface PaymentPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Payment | SuberCraftex',
  description: 'Pay for your booking with Mobile Money',
}

export const dynamic = 'force-dynamic'

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const booking = await db.serviceBooking.findUnique({
    where: { id },
    include: { service: { select: { id: true, name: true, featuredImage: true } }, quote: true },
  })
  if (!booking || user.id !== booking.userId) notFound()

  // What is due is worked out on the server: the quote's down payment first, then the rest
  const balance = await bookingBalance(db, booking.id)
  if (!balance.next) redirect(`/bookings/${id}`)

  return (
    <PaymentPageClient
      data={{
        booking: {
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          status: booking.status,
          service: booking.service,
        },
        balance: {
          total: Number(balance.total),
          paid: Number(balance.paid),
          remaining: Number(balance.remaining),
          nextType: balance.next.type,
          nextAmount: Number(balance.next.amount),
        },
        quote: booking.quote
          ? {
              materialCost: Number(booking.quote.materialCost),
              laborCost: Number(booking.quote.laborCost),
              totalCost: Number(booking.quote.totalCost),
            }
          : null,
        phone: booking.customerPhone ?? user.phone ?? '',
      }}
    />
  )
}
