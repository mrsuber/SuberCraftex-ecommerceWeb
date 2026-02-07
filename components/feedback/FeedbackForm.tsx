'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MediaUpload } from '@/components/shared/MediaUpload'
import { toast } from 'sonner'
import { Loader2, Send, Bug, Lightbulb, TrendingUp, MessageSquare, AlertTriangle } from 'lucide-react'

interface FeedbackFormProps {
  userId?: string
  userEmail?: string
  userName?: string
  onSuccess?: () => void
  compact?: boolean
}

const FEEDBACK_TYPES = [
  { value: 'bug_report', label: 'Bug Report', icon: Bug, description: 'Report a problem or error' },
  { value: 'feature_request', label: 'Feature Request', icon: Lightbulb, description: 'Suggest a new feature' },
  { value: 'improvement', label: 'Improvement', icon: TrendingUp, description: 'Suggest an improvement' },
  { value: 'general', label: 'General Feedback', icon: MessageSquare, description: 'General comments or questions' },
  { value: 'complaint', label: 'Complaint', icon: AlertTriangle, description: 'Report an issue or concern' },
]

export function FeedbackForm({
  userId,
  userEmail,
  userName,
  onSuccess,
  compact = false,
}: FeedbackFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [type, setType] = useState<string>('general')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim()) {
      toast.error('Please enter a subject')
      return
    }

    if (!message.trim()) {
      toast.error('Please enter your feedback message')
      return
    }

    setIsSubmitting(true)

    try {
      // Get device and browser info
      const deviceInfo = `${navigator.userAgent}`
      const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          subject: subject.trim(),
          message: message.trim(),
          screenshots,
          videos,
          appVersion,
          deviceInfo,
          userEmail,
          userName,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit feedback')
      }

      toast.success('Feedback submitted successfully! Thank you for your input.')

      // Reset form
      setType('general')
      setSubject('')
      setMessage('')
      setScreenshots([])
      setVideos([])

      onSuccess?.()
      router.refresh()
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit feedback')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedType = FEEDBACK_TYPES.find(t => t.value === type)

  return (
    <Card className={compact ? '' : 'max-w-2xl mx-auto'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Send Feedback
        </CardTitle>
        <CardDescription>
          Help us improve by sharing your thoughts, reporting issues, or suggesting new features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type */}
          <div className="space-y-2">
            <Label>Feedback Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {FEEDBACK_TYPES.map((feedbackType) => {
                const Icon = feedbackType.icon
                const isSelected = type === feedbackType.value
                return (
                  <button
                    key={feedbackType.value}
                    type="button"
                    onClick={() => setType(feedbackType.value)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                      <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                        {feedbackType.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{feedbackType.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={
                type === 'bug_report'
                  ? 'Brief description of the issue'
                  : type === 'feature_request'
                  ? 'What feature would you like?'
                  : 'What is this about?'
              }
              disabled={isSubmitting}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Details *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                type === 'bug_report'
                  ? 'Please describe the issue in detail. Include steps to reproduce if possible.'
                  : type === 'feature_request'
                  ? 'Describe the feature you would like and how it would help you.'
                  : 'Share your thoughts, suggestions, or concerns...'
              }
              rows={5}
              disabled={isSubmitting}
            />
          </div>

          {/* Media Upload */}
          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <p className="text-sm text-gray-500 mb-2">
              Add screenshots or videos to help us understand your feedback better
            </p>
            <MediaUpload
              images={screenshots}
              videos={videos}
              onImagesChange={setScreenshots}
              onVideosChange={setVideos}
              maxImages={5}
              maxVideos={2}
              maxImageSizeInMB={5}
              maxVideoSizeInMB={50}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !subject.trim() || !message.trim()}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Feedback
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Your feedback helps us improve the platform for everyone
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
