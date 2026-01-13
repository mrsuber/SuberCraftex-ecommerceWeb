'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Calendar, Phone, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

interface Fitting {
  id: string
  scheduledTime: string
  durationMinutes: number
  customerCalled: boolean
  booking: {
    bookingNumber: string
    customerName: string
    customerPhone: string | null
    service: {
      name: string
    }
  }
}

interface TailorDailyScheduleProps {
  fittings: Fitting[]
}

export function TailorDailySchedule({ fittings: initialFittings }: TailorDailyScheduleProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [fittings, setFittings] = useState(initialFittings)

  const handleMarkCalled = async (fittingId: string) => {
    try {
      const response = await fetch(`/api/fittings/${fittingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerCalled: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to update fitting')
      }

      toast({
        title: 'Success',
        description: 'Marked as customer called',
      })

      // Update local state
      setFittings(
        fittings.map((f) =>
          f.id === fittingId ? { ...f, customerCalled: true } : f
        )
      )

      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update fitting',
        variant: 'destructive',
      })
    }
  }

  const handleMarkCompleted = async (fittingId: string) => {
    if (!confirm('Mark this fitting as completed?')) {
      return
    }

    try {
      const response = await fetch(`/api/fittings/${fittingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attended: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to update fitting')
      }

      toast({
        title: 'Success',
        description: 'Fitting marked as completed',
      })

      // Remove from today's schedule
      setFittings(fittings.filter((f) => f.id !== fittingId))

      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update fitting',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today&apos;s Schedule
        </CardTitle>
        <CardDescription>{format(new Date(), 'EEEE, MMMM d, yyyy')}</CardDescription>
      </CardHeader>
      <CardContent>
        {fittings.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No fittings scheduled for today
          </p>
        ) : (
          <div className="space-y-3">
            {fittings.map((fitting) => (
              <div
                key={fitting.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium">{fitting.booking.customerName}</div>
                  <div className="text-sm text-muted-foreground">
                    {fitting.booking.service.name} • {fitting.booking.bookingNumber}
                  </div>
                  {fitting.booking.customerPhone && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {fitting.booking.customerPhone}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium">{fitting.scheduledTime}</div>
                    <div className="text-xs text-muted-foreground">
                      {fitting.durationMinutes} min
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!fitting.customerCalled && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkCalled(fitting.id)}
                        title="Mark as called"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleMarkCompleted(fitting.id)}
                      title="Mark as completed"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
