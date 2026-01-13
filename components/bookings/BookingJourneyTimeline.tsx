import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Circle,
  Clock,
  FileText,
  CreditCard,
  Ruler,
  Scissors,
  Wrench,
  Package,
} from 'lucide-react'
import { format } from 'date-fns'

interface BookingJourneyTimelineProps {
  booking: any
}

interface TimelineStep {
  id: string
  title: string
  description: string
  icon: any
  status: 'completed' | 'current' | 'upcoming'
  date?: string
}

export function BookingJourneyTimeline({ booking }: BookingJourneyTimelineProps) {
  const steps: TimelineStep[] = []

  // Only show for custom production and collect/repair services
  if (
    booking.serviceType !== 'custom_production' &&
    booking.serviceType !== 'collect_repair'
  ) {
    return null
  }

  // 1. Booking Created
  steps.push({
    id: 'created',
    title: 'Booking Created',
    description: `Created on ${format(new Date(booking.createdAt), 'MMM d, yyyy')}`,
    icon: FileText,
    status: 'completed',
    date: booking.createdAt,
  })

  // 2. Quote
  if (booking.status === 'quote_pending' || booking.status === 'quote_sent') {
    steps.push({
      id: 'quote',
      title: 'Awaiting Quote',
      description: 'We are preparing your custom quote',
      icon: FileText,
      status: 'current',
    })
  } else if (booking.quote) {
    steps.push({
      id: 'quote',
      title: 'Quote Received',
      description: `Quote ${booking.quote.status}`,
      icon: FileText,
      status: booking.quote.status === 'approved' ? 'completed' : 'current',
      date: booking.quote.createdAt,
    })
  }

  // 3. Payment
  const hasDownPayment = booking.payments?.some(
    (p: any) => p.paymentType === 'down_payment' && p.status === 'completed'
  )

  if (booking.status === 'awaiting_payment' || booking.status === 'payment_partial') {
    steps.push({
      id: 'payment',
      title: 'Payment Required',
      description: hasDownPayment ? 'Down payment received' : 'Awaiting payment',
      icon: CreditCard,
      status: 'current',
    })
  } else if (hasDownPayment || booking.status === 'confirmed') {
    steps.push({
      id: 'payment',
      title: 'Payment Received',
      description: 'Down payment confirmed',
      icon: CreditCard,
      status: 'completed',
      date: booking.payments?.find(
        (p: any) => p.paymentType === 'down_payment' && p.status === 'completed'
      )?.createdAt,
    })
  }

  // 4. Measurements
  if (booking.measurement) {
    steps.push({
      id: 'measurement',
      title: 'Measurements Taken',
      description: `Recorded on ${format(new Date(booking.measurement.takenAt), 'MMM d, yyyy')}`,
      icon: Ruler,
      status: 'completed',
      date: booking.measurement.takenAt,
    })
  } else if (booking.status === 'quote_approved' || booking.status === 'in_progress') {
    steps.push({
      id: 'measurement',
      title: 'Measurements',
      description: 'Waiting for tailor to take measurements',
      icon: Ruler,
      status: 'current',
    })
  }

  // 5. Work in Progress
  if (booking.status === 'in_progress') {
    const latestProgress = booking.progressUpdates?.[0]
    steps.push({
      id: 'progress',
      title: 'Work in Progress',
      description: latestProgress?.description || 'Your order is being crafted',
      icon: Wrench,
      status: 'current',
      date: latestProgress?.createdAt,
    })
  } else if (
    booking.status === 'awaiting_collection' ||
    booking.status === 'completed'
  ) {
    steps.push({
      id: 'progress',
      title: 'Work Completed',
      description: 'Crafting finished',
      icon: Wrench,
      status: 'completed',
    })
  }

  // 6. Fittings
  const fittings = booking.fittingAppointments || []
  const upcomingFitting = fittings.find(
    (f: any) =>
      (f.status === 'scheduled' || f.status === 'customer_called') &&
      new Date(f.scheduledDate) >= new Date()
  )
  const completedFittings = fittings.filter((f: any) => f.status === 'completed')

  if (upcomingFitting) {
    steps.push({
      id: 'fitting',
      title: `Fitting #${upcomingFitting.fittingNumber}`,
      description: `Scheduled for ${format(new Date(upcomingFitting.scheduledDate), 'MMM d, yyyy')} at ${upcomingFitting.scheduledTime}`,
      icon: Scissors,
      status: upcomingFitting.customerCalled ? 'current' : 'upcoming',
      date: upcomingFitting.scheduledDate,
    })
  } else if (completedFittings.length > 0) {
    const lastFitting = completedFittings[completedFittings.length - 1]
    steps.push({
      id: 'fitting',
      title: `${completedFittings.length} Fitting${completedFittings.length > 1 ? 's' : ''} Completed`,
      description: `Last fitting on ${format(new Date(lastFitting.attendedAt), 'MMM d, yyyy')}`,
      icon: Scissors,
      status: 'completed',
      date: lastFitting.attendedAt,
    })
  }

  // 7. Ready for Collection
  if (booking.status === 'awaiting_collection') {
    steps.push({
      id: 'collection',
      title: 'Ready for Collection',
      description: 'Your order is ready to be picked up',
      icon: Package,
      status: 'current',
    })
  } else if (booking.status === 'completed') {
    steps.push({
      id: 'collection',
      title: 'Order Collected',
      description: `Completed on ${format(new Date(booking.completedAt), 'MMM d, yyyy')}`,
      icon: Package,
      status: 'completed',
      date: booking.completedAt,
    })
  }

  if (steps.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Journey</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your order from booking to completion
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isLast = index === steps.length - 1

            return (
              <div key={step.id} className="relative pb-8 last:pb-0">
                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={`absolute left-5 top-10 w-0.5 h-full ${
                      step.status === 'completed'
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      step.status === 'completed'
                        ? 'bg-green-500 border-green-500'
                        : step.status === 'current'
                        ? 'bg-primary border-primary'
                        : 'bg-background border-gray-300'
                    }`}
                  >
                    {step.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : step.status === 'current' ? (
                      <Icon className="h-5 w-5 text-white" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{step.title}</h4>
                      {step.status === 'current' && (
                        <Badge variant="default" className="h-5">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
