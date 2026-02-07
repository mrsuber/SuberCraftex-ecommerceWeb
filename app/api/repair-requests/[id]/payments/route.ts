import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const recordPaymentSchema = z.object({
  amount: z.number().positive(),
  paymentType: z.enum(['diagnostic_fee', 'deposit', 'final_payment']),
  paymentMethod: z.enum(['cash', 'card', 'mobile_money']),
  reference: z.string().optional(),
});

// POST - Record payment for repair
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin or technician can record payments
    if (!['admin', 'technician'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = recordPaymentSchema.parse(body);

    // Check if repair request exists
    const existingRequest = await db.repairRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Repair request not found' }, { status: 404 });
    }

    // Create payment record
    const payment = await db.repairPayment.create({
      data: {
        repairRequestId: id,
        amount: data.amount,
        paymentType: data.paymentType,
        paymentMethod: data.paymentMethod,
        reference: data.reference,
        createdBy: user.id,
      },
    });

    // Update payment status
    const allPayments = await db.repairPayment.findMany({
      where: { repairRequestId: id },
    });

    const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const finalCost = existingRequest.finalCost ? Number(existingRequest.finalCost) : 0;

    let paymentStatus = 'pending';
    if (totalPaid >= finalCost && finalCost > 0) {
      paymentStatus = 'paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'partial';
    }

    await db.repairRequest.update({
      where: { id },
      data: { paymentStatus },
    });

    // Add progress entry
    await db.repairProgress.create({
      data: {
        repairRequestId: id,
        status: 'payment_received',
        description: `Payment received: $${data.amount.toFixed(2)} (${data.paymentType.replace(/_/g, ' ')}) via ${data.paymentMethod.replace(/_/g, ' ')}${data.reference ? `. Ref: ${data.reference}` : ''}`,
        photos: [],
        updatedBy: user.id,
        updatedByName: user.fullName || user.email,
      },
    });

    console.log(`Payment recorded for repair ${existingRequest.ticketNumber}: $${data.amount}`);

    return NextResponse.json({
      payment,
      paymentSummary: {
        totalPaid,
        finalCost,
        balance: finalCost - totalPaid,
        paymentStatus,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error recording payment:', error);
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
  }
}

// GET - Get all payments for a repair
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if repair request exists
    const existingRequest = await db.repairRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Repair request not found' }, { status: 404 });
    }

    // Role-based access
    if (user.role === 'customer' && existingRequest.customerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const payments = await db.repairPayment.findMany({
      where: { repairRequestId: id },
      orderBy: { createdAt: 'desc' },
    });

    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const finalCost = existingRequest.finalCost ? Number(existingRequest.finalCost) : 0;

    return NextResponse.json({
      payments,
      summary: {
        totalPaid,
        finalCost,
        balance: finalCost - totalPaid,
        paymentStatus: existingRequest.paymentStatus,
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
