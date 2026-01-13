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

  // Get available products for allocation
  const products = await db.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      featuredImage: true,
      variants: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
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

  // Serialize dates
  const serializedInvestor = {
    ...investor,
    createdAt: investor.createdAt.toISOString(),
    updatedAt: investor.updatedAt.toISOString(),
    verifiedAt: investor.verifiedAt?.toISOString() || null,
    agreementAcceptedAt: investor.agreementAcceptedAt?.toISOString() || null,
    user: {
      ...investor.user,
      createdAt: investor.user.createdAt.toISOString(),
      updatedAt: investor.user.updatedAt.toISOString(),
      emailVerifiedAt: investor.user.emailVerifiedAt?.toISOString() || null,
    },
    deposits: investor.deposits.map(d => ({
      ...d,
      depositedAt: d.depositedAt.toISOString(),
      createdAt: d.createdAt.toISOString(),
    })),
    transactions: investor.transactions.map(t => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
    })),
    productAllocations: investor.productAllocations.map(p => ({
      ...p,
      allocatedAt: p.allocatedAt.toISOString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
    equipmentAllocations: investor.equipmentAllocations.map(e => ({
      ...e,
      allocatedAt: e.allocatedAt.toISOString(),
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
      exitedAt: e.exitedAt?.toISOString() || null,
      equipment: {
        ...e.equipment,
        purchaseDate: e.equipment.purchaseDate.toISOString(),
        createdAt: e.equipment.createdAt.toISOString(),
        updatedAt: e.equipment.updatedAt.toISOString(),
        retiredAt: e.equipment.retiredAt?.toISOString() || null,
      },
    })),
    profitDistributions: investor.profitDistributions.map(p => ({
      ...p,
      distributedAt: p.distributedAt.toISOString(),
      createdAt: p.createdAt.toISOString(),
    })),
    withdrawalRequests: investor.withdrawalRequests.map(w => ({
      ...w,
      requestedAt: w.requestedAt.toISOString(),
      reviewedAt: w.reviewedAt?.toISOString() || null,
      processedAt: w.processedAt?.toISOString() || null,
      createdAt: w.createdAt.toISOString(),
      updatedAt: w.updatedAt.toISOString(),
    })),
  }

  return (
    <InvestorDetailClient
      investor={serializedInvestor}
      products={products}
      equipment={equipment}
    />
  )
}
