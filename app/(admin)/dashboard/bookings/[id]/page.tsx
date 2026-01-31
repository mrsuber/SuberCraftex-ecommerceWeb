import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, User, Mail, Phone, Tag, FileText, Ruler, CalendarPlus, Camera, Palette } from 'lucide-react'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/currency'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BookingPageProps {
  params: Promise<{ id: string }>
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  quote_pending: 'bg-yellow-600',
  quote_sent: 'bg-blue-600',
  quote_approved: 'bg-green-600',
  quote_rejected: 'bg-red-600',
  awaiting_payment: 'bg-orange-500',
  payment_partial: 'bg-orange-600',
  in_progress: 'bg-purple-500',
  awaiting_collection: 'bg-indigo-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
  no_show: 'bg-gray-500',
  rescheduled: 'bg-orange-500',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  quote_pending: 'Quote Pending',
  quote_sent: 'Quote Sent',
  quote_approved: 'Quote Approved',
  quote_rejected: 'Quote Rejected',
  awaiting_payment: 'Awaiting Payment',
  payment_partial: 'Partial Payment',
  in_progress: 'In Progress',
  awaiting_collection: 'Awaiting Collection',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
  rescheduled: 'Rescheduled',
}

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  const { id } = await params
  const booking = await db.serviceBooking.findUnique({
    where: { id },
  })

  if (!booking) {
    return {
      title: 'Booking Not Found',
    }
  }

  return {
    title: `Booking ${booking.bookingNumber} | Admin Dashboard`,
    description: 'View booking details',
  }
}

export default async function BookingPage({ params }: BookingPageProps) {
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
      measurement: true,
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
      materialRequests: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      progressUpdates: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      payments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      fittingAppointments: {
        orderBy: {
          scheduledDate: 'asc',
        },
        include: {
          tailor: true,
        },
      },
    },
  })

  if (!booking) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Booking Details</h1>
          <p className="text-muted-foreground mt-1">
            Booking #{booking.bookingNumber}
          </p>
        </div>
        <Badge variant="secondary" className={STATUS_COLORS[booking.status]}>
          {STATUS_LABELS[booking.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Service Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Service</div>
              <div className="font-semibold">{booking.service.name}</div>
              {booking.service.category && (
                <div className="text-sm text-muted-foreground">
                  {booking.service.category.name}
                </div>
              )}
            </div>

            <Separator />

            <div>
              <div className="text-sm text-muted-foreground">Service Type</div>
              <div className="font-medium capitalize">
                {booking.serviceType.replace(/_/g, ' ')}
              </div>
            </div>

            {booking.scheduledDate && (
              <>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-medium">
                      {format(new Date(booking.scheduledDate), 'MMMM d, yyyy')}
                    </div>
                  </div>
                </div>

                {booking.scheduledTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Time</div>
                      <div className="font-medium">
                        {booking.scheduledTime} - {booking.endTime}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Duration: {booking.duration} minutes
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {booking.collectionMethod && (
              <div>
                <div className="text-sm text-muted-foreground">Collection Method</div>
                <div className="font-medium capitalize">
                  {booking.collectionMethod.replace(/_/g, ' ')}
                </div>
              </div>
            )}

            <Separator />

            <div>
              <div className="text-sm text-muted-foreground">Price</div>
              <div className="text-2xl font-bold">
                {formatCurrency(Number(booking.price))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="font-semibold">{booking.customerName}</div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <Link
                  href={`mailto:${booking.customerEmail}`}
                  className="font-medium hover:underline"
                >
                  {booking.customerEmail}
                </Link>
              </div>
            </div>

            {booking.customerPhone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <Link
                    href={`tel:${booking.customerPhone}`}
                    className="font-medium hover:underline"
                  >
                    {booking.customerPhone}
                  </Link>
                </div>
              </div>
            )}

            <Separator />

            {booking.user && (
              <div>
                <div className="text-sm text-muted-foreground">Account</div>
                <div className="font-medium">Registered User</div>
                <Link
                  href={`/dashboard/customers/${booking.userId}`}
                  className="text-sm text-primary hover:underline"
                >
                  View customer profile
                </Link>
              </div>
            )}

            {booking.orderId && (
              <div>
                <div className="text-sm text-muted-foreground">Order</div>
                <Link
                  href={`/dashboard/orders/${booking.orderId}`}
                  className="text-sm text-primary hover:underline"
                >
                  View associated order
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Requirements (for custom production and collect/repair) */}
      {(booking.desiredOutcome || booking.requirementPhotos.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Customer Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {booking.desiredOutcome && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Desired Outcome
                </div>
                <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
                  {booking.desiredOutcome}
                </div>
              </div>
            )}

            {booking.requirementPhotos.length > 0 && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Requirement Photos ({booking.requirementPhotos.length})
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {booking.requirementPhotos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border bg-muted"
                    >
                      <img
                        src={photo}
                        alt={`Requirement ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Design Selections */}
      {booking.designSelections && Array.isArray(booking.designSelections) && (booking.designSelections as any[]).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Design Selections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {(booking.designSelections as any[]).map((selection: any, catIndex: number) => (
              <div key={catIndex}>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {selection.categoryName}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selection.optionIds?.map((opt: any, optIndex: number) => (
                    <div key={optIndex} className="border rounded-lg overflow-hidden">
                      <div className="aspect-square bg-muted">
                        <img
                          src={opt.imageUrl}
                          alt={opt.optionName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-medium">{opt.optionName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {booking.customerNotes && (
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Customer Notes
              </div>
              <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
                {booking.customerNotes}
              </div>
            </div>
          )}

          {booking.adminNotes && (
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Admin Notes
              </div>
              <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
                {booking.adminNotes}
              </div>
            </div>
          )}

          {!booking.customerNotes && !booking.adminNotes && (
            <div className="text-muted-foreground text-center py-4">
              No notes available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Booking Number</div>
            <div className="font-mono">{booking.bookingNumber}</div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Created</div>
            <div>{format(new Date(booking.createdAt), 'MMM d, yyyy h:mm a')}</div>
          </div>

          {booking.completedAt && (
            <div>
              <div className="text-sm text-muted-foreground">Completed</div>
              <div>{format(new Date(booking.completedAt), 'MMM d, yyyy h:mm a')}</div>
            </div>
          )}

          {booking.cancelledAt && (
            <div>
              <div className="text-sm text-muted-foreground">Cancelled</div>
              <div>{format(new Date(booking.cancelledAt), 'MMM d, yyyy h:mm a')}</div>
            </div>
          )}

          {booking.cancellationReason && (
            <div className="col-span-2">
              <div className="text-sm text-muted-foreground">Cancellation Reason</div>
              <div className="bg-muted p-3 rounded-md">{booking.cancellationReason}</div>
            </div>
          )}

          {booking.rescheduledFrom && (
            <div className="col-span-2">
              <div className="text-sm text-muted-foreground">Rescheduled From</div>
              <div>{booking.rescheduledFrom}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quote Section */}
      {booking.quote ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Quote</CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    booking.quote.status === 'approved'
                      ? 'default'
                      : booking.quote.status === 'rejected'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {booking.quote.status}
                </Badge>
                {booking.quote.status === 'draft' && (
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/bookings/${id}/quote/send`}>
                      Send to Customer
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Material Cost</div>
                <div className="font-semibold">{formatCurrency(Number(booking.quote.materialCost))}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Labor Cost</div>
                <div className="font-semibold">{formatCurrency(Number(booking.quote.laborCost))}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Labor Hours</div>
                <div className="font-semibold">{Number(booking.quote.laborHours).toFixed(1)} hours</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Cost</div>
                <div className="text-xl font-bold text-primary">
                  {formatCurrency(Number(booking.quote.totalCost))}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="text-sm text-muted-foreground mb-1">Down Payment</div>
              <div className="font-semibold">{formatCurrency(Number(booking.quote.downPaymentAmount))}</div>
            </div>

            {booking.quote.notes && (
              <>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Notes</div>
                  <div className="bg-muted p-3 rounded-md whitespace-pre-wrap text-sm">
                    {booking.quote.notes}
                  </div>
                </div>
              </>
            )}

            {booking.quote.validUntil && (
              <>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  Valid until: {format(new Date(booking.quote.validUntil), 'MMM d, yyyy')}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {(booking.status === 'quote_pending' || booking.status === 'pending') && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-blue-900">No Quote Created</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Create a quote to send to the customer for approval
                    </p>
                  </div>
                  <Button asChild>
                    <Link href={`/dashboard/bookings/${id}/quote/create`}>
                      Create Quote
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Materials Section */}
      {booking.materials && booking.materials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {booking.materials.map((bm) => (
                <div
                  key={bm.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{bm.material.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {bm.quantity} × {formatCurrency(Number(bm.priceAtBooking))} / {bm.material.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(Number(bm.priceAtBooking) * bm.quantity)}
                    </p>
                    {bm.isAcquired && (
                      <Badge variant="default" className="mt-1">
                        Acquired
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Updates */}
      {booking.progressUpdates && booking.progressUpdates.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Progress Updates</CardTitle>
              <Badge variant="secondary">{booking.progressUpdates.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {booking.progressUpdates.map((update, index) => (
                <div
                  key={update.id}
                  className={`p-4 border rounded-lg ${
                    index === 0 ? 'border-primary/50 bg-primary/5' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {update.status.replace(/_/g, ' ')}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(update.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    {index === 0 && (
                      <Badge variant="default">Latest</Badge>
                    )}
                  </div>
                  <p className="text-sm mb-2 whitespace-pre-wrap">{update.description}</p>
                  {update.photos && update.photos.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs font-medium text-muted-foreground mb-2">
                        Attached Photos ({update.photos.length})
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {update.photos.slice(0, 3).map((photo, i) => (
                          <div key={i} className="relative aspect-square rounded overflow-hidden">
                            <img
                              src={photo}
                              alt={`Progress photo ${i + 1}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))}
                      </div>
                      {update.photos.length > 3 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          +{update.photos.length - 3} more photo(s)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fitting Appointments Section */}
      {(booking.status === 'in_progress' || booking.status === 'quote_approved' || booking.fittingAppointments.length > 0) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarPlus className="h-5 w-5" />
                Fitting Appointments
              </CardTitle>
              <Button asChild size="sm">
                <Link href={`/dashboard/tailor/fittings?bookingId=${id}`}>
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Schedule Fitting
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {booking.fittingAppointments.length > 0 ? (
              <div className="space-y-3">
                {booking.fittingAppointments.map((fitting) => {
                  const statusColors: Record<string, string> = {
                    scheduled: 'bg-blue-500',
                    customer_called: 'bg-yellow-500',
                    completed: 'bg-green-500',
                    no_show: 'bg-red-500',
                    rescheduled: 'bg-orange-500',
                    cancelled: 'bg-gray-500',
                  }
                  const statusLabels: Record<string, string> = {
                    scheduled: 'Scheduled',
                    customer_called: 'Called',
                    completed: 'Completed',
                    no_show: 'No Show',
                    rescheduled: 'Rescheduled',
                    cancelled: 'Cancelled',
                  }

                  return (
                    <div
                      key={fitting.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                          <span className="text-xs font-bold text-primary">
                            #{fitting.fittingNumber}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {format(new Date(fitting.scheduledDate), 'MMMM d, yyyy')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {fitting.scheduledTime} ({fitting.durationMinutes} min)
                          </div>
                          {fitting.customerCalled && (
                            <div className="text-xs text-green-600 mt-1">
                              Customer called on {fitting.calledAt ? format(new Date(fitting.calledAt), 'MMM d') : 'N/A'}
                            </div>
                          )}
                          {fitting.notes && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {fitting.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className={statusColors[fitting.status]}>
                        {statusLabels[fitting.status] || fitting.status}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarPlus className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No fitting appointments scheduled</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Schedule a fitting to meet with the customer
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Measurement Section */}
      {((booking.serviceType === 'custom_production' || booking.serviceType === 'collect_repair') &&
        (booking.status === 'quote_approved' || booking.status === 'in_progress' || booking.status === 'quote_pending' || booking.status === 'pending' || booking.measurement)) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Measurements
              </CardTitle>
              <Button asChild variant={booking.measurement ? 'outline' : 'default'}>
                <Link href={`/dashboard/bookings/${id}/measurement`}>
                  <Ruler className="h-4 w-4 mr-2" />
                  {booking.measurement ? 'View/Update Measurements' : 'Record Measurements'}
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {booking.measurement ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900">Measurements Recorded</p>
                    <p className="text-sm text-green-700">
                      Taken on {format(new Date(booking.measurement.takenAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    ✓ Complete
                  </Badge>
                </div>
                {booking.measurement.notes && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Notes</div>
                    <div className="text-sm whitespace-pre-wrap">{booking.measurement.notes}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Ruler className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No measurements recorded yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click the button above to record customer measurements
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/bookings">Back to Bookings</Link>
        </Button>
        {!booking.quote && (booking.status === 'quote_pending' || booking.status === 'pending') && (
          <Button asChild>
            <Link href={`/dashboard/bookings/${id}/quote/create`}>Create Quote</Link>
          </Button>
        )}
        {((booking.serviceType === 'custom_production' || booking.serviceType === 'collect_repair') &&
          (booking.status === 'quote_approved' || booking.status === 'in_progress' || booking.status === 'quote_pending' || booking.status === 'pending') && !booking.measurement) && (
          <Button asChild variant="default">
            <Link href={`/dashboard/bookings/${id}/measurement`}>
              <Ruler className="h-4 w-4 mr-2" />
              Record Measurements
            </Link>
          </Button>
        )}
        {(booking.status === 'in_progress' || booking.status === 'payment_partial') && (
          <Button asChild>
            <Link href={`/dashboard/bookings/${id}/progress/new`}>
              Add Progress Update
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
