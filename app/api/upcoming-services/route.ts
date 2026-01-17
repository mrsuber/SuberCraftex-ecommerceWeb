import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, requireAdmin } from '@/lib/auth/verify-auth'

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

// GET /api/upcoming-services - Get all active upcoming services (public) or all (admin)
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'
    const includePast = searchParams.get('includePast') === 'true'

    const now = new Date()
    const where: any = {}

    // Only show active services for non-admin users
    if (!auth.user || auth.user.role !== 'admin') {
      where.isActive = true
      // Only show future services by default
      if (!includePast) {
        where.serviceDate = { gte: now }
      }
    } else if (!includeInactive) {
      where.isActive = true
    }

    const upcomingServices = await db.upcomingService.findMany({
      where,
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
      orderBy: [{ serviceDate: 'asc' }, { order: 'asc' }],
    })

    const serialized = upcomingServices.map(serializeUpcomingService)

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Error fetching upcoming services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upcoming services' },
      { status: 500 }
    )
  }
}

// POST /api/upcoming-services - Create new upcoming service (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()

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

    if (!title || !imageUrl || !serviceDate) {
      return NextResponse.json(
        { error: 'Title, image URL, and service date are required' },
        { status: 400 }
      )
    }

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

    const upcomingService = await db.upcomingService.create({
      data: {
        title,
        description: description || null,
        shortDescription: shortDescription || null,
        imageUrl,
        serviceDate: new Date(serviceDate),
        serviceId: serviceId || null,
        ctaText: ctaText || 'Learn More',
        location: location || null,
        price: price ? parseFloat(price) : null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
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

    return NextResponse.json(serializeUpcomingService(upcomingService), { status: 201 })
  } catch (error: any) {
    console.error('Error creating upcoming service:', error)

    if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to create upcoming service' },
      { status: 500 }
    )
  }
}
