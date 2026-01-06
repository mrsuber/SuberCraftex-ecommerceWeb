import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/session'
import { ProgressUpdateForm } from '@/components/dashboard/ProgressUpdateForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

interface ProgressNewPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Add Progress Update | Admin Dashboard',
  description: 'Add a progress update for a service booking',
}

export default async function ProgressNewPage({ params }: ProgressNewPageProps) {
  // Require admin authentication
  await requireAdmin()

  const { id } = await params

  // Fetch booking with progress history
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
      quote: true,
      progressUpdates: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 3,
      },
    },
  })

  if (!booking) {
    notFound()
  }

  // Check if booking is in a state that can receive progress updates
  const validStatuses = ['in_progress', 'awaiting_collection', 'payment_partial']
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
          <h1 className="text-3xl font-bold">Add Progress Update</h1>
          <p className="text-muted-foreground mt-1">
            Booking #{booking.bookingNumber}
          </p>
        </div>
      </div>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Information</CardTitle>
          <CardDescription>Current booking details</CardDescription>
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

          {booking.quote && (
            <div className="pt-4 border-t">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Quote Details
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Cost:</span>
                  <span className="font-semibold ml-2">
                    ${Number(booking.quote.totalCost).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Down Payment:</span>
                  <span className="font-semibold ml-2">
                    ${Number(booking.quote.downPaymentAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Progress Updates */}
      {booking.progressUpdates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recent Updates
              <Badge variant="secondary">{booking.progressUpdates.length}</Badge>
            </CardTitle>
            <CardDescription>
              Last {booking.progressUpdates.length} progress update(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {booking.progressUpdates.map((update) => (
              <div
                key={update.id}
                className="p-3 border rounded-lg bg-muted/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">
                    {update.status.replace(/_/g, ' ')}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(update.createdAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {update.description}
                </p>
                {update.photos && update.photos.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {update.photos.length} photo(s) attached
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Info Banner */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Customer Notification</p>
              <p>
                When you add a progress update, the customer will be automatically notified
                via email with the details and any photos you attach. This helps keep them
                informed and builds trust in your work.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Update Form */}
      <ProgressUpdateForm
        bookingId={booking.id}
        bookingNumber={booking.bookingNumber}
      />
    </div>
  )
}
