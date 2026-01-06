'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format, addDays } from 'date-fns'
import { Clock, Loader2 } from 'lucide-react'
import { ServiceAvailabilityResponse } from '@/types'

interface ServiceTimeSlotsProps {
  serviceId: string
  selectedDate: Date
  selectedTime?: string
  onTimeSelect: (time: string) => void
}

export function ServiceTimeSlots({
  serviceId,
  selectedDate,
  selectedTime,
  onTimeSelect,
}: ServiceTimeSlotsProps) {
  const [availability, setAvailability] = useState<ServiceAvailabilityResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [timeSlots, setTimeSlots] = useState<string[]>([])

  const fetchAvailability = useCallback(async () => {
    setLoading(true)
    try {
      const endDate = addDays(selectedDate, 1)

      const params = new URLSearchParams({
        startDate: selectedDate.toISOString(),
        endDate: endDate.toISOString(),
      })

      const response = await fetch(`/api/services/${serviceId}/availability?${params}`)
      if (response.ok) {
        const data: ServiceAvailabilityResponse = await response.json()
        setAvailability(data)

        const dateStr = format(selectedDate, 'yyyy-MM-dd')
        const slots = data.availability[dateStr] || []
        setTimeSlots(slots)
      }
    } catch (error) {
      console.error('Error fetching time slots:', error)
    } finally {
      setLoading(false)
    }
  }, [serviceId, selectedDate])

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability()
    }
  }, [selectedDate, fetchAvailability])

  // Group time slots into morning, afternoon, evening
  const groupTimeSlots = () => {
    const morning: string[] = []
    const afternoon: string[] = []
    const evening: string[] = []

    timeSlots.forEach((time) => {
      const [hours] = time.split(':').map(Number)
      if (hours < 12) {
        morning.push(time)
      } else if (hours < 17) {
        afternoon.push(time)
      } else {
        evening.push(time)
      }
    })

    return { morning, afternoon, evening }
  }

  const { morning, afternoon, evening } = groupTimeSlots()

  const renderTimeSlotGroup = (label: string, slots: string[]) => {
    if (slots.length === 0) return null

    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeSelect(time)}
              className="w-full"
            >
              {time}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Available Times
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : timeSlots.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No available time slots for this date.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availability && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">
                  Duration: {availability.durationMinutes} min
                </Badge>
                {availability.bufferTime > 0 && (
                  <Badge variant="outline">
                    Buffer: {availability.bufferTime} min
                  </Badge>
                )}
              </div>
            )}

            {renderTimeSlotGroup('Morning', morning)}
            {renderTimeSlotGroup('Afternoon', afternoon)}
            {renderTimeSlotGroup('Evening', evening)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
