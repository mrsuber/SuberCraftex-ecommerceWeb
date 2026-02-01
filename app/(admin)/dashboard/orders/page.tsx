import { db } from "@/lib/db";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Orders - Admin Dashboard",
  description: "Manage customer orders",
};

export default async function OrdersPage() {
  const [ordersRaw, count] = await Promise.all([
    db.order.findMany({
      include: {
        orderItems: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.order.count(),
  ]);

  // Map Prisma result to match expected type
  const orders = ordersRaw.map((order) => ({
    id: order.id,
    order_number: order.orderNumber,
    user_id: order.userId,
    guest_email: order.guestEmail,
    status: order.orderStatus as any,
    payment_status: order.paymentStatus as any,
    payment_method: order.paymentMethod as any,
    shipping_method: order.shippingMethod as any,
    subtotal: Number(order.subtotal),
    shipping_cost: Number(order.shippingCost),
    tax_amount: Number(order.taxAmount),
    discount_amount: Number(order.discountAmount),
    total_amount: Number(order.totalAmount),
    shipping_address: order.shippingAddress as any,
    billing_address: order.billingAddress as any,
    stripe_payment_intent_id: order.stripePaymentIntentId,
    stripe_charge_id: order.stripeChargeId,
    tracking_number: order.trackingNumber,
    carrier: order.carrier,
    estimated_delivery_date: order.estimatedDeliveryDate?.toISOString() || null,
    customer_notes: order.customerNotes,
    admin_notes: order.adminNotes,
    coupon_code: order.couponCode,
    metadata: {},
    created_at: order.createdAt.toISOString(),
    updated_at: order.updatedAt.toISOString(),
    paid_at: order.paidAt?.toISOString() || null,
    shipped_at: order.shippedAt?.toISOString() || null,
    delivered_at: order.deliveredAt?.toISOString() || null,
    cancelled_at: order.cancelledAt?.toISOString() || null,
    pickup_deadline: (order as any).pickupDeadline?.toISOString() || null,
  }));

  const pendingOrders = ordersRaw?.filter((o) => o.orderStatus === "pending") || [];
  const processingOrders = ordersRaw?.filter((o) => o.orderStatus === "processing") || [];
  const shippedOrders = ordersRaw?.filter((o) => o.orderStatus === "shipped") || [];
  const deliveredOrders = ordersRaw?.filter((o) => o.orderStatus === "delivered") || [];

  const pendingOrdersMapped = pendingOrders.map((order) => ({
    id: order.id,
    order_number: order.orderNumber,
    user_id: order.userId,
    guest_email: order.guestEmail,
    status: order.orderStatus as any,
    payment_status: order.paymentStatus as any,
    payment_method: order.paymentMethod as any,
    shipping_method: order.shippingMethod as any,
    subtotal: Number(order.subtotal),
    shipping_cost: Number(order.shippingCost),
    tax_amount: Number(order.taxAmount),
    discount_amount: Number(order.discountAmount),
    total_amount: Number(order.totalAmount),
    shipping_address: order.shippingAddress as any,
    billing_address: order.billingAddress as any,
    stripe_payment_intent_id: order.stripePaymentIntentId,
    stripe_charge_id: order.stripeChargeId,
    tracking_number: order.trackingNumber,
    carrier: order.carrier,
    estimated_delivery_date: order.estimatedDeliveryDate?.toISOString() || null,
    customer_notes: order.customerNotes,
    admin_notes: order.adminNotes,
    coupon_code: order.couponCode,
    metadata: {},
    created_at: order.createdAt.toISOString(),
    updated_at: order.updatedAt.toISOString(),
    paid_at: order.paidAt?.toISOString() || null,
    shipped_at: order.shippedAt?.toISOString() || null,
    delivered_at: order.deliveredAt?.toISOString() || null,
    cancelled_at: order.cancelledAt?.toISOString() || null,
    pickup_deadline: (order as any).pickupDeadline?.toISOString() || null,
  }));

  const processingOrdersMapped = processingOrders.map((order) => ({
    id: order.id,
    order_number: order.orderNumber,
    user_id: order.userId,
    guest_email: order.guestEmail,
    status: order.orderStatus as any,
    payment_status: order.paymentStatus as any,
    payment_method: order.paymentMethod as any,
    shipping_method: order.shippingMethod as any,
    subtotal: Number(order.subtotal),
    shipping_cost: Number(order.shippingCost),
    tax_amount: Number(order.taxAmount),
    discount_amount: Number(order.discountAmount),
    total_amount: Number(order.totalAmount),
    shipping_address: order.shippingAddress as any,
    billing_address: order.billingAddress as any,
    stripe_payment_intent_id: order.stripePaymentIntentId,
    stripe_charge_id: order.stripeChargeId,
    tracking_number: order.trackingNumber,
    carrier: order.carrier,
    estimated_delivery_date: order.estimatedDeliveryDate?.toISOString() || null,
    customer_notes: order.customerNotes,
    admin_notes: order.adminNotes,
    coupon_code: order.couponCode,
    metadata: {},
    created_at: order.createdAt.toISOString(),
    updated_at: order.updatedAt.toISOString(),
    paid_at: order.paidAt?.toISOString() || null,
    shipped_at: order.shippedAt?.toISOString() || null,
    delivered_at: order.deliveredAt?.toISOString() || null,
    cancelled_at: order.cancelledAt?.toISOString() || null,
    pickup_deadline: (order as any).pickupDeadline?.toISOString() || null,
  }));

  const shippedOrdersMapped = shippedOrders.map((order) => ({
    id: order.id,
    order_number: order.orderNumber,
    user_id: order.userId,
    guest_email: order.guestEmail,
    status: order.orderStatus as any,
    payment_status: order.paymentStatus as any,
    payment_method: order.paymentMethod as any,
    shipping_method: order.shippingMethod as any,
    subtotal: Number(order.subtotal),
    shipping_cost: Number(order.shippingCost),
    tax_amount: Number(order.taxAmount),
    discount_amount: Number(order.discountAmount),
    total_amount: Number(order.totalAmount),
    shipping_address: order.shippingAddress as any,
    billing_address: order.billingAddress as any,
    stripe_payment_intent_id: order.stripePaymentIntentId,
    stripe_charge_id: order.stripeChargeId,
    tracking_number: order.trackingNumber,
    carrier: order.carrier,
    estimated_delivery_date: order.estimatedDeliveryDate?.toISOString() || null,
    customer_notes: order.customerNotes,
    admin_notes: order.adminNotes,
    coupon_code: order.couponCode,
    metadata: {},
    created_at: order.createdAt.toISOString(),
    updated_at: order.updatedAt.toISOString(),
    paid_at: order.paidAt?.toISOString() || null,
    shipped_at: order.shippedAt?.toISOString() || null,
    delivered_at: order.deliveredAt?.toISOString() || null,
    cancelled_at: order.cancelledAt?.toISOString() || null,
    pickup_deadline: (order as any).pickupDeadline?.toISOString() || null,
  }));

  const deliveredOrdersMapped = deliveredOrders.map((order) => ({
    id: order.id,
    order_number: order.orderNumber,
    user_id: order.userId,
    guest_email: order.guestEmail,
    status: order.orderStatus as any,
    payment_status: order.paymentStatus as any,
    payment_method: order.paymentMethod as any,
    shipping_method: order.shippingMethod as any,
    subtotal: Number(order.subtotal),
    shipping_cost: Number(order.shippingCost),
    tax_amount: Number(order.taxAmount),
    discount_amount: Number(order.discountAmount),
    total_amount: Number(order.totalAmount),
    shipping_address: order.shippingAddress as any,
    billing_address: order.billingAddress as any,
    stripe_payment_intent_id: order.stripePaymentIntentId,
    stripe_charge_id: order.stripeChargeId,
    tracking_number: order.trackingNumber,
    carrier: order.carrier,
    estimated_delivery_date: order.estimatedDeliveryDate?.toISOString() || null,
    customer_notes: order.customerNotes,
    admin_notes: order.adminNotes,
    coupon_code: order.couponCode,
    metadata: {},
    created_at: order.createdAt.toISOString(),
    updated_at: order.updatedAt.toISOString(),
    paid_at: order.paidAt?.toISOString() || null,
    shipped_at: order.shippedAt?.toISOString() || null,
    delivered_at: order.deliveredAt?.toISOString() || null,
    cancelled_at: order.cancelledAt?.toISOString() || null,
    pickup_deadline: (order as any).pickupDeadline?.toISOString() || null,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track customer orders ({count || 0} total)
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Orders ({orders?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="processing">
            Processing ({processingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="shipped">
            Shipped ({shippedOrders.length})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Delivered ({deliveredOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <OrdersTable orders={orders || []} />
        </TabsContent>

        <TabsContent value="pending">
          <OrdersTable orders={pendingOrdersMapped} />
        </TabsContent>

        <TabsContent value="processing">
          <OrdersTable orders={processingOrdersMapped} />
        </TabsContent>

        <TabsContent value="shipped">
          <OrdersTable orders={shippedOrdersMapped} />
        </TabsContent>

        <TabsContent value="delivered">
          <OrdersTable orders={deliveredOrdersMapped} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
