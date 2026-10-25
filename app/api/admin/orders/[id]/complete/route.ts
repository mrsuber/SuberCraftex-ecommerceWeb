import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { completeOrder } from '@/lib/commerce/fulfilment'

// POST /api/admin/orders/[id]/complete - Complete order and distribute investor profits
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const user = await getSession()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.orderStatus === 'delivered') {
      return NextResponse.json(
        { error: 'Order already completed' },
        { status: 400 }
      )
    }

    let result
    try {
      result = await db.$transaction((tx) => completeOrder(tx, orderId, { actorId: user.id, actorRole: user.role }))
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 })
    }

    if (result.distributions.length > 0) {
      console.log(`✅ Order completed: ${order.orderNumber} - Profit distributed to ${result.distributions.length} investor allocations`)
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error completing order:', error)
    return NextResponse.json(
      { error: 'Failed to complete order' },
      { status: 500 }
    )
  }
}
