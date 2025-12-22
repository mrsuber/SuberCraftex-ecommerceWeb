import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';

// PATCH - Manual inventory adjustment
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

    const { adjustment, reason, action } = body;

    if (!adjustment || !reason || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: adjustment, reason, action' },
        { status: 400 }
      );
    }

    // Validate action type
    const validActions = ['adjustment', 'damaged', 'returned'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${validActions.join(', ')}` },
        { status: 400 }
      );
    }

    // Get current product
    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Calculate new inventory count
    const adjustmentAmount = parseInt(adjustment);
    const newInventory = product.inventoryCount + adjustmentAmount;

    if (newInventory < 0) {
      return NextResponse.json(
        { error: `Cannot reduce inventory below 0. Current: ${product.inventoryCount}, Trying to subtract: ${Math.abs(adjustmentAmount)}` },
        { status: 400 }
      );
    }

    // Update product inventory
    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        inventoryCount: newInventory,
      },
    });

    // Create inventory log
    await db.inventoryLog.create({
      data: {
        productId: id,
        action: action,
        quantityChange: adjustmentAmount,
        quantityAfter: newInventory,
        userId: user.id,
        notes: reason,
      },
    });

    console.log(
      `✅ Manual inventory adjustment for ${product.name}: ${adjustmentAmount} (${action}) by ${user.email}. New stock: ${newInventory}`
    );

    return NextResponse.json({
      product: updatedProduct,
      previousInventory: product.inventoryCount,
      newInventory,
      adjustment: adjustmentAmount,
    });
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    return NextResponse.json({ error: 'Failed to adjust inventory' }, { status: 500 });
  }
}
