import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';

// POST - Driver claims an order for delivery
export async function POST(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'driver') {
      return NextResponse.json({ error: 'Not a driver' }, { status: 403 });
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Get driver profile or create one if it doesn't exist
    let driver = await db.driver.findUnique({
      where: { userId: user.id },
    });

    if (!driver) {
      // Auto-create driver profile for users with driver role
      const userRecord = await db.user.findUnique({
        where: { id: user.id },
        select: { fullName: true, email: true, phone: true },
      });

      driver = await db.driver.create({
        data: {
          userId: user.id,
          fullName: userRecord?.fullName || user.email.split('@')[0],
          email: user.email,
          phone: userRecord?.phone || '',
          vehicleType: 'Motorcycle',
          vehicleNumber: 'Not Set',
          licenseNumber: 'Not Set',
          isActive: true,
          isAvailable: true,
        },
      });

      console.log(`✅ Auto-created driver profile for ${driver.fullName}`);
    }

    if (!driver.isActive) {
      return NextResponse.json({ error: 'Driver account is not active' }, { status: 403 });
    }

    // Check how many active deliveries driver has
    const activeDeliveries = await db.shippingTracking.count({
      where: {
        driverId: driver.id,
        status: {
          notIn: ['delivered', 'failed'],
        },
      },
    });

    if (activeDeliveries >= 5) {
      return NextResponse.json({
        error: 'You have reached the maximum number of active deliveries (5). Complete some deliveries first.'
      }, { status: 400 });
    }

    // Check if order exists and is available
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        shippingTracking: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.shippingTracking) {
      return NextResponse.json({ error: 'This order has already been claimed' }, { status: 400 });
    }

    if (!['pending', 'paid', 'processing'].includes(order.orderStatus)) {
      return NextResponse.json({ error: 'This order is not available for delivery' }, { status: 400 });
    }

    // Create shipping tracking and update order in a transaction
    const [tracking] = await db.$transaction([
      // Create shipping tracking
      db.shippingTracking.create({
        data: {
          orderId: order.id,
          driverId: driver.id,
          status: 'assigned',
          deliveryLocation: order.shippingAddress ? JSON.stringify(order.shippingAddress) : null,
          notes: `Claimed by driver ${driver.fullName}`,
        },
      }),
      // Update order status
      db.order.update({
        where: { id: orderId },
        data: { orderStatus: 'shipped' },
      }),
    ]);

    // Create initial tracking history
    await db.trackingHistory.create({
      data: {
        trackingId: tracking.id,
        location: 'Order claimed by driver',
      },
    });

    console.log(`✅ Driver ${driver.fullName} claimed order ${order.orderNumber}`);

    return NextResponse.json({
      success: true,
      message: 'Order claimed successfully',
      tracking: {
        id: tracking.id,
        orderId: tracking.orderId,
        status: tracking.status,
      },
    });
  } catch (error) {
    console.error('Error claiming order:', error);
    return NextResponse.json({ error: 'Failed to claim order' }, { status: 500 });
  }
}
