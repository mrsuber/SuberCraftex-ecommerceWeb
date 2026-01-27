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

    if (!shippingAddress || !billingAddress) {
      console.error('Order creation failed: Missing addresses');
      return NextResponse.json(
        { error: "Shipping and billing addresses are required" },
        { status: 400 }
      );
    }

    // Create order with order items in a transaction
    console.log('Creating order...');
    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user?.id || null,
        guestEmail: user?.email || shippingAddress.email,
        orderStatus: paymentMethod === "cash" ? "pending" : "processing",
        paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
        paymentMethod,
        shippingMethod,
        subtotal,
        shippingCost,
        taxAmount,
        totalAmount,
        shippingAddress,
        billingAddress,
        stripePaymentIntentId: stripePaymentIntentId || null,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.id,
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

    // TODO: Update inventory

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
