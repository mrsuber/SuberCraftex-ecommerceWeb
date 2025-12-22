import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const goodsReceiptItemSchema = z.object({
  productId: z.string(),
  quantityReceived: z.number().int().positive(),
  condition: z.enum(['good', 'damaged', 'partial']),
  notes: z.string().optional(),
});

const goodsReceiptSchema = z.object({
  purchaseOrderId: z.string(),
  items: z.array(goodsReceiptItemSchema).min(1),
  discrepancyNotes: z.string().optional(),
  photos: z.array(z.string()).optional(),
  signatureUrl: z.string().optional(),
});

// Generate GR number: GR-YYYYMMDD-XXXXX
function generateGRNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `GR-${dateStr}-${random}`;
}

// GET - List all goods receipts
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const purchaseOrderId = searchParams.get('purchaseOrderId');

    const goodsReceipts = await db.goodsReceipt.findMany({
      where: purchaseOrderId ? { purchaseOrderId } : undefined,
      include: {
        purchaseOrder: {
          include: {
            supplier: true,
          },
        },
        receivedBy: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { receivedDate: 'desc' },
    });

    return NextResponse.json({ goodsReceipts });
  } catch (error) {
    console.error('Error fetching goods receipts:', error);
    return NextResponse.json({ error: 'Failed to fetch goods receipts' }, { status: 500 });
  }
}

// POST - Create a goods receipt (receive goods)
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = goodsReceiptSchema.parse(body);

    // Get purchase order with items
    const purchaseOrder = await db.purchaseOrder.findUnique({
      where: { id: validatedData.purchaseOrderId },
      include: {
        items: true,
      },
    });

    if (!purchaseOrder) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }

    // Check if PO is in appropriate status
    if (purchaseOrder.status === 'draft' || purchaseOrder.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot receive goods for purchase orders in draft or cancelled status' },
        { status: 400 }
      );
    }

    // Create goods receipt
    const goodsReceipt = await db.goodsReceipt.create({
      data: {
        receiptNumber: generateGRNumber(),
        purchaseOrderId: validatedData.purchaseOrderId,
        receivedById: user.id,
        items: validatedData.items,
        discrepancyNotes: validatedData.discrepancyNotes,
        photos: validatedData.photos || [],
        signatureUrl: validatedData.signatureUrl,
      },
    });

    // Update purchase order items with received quantities
    for (const receiptItem of validatedData.items) {
      const poItem = purchaseOrder.items.find((item) => item.productId === receiptItem.productId);
      if (poItem) {
        await db.purchaseOrderItem.update({
          where: { id: poItem.id },
          data: {
            quantityReceived: {
              increment: receiptItem.quantityReceived,
            },
          },
        });

        // Update product inventory
        await db.product.update({
          where: { id: receiptItem.productId },
          data: {
            inventoryCount: {
              increment: receiptItem.quantityReceived,
            },
          },
        });

        // Create inventory log
        const product = await db.product.findUnique({
          where: { id: receiptItem.productId },
        });

        if (product) {
          await db.inventoryLog.create({
            data: {
              productId: receiptItem.productId,
              action: receiptItem.condition === 'good' ? 'received' : 'damaged',
              quantityChange: receiptItem.quantityReceived,
              quantityAfter: product.inventoryCount + receiptItem.quantityReceived,
              userId: user.id,
              notes: `Received from PO ${purchaseOrder.poNumber}${receiptItem.notes ? `: ${receiptItem.notes}` : ''}`,
            },
          });
        }
      }
    }

    // Update purchase order status
    const updatedPOItems = await db.purchaseOrderItem.findMany({
      where: { purchaseOrderId: validatedData.purchaseOrderId },
    });

    const allReceived = updatedPOItems.every(
      (item) => item.quantityReceived >= item.quantity
    );
    const partiallyReceived = updatedPOItems.some(
      (item) => item.quantityReceived > 0 && item.quantityReceived < item.quantity
    );

    let newStatus = purchaseOrder.status;
    if (allReceived) {
      newStatus = 'received';
    } else if (partiallyReceived) {
      newStatus = 'partial_received';
    }

    await db.purchaseOrder.update({
      where: { id: validatedData.purchaseOrderId },
      data: { status: newStatus },
    });

    console.log(`✅ Goods Receipt ${goodsReceipt.receiptNumber} created for PO ${purchaseOrder.poNumber} by ${user.email}`);

    return NextResponse.json({ goodsReceipt }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating goods receipt:', error);
    return NextResponse.json({ error: 'Failed to create goods receipt' }, { status: 500 });
  }
}
