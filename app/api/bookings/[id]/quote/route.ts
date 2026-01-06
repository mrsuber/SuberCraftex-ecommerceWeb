import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

/**
 * GET /api/bookings/[id]/quote
 * Get quote for a booking
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Get quote with history
    const quote = await db.quote.findUnique({
      where: { bookingId: id },
      include: {
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            userId: true,
            customerName: true,
            customerEmail: true,
            service: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        history: {
          orderBy: {
            createdAt: 'desc'
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

    // Check authorization (admin or booking owner)
    if (user.role !== 'admin' && quote.booking.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Serialize Decimal fields
    const serialized = {
      ...quote,
      materialCost: Number(quote.materialCost),
      laborCost: Number(quote.laborCost),
      laborHours: Number(quote.laborHours),
      totalCost: Number(quote.totalCost),
      downPaymentAmount: Number(quote.downPaymentAmount),
    }

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/bookings/[id]/quote
 * Create or update quote (admin only)
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
    const {
      material_cost,
      labor_cost,
      labor_hours,
      notes,
      down_payment_percentage = 50, // Default 50% down payment
      valid_until,
    } = body

    // Validate required fields
    if (
      material_cost === undefined ||
      labor_cost === undefined ||
      labor_hours === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required fields: material_cost, labor_cost, labor_hours' },
        { status: 400 }
      )
    }

    // Calculate totals
    const totalCost = Number(material_cost) + Number(labor_cost)
    const downPaymentAmount = totalCost * (down_payment_percentage / 100)

    const { id } = await params

    // Check if booking exists
    const booking = await db.serviceBooking.findUnique({
      where: { id },
      include: {
        service: {
          select: {
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

    // Check if quote already exists
    const existing = await db.quote.findUnique({
      where: { bookingId: id }
    })

    let quote
    if (existing) {
      // Update existing quote
      quote = await db.quote.update({
        where: { bookingId: id },
        data: {
          materialCost: material_cost,
          laborCost: labor_cost,
          laborHours: labor_hours,
          totalCost: totalCost,
          downPaymentAmount: downPaymentAmount,
          notes: notes || null,
          status: 'draft',
          validUntil: valid_until ? new Date(valid_until) : null,
        },
        include: {
          history: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      })

      // Add history entry
      await db.quoteHistory.create({
        data: {
          quoteId: quote.id,
          action: 'updated',
          notes: 'Quote updated by admin',
          createdBy: user.id,
        }
      })
    } else {
      // Create new quote
      quote = await db.quote.create({
        data: {
          bookingId: id,
          materialCost: material_cost,
          laborCost: labor_cost,
          laborHours: labor_hours,
          totalCost: totalCost,
          downPaymentAmount: downPaymentAmount,
          notes: notes || null,
          status: 'draft',
          validUntil: valid_until ? new Date(valid_until) : null,
        },
        include: {
          history: true
        }
      })

      // Add history entry
      await db.quoteHistory.create({
        data: {
          quoteId: quote.id,
          action: 'created',
          notes: 'Quote created by admin',
          createdBy: user.id,
        }
      })

      // Update booking status
      await db.serviceBooking.update({
        where: { id },
        data: { status: 'quote_pending' }
      })
    }

    console.log(`📋 Quote ${existing ? 'updated' : 'created'} for booking ${booking.bookingNumber} - Total: $${totalCost.toFixed(2)}`)

    // Serialize Decimal fields
    const serialized = {
      ...quote,
      materialCost: Number(quote.materialCost),
      laborCost: Number(quote.laborCost),
      laborHours: Number(quote.laborHours),
      totalCost: Number(quote.totalCost),
      downPaymentAmount: Number(quote.downPaymentAmount),
    }

    return NextResponse.json(serialized, { status: existing ? 200 : 201 })
  } catch (error) {
    console.error('Error creating/updating quote:', error)
    return NextResponse.json(
      { error: 'Failed to create/update quote' },
      { status: 500 }
    )
  }
}
