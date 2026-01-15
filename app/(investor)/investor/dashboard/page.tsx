import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import InvestorDashboardClient from '@/components/investor/InvestorDashboardClient'

export default async function InvestorDashboardPage() {
  const user = await getSession()

  if (!user || user.role !== 'investor') {
    redirect('/investor/register')
  }

  const investor = await db.investor.findUnique({
    where: { userId: user.id },
    include: {
      deposits: {
        orderBy: { depositedAt: 'desc' },
        take: 5,
      },
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      productAllocations: {
        where: { quantityRemaining: { gt: 0 } },
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
              price: true,
            },
          },
        },
      },
      equipmentAllocations: {
        where: { hasExited: false },
        include: {
          equipment: {
            select: {
              name: true,
              equipmentNumber: true,
              currentValue: true,
              purchasePrice: true,
              status: true,
              photos: true,
              totalRevenue: true,
              totalProfit: true,
            },
          },
        },
      },
      profitDistributions: {
        orderBy: { distributedAt: 'desc' },
        take: 10,
      },
      withdrawalRequests: {
        where: {
          status: { in: ['pending', 'approved', 'processing'] },
        },
        orderBy: { requestedAt: 'desc' },
      },
    },
  })

  if (!investor) {
    redirect('/investor/register')
  }

  if (!investor.agreementAccepted) {
    redirect('/investor/agreement')
  }

  // Redirect to verification page if KYC not approved
  // Dashboard is ONLY accessible after admin approves KYC verification
  if (!investor.isVerified || investor.kycStatus !== 'approved') {
    redirect('/investor/verify')
  }

  // Serialize dates and decimals for client component
  const serializedInvestor = {
    ...investor,
    // Serialize Decimal fields to strings
    cashBalance: investor.cashBalance.toString(),
    profitBalance: investor.profitBalance.toString(),
    totalInvested: investor.totalInvested.toString(),
    totalProfit: investor.totalProfit.toString(),
    totalWithdrawn: investor.totalWithdrawn.toString(),
    // Serialize dates
    createdAt: investor.createdAt.toISOString(),
    updatedAt: investor.updatedAt.toISOString(),
    verifiedAt: investor.verifiedAt?.toISOString() || null,
    agreementAcceptedAt: investor.agreementAcceptedAt?.toISOString() || null,
    deposits: investor.deposits.map(d => ({
      ...d,
      grossAmount: d.grossAmount?.toString() || d.amount.toString(),
      charges: d.charges?.toString() || '0',
      amount: d.amount.toString(),
      depositedAt: d.depositedAt.toISOString(),
      confirmedAt: d.confirmedAt?.toISOString() || null,
      confirmationStatus: d.confirmationStatus || 'confirmed',
      investorNotes: d.investorNotes || null,
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
      variant: p.variant ? {
        ...p.variant,
        price: p.variant.price ? p.variant.price.toString() : null,
      } : null,
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
      equipment: {
        ...e.equipment,
        currentValue: e.equipment.currentValue.toString(),
        purchasePrice: e.equipment.purchasePrice.toString(),
        totalRevenue: e.equipment.totalRevenue?.toString() || '0',
        totalProfit: e.equipment.totalProfit?.toString() || '0',
      },
      allocatedAt: e.allocatedAt.toISOString(),
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
      exitedAt: e.exitedAt?.toISOString() || null,
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

  return <InvestorDashboardClient investor={serializedInvestor} />
}
