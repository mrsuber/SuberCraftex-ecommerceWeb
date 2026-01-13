import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Scissors, Calendar, Clock, Phone, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'

interface FittingAppointment {
  id: string
  scheduledDate: string
  scheduledTime: string
  durationMinutes: number
  fittingNumber: number
  status: string
  customerCalled: boolean
  calledAt: string | null
  attended: boolean | null
  attendedAt: string | null
  notes: string | null
}

interface FittingAppointmentsDisplayProps {
  fittings: FittingAppointment[]
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-500',
  customer_called: 'bg-cyan-500',
  completed: 'bg-green-500',
  no_show: 'bg-red-500',
  rescheduled: 'bg-yellow-500',
  cancelled: 'bg-gray-500',
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Scheduled',
  customer_called: 'We Called You',
  completed: 'Completed',
  no_show: 'Missed',
  rescheduled: 'Rescheduled',
  cancelled: 'Cancelled',
}

export function FittingAppointmentsDisplay({
  fittings,
}: FittingAppointmentsDisplayProps) {
  if (fittings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Fitting Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Scissors className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No fitting appointments scheduled yet</p>
            <p className="text-sm mt-1">
              Your tailor will schedule a fitting when your garment is ready
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort fittings by number
  const sortedFittings = [...fittings].sort(
    (a, b) => a.fittingNumber - b.fittingNumber
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          Fitting Appointments
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {fittings.length} fitting{fittings.length !== 1 ? 's' : ''} scheduled
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedFittings.map((fitting) => {
          const isPast = new Date(fitting.scheduledDate) < new Date()
          const isUpcoming = !isPast && fitting.status === 'scheduled'

          return (
            <div
              key={fitting.id}
              className={`p-4 border-2 rounded-lg ${
                isUpcoming
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-muted/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">
                      {fitting.fittingNumber}
                      {fitting.fittingNumber === 1
                        ? 'st'
                        : fitting.fittingNumber === 2
                        ? 'nd'
                        : fitting.fittingNumber === 3
                        ? 'rd'
                        : 'th'}{' '}
                      Fitting
                    </h4>
                    <Badge
                      variant="secondary"
                      className={STATUS_COLORS[fitting.status]}
                    >
                      {STATUS_LABELS[fitting.status]}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {/* Date & Time */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {format(new Date(fitting.scheduledDate), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {fitting.scheduledTime} ({fitting.durationMinutes} minutes)
                  </span>
                </div>

                {/* Called Status */}
                {fitting.customerCalled && fitting.calledAt && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Phone className="h-4 w-4" />
                    <span>
                      We called you on{' '}
                      {format(new Date(fitting.calledAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}

                {/* Attendance Status */}
                {fitting.attended === true && fitting.attendedAt && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>
                      Attended on{' '}
                      {format(new Date(fitting.attendedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}

                {fitting.attended === false && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span>Missed appointment</span>
                  </div>
                )}

                {/* Notes */}
                {fitting.notes && (
                  <div className="mt-3 p-3 bg-background border rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Notes:
                    </p>
                    <p className="text-sm">{fitting.notes}</p>
                  </div>
                )}

                {/* Upcoming Reminder */}
                {isUpcoming && (
                  <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm font-medium text-primary">
                      Please arrive on time for your fitting appointment.
                      {!fitting.customerCalled &&
                        ' We will call you to confirm closer to the date.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
