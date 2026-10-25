import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import { Accounts } from '@/lib/ledger';
import { cashAccountForStaff } from '@/lib/commerce/order-payments';
import { recordRepairPayment, repairBalance } from '@/lib/services/booking-payments';

const recordPaymentSchema = z.object({
  amount: z.number().int().positive(),
  paymentType: z.enum(['diagnostic_fee', 'deposit', 'final_payment']),
  // mobile_money here means money sent by hand to the shop's own number
  paymentMethod: z.enum(['cash', 'mobile_money']),
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

    const { payment, summary } = await db.$transaction(async (tx) => {
      const into = data.paymentMethod === 'cash' ? (await cashAccountForStaff(tx, user.id)).account : Accounts.shopMobileMoney();
      const payment = await recordRepairPayment(tx, {
        repairId: id,
        amount: BigInt(data.amount),
        paymentType: data.paymentType,
        method: data.paymentMethod,
        into,
        createdBy: user.id,
        reference: data.reference,
      });
      return { payment, summary: await repairBalance(tx, id) };
    });
    const totalPaid = Number(summary.paid);
    const finalCost = Number(summary.total);
    const paymentStatus = (await db.repairRequest.findUniqueOrThrow({ where: { id } })).paymentStatus;

    // Add progress entry
    await db.repairProgress.create({
      data: {
        repairRequestId: id,
        status: 'payment_received',
        description: `Payment received: ${data.amount} FCFA (${data.paymentType.replace(/_/g, ' ')}) via ${data.paymentMethod.replace(/_/g, ' ')}${data.reference ? `. Ref: ${data.reference}` : ''}`,
        photos: [],
        updatedBy: user.id,
        updatedByName: user.fullName || user.email,
      },
    });

    console.log(`Payment recorded for repair ${existingRequest.ticketNumber}: ${data.amount} FCFA`);

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
