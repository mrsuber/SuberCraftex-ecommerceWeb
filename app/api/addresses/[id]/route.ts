import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { z } from 'zod';

const addressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  label: z.string().optional(),
  isDefault: z.boolean().optional(),
});

// PUT - Update an address
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = addressSchema.parse(body);

    // Verify the address belongs to the user
    const existingAddress = await db.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // If this is set as default, update all other addresses to not be default
    if (validatedData.isDefault) {
      await db.address.updateMany({
        where: { userId: user.id, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const address = await db.address.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(address);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

// DELETE - Delete an address
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify the address belongs to the user
    const existingAddress = await db.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    await db.address.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}

// PATCH - Set address as default
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify the address belongs to the user
    const existingAddress = await db.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Update all addresses to not be default
    await db.address.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    });

    // Set this address as default
    const address = await db.address.update({
      where: { id },
      data: { isDefault: true },
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error('Error setting default address:', error);
    return NextResponse.json({ error: 'Failed to set default address' }, { status: 500 });
  }
}
