import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';

// GET - Get available orders for drivers to claim
export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'driver') {
      return NextResponse.json({ error: 'Not a driver' }, { status: 403 });
    }

    // Get orders that need delivery and don't have a driver assigned yet
    const orders = await db.order.findMany({
      where: {
        orderStatus: {
          in: ['pending', 'paid', 'processing'],
        },
        // No driver assigned yet - check that shippingTracking relation doesn't exist
        shippingTracking: {
          is: null,
        },
        // Exclude in-store pickups, allow orders with or without shipping method set
        OR: [
          { shippingMethod: { notIn: ['in_store'] } },
          { shippingMethod: null },
        ],
      },
      include: {
        orderItems: {
          select: {
            id: true,
            productName: true,
            productImage: true,
            quantity: true,
            price: true,
          },
        },
        shippingTracking: true, // Include to verify it's null
      },
      orderBy: {
        createdAt: 'asc', // Oldest orders first
      },
    });

    // Filter out any orders that somehow have tracking (belt and suspenders)
    const availableOrdersFiltered = orders.filter(o => !o.shippingTracking);

    // Transform the data
    const availableOrders = availableOrdersFiltered.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.orderStatus,
      totalAmount: parseFloat(order.totalAmount.toString()),
      itemCount: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
      shippingAddress: order.shippingAddress,
      shippingMethod: order.shippingMethod,
      createdAt: order.createdAt.toISOString(),
      items: order.orderItems.map((item) => ({
        id: item.id,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
      })),
    }));

    return NextResponse.json({ orders: availableOrders });
  } catch (error) {
    console.error('Error fetching available orders:', error);
    return NextResponse.json({ error: 'Failed to fetch available orders' }, { status: 500 });
  }
}
