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
      quantity: quantityRaw,
      purchasePrice: purchasePriceRaw,
      notes,
    } = body

    if (!productId || !quantityRaw || !purchasePriceRaw) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, quantity, purchasePrice' },
        { status: 400 }
      )
    }

    // Parse quantity as integer and purchasePrice as Decimal
    const quantity = parseInt(quantityRaw, 10)
    const purchasePrice = new Decimal(purchasePriceRaw)

    if (isNaN(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be a positive integer' },
        { status: 400 }
      )
    }

    const totalInvestment = purchasePrice.mul(quantity)

    // Check if investor has sufficient cash balance
    if (new Decimal(investor.cashBalance).lt(totalInvestment)) {
      return NextResponse.json(
        { error: 'Insufficient cash balance' },
        { status: 400 }
      )
    }

    // Verify product exists and check inventory
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { name: true, sku: true, inventoryCount: true, trackInventory: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // If variantId provided, verify it exists and check variant inventory
    let variant = null
    if (variantId) {
      variant = await db.productVariant.findUnique({
        where: { id: variantId },
        select: { name: true, sku: true, inventoryCount: true },
      })

      if (!variant) {
        return NextResponse.json(
          { error: 'Product variant not found' },
          { status: 404 }
        )
      }

      // Check variant inventory
      if (variant.inventoryCount < quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for variant. Available: ${variant.inventoryCount}, Requested: ${quantity}` },
          { status: 400 }
        )
      }
    } else {
      // Check product inventory (only if tracking inventory)
      if (product.trackInventory && product.inventoryCount < quantity) {
        return NextResponse.json(
          { error: `Insufficient stock. Available: ${product.inventoryCount}, Requested: ${quantity}` },
          { status: 400 }
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
          quantity: quantity,
          purchasePrice: purchasePrice,
          totalInvestment: totalInvestment,
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

      // NOTE: Inventory is NOT decremented here. Allocating to an investor means
      // they own the units, but the product stays in the store for customers to buy.
      // Inventory only decreases when an actual customer order is placed.

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
          description: `Allocated to ${product.name}${variant ? ` - ${variant.name}` : ''} (${quantity} units @ ${purchasePrice.toString()} each)`,
          notes: notes || null,
          createdBy: user.id,
        },
      })

      return { allocation, updatedInvestor }
    })

    console.log(`✅ Product allocation: ${investor.investorNumber} -> ${product.name} (${quantity} units)`)

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Error allocating product:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
    })

    // Provide more specific error messages
    let errorMessage = 'Failed to allocate product'
    if (error?.code === 'P2002') {
      errorMessage = 'Duplicate allocation detected'
    } else if (error?.code === 'P2025') {
      errorMessage = 'Record not found during allocation'
    } else if (error?.message) {
      errorMessage = `Allocation failed: ${error.message}`
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
