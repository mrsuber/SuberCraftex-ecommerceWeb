'use client'

import { useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Ruler } from 'lucide-react'
import { format } from 'date-fns'

interface Booking {
  id: string
  bookingNumber: string
  customerName: string
  customerEmail: string
  status: string
  createdAt: string
  service: {
    name: string
  }
  measurement?: {
    takenAt: string
  } | null
}

interface MeasurementsTableProps {
  bookings: Booking[]
  showAction?: boolean
}

const STATUS_COLORS: Record<string, string> = {
  quote_approved: 'bg-blue-500',
  in_progress: 'bg-purple-500',
  completed: 'bg-green-500',
}

const STATUS_LABELS: Record<string, string> = {
  quote_approved: 'Quote Approved',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export function MeasurementsTable({ bookings, showAction = false }: MeasurementsTableProps) {
  const [search, setSearch] = useState('')

  const filteredBookings = bookings.filter((booking) => {
    if (!search) return true

    const searchLower = search.toLowerCase()
    return (
      booking.customerName.toLowerCase().includes(searchLower) ||
      booking.bookingNumber.toLowerCase().includes(searchLower) ||
      booking.customerEmail.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by customer name, booking number, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              {showAction && <TableHead className="text-right">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showAction ? 6 : 5} className="text-center py-8 text-muted-foreground">
                  {search ? 'No bookings found matching your search' : 'No bookings found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/bookings/${booking.id}`}
                      className="hover:underline"
                    >
                      {booking.bookingNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.customerEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{booking.service.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={STATUS_COLORS[booking.status]}>
                      {STATUS_LABELS[booking.status] || booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {booking.measurement
                      ? format(new Date(booking.measurement.takenAt), 'MMM d, yyyy')
                      : format(new Date(booking.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  {showAction && (
                    <TableCell className="text-right">
                      <Link href={`/dashboard/bookings/${booking.id}/measurement`}>
                        <Button size="sm" className="gap-2">
                          <Ruler className="h-4 w-4" />
                          Record Measurements
                        </Button>
                      </Link>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
