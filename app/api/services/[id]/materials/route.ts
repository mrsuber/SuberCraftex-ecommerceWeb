import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/services/[id]/materials
 * Get all materials associated with a specific service
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')

    // Get service with its materials
    const service = await db.service.findUnique({
      where: { id },
      include: {
        materials: {
          include: {
            material: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Extract materials and filter by active status if specified
    let materials = service.materials.map(sm => sm.material)

    if (isActive === 'true') {
      materials = materials.filter(m => m.isActive)
    } else if (isActive === 'false') {
      materials = materials.filter(m => !m.isActive)
    }

    // Serialize Decimal fields
    const serialized = materials.map(material => ({
      ...material,
      price: Number(material.price),
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Error fetching service materials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service materials' },
      { status: 500 }
    )
  }
}
