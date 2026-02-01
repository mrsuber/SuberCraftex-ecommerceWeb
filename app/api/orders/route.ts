import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    console.log('Order creation - User:', user?.id, user?.email);

    const body = await request.json();
    console.log('Order creation - Body received:', {
      itemsCount: body.items?.length,
      hasShipping: !!body.shippingAddress,
      hasBilling: !!body.billingAddress,
      total: body.totalAmount
    });

    const {
      items,
      shippingAddress,
      billingAddress,
      shippingMethod,
      paymentMethod,
      subtotal,
      shippingCost,
      taxAmount,
      totalAmount,
      stripePaymentIntentId,
    } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      console.error('Order creation failed: Cart is empty');
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    if (shippingMethod !== 'in_store' && (!shippingAddress || !billingAddress)) {
      console.error('Order creation failed: Missing addresses');
      return NextResponse.json(
        { error: "Shipping and billing addresses are required" },
        { status: 400 }
      );
    }

    // Validate inventory availability before creating order
    const productIds = items.map((item: any) => item.id);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, inventoryCount: true, trackInventory: true },
    });

    const outOfStockItems: { name: string; available: number; requested: number }[] = [];
    for (const item of items) {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        outOfStockItems.push({ name: item.name, available: 0, requested: item.quantity });
        continue;
      }
      if (product.trackInventory && product.inventoryCount < item.quantity) {
        outOfStockItems.push({
          name: product.name,
          available: product.inventoryCount,
          requested: item.quantity,
        });
      }
    }

    if (outOfStockItems.length > 0) {
      return NextResponse.json(
        {
          error: "Insufficient stock for some items",
          outOfStockItems,
        },
        { status: 400 }
      );
    }

    // Create order with inventory reservation in a transaction
    console.log('Creating order...');
    const isPickup = shippingMethod === 'in_store';
    const pickupDeadline = isPickup ? new Date(Date.now() + 12 * 60 * 60 * 1000) : null;

    const order = await db.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: user?.id || null,
          guestEmail: user?.email || shippingAddress?.email,
          orderStatus: paymentMethod === "cash" ? "pending" : "processing",
          paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
          paymentMethod,
          shippingMethod,
          subtotal,
          shippingCost: isPickup ? 0 : shippingCost,
          taxAmount,
          totalAmount: isPickup ? subtotal + taxAmount : totalAmount,
          shippingAddress: shippingAddress || null,
          billingAddress: billingAddress || null,
          stripePaymentIntentId: stripePaymentIntentId || null,
          pickupDeadline,
          orderItems: {
            create: items.map((item: any) => ({
              productId: item.id,
              variantId: item.variantId || null,
              productName: item.name,
              productSku: item.sku || "N/A",
              productImage: item.image,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity,
            })),
          },
        },
        include: {
          orderItems: true,
        },
      });

      // Reserve inventory for each order item
      for (const orderItem of newOrder.orderItems) {
        const updatedProduct = await tx.product.update({
          where: { id: orderItem.productId },
          data: { inventoryCount: { decrement: orderItem.quantity } },
        });

        if (orderItem.variantId) {
          await tx.productVariant.update({
            where: { id: orderItem.variantId },
            data: { inventoryCount: { decrement: orderItem.quantity } },
          });
        }

        await tx.inventoryLog.create({
          data: {
            productId: orderItem.productId,
            variantId: orderItem.variantId,
            action: 'reserved',
            quantityChange: -orderItem.quantity,
            quantityAfter: updatedProduct.inventoryCount,
            orderId: newOrder.id,
            userId: user?.id || null,
            notes: `Reserved for order ${newOrder.orderNumber}`,
          },
        });
      }

      return newOrder;
    });

    console.log('Order created successfully:', order.orderNumber);

    // Create admin notification for new order
    try {
      const { NotificationService } = await import('@/lib/services/notification-service');
      await NotificationService.notifyNewOrder({
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount.toString(),
        customerName: shippingAddress.fullName,
      });
      console.log('✅ Admin notification created for new order');
    } catch (notifError) {
      console.error('⚠️  Failed to create admin notification:', notifError);
    }

    // Send order confirmation email
    try {
      const { sendEmail } = await import('@/lib/email/mailer');
      const { getOrderConfirmationTemplate } = await import('@/lib/email/templates/order-confirmation');

      const emailData = {
        orderNumber: order.orderNumber,
        customerName: shippingAddress.fullName,
        customerEmail: user?.email || shippingAddress.email,
        orderDate: new Date(order.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        items: order.orderItems.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          price: parseFloat(item.price.toString()),
          total: parseFloat(item.total.toString()),
        })),
        subtotal: parseFloat(order.subtotal.toString()),
        shippingCost: parseFloat(order.shippingCost.toString()),
        taxAmount: parseFloat(order.taxAmount.toString()),
        totalAmount: parseFloat(order.totalAmount.toString()),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        paymentMethod: order.paymentMethod as 'card' | 'cash',
        paymentStatus: order.paymentStatus,
        trackingUrl: order.trackingNumber
          ? `${process.env.NEXT_PUBLIC_APP_URL}/track/${order.id}`
          : undefined,
      };

      const { html, text } = getOrderConfirmationTemplate(emailData);

      await sendEmail({
        to: user?.email || shippingAddress.email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html,
        text,
      });

      console.log('✅ Order confirmation email sent');
    } catch (emailError) {
      // Don't fail the order if email fails
      console.error('⚠️  Failed to send order confirmation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.totalAmount,
        status: order.orderStatus,
      },
    });
  } catch (error) {
    console.error("Order API error:", error);
    console.error("Error details:", error instanceof Error ? error.message : 'Unknown error');
    console.error("Error stack:", error instanceof Error ? error.stack : '');
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await db.order.findMany({
      where: { userId: user.id },
      include: {
        orderItems: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
