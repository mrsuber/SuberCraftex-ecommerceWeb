import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const pickupSchema = z.object({
  customerSignature: z.string().optional(),
  notes: z.string().optional(),
});

// POST - Mark device as picked up by customer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin or technician can mark as picked up
    if (!['admin', 'technician'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = pickupSchema.parse(body);

    // Check if repair request exists
    const existingRequest = await db.repairRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Repair request not found' }, { status: 404 });
    }

    if (existingRequest.status !== 'ready_for_pickup') {
      return NextResponse.json(
        { error: 'Repair must be ready for pickup' },
        { status: 400 }
      );
    }

    // Check if payment is complete
    const payments = await db.repairPayment.findMany({
      where: { repairRequestId: id },
    });

    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const finalCost = existingRequest.finalCost ? Number(existingRequest.finalCost) : 0;

    if (totalPaid < finalCost) {
      return NextResponse.json(
        {
          error: 'Payment not complete',
          details: {
            finalCost,
            totalPaid,
            balance: finalCost - totalPaid,
          }
        },
        { status: 400 }
      );
    }

    // Update repair request
    const repairRequest = await db.repairRequest.update({
      where: { id },
      data: {
        status: 'completed',
        customerPickedUpAt: new Date(),
        customerSignature: data.customerSignature,
        paymentStatus: 'paid',
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        technician: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    // Add progress entry
    await db.repairProgress.create({
      data: {
        repairRequestId: id,
        status: 'completed',
        description: `Device picked up by customer.${data.notes ? ` Notes: ${data.notes}` : ''}`,
        photos: [],
        updatedBy: user.id,
        updatedByName: user.fullName || user.email,
      },
    });

    console.log(`Device picked up for repair ${repairRequest.ticketNumber}`);

    return NextResponse.json(repairRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error processing pickup:', error);
    return NextResponse.json({ error: 'Failed to process pickup' }, { status: 500 });
  }
}
