import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'

// GET /api/cart/services - Get service items in cart
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)

    if (!auth.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      )
    }

    const cartItems = await db.cartItemService.findMany({
      where: {
        userId: auth.user.id,
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error('Error fetching cart services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart services' },
      { status: 500 }
    )
  }
}

// POST /api/cart/services - Add service booking to cart
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)

    if (!auth.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { serviceId, scheduledDate, scheduledTime, customerNotes } = body

    // Validate required fields
    if (!serviceId || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceId, scheduledDate, scheduledTime' },
        { status: 400 }
      )
    }

    // Parse and validate date
    const bookingDate = new Date(scheduledDate)
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Don't allow booking in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (bookingDate < today) {
      return NextResponse.json(
        { error: 'Cannot add past dates to cart' },
        { status: 400 }
      )
    }

    // Check if service exists and is active
    const service = await db.service.findUnique({
      where: { id: serviceId },
    })

    if (!service || !service.isActive) {
      return NextResponse.json(
        { error: 'Service not found or inactive' },
        { status: 404 }
      )
    }

    // Check if this exact slot is already in cart
    const existingCartItem = await db.cartItemService.findFirst({
      where: {
        userId: auth.user.id,
        serviceId,
        scheduledDate: bookingDate,
        scheduledTime,
      },
    })

    if (existingCartItem) {
      return NextResponse.json(
        { error: 'This service booking is already in your cart' },
        { status: 400 }
      )
    }

    // Check if slot is still available (preliminary check, final check at checkout)
    const conflictingBooking = await db.serviceBooking.findFirst({
      where: {
        serviceId,
        scheduledDate: bookingDate,
        scheduledTime,
        status: {
          in: ['pending', 'confirmed', 'in_progress'],
        },
      },
    })

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 409 }
      )
    }

    // Add to cart
    const cartItem = await db.cartItemService.create({
      data: {
        userId: auth.user.id,
        serviceId,
        scheduledDate: bookingDate,
        scheduledTime,
        customerNotes,
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json(cartItem, { status: 201 })
  } catch (error) {
    console.error('Error adding service to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add service to cart' },
      { status: 500 }
    )
  }
}
