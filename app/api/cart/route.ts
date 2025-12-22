import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { z } from 'zod';

const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

// GET - Fetch all cart items for the current user
export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItems = await db.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            featuredImage: true,
            inventoryCount: true,
          },
        },
        variant: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST - Add a product to cart
export async function POST(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = cartItemSchema.parse(body);

    // Check if product exists and is available
    const product = await db.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (!product.isActive) {
      return NextResponse.json({ error: 'Product is not available' }, { status: 400 });
    }

    // Check inventory
    if (product.trackInventory && product.inventoryCount < validatedData.quantity) {
      return NextResponse.json({ error: 'Insufficient inventory' }, { status: 400 });
    }

    // Check if item already exists in cart
    const existingCartItem = await db.cartItem.findFirst({
      where: {
        userId: user.id,
        productId: validatedData.productId,
        variantId: validatedData.variantId ?? null,
      },
    });

    if (existingCartItem) {
      // Update quantity
      const updatedCartItem = await db.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + validatedData.quantity,
        },
        include: {
          product: true,
          variant: true,
        },
      });

      return NextResponse.json(updatedCartItem);
    }

    // Add new cart item
    const cartItem = await db.cartItem.create({
      data: {
        userId: user.id,
        productId: validatedData.productId,
        variantId: validatedData.variantId ?? null,
        quantity: validatedData.quantity,
      },
      include: {
        product: true,
        variant: true,
      },
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}
