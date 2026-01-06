import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { BookingDetailClient } from './BookingDetailClient'

interface BookingPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  const { id } = await params
  const booking = await db.serviceBooking.findUnique({
    where: { id },
    include: {
      service: true,
    },
  })

  if (!booking) {
    return {
      title: 'Booking Not Found',
    }
  }

  return {
    title: `Booking #${booking.bookingNumber} | SuberCraftex`,
    description: `View details for your ${booking.service.name} booking`,
  }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch booking with all related data
  const booking = await db.serviceBooking.findUnique({
    where: { id },
    include: {
      service: {
        include: {
          category: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
      quote: {
        include: {
          history: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      },
      materials: {
        include: {
          material: {
            include: {
              category: true,
            },
          },
        },
      },
      materialRequests: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      progressUpdates: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      timeline: true,
      payments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!booking) {
    notFound()
  }

  // Check authorization
  if (user.id !== booking.userId && user.role !== 'admin') {
    notFound()
  }

  // Serialize for client component
  const serializedBooking = {
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    serviceId: booking.serviceId,
    userId: booking.userId,
    status: booking.status,
    serviceType: booking.serviceType,
    collectionMethod: booking.collectionMethod,
    scheduledDate: booking.scheduledDate?.toISOString() || null,
    scheduledTime: booking.scheduledTime,
    endTime: booking.endTime,
    duration: booking.duration,
    price: Number(booking.price),
    finalPrice: booking.finalPrice ? Number(booking.finalPrice) : null,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    customerNotes: booking.customerNotes,
    requirementPhotos: booking.requirementPhotos,
    desiredOutcome: booking.desiredOutcome,
    adminNotes: booking.adminNotes,
    rescheduledFrom: booking.rescheduledFrom,
    cancelledAt: booking.cancelledAt?.toISOString() || null,
    cancellationReason: booking.cancellationReason,
    completedAt: booking.completedAt?.toISOString() || null,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    service: {
      id: booking.service.id,
      name: booking.service.name,
      slug: booking.service.slug,
      description: booking.service.description,
      price: Number(booking.service.price),
      featuredImage: booking.service.featuredImage,
      category: booking.service.category
        ? {
            id: booking.service.category.id,
            name: booking.service.category.name,
            slug: booking.service.category.slug,
          }
        : null,
    },
    user: booking.user
      ? {
          id: booking.user.id,
          email: booking.user.email,
          fullName: booking.user.fullName,
        }
      : null,
    quote: booking.quote
      ? {
          id: booking.quote.id,
          bookingId: booking.quote.bookingId,
          materialCost: Number(booking.quote.materialCost),
          material_cost: Number(booking.quote.materialCost),
          laborCost: Number(booking.quote.laborCost),
          labor_cost: Number(booking.quote.laborCost),
          laborHours: Number(booking.quote.laborHours),
          labor_hours: Number(booking.quote.laborHours),
          totalCost: Number(booking.quote.totalCost),
          total_cost: Number(booking.quote.totalCost),
          downPaymentAmount: Number(booking.quote.downPaymentAmount),
          down_payment_amount: Number(booking.quote.downPaymentAmount),
          notes: booking.quote.notes,
          status: booking.quote.status,
          validUntil: booking.quote.validUntil?.toISOString() || null,
          valid_until: booking.quote.validUntil?.toISOString() || null,
          createdAt: booking.quote.createdAt.toISOString(),
          created_at: booking.quote.createdAt.toISOString(),
          updatedAt: booking.quote.updatedAt.toISOString(),
          updated_at: booking.quote.updatedAt.toISOString(),
          history: booking.quote.history.map((h) => ({
            id: h.id,
            quoteId: h.quoteId,
            action: h.action,
            notes: h.notes,
            createdBy: h.createdBy,
            created_by: h.createdBy,
            createdAt: h.createdAt.toISOString(),
            created_at: h.createdAt.toISOString(),
          })),
        }
      : null,
    materials: booking.materials.map((bm) => ({
      id: bm.id,
      bookingId: bm.bookingId,
      materialId: bm.materialId,
      quantity: bm.quantity,
      priceAtBooking: Number(bm.priceAtBooking),
      isAcquired: bm.isAcquired,
      material: {
        id: bm.material.id,
        sku: bm.material.sku,
        name: bm.material.name,
        description: bm.material.description,
        price: Number(bm.material.price),
        stockQuantity: bm.material.stockQuantity,
        unit: bm.material.unit,
        isActive: bm.material.isActive,
        category: bm.material.category
          ? {
              id: bm.material.category.id,
              name: bm.material.category.name,
              slug: bm.material.category.slug,
            }
          : null,
      },
    })),
    materialRequests: booking.materialRequests.map((mr) => ({
      id: mr.id,
      bookingId: mr.bookingId,
      description: mr.description,
      referenceUrl: mr.referenceUrl,
      referencePhotos: mr.referencePhotos,
      status: mr.status,
      adminNotes: mr.adminNotes,
      createdAt: mr.createdAt.toISOString(),
      created_at: mr.createdAt.toISOString(),
    })),
    progressUpdates: booking.progressUpdates.map((p) => ({
      id: p.id,
      bookingId: p.bookingId,
      status: p.status,
      description: p.description,
      photos: p.photos,
      createdBy: p.createdBy,
      created_by: p.createdBy,
      createdAt: p.createdAt.toISOString(),
      created_at: p.createdAt.toISOString(),
    })),
    timeline: booking.timeline.map((t) => ({
      id: t.id,
      bookingId: t.bookingId,
      milestone: t.milestone,
      expectedDate: t.expectedDate?.toISOString() || null,
      actualDate: t.actualDate?.toISOString() || null,
      notes: t.notes,
    })),
    payments: booking.payments.map((p) => ({
      id: p.id,
      bookingId: p.bookingId,
      amount: Number(p.amount),
      paymentType: p.paymentType,
      paymentMethod: p.paymentMethod,
      status: p.status,
      stripePaymentId: p.stripePaymentId,
      notes: p.notes,
      createdAt: p.createdAt.toISOString(),
      created_at: p.createdAt.toISOString(),
    })),
  }

  return <BookingDetailClient booking={serializedBooking} currentUser={user} />
}
