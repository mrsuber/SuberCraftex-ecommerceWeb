'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
  User,
  Send,
  Bug,
  Lightbulb,
  TrendingUp,
  MessageCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface FeedbackResponse {
  id: string
  responderId: string
  message: string
  isInternal: boolean
  createdAt: string
}

interface Feedback {
  id: string
  type: string
  subject: string
  message: string
  screenshots: string[]
  status: string
  priority: string
  appVersion: string | null
  deviceInfo: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  investor: {
    id: string
    fullName: string
    email: string
    investorNumber: string
  }
  adminResponses: FeedbackResponse[]
}

interface StatusCounts {
  pending: number
  under_review: number
  in_progress: number
  resolved: number
  closed: number
}

interface FeedbackDashboardClientProps {
  initialFeedback: Feedback[]
  statusCounts: StatusCounts
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'bug_report':
      return <Bug className="h-4 w-4" />
    case 'feature_request':
      return <Lightbulb className="h-4 w-4" />
    case 'improvement':
      return <TrendingUp className="h-4 w-4" />
    case 'complaint':
      return <AlertTriangle className="h-4 w-4" />
    default:
      return <MessageCircle className="h-4 w-4" />
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'bug_report':
      return 'Bug Report'
    case 'feature_request':
      return 'Feature Request'
    case 'improvement':
      return 'Improvement'
    case 'complaint':
      return 'Complaint'
    default:
      return 'General'
  }
}

const getTypeBadgeVariant = (type: string) => {
  switch (type) {
    case 'bug_report':
      return 'destructive'
    case 'feature_request':
      return 'default'
    case 'improvement':
      return 'secondary'
    case 'complaint':
      return 'destructive'
    default:
      return 'outline'
  }
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'pending':
      return 'outline'
    case 'under_review':
      return 'default'
    case 'in_progress':
      return 'secondary'
    case 'resolved':
      return 'default'
    case 'closed':
      return 'outline'
    default:
      return 'outline'
  }
}

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'destructive'
    case 'high':
      return 'destructive'
    case 'medium':
      return 'secondary'
    case 'low':
      return 'outline'
    default:
      return 'outline'
  }
}

export default function FeedbackDashboardClient({
  initialFeedback,
  statusCounts,
}: FeedbackDashboardClientProps) {
  const router = useRouter()
  const [feedback, setFeedback] = useState<Feedback[]>(initialFeedback)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [newStatus, setNewStatus] = useState<string>('')
  const [processing, setProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  const filteredFeedback = feedback.filter(f => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return ['pending', 'under_review', 'in_progress'].includes(f.status)
    return f.status === activeTab
  })

  const handleReply = async () => {
    if (!selectedFeedback || !replyMessage.trim()) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/feedback/${selectedFeedback.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: replyMessage,
          isInternal,
          updateStatus: newStatus || undefined,
        }),
      })

      if (!response.ok) throw new Error('Failed to send reply')

      const updated = await response.json()

      // Update feedback in list
      setFeedback(prev => prev.map(f => f.id === updated.id ? {
        ...updated,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        resolvedAt: updated.resolvedAt,
        adminResponses: updated.adminResponses.map((r: any) => ({
          ...r,
          createdAt: r.createdAt,
        })),
      } : f))

      setSelectedFeedback({
        ...updated,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        resolvedAt: updated.resolvedAt,
        adminResponses: updated.adminResponses.map((r: any) => ({
          ...r,
          createdAt: r.createdAt,
        })),
      })

      setReplyMessage('')
      setIsInternal(false)
      setNewStatus('')
    } catch (error) {
      console.error('Failed to send reply:', error)
    } finally {
      setProcessing(false)
    }
  }

  const handleStatusChange = async (feedbackId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      const updated = await response.json()
      setFeedback(prev => prev.map(f => f.id === updated.id ? {
        ...updated,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        resolvedAt: updated.resolvedAt,
        adminResponses: updated.adminResponses.map((r: any) => ({
          ...r,
          createdAt: r.createdAt,
        })),
      } : f))

      if (selectedFeedback?.id === feedbackId) {
        setSelectedFeedback({
          ...updated,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
          resolvedAt: updated.resolvedAt,
          adminResponses: updated.adminResponses.map((r: any) => ({
            ...r,
            createdAt: r.createdAt,
          })),
        })
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handlePriorityChange = async (feedbackId: string, priority: string) => {
    try {
      const response = await fetch(`/api/admin/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority }),
      })

      if (!response.ok) throw new Error('Failed to update priority')

      const updated = await response.json()
      setFeedback(prev => prev.map(f => f.id === updated.id ? {
        ...updated,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        resolvedAt: updated.resolvedAt,
        adminResponses: updated.adminResponses.map((r: any) => ({
          ...r,
          createdAt: r.createdAt,
        })),
      } : f))
    } catch (error) {
      console.error('Failed to update priority:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Investor Feedback</h1>
        <p className="text-muted-foreground">
          Manage feedback, suggestions, and bug reports from investors
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.under_review}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Loader2 className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.in_progress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <XCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.closed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({feedback.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({feedback.filter(f => ['pending', 'under_review', 'in_progress'].includes(f.status)).length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({statusCounts.resolved})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredFeedback.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No feedback found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((item) => (
                <Card key={item.id} className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setSelectedFeedback(item)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(item.type)}
                          <span className="font-semibold truncate">{item.subject}</span>
                          <Badge variant={getTypeBadgeVariant(item.type) as any}>
                            {getTypeLabel(item.type)}
                          </Badge>
                          <Badge variant={getPriorityBadgeVariant(item.priority) as any}>
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {item.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.investor.fullName} ({item.investor.investorNumber})
                          </span>
                          <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                          {item.adminResponses.length > 0 && (
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {item.adminResponses.length} {item.adminResponses.length === 1 ? 'reply' : 'replies'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={getStatusBadgeVariant(item.status) as any}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedFeedback(item); }}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Feedback Detail Dialog */}
      <Dialog open={!!selectedFeedback} onOpenChange={(open) => !open && setSelectedFeedback(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedFeedback && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getTypeIcon(selectedFeedback.type)}
                  {selectedFeedback.subject}
                </DialogTitle>
                <DialogDescription>
                  View and respond to investor feedback
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Investor Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{selectedFeedback.investor.fullName}</p>
                        <p className="text-sm text-muted-foreground">{selectedFeedback.investor.email}</p>
                        <p className="text-xs text-muted-foreground">{selectedFeedback.investor.investorNumber}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getTypeBadgeVariant(selectedFeedback.type) as any}>
                          {getTypeLabel(selectedFeedback.type)}
                        </Badge>
                        <Badge variant={getPriorityBadgeVariant(selectedFeedback.priority) as any}>
                          {selectedFeedback.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Status & Priority Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={selectedFeedback.status}
                      onValueChange={(value) => handleStatusChange(selectedFeedback.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select
                      value={selectedFeedback.priority}
                      onValueChange={(value) => handlePriorityChange(selectedFeedback.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Original Message */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>
                      Submitted {formatDistanceToNow(new Date(selectedFeedback.createdAt), { addSuffix: true })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{selectedFeedback.message}</p>
                    {selectedFeedback.appVersion && (
                      <p className="text-xs text-muted-foreground mt-2">App Version: {selectedFeedback.appVersion}</p>
                    )}
                    {selectedFeedback.deviceInfo && (
                      <p className="text-xs text-muted-foreground">Device: {selectedFeedback.deviceInfo}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Screenshots */}
                {selectedFeedback.screenshots.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Attachments</Label>
                    <div className="flex gap-2 flex-wrap">
                      {selectedFeedback.screenshots.map((url, index) => (
                        <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt={`Screenshot ${index + 1}`} className="h-20 w-20 object-cover rounded border" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conversation Thread */}
                {selectedFeedback.adminResponses.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Conversation</Label>
                    <div className="space-y-3">
                      {selectedFeedback.adminResponses.map((response) => (
                        <Card key={response.id} className={response.isInternal ? 'bg-yellow-50 border-yellow-200' : ''}>
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={response.isInternal ? 'outline' : 'default'} className="text-xs">
                                {response.isInternal ? 'Internal Note' : 'Admin Reply'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(response.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reply Form */}
                <div className="border-t pt-4">
                  <Label className="mb-2 block">Add Reply</Label>
                  <Textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your response..."
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="rounded"
                      />
                      Internal note (not visible to investor)
                    </label>
                    <div className="flex items-center gap-2">
                      <Select value={newStatus || "no_change"} onValueChange={(val) => setNewStatus(val === "no_change" ? "" : val)}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Update status..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_change">No change</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleReply} disabled={processing || !replyMessage.trim()}>
                        {processing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
