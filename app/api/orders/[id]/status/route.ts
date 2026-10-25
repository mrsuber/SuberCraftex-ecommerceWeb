import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import { cancelOrRefundOrder, completeOrder } from '@/lib/commerce/fulfilment';

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
        orderItems: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (user.role === 'driver') {
      // Prevent drivers from delivering to themselves
      if (existingOrder.userId === user.id) {
        return NextResponse.json(
          { error: 'Delivery agents cannot deliver to themselves. Another agent must complete this delivery.' },
          { status: 403 }
        );
      }
      // Drivers only move their own deliveries forward; everything else is an admin decision
      const driver = await db.driver.findUnique({ where: { userId: user.id }, select: { id: true } });
      if (!driver || existingOrder.shippingTracking?.driverId !== driver.id) {
        return NextResponse.json({ error: 'This delivery is not assigned to you' }, { status: 403 });
      }
      if (!['shipped', 'out_for_delivery', 'delivered'].includes(orderStatus)) {
        return NextResponse.json(
          { error: 'Drivers can only mark a delivery as shipped, out for delivery or delivered' },
          { status: 403 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      orderStatus,
      updatedAt: new Date(),
    };

    // Update delivery timestamp if status is delivered
    if (orderStatus === 'delivered') {
      updateData.deliveredAt = new Date();

    } else if (orderStatus === 'shipped') {
      updateData.shippedAt = new Date();
    } else if (orderStatus === 'cancelled') {
      updateData.cancelledAt = new Date();
    }

    // Update admin notes if provided
    if (notes) {
      updateData.adminNotes = notes;
    }

    // Cancelling or refunding: stock back, money paid owed to the customer, investors' share undone
    if ((orderStatus === 'cancelled' || orderStatus === 'refunded') && existingOrder.orderStatus !== orderStatus) {
      try {
        const updatedOrder = await db.$transaction((tx) =>
          cancelOrRefundOrder(tx, id, {
            mode: orderStatus === 'refunded' ? 'refund' : 'cancel',
            actorId: user.id,
            reason: notes ?? null,
          })
        );
        console.log(`✅ Order ${existingOrder.orderNumber} ${orderStatus} by ${user.email}`);
        return NextResponse.json({ success: true, order: updatedOrder });
      } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
      }
    }

    // If delivering, process investor profit distribution in a transaction
    if (orderStatus === 'delivered' && existingOrder.orderStatus !== 'delivered') {
      // Delivered, paid (cash on delivery is recorded with the driver or staff member) and
      // shared with investors, all in one place
      let result;
      try {
        result = await db.$transaction(async (tx) => {
          if (notes) await tx.order.update({ where: { id }, data: { adminNotes: notes } });
          return completeOrder(tx, id, {
            actorId: user.id,
            actorRole: user.role,
            driverId: existingOrder.shippingTracking?.driverId ?? null,
            note: notes ?? null,
          });
        });
      } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
      }

      if (result.distributions.length > 0) {
        console.log(`✅ Order ${existingOrder.orderNumber} delivered - Profit distributed to ${result.distributions.length} investor allocations`);
      }

      // Create/update shipping tracking
      if (signatureUrl || user.role === 'driver') {
        let driverId = null;
        if (user.role === 'driver') {
          const driver = await db.driver.findUnique({
            where: { userId: user.id },
          });
          driverId = driver?.id || null;
        }

        const trackingData: any = {
          status: 'delivered',
          actualDeliveryTime: new Date(),
          notes: notes || null,
        };

        if (signatureUrl) {
          trackingData.signatureUrl = signatureUrl;
        }

        if (driverId) {
          trackingData.driverId = driverId;
        }

        if (existingOrder.shippingTracking) {
          await db.shippingTracking.update({
            where: { orderId: id },
            data: trackingData,
          });
        } else {
          await db.shippingTracking.create({
            data: {
              orderId: id,
              ...trackingData,
            },
          });
        }
      }

      return NextResponse.json({
        success: true,
        order: result.order,
        investorDistributions: result.distributions,
      });
    }

    // Update the order (non-cancellation, non-delivery)
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
