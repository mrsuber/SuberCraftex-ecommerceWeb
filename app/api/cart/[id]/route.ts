import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity must be at least 0'),
});

// PUT - Update cart item quantity
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
    const validatedData = updateCartItemSchema.parse(body);

    // Verify the cart item belongs to the user
    const existingCartItem = await db.cartItem.findFirst({
      where: { id, userId: user.id },
      include: { product: true },
    });

    if (!existingCartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // If quantity is 0, delete the item
    if (validatedData.quantity === 0) {
      await db.cartItem.delete({
        where: { id },
      });
      return NextResponse.json({ success: true, deleted: true });
    }

    // Check inventory
    if (
      existingCartItem.product.trackInventory &&
      existingCartItem.product.inventoryCount < validatedData.quantity
    ) {
      return NextResponse.json(
        { error: 'Insufficient inventory' },
        { status: 400 }
      );
    }

    const cartItem = await db.cartItem.update({
      where: { id },
      data: { quantity: validatedData.quantity },
      include: {
        product: true,
        variant: true,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

// DELETE - Remove cart item
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

    // Verify the cart item belongs to the user
    const existingCartItem = await db.cartItem.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingCartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    await db.cartItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
}
