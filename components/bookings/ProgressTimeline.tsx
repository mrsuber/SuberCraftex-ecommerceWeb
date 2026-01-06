import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhotoGallery } from '@/components/shared/PhotoGallery'
import { Badge } from '@/components/ui/badge'
import { Clock, Package, ShoppingBag, Cog, CheckCircle2, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import type { BookingProgress, ProgressStatus } from '@/types'

interface ProgressTimelineProps {
  progressUpdates: BookingProgress[]
  currentStatus?: string
}

const statusConfig: Record<
  ProgressStatus,
  { label: string; icon: any; color: string; bgColor: string }
> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  material_ordered: {
    label: 'Materials Ordered',
    icon: ShoppingBag,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  material_received: {
    label: 'Materials Received',
    icon: Package,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  in_production: {
    label: 'In Production',
    icon: Cog,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  quality_check: {
    label: 'Quality Check',
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  ready_for_collection: {
    label: 'Ready for Collection',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
}

export function ProgressTimeline({ progressUpdates, currentStatus }: ProgressTimelineProps) {
  if (!progressUpdates || progressUpdates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No progress updates yet</p>
            <p className="text-sm mt-1">We'll update you as soon as work begins</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Timeline</CardTitle>
        <p className="text-sm text-gray-600">Track your order's journey</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {progressUpdates.map((update, index) => {
            const config = statusConfig[update.status as ProgressStatus] || statusConfig.pending
            const Icon = config.icon
            const isLatest = index === 0

            return (
              <div key={update.id} className="relative">
                {/* Timeline Line */}
                {index < progressUpdates.length - 1 && (
                  <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-200 -z-10" />
                )}

                <div className="flex gap-4">
                  {/* Status Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{config.label}</h4>
                          {isLatest && (
                            <Badge variant="default" className="text-xs">
                              Latest
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {format(new Date(update.created_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {update.description && (
                      <p className="text-sm text-gray-700 mb-3">{update.description}</p>
                    )}

                    {/* Photos */}
                    {update.photos && update.photos.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Photos ({update.photos.length})
                        </p>
                        <PhotoGallery photos={update.photos} columns={3} />
                      </div>
                    )}
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
