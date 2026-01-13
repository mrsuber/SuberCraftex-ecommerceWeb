import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import InvestorsManagementClient from '@/components/admin/InvestorsManagementClient'

export default async function AdminInvestorsPage() {
  const user = await getSession()

  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const investors = await db.investor.findMany({
    include: {
      user: {
        select: {
          email: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          deposits: true,
          transactions: true,
          productAllocations: true,
          equipmentAllocations: true,
          withdrawalRequests: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Serialize dates and decimals
  const serializedInvestors = investors.map(investor => ({
    ...investor,
    // Serialize Decimal fields
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
    user: {
      ...investor.user,
      createdAt: investor.user.createdAt.toISOString(),
    },
  }))

  return <InvestorsManagementClient investors={serializedInvestors} />
}
