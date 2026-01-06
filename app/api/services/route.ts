import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'

// GET /api/services - List all active services with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {
      isActive: true,
    }

    if (category) {
      where.categoryId = category
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }

    // Build orderBy
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Fetch services
    const [services, total] = await Promise.all([
      db.service.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      db.service.count({ where }),
    ])

    return NextResponse.json({
      services,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST /api/services - Create a new service (admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)

    if (!auth.user || auth.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const {
      name,
      slug,
      sku,
      description,
      shortDescription,
      price,
      compareAtPrice,
      categoryId,
      images,
      featuredImage,
      duration,
      customDuration,
      bufferTime,
      maxBookingsPerDay,
      isActive,
      isFeatured,
      tags,
      seoTitle,
      seoDescription,
      metadata,
    } = body

    // Validate required fields
    if (!name || !slug || !sku || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, sku, price, categoryId' },
        { status: 400 }
      )
    }

    // Check if slug or SKU already exists
    const existing = await db.service.findFirst({
      where: {
        OR: [{ slug }, { sku }],
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Service with this slug or SKU already exists' },
        { status: 400 }
      )
    }

    // Create service
    const service = await db.service.create({
      data: {
        name,
        slug,
        sku,
        description,
        shortDescription,
        price,
        compareAtPrice,
        categoryId,
        images: images || [],
        featuredImage,
        duration: duration || 'one_hour',
        customDuration,
        bufferTime: bufferTime || 0,
        maxBookingsPerDay,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
        tags: tags || [],
        seoTitle,
        seoDescription,
        metadata,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
