import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';

// POST - Assign driver to order
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, driverId, estimatedDeliveryTime, notes } = body;

    if (!orderId || !driverId) {
      return NextResponse.json({ error: 'Order ID and Driver ID are required' }, { status: 400 });
    }

    // Check if order exists
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if driver exists
    const driver = await db.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    // Check if order already has tracking
    const existingTracking = await db.shippingTracking.findUnique({
      where: { orderId },
    });

    if (existingTracking) {
      return NextResponse.json({ error: 'Order already has tracking assigned' }, { status: 400 });
    }

    // Create shipping tracking
    const tracking = await db.shippingTracking.create({
      data: {
        orderId,
        driverId,
        status: 'assigned',
        estimatedDeliveryTime: estimatedDeliveryTime ? new Date(estimatedDeliveryTime) : null,
        notes,
      },
    });

    // Update order status
    await db.order.update({
      where: { id: orderId },
      data: { orderStatus: 'shipped' },
    });

    // Create initial tracking history
    await db.trackingHistory.create({
      data: {
        trackingId: tracking.id,
        location: 'Assigned to driver',
      },
    });

    console.log(`✅ Driver ${driver.fullName} assigned to order ${order.orderNumber}`);

    return NextResponse.json(tracking, { status: 201 });
  } catch (error) {
    console.error('Error assigning driver:', error);
    return NextResponse.json({ error: 'Failed to assign driver' }, { status: 500 });
  }
}
