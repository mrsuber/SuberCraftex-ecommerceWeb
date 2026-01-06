'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge'
import { QuoteDisplay } from '@/components/bookings/QuoteDisplay'
import { QuoteApprovalActions } from '@/components/bookings/QuoteApprovalActions'
import { ProgressTimeline } from '@/components/bookings/ProgressTimeline'
import { PhotoGallery } from '@/components/shared/PhotoGallery'
import { StockIndicator } from '@/components/materials/StockIndicator'
import { CancelBookingDialog } from '@/components/bookings/CancelBookingDialog'
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  Package,
  Truck,
  Store,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import type { ServiceBooking } from '@/types'

interface BookingDetailClientProps {
  booking: any // Serialized booking data
  currentUser: any
}

const serviceTypeLabels = {
  onsite: 'On-Site Service',
  custom_production: 'Custom Production',
  collect_repair: 'Collect & Repair',
}

const collectionMethodLabels = {
  admin_collects: 'We collect from you',
  customer_brings: 'You bring to shop',
}

export function BookingDetailClient({ booking, currentUser }: BookingDetailClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApproveQuote = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch(`/api/bookings/${booking.id}/quote/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        toast({
          title: 'Quote Approved!',
          description: 'Redirecting to payment...',
        })

        // Redirect to payment page
        setTimeout(() => {
          router.push(`/bookings/${booking.id}/payment`)
        }, 1000)
      } else {
        const error = await response.json()
        toast({
          title: 'Approval Failed',
          description: error.error || 'Failed to approve quote',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error approving quote:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectQuote = async (reason?: string) => {
    setIsProcessing(true)

    try {
      const response = await fetch(`/api/bookings/${booking.id}/quote/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      if (response.ok) {
        toast({
          title: 'Quote Rejected',
          description: 'We\'ll work on a revised quote for you',
        })

        router.refresh()
      } else {
        const error = await response.json()
        toast({
          title: 'Rejection Failed',
          description: error.error || 'Failed to reject quote',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error rejecting quote:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelBooking = async (reason: string) => {
    setIsProcessing(true)

    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      if (response.ok) {
        toast({
          title: 'Booking Cancelled',
          description: 'Your booking has been cancelled successfully',
        })

        // Redirect to bookings list after a brief delay
        setTimeout(() => {
          router.push('/bookings')
        }, 1500)
      } else {
        const error = await response.json()
        toast({
          title: 'Cancellation Failed',
          description: error.error || 'Failed to cancel booking',
          variant: 'destructive',
        })
        throw new Error(error.error)
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const canApproveQuote =
    booking.quote &&
    booking.quote.status === 'sent' &&
    booking.status === 'quote_sent'

  const canCancelBooking = !['cancelled', 'completed'].includes(booking.status)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/bookings"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to My Bookings
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Booking #{booking.bookingNumber}</h1>
            <p className="text-gray-600 mt-1">
              {format(new Date(booking.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <BookingStatusBadge status={booking.status} />
            {canCancelBooking && (
              <CancelBookingDialog
                bookingId={booking.id}
                bookingNumber={booking.bookingNumber}
                onCancel={handleCancelBooking}
                isProcessing={isProcessing}
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                {booking.service.featuredImage && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={booking.service.featuredImage}
                      alt={booking.service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{booking.service.name}</h3>
                  {booking.service.category && (
                    <p className="text-sm text-gray-600">{booking.service.category.name}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">
                      {serviceTypeLabels[booking.serviceType as keyof typeof serviceTypeLabels]}
                    </Badge>
                    {booking.scheduledDate && booking.scheduledTime && (
                      <>
                        <Badge variant="secondary" className="gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(booking.scheduledDate), 'MMM d, yyyy')}
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="w-3 h-3" />
                          {booking.scheduledTime}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Service Type Specific Info */}
              {booking.serviceType === 'collect_repair' && booking.collectionMethod && (
                <div className="flex items-center gap-2 text-sm">
                  {booking.collectionMethod === 'admin_collects' ? (
                    <Truck className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Store className="w-4 h-4 text-gray-500" />
                  )}
                  <span>
                    {collectionMethodLabels[booking.collectionMethod as keyof typeof collectionMethodLabels]}
                  </span>
                </div>
              )}

              {booking.desiredOutcome && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Desired Outcome</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {booking.desiredOutcome}
                  </p>
                </div>
              )}

              {booking.customerNotes && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Additional Notes</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {booking.customerNotes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Requirement Photos */}
          {booking.requirementPhotos && booking.requirementPhotos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirement Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <PhotoGallery photos={booking.requirementPhotos} columns={3} />
              </CardContent>
            </Card>
          )}

          {/* Selected Materials */}
          {booking.materials && booking.materials.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Selected Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {booking.materials.map((bm: any) => (
                    <div
                      key={bm.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{bm.material.name}</p>
                        <p className="text-sm text-gray-600">
                          SKU: {bm.material.sku} • {bm.quantity} {bm.material.unit}
                        </p>
                        {bm.isAcquired && (
                          <Badge variant="success" className="mt-1">
                            Acquired
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${(Number(bm.priceAtBooking) * bm.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${Number(bm.priceAtBooking).toFixed(2)} / {bm.material.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Material Requests */}
          {booking.materialRequests && booking.materialRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requested Materials</CardTitle>
                <p className="text-sm text-gray-600">
                  Materials you requested that we'll source for you
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {booking.materialRequests.map((mr: any) => (
                    <div key={mr.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">{mr.description}</p>
                        <Badge
                          variant={
                            mr.status === 'acquired'
                              ? 'success'
                              : mr.status === 'approved'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {mr.status}
                        </Badge>
                      </div>
                      {mr.referenceUrl && (
                        <a
                          href={mr.referenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline block mb-1"
                        >
                          Reference Link →
                        </a>
                      )}
                      {mr.referencePhotos && mr.referencePhotos.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {mr.referencePhotos.length} reference photo(s) attached
                        </p>
                      )}
                      {mr.adminNotes && (
                        <p className="text-sm text-gray-600 mt-2 pt-2 border-t">
                          Admin: {mr.adminNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quote */}
          {booking.quote && (
            <div className="space-y-6">
              <QuoteDisplay quote={booking.quote} showHistory />

              {/* Quote Approval Actions */}
              {canApproveQuote && (
                <QuoteApprovalActions
                  quoteId={booking.quote.id}
                  bookingId={booking.id}
                  onApprove={handleApproveQuote}
                  onReject={handleRejectQuote}
                  isProcessing={isProcessing}
                />
              )}
            </div>
          )}

          {/* Progress Timeline */}
          {booking.progressUpdates && booking.progressUpdates.length > 0 && (
            <ProgressTimeline
              progressUpdates={booking.progressUpdates}
              currentStatus={booking.status}
            />
          )}

          {/* Waiting for Quote */}
          {!booking.quote &&
            (booking.status === 'quote_pending' || booking.status === 'quote_sent') && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900">Waiting for Quote</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        We're reviewing your request and will send you a detailed quote soon.
                        You'll be notified via email when it's ready.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span>{booking.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="truncate">{booking.customerEmail}</span>
              </div>
              {booking.customerPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{booking.customerPhone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {booking.finalPrice ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Price</span>
                    <span>${Number(booking.price).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Final Price</span>
                    <span className="text-lg text-primary">
                      ${Number(booking.finalPrice).toFixed(2)}
                    </span>
                  </div>
                  {booking.quote && (
                    <p className="text-xs text-gray-500">
                      Locked after quote approval
                    </p>
                  )}
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Price</span>
                  <span className="font-semibold">
                    ${Number(booking.price).toFixed(2)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payments */}
          {booking.payments && booking.payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {booking.payments.map((payment: any) => (
                    <div
                      key={payment.id}
                      className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium capitalize">
                          {payment.paymentType.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <span className="font-semibold">
                        ${Number(payment.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          {booking.adminNotes && currentUser.role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {booking.adminNotes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
