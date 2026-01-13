import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

/**
 * GET /api/bookings/[id]/progress
 * Get all progress updates for a booking
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

    // Check authorization (admin, tailor, or booking owner)
    if (user.role !== 'admin' && user.role !== 'tailor' && booking.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get all progress updates
    const progressUpdates = await db.bookingProgress.findMany({
      where: { bookingId: id },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(progressUpdates)
  } catch (error) {
    console.error('Error fetching progress updates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress updates' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/bookings/[id]/progress
 * Add progress update (admin or tailor only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check authentication - allow admin and tailor
    const user = await getCurrentUser()
    if (!user || (user.role !== 'admin' && user.role !== 'tailor')) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin or Tailor access required.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status, description, photos = [] } = body

    // Validate required fields
    if (!status || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: status, description' },
        { status: 400 }
      )
    }

    // Validate status enum
    const validStatuses = [
      'pending',
      'material_ordered',
      'material_received',
      'in_production',
      'quality_check',
      'ready_for_collection',
      'completed'
    ]

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Check if booking exists
    const booking = await db.serviceBooking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          }
        },
        service: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Create progress update
    const progressUpdate = await db.bookingProgress.create({
      data: {
        bookingId: id,
        status,
        description,
        photos,
        createdBy: user.id
      }
    })

    console.log(`📊 Progress update added for booking ${booking.bookingNumber} - Status: ${status}`)

    // TODO: Send email notification to customer
    // await sendProgressUpdateEmail(booking.user.email, {
    //   bookingNumber: booking.bookingNumber,
    //   serviceName: booking.service.name,
    //   status: progressUpdate.status,
    //   description: progressUpdate.description,
    //   photos: progressUpdate.photos
    // })

    return NextResponse.json(progressUpdate, { status: 201 })
  } catch (error) {
    console.error('Error creating progress update:', error)
    return NextResponse.json(
      { error: 'Failed to create progress update' },
      { status: 500 }
    )
  }
}
