import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { Prisma } from '@prisma/client'

/**
 * POST /api/pos/orders
 * Create in-store order (cashier only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'cashier') {
      return NextResponse.json(
        { error: 'Unauthorized. Cashier access required.' },
        { status: 401 }
      )
    }

    const cashier = await db.cashier.findUnique({
      where: { userId: user.id }
    })

    if (!cashier) {
      return NextResponse.json(
        { error: 'Cashier profile not found' },
        { status: 404 }
      )
    }

    // Check for active session
    const session = await db.pOSSession.findFirst({
      where: {
        cashierId: cashier.id,
        status: 'open'
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'No active POS session. Please open a session first.' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      items, // [{ productId, variantId?, quantity, price }]
      paymentMethod,
      amountTendered,
      customerName,
      customerEmail,
      customerPhone,
      customerNotes,
      taxRate = 0, // Tax rate as percentage
      discountAmount = 0,
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      )
    }

    // Calculate totals
    let subtotal = new Prisma.Decimal(0)

    for (const item of items) {
      const itemTotal = new Prisma.Decimal(item.price).mul(item.quantity)
      subtotal = subtotal.add(itemTotal)
    }

    const discountDec = new Prisma.Decimal(discountAmount)
    const taxAmount = subtotal.sub(discountDec).mul(taxRate / 100)
    const totalAmount = subtotal.sub(discountDec).add(taxAmount)

    // Generate order number
    const orderNumber = `POS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Create order in transaction
    const order = await db.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          isPosOrder: true,
          cashierId: cashier.id,
          posSessionId: session.id,
          customerName: customerName || 'Walk-in Customer',
          customerPhone: customerPhone || null,
          guestEmail: customerEmail || null,
          customerNotes: customerNotes || null,
          orderStatus: 'pending',
          paymentStatus: 'pending',
          paymentMethod,
          shippingMethod: 'in_store',
          subtotal,
          taxAmount,
          discountAmount: discountDec,
          shippingCost: 0,
          totalAmount,
          amountTendered: amountTendered ? new Prisma.Decimal(amountTendered) : null,
          changeGiven: amountTendered ? new Prisma.Decimal(amountTendered).sub(totalAmount) : null,
          shippingAddress: null,
          billingAddress: null,
        }
      })

      // Create order items
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: {
            variants: item.variantId ? {
              where: { id: item.variantId }
            } : false
          }
        })

        if (!product) {
          throw new Error(`Product ${item.productId} not found`)
        }

        const variant = item.variantId ? product.variants?.[0] : null

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            variantId: item.variantId || null,
            productName: product.name,
            productSku: variant?.sku || product.sku,
            productImage: variant?.imageUrl || product.featuredImage,
            variantOptions: variant?.options || null,
            quantity: item.quantity,
            price: new Prisma.Decimal(item.price),
            total: new Prisma.Decimal(item.price).mul(item.quantity),
          }
        })

        // Decrement inventory
        if (item.variantId && variant) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              inventoryCount: {
                decrement: item.quantity
              }
            }
          })
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              inventoryCount: {
                decrement: item.quantity
              }
            }
          })
        }
      }

      return newOrder
    })

    console.log(`🛒 POS order created: ${orderNumber} - Total: $${Number(totalAmount).toFixed(2)}`)

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        subtotal: Number(order.subtotal),
        taxAmount: Number(order.taxAmount),
        discountAmount: Number(order.discountAmount),
        totalAmount: Number(order.totalAmount),
        amountTendered: order.amountTendered ? Number(order.amountTendered) : null,
        changeGiven: order.changeGiven ? Number(order.changeGiven) : null,
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating POS order:', error)

    if (error.message && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(
      { error: 'Failed to create POS order' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/pos/orders
 * Get POS orders for current session
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'cashier') {
      return NextResponse.json(
        { error: 'Unauthorized. Cashier access required.' },
        { status: 401 }
      )
    }

    const cashier = await db.cashier.findUnique({
      where: { userId: user.id }
    })

    if (!cashier) {
      return NextResponse.json(
        { error: 'Cashier profile not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    const where: any = {
      isPosOrder: true,
      cashierId: cashier.id,
    }

    if (sessionId) {
      where.posSessionId = sessionId
    } else {
      // Get current session orders
      const session = await db.pOSSession.findFirst({
        where: {
          cashierId: cashier.id,
          status: 'open'
        }
      })

      if (session) {
        where.posSessionId = session.id
      }
    }

    const orders = await db.order.findMany({
      where,
      include: {
        orderItems: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const serialized = orders.map(order => ({
      ...order,
      subtotal: Number(order.subtotal),
      taxAmount: Number(order.taxAmount),
      discountAmount: Number(order.discountAmount),
      totalAmount: Number(order.totalAmount),
      amountTendered: order.amountTendered ? Number(order.amountTendered) : null,
      changeGiven: order.changeGiven ? Number(order.changeGiven) : null,
      orderItems: order.orderItems.map(item => ({
        ...item,
        price: Number(item.price),
        total: Number(item.total),
      }))
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error('Error fetching POS orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch POS orders' },
      { status: 500 }
    )
  }
}
