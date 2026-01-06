import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

/**
 * PATCH /api/material-requests/[id]
 * Admin updates material request status
 */
export async function PATCH(
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
    const { status, admin_notes } = body

    // Validate status enum
    const validStatuses = ['pending', 'approved', 'acquired', 'cancelled']

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Check if material request exists
    const existing = await db.materialRequest.findUnique({
      where: { id: params.id },
      include: {
        booking: {
          select: {
            id: true,
            booking_number: true,
          }
        }
      }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Material request not found' },
        { status: 404 }
      )
    }

    // Update material request
    const materialRequest = await db.materialRequest.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(admin_notes !== undefined && { admin_notes }),
      }
    })

    console.log(
      `📦 Material request ${params.id} updated - Status: ${materialRequest.status} - Booking: ${existing.booking.booking_number}`
    )

    // TODO: Send email notification to customer about status change
    // if (status) {
    //   await sendMaterialRequestStatusEmail(materialRequest)
    // }

    return NextResponse.json(materialRequest)
  } catch (error) {
    console.error('Error updating material request:', error)
    return NextResponse.json(
      { error: 'Failed to update material request' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/material-requests/[id]
 * Admin deletes material request
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

    // Check if material request exists
    const existing = await db.materialRequest.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Material request not found' },
        { status: 404 }
      )
    }

    // Delete material request
    await db.materialRequest.delete({
      where: { id: params.id }
    })

    console.log(`🗑️ Material request ${params.id} deleted`)

    return NextResponse.json({
      success: true,
      message: 'Material request deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting material request:', error)
    return NextResponse.json(
      { error: 'Failed to delete material request' },
      { status: 500 }
    )
  }
}
