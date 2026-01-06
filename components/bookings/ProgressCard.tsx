import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Clock, Package, ShoppingBag, Cog, CheckCircle2, AlertCircle } from 'lucide-react'
import type { BookingProgress, ProgressStatus } from '@/types'

interface ProgressCardProps {
  update: BookingProgress
  isLatest?: boolean
}

const statusConfig: Record<
  ProgressStatus,
  { label: string; icon: any; variant: any }
> = {
  pending: { label: 'Pending', icon: Clock, variant: 'secondary' },
  material_ordered: { label: 'Materials Ordered', icon: ShoppingBag, variant: 'default' },
  material_received: { label: 'Materials Received', icon: Package, variant: 'default' },
  in_production: { label: 'In Production', icon: Cog, variant: 'default' },
  quality_check: { label: 'Quality Check', icon: AlertCircle, variant: 'default' },
  ready_for_collection: { label: 'Ready', icon: CheckCircle2, variant: 'success' },
  completed: { label: 'Completed', icon: CheckCircle2, variant: 'success' },
}

export function ProgressCard({ update, isLatest = false }: ProgressCardProps) {
  const config = statusConfig[update.status as ProgressStatus] || statusConfig.pending
  const Icon = config.icon

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={config.variant}>{config.label}</Badge>
              {isLatest && (
                <Badge variant="outline" className="text-xs">
                  Latest
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{update.description}</p>
            <p className="text-xs text-gray-500 mt-2">
              {format(new Date(update.created_at), 'MMM d, yyyy h:mm a')}
            </p>
            {update.photos && update.photos.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {update.photos.length} photo{update.photos.length > 1 ? 's' : ''} attached
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
