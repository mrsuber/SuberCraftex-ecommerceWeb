import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const supplierSchema = z.object({
  name: z.string().min(1),
  contactPerson: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  paymentTerms: z.string().default('net_30'),
  taxId: z.string().optional(),
  bankDetails: z.object({
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
});

// GET - List all suppliers
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const suppliers = await db.supplier.findMany({
      where: isActive ? { isActive: isActive === 'true' } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ suppliers });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}

// POST - Create a new supplier
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = supplierSchema.parse(body);

    // Check if supplier with this email already exists
    const existingSupplier = await db.supplier.findUnique({
      where: { email: validatedData.email },
    });

    if (existingSupplier) {
      return NextResponse.json(
        { error: 'Supplier with this email already exists' },
        { status: 400 }
      );
    }

    const supplier = await db.supplier.create({
      data: validatedData,
    });

    return NextResponse.json({ supplier }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating supplier:', error);
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
  }
}
