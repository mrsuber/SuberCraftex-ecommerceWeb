import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['draft', 'sent', 'confirmed', 'shipped', 'partial_received', 'received', 'completed', 'cancelled']),
});

const purchaseOrderUpdateSchema = z.object({
  status: z.enum(['draft', 'sent', 'confirmed', 'shipped', 'partial_received', 'received', 'completed', 'cancelled']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  paymentDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

// GET - Get purchase order by ID
export async function GET(
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
        items: {
          include: {
            product: true,
          },
        },
        goodsReceipts: {
          orderBy: { receivedDate: 'desc' },
        },
        createdBy: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!purchaseOrder) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }

    return NextResponse.json({ purchaseOrder });
  } catch (error) {
    console.error('Error fetching purchase order:', error);
    return NextResponse.json({ error: 'Failed to fetch purchase order' }, { status: 500 });
  }
}

// PATCH - Update purchase order
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = purchaseOrderUpdateSchema.parse(body);

    const existingPO = await db.purchaseOrder.findUnique({
      where: { id },
    });

    if (!existingPO) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (validatedData.status) updateData.status = validatedData.status;
    if (validatedData.paymentStatus) updateData.paymentStatus = validatedData.paymentStatus;
    if (validatedData.paymentDate) updateData.paymentDate = new Date(validatedData.paymentDate);
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;

    const purchaseOrder = await db.purchaseOrder.update({
      where: { id },
      data: updateData,
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log(`✅ Purchase Order ${existingPO.poNumber} updated to ${validatedData.status} by ${user.email}`);

    return NextResponse.json({ purchaseOrder });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating purchase order:', error);
    return NextResponse.json({ error: 'Failed to update purchase order' }, { status: 500 });
  }
}

// DELETE - Delete purchase order (only if draft)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existingPO = await db.purchaseOrder.findUnique({
      where: { id },
      include: {
        goodsReceipts: true,
      },
    });

    if (!existingPO) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }

    // Can only delete draft POs with no receipts
    if (existingPO.status !== 'draft') {
      return NextResponse.json(
        { error: 'Can only delete purchase orders in draft status. Consider cancelling instead.' },
        { status: 400 }
      );
    }

    if (existingPO.goodsReceipts.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete purchase order with goods receipts' },
        { status: 400 }
      );
    }

    await db.purchaseOrder.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    console.error('Error deleting purchase order:', error);
    return NextResponse.json({ error: 'Failed to delete purchase order' }, { status: 500 });
  }
}
