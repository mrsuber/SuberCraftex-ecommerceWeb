import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

/**
 * GET /api/materials
 * List all materials with filtering options
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const inStockOnly = searchParams.get('inStock') === 'true'
    const isActive = searchParams.get('isActive')

    const where: any = {}

    if (category) {
      where.serviceCategoryId = category
    }

    if (inStockOnly) {
      where.stockQuantity = { gt: 0 }
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true'
    }

    const materials = await db.material.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      },
      orderBy: [
        { name: 'asc' }
      ]
    })

    // Serialize Decimal fields to numbers
    const serialized = materials.map(material => ({
      ...material,
      price: Number(material.price),
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/materials
 * Create a new material (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      sku,
      name,
      description,
      price,
      stockQuantity,
      unit,
      imageUrl,
      serviceCategoryId,
      isActive,
      serviceIds = [],
    } = body

    // Validate required fields
    if (!sku || !name || price === undefined || price === null) {
      return NextResponse.json(
        { error: 'Missing required fields: sku, name, price' },
        { status: 400 }
      )
    }

    // Check if SKU already exists
    const existing = await db.material.findUnique({
      where: { sku }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Material with this SKU already exists' },
        { status: 400 }
      )
    }

    // Create material with service associations
    const material = await db.material.create({
      data: {
        sku,
        name,
        description: description || null,
        price,
        stockQuantity: stockQuantity || 0,
        unit: unit || 'piece',
        imageUrl: imageUrl || null,
        serviceCategoryId: serviceCategoryId || null,
        isActive: isActive !== undefined ? isActive : true,
        // Create service associations
        services: {
          create: serviceIds.map((serviceId: string) => ({
            serviceId,
            isRequired: false,
            defaultQuantity: 1,
          })),
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      }
    })

    // Serialize Decimal fields
    const serialized = {
      ...material,
      price: Number(material.price),
    }

    return NextResponse.json(serialized, { status: 201 })
  } catch (error) {
    console.error('Error creating material:', error)
    return NextResponse.json(
      { error: 'Failed to create material' },
      { status: 500 }
    )
  }
}
