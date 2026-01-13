import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { Decimal } from '@prisma/client/runtime/library'

// POST /api/admin/investors/[id]/allocate-product - Allocate investor funds to product purchase
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getSession()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const investor = await db.investor.findUnique({
      where: { id },
    })

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      productId,
      variantId,
      quantity,
      purchasePrice,
      notes,
    } = body

    if (!productId || !quantity || !purchasePrice) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, quantity, purchasePrice' },
        { status: 400 }
      )
    }

    const totalInvestment = new Decimal(purchasePrice).mul(quantity)

    // Check if investor has sufficient cash balance
    if (new Decimal(investor.cashBalance).lt(totalInvestment)) {
      return NextResponse.json(
        { error: 'Insufficient cash balance' },
        { status: 400 }
      )
    }

    // Verify product exists
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { name: true, sku: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // If variantId provided, verify it exists
    let variant = null
    if (variantId) {
      variant = await db.productVariant.findUnique({
        where: { id: variantId },
        select: { name: true, sku: true },
      })

      if (!variant) {
        return NextResponse.json(
          { error: 'Product variant not found' },
          { status: 404 }
        )
      }
    }

    // Create allocation and update balances in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create product allocation
      const allocation = await tx.investorProductAllocation.create({
        data: {
          investorId: investor.id,
          productId,
          variantId: variantId || null,
          amountAllocated: totalInvestment,
          quantity,
          purchasePrice,
          totalInvestment,
          quantityRemaining: quantity,
          notes: notes || null,
        },
        include: {
          product: {
            select: {
              name: true,
              sku: true,
              featuredImage: true,
            },
          },
          variant: {
            select: {
              name: true,
              sku: true,
            },
          },
        },
      })

      // Update investor cash balance
      const updatedInvestor = await tx.investor.update({
        where: { id: investor.id },
        data: {
          cashBalance: {
            decrement: totalInvestment,
          },
        },
      })

      // Create transaction record
      await tx.investorTransaction.create({
        data: {
          investorId: investor.id,
          type: 'allocation_product',
          amount: totalInvestment,
          balanceAfter: updatedInvestor.cashBalance,
          profitAfter: updatedInvestor.profitBalance,
          productId,
          description: `Allocated to ${product.name}${variant ? ` - ${variant.name}` : ''} (${quantity} units @ ${purchasePrice} each)`,
          notes: notes || null,
          createdBy: user.id,
        },
      })

      return { allocation, updatedInvestor }
    })

    console.log(`✅ Product allocation: ${investor.investorNumber} -> ${product.name} (${quantity} units)`)

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error allocating product:', error)
    return NextResponse.json(
      { error: 'Failed to allocate product' },
      { status: 500 }
    )
  }
}
