import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';

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
    } else if (orderStatus === 'cancelled') {
      updateData.cancelledAt = new Date();
    }

    // Update admin notes if provided
    if (notes) {
      updateData.adminNotes = notes;
    }

    // If cancelling, release inventory in a transaction
    if (orderStatus === 'cancelled' && existingOrder.orderStatus !== 'cancelled') {
      const updatedOrder = await db.$transaction(async (tx) => {
        const order = await tx.order.update({
          where: { id },
          data: updateData,
        });

        // Release inventory for each order item
        for (const item of existingOrder.orderItems) {
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
              orderId: id,
              userId: user.id,
              notes: `Released from cancelled order ${existingOrder.orderNumber}`,
            },
          });
        }

        return order;
      });

      console.log(`✅ Order ${existingOrder.orderNumber} cancelled and inventory released by ${user.email}`);

      return NextResponse.json({
        success: true,
        order: updatedOrder,
      });
    }

    // If delivering, process investor profit distribution in a transaction
    if (orderStatus === 'delivered' && existingOrder.orderStatus !== 'delivered') {
      const result = await db.$transaction(async (tx) => {
        // Update order status
        const order = await tx.order.update({
          where: { id },
          data: updateData,
        });

        const distributions = [];

        // Process each order item for investor profit distribution
        for (const item of existingOrder.orderItems) {
          // Find investor allocations for this product (FIFO order)
          const allocations = await tx.investorProductAllocation.findMany({
            where: {
              productId: item.productId,
              variantId: item.variantId,
              quantityRemaining: { gt: 0 },
            },
            include: {
              investor: true,
            },
            orderBy: { allocatedAt: 'asc' }, // FIFO - First allocated, first sold
          });

          let remainingQuantity = item.quantity;

          for (const allocation of allocations) {
            if (remainingQuantity <= 0) break;

            // Calculate how many units from this allocation to process
            const quantityToProcess = Math.min(remainingQuantity, allocation.quantityRemaining);

            if (quantityToProcess <= 0) continue;

            // Calculate profit for these units
            const salePrice = new Decimal(item.price);
            const costPrice = allocation.purchasePrice;
            const unitProfit = salePrice.sub(costPrice);

            if (unitProfit.gt(0)) {
              const totalProfit = unitProfit.mul(quantityToProcess);
              const companyShare = totalProfit.div(2);
              const investorShare = totalProfit.div(2);

              // Calculate capital to return
              const capitalReturned = costPrice.mul(quantityToProcess);

              // Update investor balances
              const updatedInvestor = await tx.investor.update({
                where: { id: allocation.investorId },
                data: {
                  cashBalance: {
                    increment: capitalReturned, // Return capital
                  },
                  profitBalance: {
                    increment: investorShare, // Add profit
                  },
                  totalProfit: {
                    increment: investorShare,
                  },
                },
              });

              // Update allocation
              await tx.investorProductAllocation.update({
                where: { id: allocation.id },
                data: {
                  quantitySold: {
                    increment: quantityToProcess,
                  },
                  quantityRemaining: {
                    decrement: quantityToProcess,
                  },
                  profitGenerated: {
                    increment: investorShare,
                  },
                  capitalReturned: {
                    increment: capitalReturned,
                  },
                },
              });

              // Create profit distribution record
              await tx.profitDistribution.create({
                data: {
                  investorId: allocation.investorId,
                  orderId: id,
                  productId: item.productId,
                  saleRevenue: salePrice.mul(quantityToProcess),
                  saleCost: costPrice.mul(quantityToProcess),
                  grossProfit: totalProfit,
                  companyShare,
                  investorShare,
                  capitalReturned,
                  description: `Sale of ${quantityToProcess} x ${item.productName}`,
                  notes: `Order: ${existingOrder.orderNumber}`,
                },
              });

              // Create investor transaction record
              await tx.investorTransaction.create({
                data: {
                  investorId: allocation.investorId,
                  type: 'profit_credit',
                  amount: capitalReturned.add(investorShare),
                  balanceAfter: updatedInvestor.cashBalance,
                  profitAfter: updatedInvestor.profitBalance,
                  productId: item.productId,
                  orderId: id,
                  description: `Sale: ${quantityToProcess} x ${item.productName} - Capital: ${capitalReturned}, Profit: ${investorShare}`,
                  notes: `Order: ${existingOrder.orderNumber}`,
                  createdBy: user.id,
                },
              });

              distributions.push({
                investorId: allocation.investorId,
                investorName: allocation.investor.fullName,
                product: item.productName,
                quantity: quantityToProcess,
                capitalReturned: capitalReturned.toString(),
                profitShare: investorShare.toString(),
              });
            }

            remainingQuantity -= quantityToProcess;
          }
        }

        return { order, distributions };
      });

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
