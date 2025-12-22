import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { headers } from 'next/headers';

// POST - Confirm payment received by supplier
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Get client IP address
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0] : headersList.get('x-real-ip') || 'unknown';

    const confirmation = await db.paymentConfirmation.findUnique({
      where: { token },
      include: {
        purchaseOrder: true,
      },
    });

    if (!confirmation) {
      return NextResponse.json({ error: 'Invalid confirmation token' }, { status: 404 });
    }

    // Check if already confirmed
    if (confirmation.isConfirmed) {
      return NextResponse.json(
        { error: 'Payment has already been confirmed' },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date() > confirmation.expiresAt) {
      return NextResponse.json(
        { error: 'Confirmation link has expired' },
        { status: 400 }
      );
    }

    // Update confirmation status
    await db.paymentConfirmation.update({
      where: { id: confirmation.id },
      data: {
        isConfirmed: true,
        confirmedAt: new Date(),
        confirmedIp: clientIp,
      },
    });

    // Update purchase order payment status
    await db.purchaseOrder.update({
      where: { id: confirmation.purchaseOrderId },
      data: {
        paymentStatus: 'paid',
        paymentDate: new Date(),
      },
    });

    console.log(
      `✅ Payment confirmed for PO ${confirmation.purchaseOrder.poNumber} from IP ${clientIp}`
    );

    return NextResponse.json({
      message: 'Payment confirmed successfully',
      poNumber: confirmation.purchaseOrder.poNumber,
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}
