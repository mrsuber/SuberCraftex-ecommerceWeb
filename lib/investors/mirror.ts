import { TransactionType } from '@prisma/client'
import { Accounts, balanceOf, Tx } from '@/lib/ledger'
import { toDecimal, Xaf } from '@/lib/money'

/**
 * The ledger is the truth. The old columns on investors (cash and profit balance) and the
 * investor_transactions list are kept in step, so the existing dashboard and the mobile app
 * keep showing the right numbers.
 */
export async function investorBalances(tx: Tx, investorId: string) {
  const [free, profit, pending] = await Promise.all([
    balanceOf(tx, Accounts.investorFree(investorId)),
    balanceOf(tx, Accounts.investorProfit(investorId)),
    balanceOf(tx, Accounts.investorProfitPending(investorId)),
  ])
  return { free, profit, pending }
}

export async function mirrorInvestor(
  tx: Tx,
  investorId: string,
  entry?: {
    type: TransactionType
    amount: Xaf
    description: string
    notes?: string
    productId?: string | null
    equipmentId?: string | null
    orderId?: string | null
    withdrawalId?: string | null
    createdBy?: string | null
    totals?: { invested?: Xaf; profit?: Xaf; withdrawn?: Xaf }
  }
) {
  const { free, profit } = await investorBalances(tx, investorId)
  await tx.investor.update({
    where: { id: investorId },
    data: {
      cashBalance: toDecimal(free),
      profitBalance: toDecimal(profit),
      ...(entry?.totals?.invested ? { totalInvested: { increment: toDecimal(entry.totals.invested) } } : {}),
      ...(entry?.totals?.profit ? { totalProfit: { increment: toDecimal(entry.totals.profit) } } : {}),
      ...(entry?.totals?.withdrawn ? { totalWithdrawn: { increment: toDecimal(entry.totals.withdrawn) } } : {}),
    },
  })
  if (entry) {
    await tx.investorTransaction.create({
      data: {
        investorId,
        type: entry.type,
        amount: toDecimal(entry.amount < 0n ? -entry.amount : entry.amount),
        balanceAfter: toDecimal(free),
        profitAfter: toDecimal(profit),
        productId: entry.productId ?? null,
        equipmentId: entry.equipmentId ?? null,
        orderId: entry.orderId ?? null,
        withdrawalId: entry.withdrawalId ?? null,
        description: entry.description,
        notes: entry.notes ?? null,
        createdBy: entry.createdBy ?? null,
      },
    })
  }
}
