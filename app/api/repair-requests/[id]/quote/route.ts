import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createQuoteSchema = z.object({
  estimatedPartsCost: z.number().min(0),
  estimatedLaborCost: z.number().min(0),
  diagnosticFee: z.number().min(0).default(0),
  warrantyDays: z.number().min(0).optional(),
  validDays: z.number().min(1).default(7),
  notes: z.string().optional(),
});

// POST - Create and send quote to customer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin or technician can create quotes
    if (!['admin', 'technician'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = createQuoteSchema.parse(body);

    // Check if repair request exists
    const existingRequest = await db.repairRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Repair request not found' }, { status: 404 });
    }

    if (existingRequest.status !== 'diagnosed') {
      return NextResponse.json(
        { error: 'Diagnosis must be completed before creating a quote' },
        { status: 400 }
      );
    }

    // Calculate total
    const totalQuote = data.estimatedPartsCost + data.estimatedLaborCost + data.diagnosticFee;

    // Calculate quote valid until date
    const quoteValidUntil = new Date();
    quoteValidUntil.setDate(quoteValidUntil.getDate() + data.validDays);

    // Update repair request with quote
    const repairRequest = await db.repairRequest.update({
      where: { id },
      data: {
        status: 'quote_sent',
        estimatedPartsCost: data.estimatedPartsCost,
        estimatedLaborCost: data.estimatedLaborCost,
        diagnosticFee: data.diagnosticFee,
        totalQuote,
        quoteValidUntil,
        quoteSentAt: new Date(),
        warrantyDays: data.warrantyDays,
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
    const quoteDetails = [
      `Parts: $${data.estimatedPartsCost.toFixed(2)}`,
      `Labor: $${data.estimatedLaborCost.toFixed(2)}`,
      data.diagnosticFee > 0 ? `Diagnostic Fee: $${data.diagnosticFee.toFixed(2)}` : null,
      `Total: $${totalQuote.toFixed(2)}`,
      data.warrantyDays ? `Warranty: ${data.warrantyDays} days` : null,
    ].filter(Boolean).join('. ');

    await db.repairProgress.create({
      data: {
        repairRequestId: id,
        status: 'quote_sent',
        description: `Quote sent to customer. ${quoteDetails}${data.notes ? `. Notes: ${data.notes}` : ''}`,
        photos: [],
        updatedBy: user.id,
        updatedByName: user.fullName || user.email,
      },
    });

    console.log(`Quote sent for repair ${repairRequest.ticketNumber}: $${totalQuote.toFixed(2)}`);

    return NextResponse.json(repairRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating quote:', error);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}
