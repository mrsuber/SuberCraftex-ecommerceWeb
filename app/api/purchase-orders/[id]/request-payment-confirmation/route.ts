import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email/mailer';
import { getPaymentConfirmationTemplate } from '@/lib/email/templates/payment-confirmation';
import crypto from 'crypto';

// POST - Request payment confirmation from supplier
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const purchaseOrder = await db.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
      },
    });

    if (!purchaseOrder) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }

    // Check if payment is already confirmed
    if (purchaseOrder.paymentStatus === 'paid') {
      return NextResponse.json(
        { error: 'Payment is already marked as paid' },
        { status: 400 }
      );
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Calculate expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Check if there's already a pending confirmation
    const existingConfirmation = await db.paymentConfirmation.findFirst({
      where: {
        purchaseOrderId: id,
        isConfirmed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    let confirmation;
    if (existingConfirmation) {
      // Use existing token
      confirmation = existingConfirmation;
    } else {
      // Create new confirmation token
      confirmation = await db.paymentConfirmation.create({
        data: {
          token,
          purchaseOrderId: id,
          expiresAt,
        },
      });
    }

    // Send email to supplier
    const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/confirm-payment/${confirmation.token}`;

    const emailData = {
      poNumber: purchaseOrder.poNumber,
      supplierName: purchaseOrder.supplier.name,
      totalAmount: Number(purchaseOrder.totalAmount),
      confirmationUrl,
      companyName: process.env.NEXT_PUBLIC_APP_NAME || 'SuberCraftex',
      companyEmail: process.env.SMTP_FROM_EMAIL || 'orders@subercraftex.com',
      expiresInDays: 7,
    };

    const { html, text } = getPaymentConfirmationTemplate(emailData);

    await sendEmail({
      to: purchaseOrder.supplier.email,
      subject: `Payment Confirmation Request - ${purchaseOrder.poNumber}`,
      html,
      text,
    });

    console.log(`✅ Payment confirmation email sent to ${purchaseOrder.supplier.email} for PO ${purchaseOrder.poNumber}`);

    return NextResponse.json({
      message: 'Payment confirmation request sent successfully',
      expiresAt: confirmation.expiresAt,
    });
  } catch (error) {
    console.error('Error requesting payment confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to send payment confirmation request' },
      { status: 500 }
    );
  }
}
