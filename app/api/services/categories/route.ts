import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'

// GET /api/services/categories - List all service categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const where: any = {}

    // Only show active categories to non-admin users
    if (!includeInactive) {
      where.isActive = true
    }

    const categories = await db.serviceCategory.findMany({
      where,
      include: {
        _count: {
          select: {
            services: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: {
        sortOrder: 'asc',
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching service categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service categories' },
      { status: 500 }
    )
  }
}

// POST /api/services/categories - Create service category (admin only)
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
      description,
      imageUrl,
      icon,
      sortOrder,
      isActive,
    } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await db.serviceCategory.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      )
    }

    // Create category
    const category = await db.serviceCategory.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        icon,
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating service category:', error)
    return NextResponse.json(
      { error: 'Failed to create service category' },
      { status: 500 }
    )
  }
}
