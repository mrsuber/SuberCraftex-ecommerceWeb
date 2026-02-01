import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import InvestorDetailClient from '@/components/admin/InvestorDetailClient'

export default async function InvestorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getSession()

  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const investor = await db.investor.findUnique({
    where: { id },
    include: {
      user: true,
      deposits: {
        orderBy: { depositedAt: 'desc' },
      },
      transactions: {
        orderBy: { createdAt: 'desc' },
      },
      productAllocations: {
        include: {
          product: {
            select: {
              name: true,
              featuredImage: true,
              sku: true,
              price: true,
            },
          },
          variant: {
            select: {
              name: true,
              sku: true,
              imageUrl: true,
            },
          },
        },
      },
      equipmentAllocations: {
        include: {
          equipment: true,
        },
      },
      profitDistributions: {
        orderBy: { distributedAt: 'desc' },
      },
      withdrawalRequests: {
        orderBy: { requestedAt: 'desc' },
      },
    },
  })

  if (!investor) {
    redirect('/dashboard/investors')
  }

  // Get available products for allocation with inventory and allocation info
  const products = await db.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      featuredImage: true,
      inventoryCount: true,
      investorAllocations: {
        where: { quantityRemaining: { gt: 0 } },
        select: {
          quantity: true,
          quantityRemaining: true,
          variantId: true,
        },
      },
      variants: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          inventoryCount: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  // Get available equipment
  const equipment = await db.equipment.findMany({
    where: { status: 'active' },
    select: {
      id: true,
      name: true,
      equipmentNumber: true,
      purchasePrice: true,
      currentValue: true,
      category: true,
    },
    orderBy: { name: 'asc' },
  })

  // Serialize dates and Decimal fields
  const serializedInvestor = {
    ...investor,
    // Decimal fields
    cashBalance: investor.cashBalance.toString(),
    profitBalance: investor.profitBalance.toString(),
    totalInvested: investor.totalInvested.toString(),
    totalProfit: investor.totalProfit.toString(),
    totalWithdrawn: investor.totalWithdrawn.toString(),
    // Date fields
    createdAt: investor.createdAt.toISOString(),
    updatedAt: investor.updatedAt.toISOString(),
    verifiedAt: investor.verifiedAt?.toISOString() || null,
    agreementAcceptedAt: investor.agreementAcceptedAt?.toISOString() || null,
    kycSubmittedAt: investor.kycSubmittedAt?.toISOString() || null,
    user: {
      ...investor.user,
      createdAt: investor.user.createdAt.toISOString(),
      updatedAt: investor.user.updatedAt.toISOString(),
      emailVerifiedAt: investor.user.emailVerifiedAt?.toISOString() || null,
    },
    deposits: investor.deposits.map(d => ({
      ...d,
      grossAmount: d.grossAmount?.toString() || d.amount.toString(),
      charges: d.charges?.toString() || '0',
      amount: d.amount.toString(),
      depositedAt: d.depositedAt.toISOString(),
      confirmedAt: d.confirmedAt?.toISOString() || null,
      adminConfirmedAt: d.adminConfirmedAt?.toISOString() || null,
      confirmationStatus: d.confirmationStatus || 'confirmed',
      investorNotes: d.investorNotes || null,
      notes: d.notes || null,
      investorReceiptUrl: d.investorReceiptUrl || null,
      receiptUrl: d.receiptUrl || null,
      referenceNumber: d.referenceNumber || null,
      createdAt: d.createdAt.toISOString(),
    })),
    transactions: investor.transactions.map(t => ({
      ...t,
      amount: t.amount.toString(),
      balanceAfter: t.balanceAfter.toString(),
      profitAfter: t.profitAfter.toString(),
      createdAt: t.createdAt.toISOString(),
    })),
    productAllocations: investor.productAllocations.map(p => ({
      ...p,
      amountAllocated: p.amountAllocated.toString(),
      purchasePrice: p.purchasePrice.toString(),
      totalInvestment: p.totalInvestment.toString(),
      profitGenerated: p.profitGenerated.toString(),
      capitalReturned: p.capitalReturned.toString(),
      product: {
        ...p.product,
        price: p.product.price.toString(),
      },
      allocatedAt: p.allocatedAt.toISOString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
    equipmentAllocations: investor.equipmentAllocations.map(e => ({
      ...e,
      amountAllocated: e.amountAllocated.toString(),
      investmentPercentage: e.investmentPercentage.toString(),
      profitShare: e.profitShare.toString(),
      totalProfitReceived: e.totalProfitReceived.toString(),
      exitAmount: e.exitAmount?.toString() || null,
      allocatedAt: e.allocatedAt.toISOString(),
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
      exitedAt: e.exitedAt?.toISOString() || null,
      equipment: {
        ...e.equipment,
        purchasePrice: e.equipment.purchasePrice.toString(),
        currentValue: e.equipment.currentValue.toString(),
        totalRevenue: e.equipment.totalRevenue?.toString() || '0',
        totalProfit: e.equipment.totalProfit?.toString() || '0',
        purchaseDate: e.equipment.purchaseDate.toISOString(),
        createdAt: e.equipment.createdAt.toISOString(),
        updatedAt: e.equipment.updatedAt.toISOString(),
        retiredAt: e.equipment.retiredAt?.toISOString() || null,
      },
    })),
    profitDistributions: investor.profitDistributions.map(p => ({
      ...p,
      saleRevenue: p.saleRevenue.toString(),
      saleCost: p.saleCost.toString(),
      grossProfit: p.grossProfit.toString(),
      companyShare: p.companyShare.toString(),
      investorShare: p.investorShare.toString(),
      capitalReturned: p.capitalReturned.toString(),
      distributedAt: p.distributedAt.toISOString(),
      createdAt: p.createdAt.toISOString(),
    })),
    withdrawalRequests: investor.withdrawalRequests.map(w => ({
      ...w,
      amount: w.amount.toString(),
      approvedAmount: w.approvedAmount?.toString() || null,
      requestedAt: w.requestedAt.toISOString(),
      reviewedAt: w.reviewedAt?.toISOString() || null,
      processedAt: w.processedAt?.toISOString() || null,
      createdAt: w.createdAt.toISOString(),
      updatedAt: w.updatedAt.toISOString(),
    })),
  }

  // Also serialize products and equipment
  const serializedProducts = products.map(p => {
    // Calculate total allocated quantity for this product (excluding variants)
    const productAllocatedQty = p.investorAllocations
      .filter(a => !a.variantId)
      .reduce((sum, a) => sum + a.quantityRemaining, 0);

    return {
      ...p,
      price: p.price.toString(),
      inventoryCount: p.inventoryCount,
      allocatedQuantity: productAllocatedQty,
      availableQuantity: Math.max(0, p.inventoryCount - productAllocatedQty),
      variants: p.variants.map(v => {
        // Calculate allocated quantity for this variant
        const variantAllocatedQty = p.investorAllocations
          .filter(a => a.variantId === v.id)
          .reduce((sum, a) => sum + a.quantityRemaining, 0);

        return {
          ...v,
          price: v.price?.toString() || null,
          inventoryCount: v.inventoryCount,
          allocatedQuantity: variantAllocatedQty,
          availableQuantity: Math.max(0, v.inventoryCount - variantAllocatedQty),
        };
      }),
      investorAllocations: undefined, // Don't pass raw allocations to client
    };
  })

  const serializedEquipment = equipment.map(e => ({
    ...e,
    purchasePrice: e.purchasePrice.toString(),
    currentValue: e.currentValue.toString(),
  }))

  return (
    <InvestorDetailClient
      investor={serializedInvestor}
      products={serializedProducts}
      equipment={serializedEquipment}
    />
  )
}
