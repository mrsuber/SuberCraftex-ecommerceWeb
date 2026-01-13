import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'

// DELETE /api/cart/services/[id] - Remove service from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request)

    if (!auth.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      )
    }

    const { id } = await params
    // Check if cart item exists and belongs to user
    const cartItem = await db.cartItemService.findUnique({
      where: { id },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (cartItem.userId !== auth.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete cart item
    await db.cartItemService.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Service removed from cart' })
  } catch (error) {
    console.error('Error removing service from cart:', error)
    return NextResponse.json(
      { error: 'Failed to remove service from cart' },
      { status: 500 }
    )
  }
}

// PATCH /api/cart/services/[id] - Update service booking in cart
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request)

    if (!auth.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Check if cart item exists and belongs to user
    const cartItem = await db.cartItemService.findUnique({
      where: { id },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (cartItem.userId !== auth.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Update cart item
    const updateData: any = {}

    if (body.scheduledDate) {
      const newDate = new Date(body.scheduledDate)
      if (isNaN(newDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        )
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (newDate < today) {
        return NextResponse.json(
          { error: 'Cannot update to a past date' },
          { status: 400 }
        )
      }

      updateData.scheduledDate = newDate
    }

    if (body.scheduledTime) {
      updateData.scheduledTime = body.scheduledTime
    }

    if (body.customerNotes !== undefined) {
      updateData.customerNotes = body.customerNotes
    }

    const updatedCartItem = await db.cartItemService.update({
      where: { id },
      data: updateData,
      include: {
        service: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json(updatedCartItem)
  } catch (error) {
    console.error('Error updating cart service:', error)
    return NextResponse.json(
      { error: 'Failed to update cart service' },
      { status: 500 }
    )
  }
}
