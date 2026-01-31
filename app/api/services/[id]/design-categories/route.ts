import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'

// GET /api/services/[id]/design-categories - List categories with options
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const categories = await db.serviceDesignCategory.findMany({
      where: { serviceId: id },
      include: {
        options: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching design categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch design categories' },
      { status: 500 }
    )
  }
}

// POST /api/services/[id]/design-categories - Create category (admin)
export async function POST(
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

    const { name, description, sortOrder, isRequired } = body

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Verify service exists
    const service = await db.service.findUnique({ where: { id } })
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    const category = await db.serviceDesignCategory.create({
      data: {
        serviceId: id,
        name: name.trim(),
        description: description || null,
        sortOrder: sortOrder ?? 0,
        isRequired: isRequired ?? true,
      },
      include: {
        options: true,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating design category:', error)
    return NextResponse.json(
      { error: 'Failed to create design category' },
      { status: 500 }
    )
  }
}
