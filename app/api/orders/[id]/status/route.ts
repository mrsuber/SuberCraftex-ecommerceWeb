import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const statusUpdateSchema = z.object({
  orderStatus: z.enum(['pending', 'paid', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded']),
  signatureUrl: z.string().optional(),
  notes: z.string().optional(),
});

// PATCH - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication (driver or admin)
    const user = await requireApiAuth();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and driver can update order status
    if (user.role !== 'admin' && user.role !== 'driver') {
      return NextResponse.json(
        { error: 'Forbidden - Only admins and drivers can update order status' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { orderStatus, signatureUrl, notes } = statusUpdateSchema.parse(body);

    // Check if order exists
    const existingOrder = await db.order.findUnique({
      where: { id },
      include: {
        shippingTracking: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Prevent drivers from delivering to themselves
    if (user.role === 'driver' && existingOrder.userId === user.id) {
      return NextResponse.json(
        { error: 'Delivery agents cannot deliver to themselves. Another agent must complete this delivery.' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: any = {
      orderStatus,
      updatedAt: new Date(),
    };

    // Update delivery timestamp if status is delivered
    if (orderStatus === 'delivered') {
      updateData.deliveredAt = new Date();

      // Automatically mark payment as paid for cash on delivery orders
      if (existingOrder.paymentMethod === 'cash') {
        updateData.paymentStatus = 'paid';
      }
    } else if (orderStatus === 'shipped') {
      updateData.shippedAt = new Date();
    }

    // Update admin notes if provided
    if (notes) {
      updateData.adminNotes = notes;
    }

    // Update the order
    const updatedOrder = await db.order.update({
      where: { id },
      data: updateData,
    });

    // Create or update shipping tracking if signature is provided or if driver is updating
    if (signatureUrl || user.role === 'driver') {
      // Get or create driver record for drivers
      let driverId = null;
      if (user.role === 'driver') {
        const driver = await db.driver.findUnique({
          where: { userId: user.id },
        });
        driverId = driver?.id || null;
      }

      const trackingData: any = {
        status: orderStatus === 'delivered' ? 'delivered' :
                orderStatus === 'out_for_delivery' ? 'out_for_delivery' :
                orderStatus === 'shipped' ? 'in_transit' : 'assigned',
        actualDeliveryTime: orderStatus === 'delivered' ? new Date() : null,
        notes: notes || null,
      };

      // Add signature if provided
      if (signatureUrl) {
        trackingData.signatureUrl = signatureUrl;
      }

      // Add driver if this is a driver updating the order
      if (driverId) {
        trackingData.driverId = driverId;
      }

      if (existingOrder.shippingTracking) {
        // Update existing tracking
        await db.shippingTracking.update({
          where: { orderId: id },
          data: trackingData,
        });
      } else {
        // Create new tracking record
        await db.shippingTracking.create({
          data: {
            orderId: id,
            ...trackingData,
          },
        });
      }
    }

    console.log(`✅ Order ${existingOrder.orderNumber} status updated to ${orderStatus} by ${user.email}`);

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
