import { Decimal } from '@prisma/client/runtime/library'
import { Tx } from '@/lib/ledger'
import { investorLedgerLive } from './live'
import { distributeOrderPooled } from './lots'

export interface SaleDistribution {
  investorId: string
  investorName: string
  product: string
  quantity: number
  capitalReturned: string
  profitShare: string
}

/**
 * Share the profit of a delivered order with the investors who funded its products.
 * Once investor balances are in the ledger, the pooled engine does it (lots.ts); before
 * that, the original first-in-first-out logic below keeps running unchanged.
 */
export async function distributeOrderToInvestors(tx: Tx, orderId: string, actorId: string | null): Promise<SaleDistribution[]> {
  if (await investorLedgerLive(tx)) {
    const pooled = await distributeOrderPooled(tx, orderId, actorId)
    const names = await tx.investor.findMany({ where: { id: { in: pooled.map((p) => p.investorId) } }, select: { id: true, fullName: true } })
    return pooled.map((p) => ({
      investorId: p.investorId,
      investorName: names.find((n) => n.id === p.investorId)?.fullName ?? '',
      product: p.product,
      quantity: p.units,
      capitalReturned: String(p.capitalReturned),
      profitShare: String(p.investorShare),
    }))
  }
  return legacyDistribution(tx, orderId, actorId)
}

async function legacyDistribution(tx: Tx, orderId: string, actorId: string | null): Promise<SaleDistribution[]> {
  const order = await tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { orderItems: true } })
  const distributions: SaleDistribution[] = []
  for (const item of order.orderItems) {
    const allocations = await tx.investorProductAllocation.findMany({
      where: { productId: item.productId, variantId: item.variantId, quantityRemaining: { gt: 0 } },
      include: { investor: true },
      orderBy: { allocatedAt: 'asc' },
    })
    let remainingQuantity = item.quantity
    for (const allocation of allocations) {
      if (remainingQuantity <= 0) break
      const quantityToProcess = Math.min(remainingQuantity, allocation.quantityRemaining)
      if (quantityToProcess <= 0) continue
      const salePrice = new Decimal(item.price)
      const costPrice = allocation.purchasePrice
      const unitProfit = salePrice.sub(costPrice)
      if (unitProfit.gt(0)) {
        const totalProfit = unitProfit.mul(quantityToProcess)
        const companyShare = totalProfit.div(2)
        const investorShare = totalProfit.div(2)
        const capitalReturned = costPrice.mul(quantityToProcess)
        const updatedInvestor = await tx.investor.update({
          where: { id: allocation.investorId },
          data: {
            cashBalance: { increment: capitalReturned },
            profitBalance: { increment: investorShare },
            totalProfit: { increment: investorShare },
          },
        })
        await tx.investorProductAllocation.update({
          where: { id: allocation.id },
          data: {
            quantitySold: { increment: quantityToProcess },
            quantityRemaining: { decrement: quantityToProcess },
            profitGenerated: { increment: investorShare },
            capitalReturned: { increment: capitalReturned },
          },
        })
        await tx.profitDistribution.create({
          data: {
            investorId: allocation.investorId,
            orderId,
            productId: item.productId,
            saleRevenue: salePrice.mul(quantityToProcess),
            saleCost: costPrice.mul(quantityToProcess),
            grossProfit: totalProfit,
            companyShare,
            investorShare,
            capitalReturned,
            description: `Sale of ${quantityToProcess} x ${item.productName}`,
            notes: `Order: ${order.orderNumber}`,
          },
        })
        await tx.investorTransaction.create({
          data: {
            investorId: allocation.investorId,
            type: 'profit_credit',
            amount: capitalReturned.add(investorShare),
            balanceAfter: updatedInvestor.cashBalance,
            profitAfter: updatedInvestor.profitBalance,
            productId: item.productId,
            orderId,
            description: `Sale: ${quantityToProcess} x ${item.productName} - Capital: ${capitalReturned}, Profit: ${investorShare}`,
            notes: `Order: ${order.orderNumber}`,
            createdBy: actorId,
          },
        })
        distributions.push({
          investorId: allocation.investorId,
          investorName: allocation.investor.fullName,
          product: item.productName,
          quantity: quantityToProcess,
          capitalReturned: capitalReturned.toString(),
          profitShare: investorShare.toString(),
        })
      }
      remainingQuantity -= quantityToProcess
    }
  }
  return distributions
}
