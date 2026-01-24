import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';

// GET - Get driver's assigned deliveries
export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'driver') {
      return NextResponse.json({ error: 'Not a driver' }, { status: 403 });
    }

    // Get driver profile
    const driver = await db.driver.findUnique({
      where: { userId: user.id },
    });

    if (!driver) {
      return NextResponse.json({ error: 'Driver profile not found' }, { status: 404 });
    }

    // Get URL params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'active' | 'completed' | 'all'

    // Build where clause
    const whereClause: any = {
      driverId: driver.id,
    };

    if (status === 'active') {
      whereClause.status = {
        notIn: ['delivered', 'failed'],
      };
    } else if (status === 'completed') {
      whereClause.status = {
        in: ['delivered', 'failed'],
      };
    }

    const deliveries = await db.shippingTracking.findMany({
      where: whereClause,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            orderStatus: true,
            totalAmount: true,
            shippingAddress: true,
            customerName: true,
            customerPhone: true,
            customerNotes: true,
            createdAt: true,
            orderItems: {
              select: {
                id: true,
                productName: true,
                productImage: true,
                quantity: true,
              },
            },
          },
        },
        trackingHistory: {
          orderBy: {
            recordedAt: 'desc',
          },
          take: 5,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data
    const transformedDeliveries = deliveries.map((delivery) => ({
      id: delivery.id,
      orderId: delivery.orderId,
      status: delivery.status,
      orderNumber: delivery.order.orderNumber,
      totalAmount: parseFloat(delivery.order.totalAmount.toString()),
      shippingAddress: delivery.order.shippingAddress,
      customerName: delivery.order.customerName,
      customerPhone: delivery.order.customerPhone,
      customerNotes: delivery.order.customerNotes,
      estimatedDeliveryTime: delivery.estimatedDeliveryTime?.toISOString() || null,
      actualDeliveryTime: delivery.actualDeliveryTime?.toISOString() || null,
      currentLocation: delivery.currentLocation,
      notes: delivery.notes,
      createdAt: delivery.createdAt.toISOString(),
      items: delivery.order.orderItems.map((item) => ({
        id: item.id,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
      })),
      history: delivery.trackingHistory.map((h) => ({
        id: h.id,
        location: h.location,
        recordedAt: h.recordedAt.toISOString(),
      })),
    }));

    return NextResponse.json({ deliveries: transformedDeliveries });
  } catch (error) {
    console.error('Error fetching driver deliveries:', error);
    return NextResponse.json({ error: 'Failed to fetch deliveries' }, { status: 500 });
  }
}
