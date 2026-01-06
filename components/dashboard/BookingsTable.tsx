'use client'

import { useState } from 'react'
import { ServiceBooking, BookingStatus } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Eye, MoreHorizontal, Search, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface BookingsTableProps {
  initialBookings: ServiceBooking[]
}

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  in_progress: 'bg-purple-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
  no_show: 'bg-gray-500',
  rescheduled: 'bg-orange-500',
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
  rescheduled: 'Rescheduled',
}

export function BookingsTable({ initialBookings }: BookingsTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<ServiceBooking[]>(initialBookings)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = search
      ? booking.booking_number.toLowerCase().includes(search.toLowerCase()) ||
        booking.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        booking.customer_email.toLowerCase().includes(search.toLowerCase()) ||
        booking.service?.name.toLowerCase().includes(search.toLowerCase())
      : true

    const matchesStatus = statusFilter ? booking.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Booking status updated successfully',
        })
        setBookings(
          bookings.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        )
        router.refresh()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to update booking status',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no_show">No Show</SelectItem>
            <SelectItem value="rescheduled">Rescheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking #</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.booking_number}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{booking.service?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.service?.sku}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{booking.customer_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.customer_email}
                      </div>
                      {booking.customer_phone && (
                        <div className="text-sm text-muted-foreground">
                          {booking.customer_phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="space-y-1">
                        <div className="text-sm">
                          {format(new Date(booking.scheduled_date), 'MMM d, yyyy')}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {booking.scheduled_time}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{booking.duration} min</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${booking.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={STATUS_COLORS[booking.status]}
                    >
                      {STATUS_LABELS[booking.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/bookings/${booking.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                        >
                          Mark as Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(booking.id, 'in_progress')}
                        >
                          Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(booking.id, 'completed')}
                        >
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="text-destructive"
                        >
                          Mark as Cancelled
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(booking.id, 'no_show')}
                          className="text-destructive"
                        >
                          Mark as No Show
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
