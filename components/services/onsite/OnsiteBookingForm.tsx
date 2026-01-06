'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PhotoUpload } from '@/components/shared/PhotoUpload'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Clock, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import type { Service } from '@/types'

interface OnsiteBookingFormProps {
  service: Service
  onSubmit: (data: OnsiteBookingData) => void
  isSubmitting?: boolean
}

export interface OnsiteBookingData {
  scheduledDate: Date
  scheduledTime: string
  notes: string
  requirementPhotos: string[]
}

export function OnsiteBookingForm({
  service,
  onSubmit,
  isSubmitting = false,
}: OnsiteBookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [requirementPhotos, setRequirementPhotos] = useState<string[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Memoize today's date to avoid hydration issues
  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  // Generate time slots (9 AM - 5 PM in 30-minute increments)
  const generateTimeSlots = () => {
    const slots: string[] = []
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 17 && minute > 0) break // Stop at 5:00 PM
        const time = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }

  const handleDateSelect = async (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime('')

    if (!date) {
      setAvailableSlots([])
      return
    }

    // Fetch available time slots for the selected date
    setLoadingSlots(true)
    try {
      const response = await fetch(
        `/api/services/${service.id}/availability?date=${format(date, 'yyyy-MM-dd')}`
      )

      if (response.ok) {
        const data = await response.json()
        setAvailableSlots(data.availableSlots || [])
      } else {
        // Fallback to all slots if API fails
        setAvailableSlots(generateTimeSlots())
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
      setAvailableSlots(generateTimeSlots())
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time')
      return
    }

    onSubmit({
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      notes,
      requirementPhotos,
    })
  }

  const isFormValid = selectedDate && selectedTime

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Select Date & Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Calendar */}
          <div>
            <Label>Choose a date</Label>
            <div className="mt-2 border rounded-lg p-4 inline-block">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date < today ||
                  date.getDay() === 0 // Disable Sundays
                }
                className="rounded-md"
              />
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Choose a time slot
              </Label>
              {loadingSlots ? (
                <div className="mt-2 text-sm text-gray-500">Loading available slots...</div>
              ) : availableSlots.length > 0 ? (
                <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={selectedTime === slot ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTime(slot)}
                      className="font-mono"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  No available slots for this date. Please select another date.
                </p>
              )}
            </div>
          )}

          {selectedDate && selectedTime && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm font-medium">
                Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Requirement Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Photos (Optional)</CardTitle>
          <p className="text-sm text-gray-600">
            Share photos of the area or item that needs service
          </p>
        </CardHeader>
        <CardContent>
          <PhotoUpload
            value={requirementPhotos}
            onChange={setRequirementPhotos}
            maxFiles={5}
            type="requirement"
          />
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific requirements or instructions for our team..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={!isFormValid || isSubmitting}
          className="min-w-[200px]"
        >
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </Button>
      </div>
    </form>
  )
}
