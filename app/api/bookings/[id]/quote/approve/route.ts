import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'

/**
 * POST /api/bookings/[id]/quote/approve
 * Customer approves quote
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    // Get quote with booking details
    const quote = await db.quote.findUnique({
      where: { bookingId: id },
      include: {
        booking: {
          include: {
            materials: {
              include: {
                material: true
              }
            }
          }
        }
      }
    })

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Check authorization (must be booking owner)
    if (quote.booking.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only approve your own quotes.' },
        { status: 403 }
      )
    }

    // Check if quote is in valid state for approval
    if (quote.status === 'approved') {
      return NextResponse.json(
        { error: 'Quote already approved' },
        { status: 400 }
      )
    }

    if (quote.status === 'expired') {
      return NextResponse.json(
        { error: 'Quote has expired. Please request a new quote.' },
        { status: 400 }
      )
    }

    // Use transaction to ensure atomicity
    const result = await db.$transaction(async (tx) => {
      // Update quote status
      const updatedQuote = await tx.quote.update({
        where: { id: quote.id },
        data: { status: 'approved' }
      })

      // Update booking status and lock price
      await tx.serviceBooking.update({
        where: { id },
        data: {
          status: 'awaiting_payment',
          finalPrice: quote.totalCost
        }
      })

      // Reserve materials (decrement stock)
      for (const bookingMaterial of quote.booking.materials) {
        const material = bookingMaterial.material

        // Check stock availability
        if (material.stockQuantity < bookingMaterial.quantity) {
          throw new Error(
            `Insufficient stock for ${material.name}. Available: ${material.stockQuantity}, Required: ${bookingMaterial.quantity}`
          )
        }

        // Decrement stock (reserve)
        await tx.material.update({
          where: { id: material.id },
          data: {
            stockQuantity: {
              decrement: bookingMaterial.quantity
            }
          }
        })

        // Lock price at booking time
        await tx.bookingMaterial.update({
          where: { id: bookingMaterial.id },
          data: {
            priceAtBooking: material.price
          }
        })
      }

      // Create quote history entry
      await tx.quoteHistory.create({
        data: {
          quoteId: quote.id,
          action: 'approved',
          notes: 'Customer approved quote',
          createdBy: user.id
        }
      })

      return updatedQuote
    })

    console.log(`✅ Quote approved for booking ${quote.booking.bookingNumber} - Total: ${Number(quote.totalCost).toFixed(2)}`)

    return NextResponse.json({
      success: true,
      message: 'Quote approved successfully',
      quote: {
        ...result,
        materialCost: Number(result.materialCost),
        laborCost: Number(result.laborCost),
        laborHours: Number(result.laborHours),
        totalCost: Number(result.totalCost),
        downPaymentAmount: Number(result.downPaymentAmount),
      }
    })
  } catch (error) {
    console.error('Error approving quote:', error)

    // Handle specific errors
    if (error instanceof Error && error.message.includes('Insufficient stock')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to approve quote' },
      { status: 500 }
    )
  }
}
