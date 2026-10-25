import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { db } from '@/lib/db'
import { checkPaymentToken } from '@/lib/payments/token'

// GET /api/orders/[id]/payment-info?token= - What the pay and confirmation pages show.
// The owner (logged in) or whoever holds the order's payment token may see it.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await db.order.findUnique({ where: { id }, include: { orderItems: true } })
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  const { user } = await verifyAuth(request)
  const token = request.nextUrl.searchParams.get('token')
  const allowed =
    (order.userId && user?.id === order.userId) ||
    checkPaymentToken('order', order.id, token) ||
    user?.role === 'admin'
  if (!allowed) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  const lastPayment = await db.paymentCollection.findFirst({
    where: { targetId: order.id, purpose: 'order' },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({
    id: order.id,
    orderNumber: order.orderNumber,
    totalAmount: Number(order.totalAmount),
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    shippingMethod: order.shippingMethod,
    paymentDueAt: order.paymentDueAt,
    customerPhone: order.customerPhone,
    email: order.guestEmail,
    items: order.orderItems.map((i) => ({ name: i.productName, quantity: i.quantity, total: Number(i.total) })),
    lastPayment: lastPayment ? { reference: lastPayment.reference, status: lastPayment.status } : null,
  })
}
