import { Badge } from '@/components/ui/badge'
import type { BookingStatus } from '@/types'

interface BookingStatusBadgeProps {
  status: BookingStatus
  className?: string
}

const statusConfig: Record<BookingStatus, { label: string; variant: any }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  quote_pending: { label: 'Quote Pending', variant: 'secondary' },
  quote_sent: { label: 'Quote Sent', variant: 'default' },
  quote_approved: { label: 'Quote Approved', variant: 'success' },
  quote_rejected: { label: 'Quote Rejected', variant: 'destructive' },
  awaiting_payment: { label: 'Awaiting Payment', variant: 'default' },
  payment_partial: { label: 'Partially Paid', variant: 'default' },
  in_progress: { label: 'In Progress', variant: 'default' },
  awaiting_collection: { label: 'Ready for Pickup', variant: 'success' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  no_show: { label: 'No Show', variant: 'destructive' },
  rescheduled: { label: 'Rescheduled', variant: 'secondary' },
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
