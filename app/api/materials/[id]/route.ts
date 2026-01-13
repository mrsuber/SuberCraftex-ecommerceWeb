import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

/**
 * GET /api/materials/[id]
 * Get a specific material by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const material = await db.material.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        services: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    })

    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }

    const serialized = {
      ...material,
      price: Number(material.price),
    }

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Error fetching material:', error)
    return NextResponse.json(
      { error: 'Failed to fetch material' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/materials/[id]
 * Update a material (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const {
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

    // Check if material exists
    const existing = await db.material.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }

    // Update material and service associations
    const material = await db.material.update({
      where: { id },
      data: {
        name,
        description: description || null,
        price,
        stockQuantity,
        unit,
        imageUrl: imageUrl || null,
        serviceCategoryId: serviceCategoryId || null,
        isActive,
        // Update service associations
        services: {
          // Delete existing associations
          deleteMany: {},
          // Create new associations
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

    const serialized = {
      ...material,
      price: Number(material.price),
    }

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Error updating material:', error)
    return NextResponse.json(
      { error: 'Failed to update material' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/materials/[id]
 * Delete a material (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { id } = await params
    // Check if material exists
    const existing = await db.material.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }

    // Delete material (cascade will delete service associations)
    await db.material.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting material:', error)
    return NextResponse.json(
      { error: 'Failed to delete material' },
      { status: 500 }
    )
  }
}
