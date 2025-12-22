import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { sendEmail } from '@/lib/email/mailer';
import { getPurchaseOrderTemplate } from '@/lib/email/templates/purchase-order';

const purchaseOrderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

const purchaseOrderSchema = z.object({
  supplierId: z.string(),
  expectedDeliveryDate: z.string().datetime().optional(),
  paymentTerms: z.string(),
  notes: z.string().optional(),
  taxAmount: z.number().default(0),
  shippingCost: z.number().default(0),
  items: z.array(purchaseOrderItemSchema).min(1),
});

// Generate PO number: PO-YYYYMMDD-XXXXX
function generatePONumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PO-${dateStr}-${random}`;
}

// GET - List all purchase orders
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const supplierId = searchParams.get('supplierId');

    const where: Prisma.PurchaseOrderWhereInput = {};
    if (status) where.status = status as any;
    if (supplierId) where.supplierId = supplierId;

    const purchaseOrders = await db.purchaseOrder.findMany({
      where,
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
        createdBy: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ purchaseOrders });
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json({ error: 'Failed to fetch purchase orders' }, { status: 500 });
  }
}

// POST - Create a new purchase order
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = purchaseOrderSchema.parse(body);

    // Calculate totals
    const subtotal = validatedData.items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    const totalAmount = subtotal + validatedData.taxAmount + validatedData.shippingCost;

    // Get supplier info for payment terms if not provided
    const supplier = await db.supplier.findUnique({
      where: { id: validatedData.supplierId },
    });

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    // Create purchase order with items
    const purchaseOrder = await db.purchaseOrder.create({
      data: {
        poNumber: generatePONumber(),
        supplierId: validatedData.supplierId,
        expectedDeliveryDate: validatedData.expectedDeliveryDate
          ? new Date(validatedData.expectedDeliveryDate)
          : null,
        paymentTerms: validatedData.paymentTerms || supplier.paymentTerms,
        notes: validatedData.notes,
        subtotal: new Prisma.Decimal(subtotal),
        taxAmount: new Prisma.Decimal(validatedData.taxAmount),
        shippingCost: new Prisma.Decimal(validatedData.shippingCost),
        totalAmount: new Prisma.Decimal(totalAmount),
        createdById: user.id,
        items: {
          create: validatedData.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: new Prisma.Decimal(item.unitPrice),
            lineTotal: new Prisma.Decimal(item.quantity * item.unitPrice),
          })),
        },
      },
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log(`✅ Purchase Order ${purchaseOrder.poNumber} created by ${user.email}`);

    // Send email notification to supplier
    try {
      const emailData = {
        poNumber: purchaseOrder.poNumber,
        supplierName: purchaseOrder.supplier.name,
        supplierEmail: purchaseOrder.supplier.email,
        orderDate: purchaseOrder.orderDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        expectedDeliveryDate: purchaseOrder.expectedDeliveryDate
          ? purchaseOrder.expectedDeliveryDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : undefined,
        items: purchaseOrder.items.map((item) => ({
          productName: item.product.name,
          productSku: item.product.sku,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          lineTotal: Number(item.lineTotal),
        })),
        subtotal: Number(purchaseOrder.subtotal),
        taxAmount: Number(purchaseOrder.taxAmount),
        shippingCost: Number(purchaseOrder.shippingCost),
        totalAmount: Number(purchaseOrder.totalAmount),
        paymentTerms: purchaseOrder.paymentTerms,
        notes: purchaseOrder.notes || undefined,
        companyName: process.env.NEXT_PUBLIC_APP_NAME || 'SuberCraftex',
        companyEmail: process.env.SMTP_FROM_EMAIL || 'orders@subercraftex.com',
      };

      const { html, text } = getPurchaseOrderTemplate(emailData);

      await sendEmail({
        to: purchaseOrder.supplier.email,
        subject: `Purchase Order ${purchaseOrder.poNumber} from ${emailData.companyName}`,
        html,
        text,
      });

      console.log(`✅ Purchase Order email sent to ${purchaseOrder.supplier.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send purchase order email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ purchaseOrder }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating purchase order:', error);
    return NextResponse.json({ error: 'Failed to create purchase order' }, { status: 500 });
  }
}
