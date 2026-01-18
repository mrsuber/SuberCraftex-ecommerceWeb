import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'

/**
 * POST /api/bookings/[id]/quote/reject
 * Customer rejects quote
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
    const body = await request.json()
    const { reason } = body

    // Get quote with booking details
    const quote = await db.quote.findUnique({
      where: { bookingId: id },
      include: {
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            userId: true,
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
        { error: 'Unauthorized. You can only reject your own quotes.' },
        { status: 403 }
      )
    }

    // Check if quote is in valid state for rejection
    if (quote.status === 'approved') {
      return NextResponse.json(
        { error: 'Quote already approved. Cannot reject.' },
        { status: 400 }
      )
    }

    if (quote.status === 'rejected') {
      return NextResponse.json(
        { error: 'Quote already rejected' },
        { status: 400 }
      )
    }

    // Use transaction to ensure atomicity
    const result = await db.$transaction(async (tx) => {
      // Update quote status
      const updatedQuote = await tx.quote.update({
        where: { id: quote.id },
        data: { status: 'rejected' }
      })

      // Update booking status
      await tx.serviceBooking.update({
        where: { id },
        data: { status: 'quote_rejected' }
      })

      // Create quote history entry
      await tx.quoteHistory.create({
        data: {
          quoteId: quote.id,
          action: 'rejected',
          notes: reason || 'Customer rejected quote',
          createdBy: user.id
        }
      })

      return updatedQuote
    })

    console.log(`❌ Quote rejected for booking ${quote.booking.bookingNumber}${reason ? ` - Reason: ${reason}` : ''}`)

    return NextResponse.json({
      success: true,
      message: 'Quote rejected successfully',
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
    console.error('Error rejecting quote:', error)
    return NextResponse.json(
      { error: 'Failed to reject quote' },
      { status: 500 }
    )
  }
}
