'use client'

import { useState } from 'react'
import { Service } from '@/types'
import { ServiceCalendar } from './ServiceCalendar'
import { ServiceTimeSlots } from './ServiceTimeSlots'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Calendar, Clock, DollarSign, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

interface ServiceBookingFormProps {
  service: Service
}

export function ServiceBookingForm({ service }: ServiceBookingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerNotes, setCustomerNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Missing Information',
        description: 'Please select a date and time for your booking.',
        variant: 'destructive',
      })
      return
    }

    if (!customerName || !customerEmail) {
      toast({
        title: 'Missing Information',
        description: 'Please provide your name and email.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      // Add to cart
      const response = await fetch('/api/cart/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service.id,
          scheduledDate: selectedDate.toISOString(),
          scheduledTime: selectedTime,
          customerNotes,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Added to Cart',
          description: 'Service booking has been added to your cart.',
        })
        router.push('/cart')
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to add service to cart.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error booking service:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      {(selectedDate || selectedTime) && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
              </div>
            )}
            {selectedTime && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{selectedTime}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm font-semibold pt-2 border-t">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>{formatCurrency(service.price)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Date Selection */}
      <ServiceCalendar
        serviceId={service.id}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      {/* Time Selection */}
      {selectedDate && (
        <ServiceTimeSlots
          serviceId={service.id}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
        />
      )}

      {/* Customer Information */}
      {selectedDate && selectedTime && (
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>
              We'll send booking confirmation to your email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Special Requests (Optional)</Label>
                <Textarea
                  id="notes"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Any specific requirements or preferences..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  'Add to Cart'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
