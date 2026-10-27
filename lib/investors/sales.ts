import { shareOrderOnOldSystem } from './missed-sales'
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
  const shares = await shareOrderOnOldSystem(tx, orderId, actorId)
  return shares.map((s) => ({
    investorId: s.investorId,
    investorName: s.investorName,
    product: s.productName,
    quantity: s.units,
    capitalReturned: String(s.capitalReturned),
    profitShare: String(s.investorShare),
  }))
}
