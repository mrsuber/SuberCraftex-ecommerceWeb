import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://subercraftex.com'

// Helper to convert relative URLs to absolute URLs
function toAbsoluteUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${APP_URL}${url}`
}

// Transform service for API response with absolute URLs
function transformService(service: any) {
  return {
    ...service,
    featuredImage: toAbsoluteUrl(service.featuredImage),
    featured_image: toAbsoluteUrl(service.featuredImage),
    images: service.images?.map((img: string) => toAbsoluteUrl(img)).filter(Boolean) || [],
    price: Number(service.price),
    compareAtPrice: service.compareAtPrice ? Number(service.compareAtPrice) : null,
    compare_at_price: service.compareAtPrice ? Number(service.compareAtPrice) : null,
    category: service.category ? {
      ...service.category,
      imageUrl: toAbsoluteUrl(service.category.imageUrl),
      image_url: toAbsoluteUrl(service.category.imageUrl),
    } : null,
  }
}

// GET /api/services/[id] - Get service details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const service = await db.service.findUnique({
      where: { id },
      include: {
        category: true,
        availability: {
          where: { isActive: true },
          orderBy: { dayOfWeek: 'asc' },
        },
        designCategories: {
          orderBy: { sortOrder: 'asc' },
          include: {
            options: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  in: ['confirmed', 'in_progress', 'completed'],
                },
              },
            },
          },
        },
      },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Don't return inactive services to non-admin users
    if (!service.isActive) {
      const auth = await verifyAuth(request)
      if (!auth.user || auth.user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(transformService(service))
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

// PATCH /api/services/[id] - Update service (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request)

    if (!auth.user || auth.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Check if service exists
    const existing = await db.service.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // If updating slug or SKU, check for conflicts
    if (body.slug && body.slug !== existing.slug) {
      const slugConflict = await db.service.findFirst({
        where: {
          slug: body.slug,
          id: { not: id },
        },
      })

      if (slugConflict) {
        return NextResponse.json(
          { error: 'Service with this slug already exists' },
          { status: 400 }
        )
      }
    }

    if (body.sku && body.sku !== existing.sku) {
      const skuConflict = await db.service.findFirst({
        where: {
          sku: body.sku,
          id: { not: id },
        },
      })

      if (skuConflict) {
        return NextResponse.json(
          { error: 'Service with this SKU already exists' },
          { status: 400 }
        )
      }
    }

    // Update service
    const service = await db.service.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.slug && { slug: body.slug }),
        ...(body.sku && { sku: body.sku }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.shortDescription !== undefined && { shortDescription: body.shortDescription }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.compareAtPrice !== undefined && { compareAtPrice: body.compareAtPrice }),
        ...(body.categoryId && { categoryId: body.categoryId }),
        ...(body.images && { images: body.images }),
        ...(body.featuredImage !== undefined && { featuredImage: body.featuredImage }),
        ...(body.duration && { duration: body.duration }),
        ...(body.customDuration !== undefined && { customDuration: body.customDuration }),
        ...(body.bufferTime !== undefined && { bufferTime: body.bufferTime }),
        ...(body.maxBookingsPerDay !== undefined && { maxBookingsPerDay: body.maxBookingsPerDay }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
        ...(body.tags && { tags: body.tags }),
        ...(body.seoTitle !== undefined && { seoTitle: body.seoTitle }),
        ...(body.seoDescription !== undefined && { seoDescription: body.seoDescription }),
        ...(body.metadata !== undefined && { metadata: body.metadata }),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(transformService(service))
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// DELETE /api/services/[id] - Delete service (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request)

    if (!auth.user || auth.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { id } = await params
    // Check if service has any bookings
    const bookingsCount = await db.serviceBooking.count({
      where: {
        serviceId: id,
        status: {
          in: ['pending', 'confirmed', 'in_progress'],
        },
      },
    })

    if (bookingsCount > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete service with active bookings. Please cancel or complete them first.',
        },
        { status: 400 }
      )
    }

    // Soft delete: just mark as inactive
    const service = await db.service.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ message: 'Service deleted successfully', service })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
