'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Calendar, Clock, ArrowRight, Package } from 'lucide-react'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/currency'

interface BookingsListClientProps {
  bookings: any[]
}

const serviceTypeLabels = {
  onsite: 'On-Site',
  custom_production: 'Custom Production',
  collect_repair: 'Collect & Repair',
}

export function BookingsListClient({ bookings }: BookingsListClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all')

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          booking.bookingNumber.toLowerCase().includes(query) ||
          booking.service.name.toLowerCase().includes(query)

        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter !== 'all' && booking.status !== statusFilter) {
        return false
      }

      // Service type filter
      if (serviceTypeFilter !== 'all' && booking.serviceType !== serviceTypeFilter) {
        return false
      }

      return true
    })
  }, [bookings, searchQuery, statusFilter, serviceTypeFilter])

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-6">
                Start by booking a service from our catalog
              </p>
              <Button asChild>
                <Link href="/services">Browse Services</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-gray-600">View and manage your service bookings</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="quote_pending">Quote Pending</SelectItem>
                  <SelectItem value="quote_sent">Quote Sent</SelectItem>
                  <SelectItem value="awaiting_payment">Awaiting Payment</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Service Type Filter */}
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="onsite">On-Site</SelectItem>
                  <SelectItem value="custom_production">Custom Production</SelectItem>
                  <SelectItem value="collect_repair">Collect & Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredBookings.length} of {bookings.length} bookings
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Service Image */}
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

                  {/* Booking Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="text-lg font-semibold hover:text-primary"
                        >
                          {booking.service.name}
                        </Link>
                        <p className="text-sm text-gray-600">
                          Booking #{booking.bookingNumber}
                        </p>
                      </div>
                      <BookingStatusBadge status={booking.status} />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
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

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {booking.quote ? (
                          <span className="font-semibold text-gray-900">
                            Quote: {formatCurrency(Number(booking.quote.totalCost))}
                          </span>
                        ) : booking.finalPrice ? (
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(Number(booking.finalPrice))}
                          </span>
                        ) : (
                          <span>
                            Est. {formatCurrency(Number(booking.price))}
                          </span>
                        )}
                      </div>

                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/bookings/${booking.id}`}>
                          View Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>

                    {/* Latest Progress */}
                    {booking.latestProgress && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-500">
                          Latest update: {booking.latestProgress.status.replace('_', ' ')} •{' '}
                          {format(new Date(booking.latestProgress.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <p>No bookings match your filters</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
