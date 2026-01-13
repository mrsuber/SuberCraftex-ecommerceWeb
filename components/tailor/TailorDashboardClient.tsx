'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  Ruler,
  Scissors,
  TrendingUp,
  ArrowRight,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'

interface Fitting {
  id: string
  scheduledDate: string
  scheduledTime: string
  durationMinutes: number
  fittingNumber: number
  status: string
  customerCalled: boolean
  booking: {
    id: string
    bookingNumber: string
    customerName: string
    customerPhone: string | null
    service: {
      name: string
    }
  }
}

interface Booking {
  id: string
  bookingNumber: string
  customerName: string
  status: string
  service: {
    name: string
  }
  measurement: { id: string } | null
  quote: {
    id: string
    status: string
    totalCost: number
  } | null
  progressUpdates: {
    id: string
    status: string
    createdAt: string
  }[]
}

interface TailorDashboardClientProps {
  tailorName: string
  todaysFittings: Fitting[]
  upcomingFittings: Fitting[]
  activeBookings: Booking[]
  stats: {
    totalFittings: number
    completedFittings: number
    totalMeasurements: number
    activePendingBookings: number
  }
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500',
  quote_pending: 'bg-blue-500',
  quote_sent: 'bg-cyan-500',
  quote_approved: 'bg-green-500',
  in_progress: 'bg-purple-500',
  completed: 'bg-gray-500',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  quote_pending: 'Quote Pending',
  quote_sent: 'Quote Sent',
  quote_approved: 'Quote Approved',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export function TailorDashboardClient({
  tailorName,
  todaysFittings,
  upcomingFittings,
  activeBookings,
  stats,
}: TailorDashboardClientProps) {
  const [selectedTab, setSelectedTab] = useState<'today' | 'upcoming' | 'bookings'>('today')

  const getBookingPriority = (booking: Booking) => {
    if (!booking.measurement) {
      return { level: 'high', label: 'Needs Measurement', color: 'text-red-600' }
    }
    if (!booking.quote) {
      return { level: 'high', label: 'Needs Quote', color: 'text-orange-600' }
    }
    if (booking.quote.status === 'draft') {
      return { level: 'medium', label: 'Quote Draft', color: 'text-yellow-600' }
    }
    if (booking.status === 'in_progress') {
      return { level: 'medium', label: 'In Progress', color: 'text-blue-600' }
    }
    return { level: 'low', label: 'On Track', color: 'text-green-600' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {tailorName.split(' ')[0]}!</h1>
        <p className="text-muted-foreground mt-1">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Fittings</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysFittings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {todaysFittings.filter((f) => f.customerCalled).length} customer(s) called
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePendingBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require your attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Measurements</CardTitle>
            <Ruler className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMeasurements}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Recorded by you
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalFittings > 0
                ? Math.round((stats.completedFittings / stats.totalFittings) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.completedFittings} of {stats.totalFittings} fittings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link href="/dashboard/tailor/measurements">
              <Button variant="outline" className="w-full justify-start">
                <Ruler className="mr-2 h-4 w-4" />
                Record Measurements
              </Button>
            </Link>
            <Link href="/dashboard/tailor/fittings">
              <Button variant="outline" className="w-full justify-start">
                <Scissors className="mr-2 h-4 w-4" />
                Manage Fittings
              </Button>
            </Link>
            <Link href="/dashboard/bookings">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View All Bookings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <div className="space-y-4">
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setSelectedTab('today')}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedTab === 'today'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Today's Schedule ({todaysFittings.length})
          </button>
          <button
            onClick={() => setSelectedTab('upcoming')}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedTab === 'upcoming'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Upcoming Fittings ({upcomingFittings.length})
          </button>
          <button
            onClick={() => setSelectedTab('bookings')}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedTab === 'bookings'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Active Bookings ({activeBookings.length})
          </button>
        </div>

        {/* Today's Fittings */}
        {selectedTab === 'today' && (
          <Card>
            <CardHeader>
              <CardTitle>Today's Fitting Appointments</CardTitle>
              <CardDescription>
                {todaysFittings.length === 0
                  ? 'No fittings scheduled for today'
                  : `${todaysFittings.length} appointment${todaysFittings.length !== 1 ? 's' : ''} scheduled`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todaysFittings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No fittings scheduled for today</p>
                  <Link href="/dashboard/tailor/fittings">
                    <Button variant="link" className="mt-2">
                      Schedule a fitting
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysFittings.map((fitting) => (
                    <div
                      key={fitting.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
                          <Clock className="h-5 w-5 text-primary" />
                          <span className="text-xs font-medium mt-1">
                            {fitting.scheduledTime}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{fitting.booking.customerName}</span>
                            {fitting.customerCalled && (
                              <Badge variant="secondary" className="bg-green-500 text-xs">
                                <Phone className="h-3 w-3 mr-1" />
                                Called
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {fitting.booking.service.name} • Fitting #{fitting.fittingNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {fitting.booking.bookingNumber}
                            {fitting.booking.customerPhone && ` • ${fitting.booking.customerPhone}`}
                          </p>
                        </div>
                      </div>
                      <Link href={`/dashboard/bookings/${fitting.booking.id}`}>
                        <Button variant="ghost" size="sm">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upcoming Fittings */}
        {selectedTab === 'upcoming' && (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Fitting Appointments</CardTitle>
              <CardDescription>
                {upcomingFittings.length === 0
                  ? 'No upcoming fittings scheduled'
                  : `Next ${upcomingFittings.length} appointment${upcomingFittings.length !== 1 ? 's' : ''}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingFittings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming fittings scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingFittings.map((fitting) => (
                    <div
                      key={fitting.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center w-16 h-16 bg-secondary rounded-lg">
                          <Calendar className="h-5 w-5" />
                          <span className="text-xs font-medium mt-1">
                            {format(new Date(fitting.scheduledDate), 'MMM d')}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">{fitting.booking.customerName}</span>
                          <p className="text-sm text-muted-foreground">
                            {fitting.booking.service.name} • {fitting.scheduledTime}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {fitting.booking.bookingNumber}
                          </p>
                        </div>
                      </div>
                      <Link href={`/dashboard/bookings/${fitting.booking.id}`}>
                        <Button variant="ghost" size="sm">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                  <Link href="/dashboard/tailor/fittings">
                    <Button variant="outline" className="w-full">
                      View All Fittings
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Active Bookings */}
        {selectedTab === 'bookings' && (
          <Card>
            <CardHeader>
              <CardTitle>Active Bookings</CardTitle>
              <CardDescription>
                Bookings that need your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No active bookings at the moment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBookings.map((booking) => {
                    const priority = getBookingPriority(booking)
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{booking.customerName}</span>
                            <Badge variant="secondary" className={STATUS_COLORS[booking.status]}>
                              {STATUS_LABELS[booking.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {booking.service.name} • {booking.bookingNumber}
                          </p>
                          <div className="flex items-center gap-2">
                            <AlertCircle className={`h-4 w-4 ${priority.color}`} />
                            <span className={`text-sm font-medium ${priority.color}`}>
                              {priority.label}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!booking.measurement && (
                            <Link href={`/dashboard/bookings/${booking.id}/measurement`}>
                              <Button size="sm" variant="outline">
                                <Ruler className="mr-2 h-4 w-4" />
                                Add Measurements
                              </Button>
                            </Link>
                          )}
                          {!booking.quote && booking.measurement && (
                            <Link href={`/dashboard/bookings/${booking.id}/quote/create`}>
                              <Button size="sm" variant="outline">
                                <FileText className="mr-2 h-4 w-4" />
                                Create Quote
                              </Button>
                            </Link>
                          )}
                          <Link href={`/dashboard/bookings/${booking.id}`}>
                            <Button size="sm" variant="ghost">
                              View
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                  <Link href="/dashboard/bookings">
                    <Button variant="outline" className="w-full">
                      View All Bookings
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
