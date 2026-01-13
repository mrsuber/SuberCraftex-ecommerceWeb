import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { requireAdminOrTailor } from '@/lib/session'
import { QuoteForm } from '@/components/dashboard/QuoteForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface QuoteCreatePageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Create Quote | Admin Dashboard',
  description: 'Create a quote for a service booking',
}

export default async function QuoteCreatePage({ params }: QuoteCreatePageProps) {
  // Require admin or tailor authentication
  await requireAdminOrTailor()

  const { id } = await params

  // Fetch booking with all necessary details
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
      materials: {
        include: {
          material: {
            include: {
              category: true,
            },
          },
        },
      },
      quote: true,
    },
  })

  if (!booking) {
    notFound()
  }

  // Check if quote already exists
  if (booking.quote) {
    redirect(`/dashboard/bookings/${id}`)
  }

  // Check if booking is in a state that can receive a quote
  const validStatuses = ['quote_pending', 'pending']
  if (!validStatuses.includes(booking.status)) {
    redirect(`/dashboard/bookings/${id}`)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/bookings/${id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Create Quote</h1>
          <p className="text-muted-foreground mt-1">
            Booking #{booking.bookingNumber}
          </p>
        </div>
      </div>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Information</CardTitle>
          <CardDescription>Review booking details before creating quote</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Service</div>
              <div className="font-semibold">{booking.service.name}</div>
              {booking.service.category && (
                <div className="text-sm text-muted-foreground">
                  {booking.service.category.name}
                </div>
              )}
            </div>

            <div>
              <div className="text-sm text-muted-foreground">Service Type</div>
              <Badge variant="outline" className="mt-1">
                {booking.serviceType === 'onsite'
                  ? 'On-Site Service'
                  : booking.serviceType === 'custom_production'
                  ? 'Custom Production'
                  : 'Collect & Repair'}
              </Badge>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">Customer</div>
              <div className="font-medium">{booking.customerName}</div>
              <div className="text-sm text-muted-foreground">{booking.customerEmail}</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">Current Status</div>
              <Badge variant="secondary" className="mt-1">
                {booking.status}
              </Badge>
            </div>
          </div>

          {booking.desiredOutcome && (
            <div className="pt-4 border-t">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Desired Outcome
              </div>
              <div className="bg-muted p-3 rounded-md whitespace-pre-wrap text-sm">
                {booking.desiredOutcome}
              </div>
            </div>
          )}

          {booking.customerNotes && (
            <div className="pt-4 border-t">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Customer Notes
              </div>
              <div className="bg-muted p-3 rounded-md whitespace-pre-wrap text-sm">
                {booking.customerNotes}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Banner */}
      {booking.serviceType === 'custom_production' || booking.serviceType === 'collect_repair' ? (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Quote-Based Service</p>
                <p>
                  This booking requires a detailed quote including material and labor costs.
                  Once you send the quote, the customer will be able to review and approve it
                  before proceeding with payment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-900">
                <p className="font-semibold mb-1">Note</p>
                <p>
                  This is an on-site service booking. Quotes are typically optional for this
                  service type but can be used to provide detailed cost breakdowns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quote Form */}
      <QuoteForm
        bookingId={booking.id}
        bookingNumber={booking.bookingNumber}
        materials={booking.materials.map((bm) => ({
          id: bm.id,
          material: {
            id: bm.material.id,
            name: bm.material.name,
            price: Number(bm.material.price),
            unit: bm.material.unit,
          },
          quantity: bm.quantity,
        }))}
      />
    </div>
  )
}
