import { Metadata } from 'next'
import { db } from '@/lib/db'
import { BookingsTable } from '@/components/dashboard/BookingsTable'

export const metadata: Metadata = {
  title: 'Bookings Management | Admin Dashboard',
  description: 'Manage service bookings',
}

export default async function BookingsPage() {
  const bookings = await db.serviceBooking.findMany({
    include: {
      service: true,
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Serialize bookings
  const serializedBookings = bookings.map((booking) => ({
    ...booking,
    price: Number(booking.price),
    finalPrice: booking.finalPrice ? Number(booking.finalPrice) : null,
    scheduled_date: booking.scheduledDate?.toISOString() || null,
    scheduledDate: booking.scheduledDate?.toISOString() || null,
    scheduled_time: booking.scheduledTime,
    scheduledTime: booking.scheduledTime,
    end_time: booking.endTime,
    endTime: booking.endTime,
    customer_name: booking.customerName,
    customerName: booking.customerName,
    customer_email: booking.customerEmail,
    customerEmail: booking.customerEmail,
    customer_phone: booking.customerPhone,
    customerPhone: booking.customerPhone,
    customer_notes: booking.customerNotes,
    customerNotes: booking.customerNotes,
    admin_notes: booking.adminNotes,
    adminNotes: booking.adminNotes,
    booking_number: booking.bookingNumber,
    bookingNumber: booking.bookingNumber,
    user_id: booking.userId,
    userId: booking.userId,
    order_id: booking.orderId,
    orderId: booking.orderId,
    service_id: booking.serviceId,
    serviceId: booking.serviceId,
    cancellation_reason: booking.cancellationReason,
    cancellationReason: booking.cancellationReason,
    rescheduled_from: booking.rescheduledFrom,
    rescheduledFrom: booking.rescheduledFrom,
    completed_at: booking.completedAt?.toISOString() || null,
    completedAt: booking.completedAt?.toISOString() || null,
    cancelled_at: booking.cancelledAt?.toISOString() || null,
    cancelledAt: booking.cancelledAt?.toISOString() || null,
    created_at: booking.createdAt.toISOString(),
    createdAt: booking.createdAt.toISOString(),
    updated_at: booking.updatedAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    service: booking.service ? {
      ...booking.service,
      price: Number(booking.service.price),
      compare_at_price: booking.service.compareAtPrice ? Number(booking.service.compareAtPrice) : null,
      compareAtPrice: booking.service.compareAtPrice ? Number(booking.service.compareAtPrice) : null,
      buffer_time: booking.service.bufferTime,
      bufferTime: booking.service.bufferTime,
      max_bookings_per_day: booking.service.maxBookingsPerDay,
      maxBookingsPerDay: booking.service.maxBookingsPerDay,
      custom_duration: booking.service.customDuration,
      customDuration: booking.service.customDuration,
      category_id: booking.service.categoryId,
      categoryId: booking.service.categoryId,
      short_description: booking.service.shortDescription,
      shortDescription: booking.service.shortDescription,
      featured_image: booking.service.featuredImage,
      featuredImage: booking.service.featuredImage,
      is_active: booking.service.isActive,
      isActive: booking.service.isActive,
      is_featured: booking.service.isFeatured,
      isFeatured: booking.service.isFeatured,
      seo_title: booking.service.seoTitle,
      seoTitle: booking.service.seoTitle,
      seo_description: booking.service.seoDescription,
      seoDescription: booking.service.seoDescription,
      created_at: booking.service.createdAt.toISOString(),
      createdAt: booking.service.createdAt.toISOString(),
      updated_at: booking.service.updatedAt.toISOString(),
      updatedAt: booking.service.updatedAt.toISOString(),
    } : undefined,
  }))

  // Calculate stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    revenue: bookings
      .filter((b) => b.status === 'completed')
      .reduce((sum, b) => sum + Number(b.price), 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground mt-1">
            Manage service bookings and appointments
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Bookings</div>
          <div className="text-2xl font-bold mt-1">{stats.total}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Pending</div>
          <div className="text-2xl font-bold mt-1 text-yellow-600">{stats.pending}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Confirmed</div>
          <div className="text-2xl font-bold mt-1 text-blue-600">{stats.confirmed}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Completed</div>
          <div className="text-2xl font-bold mt-1 text-green-600">{stats.completed}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Cancelled</div>
          <div className="text-2xl font-bold mt-1 text-red-600">{stats.cancelled}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Revenue</div>
          <div className="text-2xl font-bold mt-1 text-green-600">
            ${stats.revenue.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Table */}
      <BookingsTable initialBookings={serializedBookings as any} />
    </div>
  )
}
