'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format, addDays, startOfToday } from 'date-fns'
import { ServiceAvailabilityResponse } from '@/types'

interface ServiceCalendarProps {
  serviceId: string
  onDateSelect: (date: Date | undefined) => void
  selectedDate?: Date
}

export function ServiceCalendar({ serviceId, onDateSelect, selectedDate }: ServiceCalendarProps) {
  const [availability, setAvailability] = useState<ServiceAvailabilityResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [availableDates, setAvailableDates] = useState<Date[]>([])

  const fetchAvailability = useCallback(async () => {
    setLoading(true)
    try {
      const today = startOfToday()
      const endDate = addDays(today, 30)

      const params = new URLSearchParams({
        startDate: today.toISOString(),
        endDate: endDate.toISOString(),
      })

      const response = await fetch(`/api/services/${serviceId}/availability?${params}`)
      if (response.ok) {
        const data: ServiceAvailabilityResponse = await response.json()
        setAvailability(data)

        // Convert date strings to Date objects
        const dates = Object.keys(data.availability).map((dateStr) => new Date(dateStr))
        setAvailableDates(dates)
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setLoading(false)
    }
  }, [serviceId])

  // Fetch availability for next 30 days
  useEffect(() => {
    fetchAvailability()
  }, [fetchAvailability])

  // Check if a date has available slots
  const isDateAvailable = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return availability?.availability[dateStr]?.length > 0
  }

  // Disable dates that have no availability
  const disabledDays = (date: Date) => {
    const today = startOfToday()
    if (date < today) return true
    if (date > addDays(today, 30)) return true
    if (!availability) return true
    return !isDateAvailable(date)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Date</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">Loading availability...</p>
          </div>
        ) : (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={disabledDays}
            className="rounded-md border"
            modifiers={{
              available: availableDates,
            }}
            modifiersClassNames={{
              available: 'bg-primary/10 hover:bg-primary/20',
            }}
          />
        )}
        <p className="text-xs text-muted-foreground mt-4">
          Dates with available time slots are highlighted. Select a date to see available times.
        </p>
      </CardContent>
    </Card>
  )
}
