import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

/**
 * PATCH /api/bookings/[id]/progress/[progressId]
 * Update progress update (admin or tailor only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; progressId: string }> }
) {
  try {
    const { id, progressId } = await params
    // Check authentication - allow admin and tailor
    const user = await getCurrentUser()
    if (!user || (user.role !== 'admin' && user.role !== 'tailor')) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin or Tailor access required.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status, description, photos } = body

    // Check if progress update exists
    const existing = await db.bookingProgress.findUnique({
      where: { id: progressId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Progress update not found' },
        { status: 404 }
      )
    }

    // Verify it belongs to the correct booking
    if (existing.bookingId !== id) {
      return NextResponse.json(
        { error: 'Progress update does not belong to this booking' },
        { status: 400 }
      )
    }

    // Update progress update
    const progressUpdate = await db.bookingProgress.update({
      where: { id: progressId },
      data: {
        ...(status && { status }),
        ...(description && { description }),
        ...(photos && { photos }),
      }
    })

    console.log(`📊 Progress update ${progressId} updated`)

    return NextResponse.json(progressUpdate)
  } catch (error) {
    console.error('Error updating progress update:', error)
    return NextResponse.json(
      { error: 'Failed to update progress update' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/bookings/[id]/progress/[progressId]
 * Delete progress update (admin or tailor only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; progressId: string }> }
) {
  try {
    const { id, progressId } = await params
    // Check authentication - allow admin and tailor
    const user = await getCurrentUser()
    if (!user || (user.role !== 'admin' && user.role !== 'tailor')) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin or Tailor access required.' },
        { status: 401 }
      )
    }

    // Check if progress update exists
    const existing = await db.bookingProgress.findUnique({
      where: { id: progressId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Progress update not found' },
        { status: 404 }
      )
    }

    // Verify it belongs to the correct booking
    if (existing.bookingId !== id) {
      return NextResponse.json(
        { error: 'Progress update does not belong to this booking' },
        { status: 400 }
      )
    }

    // Delete progress update
    await db.bookingProgress.delete({
      where: { id: progressId }
    })

    console.log(`🗑️ Progress update ${progressId} deleted`)

    return NextResponse.json({
      success: true,
      message: 'Progress update deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting progress update:', error)
    return NextResponse.json(
      { error: 'Failed to delete progress update' },
      { status: 500 }
    )
  }
}
