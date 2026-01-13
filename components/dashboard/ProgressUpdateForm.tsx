'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { PhotoUpload } from '@/components/shared/PhotoUpload'
import {
  Activity,
  Camera,
  FileText,
  Send,
  Loader2,
  Package,
  ShoppingCart,
  Hammer,
  CheckCircle2,
  Truck,
} from 'lucide-react'

interface ProgressUpdateFormProps {
  bookingId: string
  bookingNumber: string
}

const PROGRESS_STATUSES = [
  { value: 'pending', label: 'Pending', icon: Activity, description: 'Work not yet started' },
  { value: 'material_ordered', label: 'Materials Ordered', icon: ShoppingCart, description: 'Materials have been ordered' },
  { value: 'material_received', label: 'Materials Received', icon: Package, description: 'Materials received and ready' },
  { value: 'in_production', label: 'In Production', icon: Hammer, description: 'Work is actively in progress' },
  { value: 'quality_check', label: 'Quality Check', icon: CheckCircle2, description: 'Final quality inspection' },
  { value: 'ready_for_collection', label: 'Ready for Collection', icon: Truck, description: 'Work complete and ready' },
  { value: 'completed', label: 'Completed', icon: CheckCircle2, description: 'Job fully completed' },
]

export function ProgressUpdateForm({ bookingId, bookingNumber }: ProgressUpdateFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])

  const [formData, setFormData] = useState({
    status: 'in_production',
    description: '',
  })

  const selectedStatus = PROGRESS_STATUSES.find(s => s.value === formData.status)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.description.trim()) {
      toast({
        title: 'Description Required',
        description: 'Please provide a description of the progress',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/bookings/${bookingId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: formData.status,
          description: formData.description,
          photos: photos,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Progress Update Added!',
          description: 'Customer has been notified of the update.',
        })
        router.push(`/dashboard/bookings/${bookingId}`)
        router.refresh()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to add progress update',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error adding progress update:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Progress Status
          </CardTitle>
          <CardDescription>
            Select the current status of the work
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROGRESS_STATUSES.map((status) => {
                  const Icon = status.icon
                  return (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{status.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {status.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {selectedStatus && (
              <p className="text-sm text-muted-foreground mt-2">
                {selectedStatus.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Update Description
          </CardTitle>
          <CardDescription>
            Provide details about the current progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="description"
            placeholder="e.g., All materials have been received. Starting production of the lace overlay. Custom fitting scheduled for next week."
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <p className="text-sm text-muted-foreground mt-2">
            Be specific about what work has been completed and what's coming next
          </p>
        </CardContent>
      </Card>

      {/* Photo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Progress Photos
          </CardTitle>
          <CardDescription>
            Upload photos showing the current progress (optional but recommended)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PhotoUpload
            value={photos}
            onChange={setPhotos}
            maxFiles={5}
            type="progress"
            bookingId={bookingId}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Photos help customers see the quality of work and build trust
          </p>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Update Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            {selectedStatus && <selectedStatus.icon className="h-4 w-4" />}
            <strong>Status:</strong> {selectedStatus?.label}
          </div>
          <div>
            <strong>Booking:</strong> {bookingNumber}
          </div>
          {formData.description && (
            <div className="mt-2 pt-2 border-t">
              <strong>Description:</strong>
              <p className="text-muted-foreground whitespace-pre-wrap mt-1">
                {formData.description}
              </p>
            </div>
          )}
          {photos.length > 0 && (
            <div className="mt-2 pt-2 border-t">
              <strong>Photos:</strong> {photos.length} photo(s) attached
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Update...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Add Progress Update
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
