import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { randomBytes } from 'crypto'
import { MoneyInputError, parseXafOrZero, toDecimal } from '@/lib/money'
import { OutOfStockError, parseLines, priceLines, PricingError, reserveStock, subtotalOf } from '@/lib/commerce/pricing'
import { Prisma } from '@prisma/client'

/**
 * POST /api/pos/orders
 * Create in-store order (cashier only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'cashier' && user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. Cashier or admin access required.' },
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

    if (!['cash', 'mobile_payment'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Payment method must be cash or mobile money' },
        { status: 400 }
      )
    }

    // Prices come from the catalogue, never from the till
    const lines = parseLines(items)
    const discount = parseXafOrZero(discountAmount, 'discount')

    // Generate order number
    const orderNumber = `POS-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`

    // Create order in transaction
    const order = await db.$transaction(async (tx) => {
      const priced = await priceLines(tx, lines)
      const subtotal = subtotalOf(priced)
      if (discount > subtotal) {
        throw new PricingError('Discount cannot be more than the order subtotal')
      }
      // Catalogue prices already include any VAT, so nothing is added on top
      const totalAmount = subtotal - discount
      const tendered = amountTendered === undefined || amountTendered === null || amountTendered === ''
        ? null
        : parseXafOrZero(amountTendered, 'amount tendered')
      if (paymentMethod === 'cash' && tendered !== null && tendered < totalAmount) {
        throw new PricingError('Amount tendered is less than the total')
      }

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
          subtotal: toDecimal(subtotal),
          taxAmount: 0,
          discountAmount: toDecimal(discount),
          shippingCost: 0,
          totalAmount: toDecimal(totalAmount),
          amountTendered: tendered !== null ? toDecimal(tendered) : null,
          changeGiven: tendered !== null ? toDecimal(tendered - totalAmount) : null,
          shippingAddress: Prisma.JsonNull,
          billingAddress: Prisma.JsonNull,
          orderItems: {
            create: priced.map((line) => ({
              productId: line.productId,
              variantId: line.variantId,
              productName: line.name,
              productSku: line.sku,
              productImage: line.image,
              variantOptions: line.variantOptions ?? Prisma.JsonNull,
              quantity: line.quantity,
              price: toDecimal(line.unitPrice),
              total: toDecimal(line.total),
            })),
          },
        }
      })

      await reserveStock(tx, priced, {
        orderId: newOrder.id,
        userId: user.id,
        notes: `Sold at POS (${orderNumber})`,
      })

      return newOrder
    })

    console.log(`🛒 POS order created: ${orderNumber} - Total: ${Number(order.totalAmount)} FCFA`)

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
    if (error instanceof OutOfStockError) {
      return NextResponse.json({ error: error.message, outOfStockItems: error.items }, { status: 400 })
    }
    if (error instanceof PricingError || error instanceof MoneyInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
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
    if (!user || (user.role !== 'cashier' && user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized. Cashier or admin access required.' },
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
