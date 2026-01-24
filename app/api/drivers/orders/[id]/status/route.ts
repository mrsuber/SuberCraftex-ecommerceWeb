import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';

// PATCH - Update delivery status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: trackingId } = await params;
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'driver') {
      return NextResponse.json({ error: 'Not a driver' }, { status: 403 });
    }

    const body = await request.json();
    const { status, location, notes, signatureUrl, photoUrl } = body;

    // Valid status transitions
    const validStatuses = ['assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Get driver profile
    const driver = await db.driver.findUnique({
      where: { userId: user.id },
    });

    if (!driver) {
      return NextResponse.json({ error: 'Driver profile not found' }, { status: 404 });
    }

    // Get the tracking record
    const tracking = await db.shippingTracking.findUnique({
      where: { id: trackingId },
      include: { order: true },
    });

    if (!tracking) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Verify this is the driver's delivery
    if (tracking.driverId !== driver.id) {
      return NextResponse.json({ error: 'This delivery is not assigned to you' }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (location) {
      updateData.currentLocation = location;
    }
    if (notes) {
      updateData.notes = notes;
    }
    if (signatureUrl) {
      updateData.signatureUrl = signatureUrl;
    }
    if (photoUrl) {
      updateData.photoUrl = photoUrl;
    }

    // Handle delivery completion
    if (status === 'delivered') {
      updateData.actualDeliveryTime = new Date();

      // Update order status
      await db.order.update({
        where: { id: tracking.orderId },
        data: {
          orderStatus: 'delivered',
          deliveredAt: new Date(),
          // If payment was cash on delivery, mark as paid
          ...(tracking.order.paymentMethod === 'cash' && {
            paymentStatus: 'paid',
            paidAt: new Date(),
          }),
        },
      });

      // Update driver stats
      await db.driver.update({
        where: { id: driver.id },
        data: {
          totalDeliveries: {
            increment: 1,
          },
        },
      });
    }

    // Handle failed delivery
    if (status === 'failed') {
      await db.order.update({
        where: { id: tracking.orderId },
        data: {
          orderStatus: 'processing', // Reset to processing so it can be reassigned
        },
      });
    }

    // Update tracking
    const updatedTracking = await db.shippingTracking.update({
      where: { id: trackingId },
      data: updateData,
    });

    // Create tracking history entry
    await db.trackingHistory.create({
      data: {
        trackingId: trackingId,
        location: location || `Status updated to ${status}`,
      },
    });

    console.log(`✅ Delivery ${trackingId} status updated to ${status} by driver ${driver.fullName}`);

    return NextResponse.json({
      success: true,
      tracking: {
        id: updatedTracking.id,
        status: updatedTracking.status,
        currentLocation: updatedTracking.currentLocation,
        actualDeliveryTime: updatedTracking.actualDeliveryTime?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    return NextResponse.json({ error: 'Failed to update delivery status' }, { status: 500 });
  }
}
