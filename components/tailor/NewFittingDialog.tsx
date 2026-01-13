'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useToast } from '@/hooks/use-toast'
import { Calendar as CalendarIcon, Loader2, Plus, Search } from 'lucide-react'
import { format } from 'date-fns'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

interface Booking {
  id: string
  bookingNumber: string
  customerName: string
  customerEmail: string
  service: {
    name: string
  }
  status: string
}

export function NewFittingDialog() {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [bookingSearchOpen, setBookingSearchOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    scheduledTime: '',
    durationMinutes: 30,
    notes: '',
  })

  // Fetch active bookings when dialog opens
  useEffect(() => {
    if (open) {
      fetchBookings()
    }
  }, [open])

  const fetchBookings = async () => {
    setLoadingBookings(true)
    try {
      const response = await fetch('/api/bookings')
      if (response.ok) {
        const data = await response.json()
        // Filter bookings that can have fittings (active statuses)
        const activeBookings = data.filter((b: Booking) =>
          ['quote_approved', 'in_progress', 'quote_pending', 'pending', 'quote_sent'].includes(b.status)
        )
        setBookings(activeBookings)
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoadingBookings(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedBooking) {
      toast({
        title: 'Error',
        description: 'Please select a booking',
        variant: 'destructive',
      })
      return
    }

    if (!date) {
      toast({
        title: 'Error',
        description: 'Please select a date',
        variant: 'destructive',
      })
      return
    }

    if (!formData.scheduledTime) {
      toast({
        title: 'Error',
        description: 'Please enter a time',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/fittings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          scheduledDate: date.toISOString(),
          scheduledTime: formData.scheduledTime,
          durationMinutes: formData.durationMinutes,
          notes: formData.notes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to schedule fitting')
      }

      toast({
        title: 'Success',
        description: `Fitting appointment scheduled for ${selectedBooking.customerName}`,
      })

      // Reset form
      setSelectedBooking(null)
      setDate(undefined)
      setFormData({
        scheduledTime: '',
        durationMinutes: 30,
        notes: '',
      })

      setOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to schedule fitting',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule New Fitting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Schedule New Fitting Appointment</DialogTitle>
          <DialogDescription>
            Select a booking and schedule a fitting appointment for the customer
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Booking Selection */}
          <div className="space-y-2">
            <Label>Select Booking *</Label>
            <Popover open={bookingSearchOpen} onOpenChange={setBookingSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={bookingSearchOpen}
                  className="w-full justify-between"
                >
                  {selectedBooking ? (
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{selectedBooking.bookingNumber}</span>
                      <span className="text-muted-foreground">•</span>
                      <span>{selectedBooking.customerName}</span>
                    </span>
                  ) : (
                    'Select booking...'
                  )}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-0">
                <Command>
                  <CommandInput placeholder="Search bookings..." />
                  <CommandList>
                    <CommandEmpty>
                      {loadingBookings ? 'Loading bookings...' : 'No active bookings found.'}
                    </CommandEmpty>
                    <CommandGroup>
                      {bookings.map((booking) => (
                        <CommandItem
                          key={booking.id}
                          value={`${booking.bookingNumber} ${booking.customerName} ${booking.customerEmail}`}
                          onSelect={() => {
                            setSelectedBooking(booking)
                            setBookingSearchOpen(false)
                          }}
                        >
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{booking.bookingNumber}</span>
                              <span className="text-xs text-muted-foreground">
                                {booking.service.name}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {booking.customerName} • {booking.customerEmail}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Input */}
          <div className="space-y-2">
            <Label htmlFor="time">Time *</Label>
            <Input
              id="time"
              type="time"
              value={formData.scheduledTime}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, scheduledTime: e.target.value }))
              }
              required
            />
          </div>

          {/* Duration Select */}
          <div className="space-y-2">
            <Label>Duration</Label>
            <Select
              value={formData.durationMinutes.toString()}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, durationMinutes: parseInt(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Any special notes for this fitting..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Schedule Fitting
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
