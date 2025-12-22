import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';

// DELETE - Remove a product from wishlist
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

    // Verify the wishlist item belongs to the user
    const existingWishlistItem = await db.wishlist.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingWishlistItem) {
      return NextResponse.json({ error: 'Wishlist item not found' }, { status: 404 });
    }

    await db.wishlist.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}
