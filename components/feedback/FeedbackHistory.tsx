'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { format } from 'date-fns'
import {
  Bug,
  Lightbulb,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Video,
  ChevronRight,
  MessageCircle,
} from 'lucide-react'

interface FeedbackResponse {
  id: string
  message: string
  createdAt: string
}

interface Feedback {
  id: string
  type: string
  subject: string
  message: string
  screenshots: string[]
  videos: string[]
  status: string
  priority: string
  createdAt: string
  resolvedAt: string | null
  adminResponses: FeedbackResponse[]
}

interface FeedbackHistoryProps {
  feedback: Feedback[]
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  bug_report: { icon: Bug, label: 'Bug Report', color: 'text-red-600 bg-red-50' },
  feature_request: { icon: Lightbulb, label: 'Feature Request', color: 'text-yellow-600 bg-yellow-50' },
  improvement: { icon: TrendingUp, label: 'Improvement', color: 'text-blue-600 bg-blue-50' },
  general: { icon: MessageSquare, label: 'General', color: 'text-gray-600 bg-gray-50' },
  complaint: { icon: AlertTriangle, label: 'Complaint', color: 'text-orange-600 bg-orange-50' },
}

const STATUS_CONFIG: Record<string, { icon: React.ElementType; label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { icon: Clock, label: 'Pending', variant: 'secondary' },
  under_review: { icon: MessageCircle, label: 'Under Review', variant: 'outline' },
  in_progress: { icon: TrendingUp, label: 'In Progress', variant: 'default' },
  resolved: { icon: CheckCircle, label: 'Resolved', variant: 'default' },
  closed: { icon: XCircle, label: 'Closed', variant: 'secondary' },
}

export function FeedbackHistory({ feedback }: FeedbackHistoryProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)

  if (feedback.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Feedback Yet</h3>
          <p className="text-muted-foreground">
            You haven't submitted any feedback yet. Use the "Send Feedback" tab to share your thoughts.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {feedback.map((item) => {
          const typeConfig = TYPE_CONFIG[item.type] || TYPE_CONFIG.general
          const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending
          const TypeIcon = typeConfig.icon
          const StatusIcon = statusConfig.icon
          const hasMedia = item.screenshots.length > 0 || item.videos.length > 0
          const hasResponses = item.adminResponses.length > 0

          return (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedFeedback(item)}
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div className={`p-1.5 rounded ${typeConfig.color}`}>
                        <TypeIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs text-muted-foreground">{typeConfig.label}</span>
                      <Badge variant={statusConfig.variant} className="text-xs">
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                      {hasMedia && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {item.screenshots.length > 0 && (
                            <span className="flex items-center gap-0.5">
                              <ImageIcon className="w-3 h-3" /> {item.screenshots.length}
                            </span>
                          )}
                          {item.videos.length > 0 && (
                            <span className="flex items-center gap-0.5">
                              <Video className="w-3 h-3" /> {item.videos.length}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium truncate">{item.subject}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{format(new Date(item.createdAt), 'MMM d, yyyy')}</span>
                      {hasResponses && (
                        <span className="flex items-center gap-1 text-primary">
                          <MessageCircle className="w-3 h-3" />
                          {item.adminResponses.length} response{item.adminResponses.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedFeedback && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const config = TYPE_CONFIG[selectedFeedback.type] || TYPE_CONFIG.general
                    const Icon = config.icon
                    return (
                      <div className={`p-1.5 rounded ${config.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    )
                  })()}
                  <Badge variant={STATUS_CONFIG[selectedFeedback.status]?.variant || 'secondary'}>
                    {STATUS_CONFIG[selectedFeedback.status]?.label || selectedFeedback.status}
                  </Badge>
                </div>
                <DialogTitle>{selectedFeedback.subject}</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Submitted on {format(new Date(selectedFeedback.createdAt), 'MMMM d, yyyy h:mm a')}
                </p>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Message */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Your Message</h4>
                  <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">
                    {selectedFeedback.message}
                  </div>
                </div>

                {/* Screenshots */}
                {selectedFeedback.screenshots.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Screenshots ({selectedFeedback.screenshots.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedFeedback.screenshots.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block aspect-video relative rounded-lg overflow-hidden border hover:opacity-90"
                        >
                          <img
                            src={url}
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {selectedFeedback.videos.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Videos ({selectedFeedback.videos.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedFeedback.videos.map((url, index) => (
                        <video
                          key={index}
                          src={url}
                          controls
                          className="w-full rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Responses */}
                {selectedFeedback.adminResponses.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Responses</h4>
                    <div className="space-y-3">
                      {selectedFeedback.adminResponses.map((response) => (
                        <div key={response.id} className="p-4 bg-primary/5 border-l-2 border-primary rounded-r-lg">
                          <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(new Date(response.createdAt), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resolved date */}
                {selectedFeedback.resolvedAt && (
                  <p className="text-sm text-muted-foreground">
                    Resolved on {format(new Date(selectedFeedback.resolvedAt), 'MMMM d, yyyy')}
                  </p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
