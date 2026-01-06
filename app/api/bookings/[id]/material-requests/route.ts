import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

/**
 * POST /api/bookings/[id]/material-requests
 * Customer requests unavailable material
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { description, reference_url, reference_photos = [] } = body

    // Validate required fields
    if (!description) {
      return NextResponse.json(
        { error: 'Missing required field: description' },
        { status: 400 }
      )
    }

    // Check if booking exists and belongs to user
    const booking = await db.serviceBooking.findUnique({
      where: { id },
      select: {
        id: true,
        bookingNumber: true,
        userId: true,
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check authorization (must be booking owner)
    if (booking.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only request materials for your own bookings.' },
        { status: 403 }
      )
    }

    // Create material request
    const materialRequest = await db.materialRequest.create({
      data: {
        bookingId: id,
        description,
        referenceUrl: reference_url || null,
        referencePhotos: reference_photos,
        status: 'pending'
      }
    })

    console.log(`📦 Material request created for booking ${booking.bookingNumber}`)

    // TODO: Send email notification to admin
    // await sendMaterialRequestEmail(materialRequest)

    return NextResponse.json(materialRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating material request:', error)
    return NextResponse.json(
      { error: 'Failed to create material request' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/bookings/[id]/material-requests
 * Get all material requests for a booking
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get booking to check authorization
    const booking = await db.serviceBooking.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check authorization (admin or booking owner)
    if (user.role !== 'admin' && booking.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get all material requests for this booking
    const materialRequests = await db.materialRequest.findMany({
      where: { bookingId: id },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(materialRequests)
  } catch (error) {
    console.error('Error fetching material requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch material requests' },
      { status: 500 }
    )
  }
}
