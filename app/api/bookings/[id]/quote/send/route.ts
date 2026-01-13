import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

/**
 * POST /api/bookings/[id]/quote/send
 * Send quote to customer (admin or tailor only)
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

    // Get booking with quote
    const booking = await db.serviceBooking.findUnique({
      where: { id },
      include: {
        quote: true,
        service: {
          select: {
            name: true,
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
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

    if (!booking.quote) {
      return NextResponse.json(
        { error: 'No quote found for this booking' },
        { status: 404 }
      )
    }

    if (booking.quote.status === 'sent') {
      return NextResponse.json(
        { error: 'Quote has already been sent' },
        { status: 400 }
      )
    }

    if (booking.quote.status === 'approved' || booking.quote.status === 'rejected') {
      return NextResponse.json(
        { error: `Quote has already been ${booking.quote.status}` },
        { status: 400 }
      )
    }

    // Update quote status using transaction
    await db.$transaction(async (tx) => {
      // Update quote status to sent
      await tx.quote.update({
        where: { id: booking.quote!.id },
        data: { status: 'sent' }
      })

      // Update booking status
      await tx.serviceBooking.update({
        where: { id },
        data: { status: 'quote_sent' }
      })

      // Add history entry
      await tx.quoteHistory.create({
        data: {
          quoteId: booking.quote!.id,
          action: 'sent',
          notes: `Quote sent to customer by ${user.role}`,
          createdBy: user.id,
        }
      })
    })

    console.log(`📧 Quote sent for booking ${booking.bookingNumber} to ${booking.customerEmail}`)

    // TODO: Send email notification to customer
    // This would integrate with your email service (e.g., SendGrid, Resend)
    // await sendQuoteEmail({
    //   to: booking.customerEmail,
    //   bookingNumber: booking.bookingNumber,
    //   serviceName: booking.service.name,
    //   quote: booking.quote,
    // })

    return NextResponse.json({
      success: true,
      message: 'Quote sent to customer successfully',
      bookingNumber: booking.bookingNumber,
      customerEmail: booking.customerEmail,
    })
  } catch (error) {
    console.error('Error sending quote:', error)
    return NextResponse.json(
      { error: 'Failed to send quote' },
      { status: 500 }
    )
  }
}
