'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, MoreHorizontal, Phone, CheckCircle, XCircle, Calendar, Clock, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { RescheduleFittingDialog } from './RescheduleFittingDialog'

interface Fitting {
  id: string
  bookingId: string
  scheduledDate: string
  scheduledTime: string
  durationMinutes: number
  fittingNumber: number
  status: string
  customerCalled: boolean
  calledAt: string | null
  attended: boolean | null
  attendedAt: string | null
  notes: string | null
  booking: {
    id: string
    bookingNumber: string
    customerName: string
    customerEmail: string
    customerPhone: string | null
    service: {
      name: string
    }
  }
}

interface FittingsTableProps {
  initialFittings: Fitting[]
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-500',
  customer_called: 'bg-cyan-500',
  completed: 'bg-green-500',
  no_show: 'bg-red-500',
  rescheduled: 'bg-yellow-500',
  cancelled: 'bg-gray-500',
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Scheduled',
  customer_called: 'Customer Called',
  completed: 'Completed',
  no_show: 'No Show',
  rescheduled: 'Rescheduled',
  cancelled: 'Cancelled',
}

export function FittingsTable({ initialFittings }: FittingsTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [fittings, setFittings] = useState<Fitting[]>(initialFittings)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const filteredFittings = fittings.filter((fitting) => {
    const matchesSearch = search
      ? fitting.booking.customerName.toLowerCase().includes(search.toLowerCase()) ||
        fitting.booking.bookingNumber.toLowerCase().includes(search.toLowerCase())
      : true

    const matchesStatus = statusFilter ? fitting.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

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

      setFittings(
        fittings.map((f) =>
          f.id === fittingId
            ? { ...f, customerCalled: true, status: 'customer_called' }
            : f
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

  const handleMarkAttended = async (fittingId: string, attended: boolean) => {
    try {
      const response = await fetch(`/api/fittings/${fittingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attended }),
      })

      if (!response.ok) {
        throw new Error('Failed to update fitting')
      }

      toast({
        title: 'Success',
        description: attended ? 'Marked as completed' : 'Marked as no show',
      })

      setFittings(
        fittings.map((f) =>
          f.id === fittingId
            ? {
                ...f,
                attended,
                status: attended ? 'completed' : 'no_show',
              }
            : f
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

  const handleCancel = async (fittingId: string) => {
    if (!confirm('Are you sure you want to cancel this fitting?')) {
      return
    }

    try {
      const response = await fetch(`/api/fittings/${fittingId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to cancel fitting')
      }

      toast({
        title: 'Success',
        description: 'Fitting cancelled',
      })

      setFittings(
        fittings.map((f) =>
          f.id === fittingId ? { ...f, status: 'cancelled' } : f
        )
      )
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel fitting',
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
            placeholder="Search by customer name or booking number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="customer_called">Customer Called</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="no_show">No Show</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Fitting #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFittings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No fittings found
                </TableCell>
              </TableRow>
            ) : (
              filteredFittings.map((fitting) => (
                <TableRow key={fitting.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/bookings/${fitting.bookingId}`}
                      className="hover:underline"
                    >
                      {fitting.booking.bookingNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{fitting.booking.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {fitting.booking.customerEmail}
                      </div>
                      {fitting.booking.customerPhone && (
                        <div className="text-sm text-muted-foreground">
                          {fitting.booking.customerPhone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{fitting.booking.service.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="space-y-1">
                        <div className="text-sm flex items-center gap-2">
                          {format(new Date(fitting.scheduledDate), 'MMM d, yyyy')}
                          {fitting.notes && (
                            <span title="Has notes">
                              <FileText className="h-3 w-3 text-blue-500" />
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {fitting.scheduledTime} ({fitting.durationMinutes} min)
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {fitting.fittingNumber}
                      {fitting.fittingNumber === 1
                        ? 'st'
                        : fitting.fittingNumber === 2
                        ? 'nd'
                        : fitting.fittingNumber === 3
                        ? 'rd'
                        : 'th'}{' '}
                      fitting
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={STATUS_COLORS[fitting.status]}>
                      {STATUS_LABELS[fitting.status]}
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
                        {!fitting.customerCalled && fitting.status === 'scheduled' && (
                          <DropdownMenuItem
                            onClick={() => handleMarkCalled(fitting.id)}
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Mark as Called
                          </DropdownMenuItem>
                        )}
                        {fitting.customerCalled &&
                          fitting.attended === null &&
                          fitting.status !== 'cancelled' && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleMarkAttended(fitting.id, true)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Attended
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleMarkAttended(fitting.id, false)}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Mark as No Show
                              </DropdownMenuItem>
                            </>
                          )}
                        {fitting.status !== 'completed' &&
                          fitting.status !== 'cancelled' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <RescheduleFittingDialog
                                  fittingId={fitting.id}
                                  currentDate={fitting.scheduledDate}
                                  currentTime={fitting.scheduledTime}
                                  currentDuration={fitting.durationMinutes}
                                  currentNotes={fitting.notes}
                                  customerName={fitting.booking.customerName}
                                  bookingNumber={fitting.booking.bookingNumber}
                                  trigger={
                                    <div className="flex items-center w-full cursor-pointer">
                                      <Clock className="mr-2 h-4 w-4" />
                                      Reschedule
                                    </div>
                                  }
                                  onSuccess={() => router.refresh()}
                                />
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleCancel(fitting.id)}
                              >
                                Cancel Fitting
                              </DropdownMenuItem>
                            </>
                          )}
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
