import { db } from '@/lib/db'

/** Email the customer their order confirmation. Never throws: a failed email must not fail an order. */
export async function sendOrderConfirmation(orderId: string) {
  try {
    const order = await db.order.findUnique({ where: { id: orderId }, include: { orderItems: true, user: true } })
    const to = order?.user?.email ?? order?.guestEmail
    if (!order || !to) return
    const { sendEmail } = await import('@/lib/email/mailer')
    const { getOrderConfirmationTemplate } = await import('@/lib/email/templates/order-confirmation')
    const { html, text } = getOrderConfirmationTemplate({
      orderNumber: order.orderNumber,
      customerName: order.customerName || order.user?.fullName || 'Customer',
      customerEmail: to,
      orderDate: new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: order.orderItems.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        price: Number(item.price),
        total: Number(item.total),
      })),
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      taxAmount: Number(order.taxAmount),
      totalAmount: Number(order.totalAmount),
      shippingAddress: (order.shippingAddress as any) || {},
      paymentMethod: order.paymentMethod as any,
      paymentStatus: order.paymentStatus,
      trackingUrl: order.trackingNumber ? `${process.env.NEXT_PUBLIC_APP_URL}/track/${order.id}` : undefined,
    })
    await sendEmail({ to, subject: `Order Confirmation - ${order.orderNumber}`, html, text })
  } catch (error) {
    console.error('⚠️  Failed to send order confirmation email:', error)
  }
}
