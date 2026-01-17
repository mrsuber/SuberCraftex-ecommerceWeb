import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/verify-auth'

// Serialize upcoming service for frontend (snake_case)
function serializeUpcomingService(service: any) {
  return {
    id: service.id,
    title: service.title,
    description: service.description,
    short_description: service.shortDescription,
    image_url: service.imageUrl,
    service_date: service.serviceDate?.toISOString() || null,
    service_id: service.serviceId,
    cta_text: service.ctaText,
    location: service.location,
    price: service.price?.toString() || null,
    order: service.order,
    is_active: service.isActive,
    created_at: service.createdAt.toISOString(),
    updated_at: service.updatedAt.toISOString(),
    service: service.service ? {
      id: service.service.id,
      name: service.service.name,
      slug: service.service.slug,
      featured_image: service.service.featuredImage,
    } : null,
  }
}

// GET /api/upcoming-services/[id] - Get single upcoming service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const upcomingService = await db.upcomingService.findUnique({
      where: { id },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            slug: true,
            featuredImage: true,
            price: true,
            description: true,
          },
        },
      },
    })

    if (!upcomingService) {
      return NextResponse.json(
        { error: 'Upcoming service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(serializeUpcomingService(upcomingService))
  } catch (error) {
    console.error('Error fetching upcoming service:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upcoming service' },
      { status: 500 }
    )
  }
}

// PATCH /api/upcoming-services/[id] - Update upcoming service (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params
    const body = await request.json()

    // Check if service exists
    const existing = await db.upcomingService.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Upcoming service not found' },
        { status: 404 }
      )
    }

    const {
      title,
      description,
      shortDescription,
      imageUrl,
      serviceDate,
      serviceId,
      ctaText,
      location,
      price,
      order,
      isActive,
    } = body

    // Validate serviceId if provided
    if (serviceId) {
      const service = await db.service.findUnique({ where: { id: serviceId } })
      if (!service) {
        return NextResponse.json(
          { error: 'Invalid service ID' },
          { status: 400 }
        )
      }
    }

    const updatedService = await db.upcomingService.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(serviceDate !== undefined && { serviceDate: new Date(serviceDate) }),
        ...(serviceId !== undefined && { serviceId: serviceId || null }),
        ...(ctaText !== undefined && { ctaText }),
        ...(location !== undefined && { location }),
        ...(price !== undefined && { price: price ? parseFloat(price) : null }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            slug: true,
            featuredImage: true,
          },
        },
      },
    })

    return NextResponse.json(serializeUpcomingService(updatedService))
  } catch (error: any) {
    console.error('Error updating upcoming service:', error)

    if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to update upcoming service' },
      { status: 500 }
    )
  }
}

// DELETE /api/upcoming-services/[id] - Delete upcoming service (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params

    // Check if service exists
    const existing = await db.upcomingService.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Upcoming service not found' },
        { status: 404 }
      )
    }

    await db.upcomingService.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting upcoming service:', error)

    if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to delete upcoming service' },
      { status: 500 }
    )
  }
}
