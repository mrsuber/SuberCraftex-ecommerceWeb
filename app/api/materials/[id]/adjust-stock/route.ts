import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

/**
 * POST /api/materials/[id]/adjust-stock
 * Adjust material inventory (admin only)
 *
 * Body: { adjustment: number, reason?: string }
 * Positive numbers = add stock (purchase/receive)
 * Negative numbers = remove stock (use/damage)
 */
export async function POST(
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

    const body = await request.json()
    const { adjustment, reason } = body

    // Validate adjustment
    if (adjustment === undefined || adjustment === null || typeof adjustment !== 'number') {
      return NextResponse.json(
        { error: 'Invalid adjustment value' },
        { status: 400 }
      )
    }

    if (adjustment === 0) {
      return NextResponse.json(
        { error: 'Adjustment cannot be zero' },
        { status: 400 }
      )
    }

    // Get current material
    const material = await db.material.findUnique({
      where: { id: params.id }
    })

    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }

    // Calculate new stock quantity
    const newStock = material.stockQuantity + adjustment

    // Prevent negative stock
    if (newStock < 0) {
      return NextResponse.json(
        {
          error: 'Insufficient stock. Cannot reduce below zero.',
          currentStock: material.stockQuantity,
          requestedAdjustment: adjustment,
          resultingStock: newStock,
        },
        { status: 400 }
      )
    }

    // Update stock quantity
    const updated = await db.material.update({
      where: { id: params.id },
      data: {
        stockQuantity: newStock
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

    console.log(
      `📦 Stock adjusted for ${updated.name}: ${material.stockQuantity} → ${newStock} (${adjustment >= 0 ? '+' : ''}${adjustment})${reason ? ` - Reason: ${reason}` : ''}`
    )

    // Serialize Decimal fields
    const serialized = {
      ...updated,
      price: Number(updated.price),
      previousStock: material.stockQuantity,
      adjustment,
      reason: reason || null,
    }

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Error adjusting stock:', error)
    return NextResponse.json(
      { error: 'Failed to adjust stock' },
      { status: 500 }
    )
  }
}
