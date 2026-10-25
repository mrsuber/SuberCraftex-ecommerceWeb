import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { createOrder } from "@/lib/commerce/orders";
import { OutOfStockError, parseLines, PricingError } from "@/lib/commerce/pricing";

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    const body = await request.json();
    const { items, shippingAddress, billingAddress, shippingMethod, paymentMethod, customerNotes } = body;

    // Prices, delivery cost and totals are worked out on the server; any amounts in the
    // request are ignored
    let order;
    try {
      order = await createOrder({
        userId: user?.id ?? null,
        userEmail: user?.email ?? null,
        lines: parseLines(items),
        shippingMethod,
        paymentMethod,
        shippingAddress,
        billingAddress,
        customerNotes,
      });
    } catch (error) {
      if (error instanceof OutOfStockError) {
        return NextResponse.json(
          { error: 'Insufficient stock for some items', outOfStockItems: error.items },
          { status: 400 }
        );
      }
      if (error instanceof PricingError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }

    console.log('Order created successfully:', order.orderNumber);

    // Create admin notification for new order
    try {
      const { NotificationService } = await import('@/lib/services/notification-service');
      await NotificationService.notifyNewOrder({
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount.toString(),
        customerName: order.customerName || 'Customer',
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
        customerName: order.customerName || 'Customer',
        customerEmail: order.guestEmail || '',
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
        shippingAddress: (order.shippingAddress as any) || {},
        paymentMethod: order.paymentMethod as 'card' | 'cash',
        paymentStatus: order.paymentStatus,
        trackingUrl: order.trackingNumber
          ? `${process.env.NEXT_PUBLIC_APP_URL}/track/${order.id}`
          : undefined,
      };

      const { html, text } = getOrderConfirmationTemplate(emailData);

      await sendEmail({
        to: order.guestEmail || '',
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
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
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
