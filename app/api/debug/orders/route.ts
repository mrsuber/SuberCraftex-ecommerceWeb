import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch all orders for the user
    const orders = await db.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: true,
      },
    });

    // Also get total order count in database
    const totalOrders = await db.order.count();

    // Get all orders (for debugging)
    const allOrders = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      userOrders: orders,
      userOrderCount: orders.length,
      totalOrdersInDB: totalOrders,
      recentOrdersInDB: allOrders,
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      error: 'Failed to fetch orders',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
