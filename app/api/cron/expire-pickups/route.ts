import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Find all expired pickup orders
    const expiredOrders = await db.order.findMany({
      where: {
        shippingMethod: 'in_store',
        orderStatus: 'pending',
        pickupDeadline: { lt: now },
      },
      include: {
        orderItems: true,
      },
    });

    if (expiredOrders.length === 0) {
      return NextResponse.json({ cancelled: 0, message: 'No expired pickup orders' });
    }

    let cancelledCount = 0;

    for (const order of expiredOrders) {
      try {
        await db.$transaction(async (tx) => {
          // Cancel the order
          await tx.order.update({
            where: { id: order.id },
            data: {
              orderStatus: 'cancelled',
              cancelledAt: now,
              adminNotes: 'Auto-cancelled: pickup deadline expired',
            },
          });

          // Release inventory for each item
          for (const item of order.orderItems) {
            const updatedProduct = await tx.product.update({
              where: { id: item.productId },
              data: { inventoryCount: { increment: item.quantity } },
            });

            if (item.variantId) {
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: { inventoryCount: { increment: item.quantity } },
              });
            }

            await tx.inventoryLog.create({
              data: {
                productId: item.productId,
                variantId: item.variantId,
                action: 'released',
                quantityChange: item.quantity,
                quantityAfter: updatedProduct.inventoryCount,
                orderId: order.id,
                notes: `Auto-released: pickup deadline expired for order ${order.orderNumber}`,
              },
            });
          }
        });

        // Send cancellation email
        try {
          const { sendEmail } = await import('@/lib/email/mailer');
          const customerEmail = order.guestEmail || (order.userId ? (await db.user.findUnique({ where: { id: order.userId }, select: { email: true } }))?.email : null);

          if (customerEmail) {
            const customerName = (order.shippingAddress as any)?.fullName || 'Customer';
            await sendEmail({
              to: customerEmail,
              subject: `Order ${order.orderNumber} - Pickup Expired`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #D4AF76;">SuberCraftex</h2>
                  <h3>Your order has been cancelled</h3>
                  <p>Hi ${customerName},</p>
                  <p>Your order <strong>#${order.orderNumber}</strong> has been automatically cancelled because it was not picked up within 12 hours.</p>
                  <p>All items have been returned to stock. If you'd like to place a new order, please visit our store or app.</p>
                  <p>If you have any questions, please contact us at support@subercraftex.com</p>
                  <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">&copy; ${new Date().getFullYear()} SuberCraftex</p>
                </div>
              `,
              text: `Your order #${order.orderNumber} has been automatically cancelled because it was not picked up within 12 hours. All items have been returned to stock.`,
            });
          }
        } catch (emailError) {
          console.error(`Failed to send expiry email for order ${order.orderNumber}:`, emailError);
        }

        cancelledCount++;
        console.log(`✅ Auto-cancelled expired pickup order: ${order.orderNumber}`);
      } catch (orderError) {
        console.error(`Failed to cancel order ${order.orderNumber}:`, orderError);
      }
    }

    return NextResponse.json({
      cancelled: cancelledCount,
      message: `Cancelled ${cancelledCount} expired pickup orders`,
    });
  } catch (error) {
    console.error('Expire pickups cron error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
