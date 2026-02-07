import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const approveQuoteSchema = z.object({
  approved: z.boolean(),
  rejectionReason: z.string().optional(),
});

// POST - Approve or reject quote (customer)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = approveQuoteSchema.parse(body);

    // Check if repair request exists
    const existingRequest = await db.repairRequest.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Repair request not found' }, { status: 404 });
    }

    // Customer can only approve their own requests
    if (user.role === 'customer' && existingRequest.customerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (existingRequest.status !== 'quote_sent') {
      return NextResponse.json(
        { error: 'Quote is not pending approval' },
        { status: 400 }
      );
    }

    // Check if quote has expired
    if (existingRequest.quoteValidUntil && new Date() > existingRequest.quoteValidUntil) {
      return NextResponse.json(
        { error: 'Quote has expired. Please request a new quote.' },
        { status: 400 }
      );
    }

    const newStatus = data.approved ? 'quote_approved' : 'quote_rejected';

    // Update repair request
    const repairRequest = await db.repairRequest.update({
      where: { id },
      data: {
        status: newStatus,
        quoteApprovedAt: data.approved ? new Date() : null,
        finalCost: data.approved ? existingRequest.totalQuote : null,
        warrantyExpiresAt: data.approved && existingRequest.warrantyDays
          ? (() => {
              const date = new Date();
              date.setDate(date.getDate() + existingRequest.warrantyDays);
              return date;
            })()
          : null,
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Add progress entry
    await db.repairProgress.create({
      data: {
        repairRequestId: id,
        status: newStatus,
        description: data.approved
          ? 'Quote approved by customer. Repair can proceed.'
          : `Quote rejected by customer.${data.rejectionReason ? ` Reason: ${data.rejectionReason}` : ''}`,
        photos: [],
        updatedBy: user.id,
        updatedByName: user.fullName || user.email,
      },
    });

    console.log(`Quote ${data.approved ? 'approved' : 'rejected'} for repair ${repairRequest.ticketNumber}`);

    return NextResponse.json(repairRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error processing quote approval:', error);
    return NextResponse.json({ error: 'Failed to process quote approval' }, { status: 500 });
  }
}
