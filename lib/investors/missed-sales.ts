import { Order, OrderItem } from '@prisma/client'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { Tx } from '@/lib/ledger'
import { splitByWeights, toDecimal, toXaf, Xaf } from '@/lib/money'
import { getSetting } from '@/lib/settings'
import { investorLedgerLive } from './live'
import { InvestorEngineError } from './lots'

/**
 * Sales of investor-funded units on the old system, before the ledger.
 *
 * The old code shared a sale only when an order's status was changed to delivered from the
 * order screens, and only when it sold above cost. Till (POS) sales are created already
 * delivered, so they were never shared, and the units stayed on the investor's allocation
 * after leaving the shop. This finds every delivered, paid sale of a funded product that
 * was not shared, and records it as it should have been at the time:
 *   capital back (cost of the units) + the investor's share of the profit (50% by default),
 *   or, sold below cost, the capital less the investor's share of the loss.
 * The same arithmetic now shares every new sale on the old system, until the move.
 */

export interface MissedShare {
  allocationId: string
  investorId: string
  investorNumber: string
  investorName: string
  units: number
  revenue: number
  cost: number
  profit: number
  investorShare: number
  capitalReturned: number
}

export interface MissedSale {
  orderId: string
  orderNumber: string
  orderDate: string
  pos: boolean
  orderItemId: string
  productId: string
  productName: string
  quantity: number
  lineRevenue: number
  shares: MissedShare[]
}

/** What the customer paid for one line, after its part of any order discount. */
function lineRevenue(order: Pick<Order, 'subtotal' | 'discountAmount'>, item: Pick<OrderItem, 'total'>): Xaf {
  const total = toXaf(item.total)
  const subtotal = toXaf(order.subtotal)
  const discount = toXaf(order.discountAmount)
  if (discount <= 0n || subtotal <= 0n) return total
  return total - (discount * total) / subtotal
}

type Allocation = { id: string; investorId: string; quantityRemaining: number; purchasePrice: { toString(): string }; allocatedAt: Date; investor: { investorNumber: string; fullName: string } }

/** Share one order line over the allocations, oldest first. `remaining` is updated as units are used. */
function shareLine(
  order: Pick<Order, 'subtotal' | 'discountAmount'>,
  item: Pick<OrderItem, 'quantity' | 'total'>,
  allocations: Allocation[],
  remaining: Map<string, number>,
  investorPercent: number
): MissedShare[] {
  const revenueAll = lineRevenue(order, item)
  const takes: { a: Allocation; units: number }[] = []
  let left = item.quantity
  for (const a of allocations) {
    if (left <= 0) break
    const have = remaining.get(a.id) ?? 0
    const units = Math.min(left, have)
    if (units <= 0) continue
    takes.push({ a, units })
    remaining.set(a.id, have - units)
    left -= units
  }
  if (takes.length === 0) return []
  // Revenue for the investors' units, and the rest of the line (SuberCraftex's own units)
  const weights = [...takes.map((t) => BigInt(t.units)), BigInt(left)]
  const revenues = splitByWeights(revenueAll, weights)
  const basis = BigInt(Math.round(investorPercent * 100))
  return takes.map((t, i) => {
    const revenue = revenues[i]
    const cost = toXaf(t.a.purchasePrice.toString()) * BigInt(t.units)
    const profit = revenue - cost
    const share = (profit * basis) / 10_000n
    const capital = share < 0n ? cost + share : cost
    return {
      allocationId: t.a.id,
      investorId: t.a.investorId,
      investorNumber: t.a.investor.investorNumber,
      investorName: t.a.investor.fullName,
      units: t.units,
      revenue: Number(revenue),
      cost: Number(cost),
      profit: Number(profit),
      investorShare: Number(share),
      capitalReturned: Number(capital),
    }
  })
}

async function allocationsFor(client: Tx | typeof db, productId: string, variantId: string | null, before: Date) {
  return client.investorProductAllocation.findMany({
    where: { productId, variantId, quantityRemaining: { gt: 0 }, allocatedAt: { lte: before } },
    include: { investor: { select: { investorNumber: true, fullName: true } } },
    orderBy: { allocatedAt: 'asc' },
  })
}

/** Every delivered, paid sale of a funded product that was never shared, oldest first. Changes nothing. */
export async function findMissedSales(client: Tx | typeof db = db): Promise<MissedSale[]> {
  const funded = await client.investorProductAllocation.findMany({ where: { quantityRemaining: { gt: 0 } }, select: { productId: true } })
  const productIds = [...new Set(funded.map((f) => f.productId))]
  if (productIds.length === 0) return []
  const orders = await client.order.findMany({
    where: { orderStatus: 'delivered', paymentStatus: 'paid', orderItems: { some: { productId: { in: productIds } } } },
    include: { orderItems: true },
    orderBy: { createdAt: 'asc' },
  })
  const shared = await client.profitDistribution.findMany({ where: { orderId: { in: orders.map((o) => o.id) } }, select: { orderId: true, productId: true } })
  const done = new Set(shared.map((s) => `${s.orderId}:${s.productId}`))
  const investorPercent = await getSetting('investors.investorProfitPercent')
  const remaining = new Map<string, number>()
  const out: MissedSale[] = []
  for (const order of orders) {
    for (const item of order.orderItems) {
      if (!productIds.includes(item.productId) || done.has(`${order.id}:${item.productId}`)) continue
      const allocations = await allocationsFor(client, item.productId, item.variantId, order.createdAt)
      for (const a of allocations) if (!remaining.has(a.id)) remaining.set(a.id, a.quantityRemaining)
      const shares = shareLine(order, item, allocations, remaining, investorPercent)
      if (shares.length === 0) continue
      out.push({
        orderId: order.id,
        orderNumber: order.orderNumber,
        orderDate: order.createdAt.toISOString(),
        pos: order.isPosOrder,
        orderItemId: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        lineRevenue: Number(lineRevenue(order, item)),
        shares,
      })
    }
  }
  return out
}

/** Write one share on the old-system balances, with its distribution record and history line. */
async function applyShare(tx: Tx, sale: { orderId: string; orderNumber: string; productId: string; productName: string }, s: MissedShare, actorId: string | null, note: string) {
  const profitCredit = s.investorShare > 0 ? s.investorShare : 0
  const updated = await tx.investor.update({
    where: { id: s.investorId },
    data: {
      cashBalance: { increment: s.capitalReturned },
      profitBalance: { increment: profitCredit },
      totalProfit: { increment: s.investorShare },
    },
  })
  const allocation = await tx.investorProductAllocation.updateMany({
    where: { id: s.allocationId, quantityRemaining: { gte: s.units } },
    data: {
      quantitySold: { increment: s.units },
      quantityRemaining: { decrement: s.units },
      profitGenerated: { increment: s.investorShare },
      capitalReturned: { increment: s.capitalReturned },
    },
  })
  if (allocation.count !== 1) throw new InvestorEngineError(`The units of ${sale.productName} changed meanwhile: preview again`)
  await tx.profitDistribution.create({
    data: {
      investorId: s.investorId,
      orderId: sale.orderId,
      productId: sale.productId,
      saleRevenue: toDecimal(BigInt(s.revenue)),
      saleCost: toDecimal(BigInt(s.cost)),
      grossProfit: toDecimal(BigInt(s.profit)),
      companyShare: toDecimal(BigInt(s.profit - s.investorShare)),
      investorShare: toDecimal(BigInt(s.investorShare)),
      capitalReturned: toDecimal(BigInt(s.capitalReturned)),
      description: `Sale of ${s.units} x ${sale.productName}${s.profit < 0 ? ' (below cost: loss shared)' : ''}`,
      notes: `Order: ${sale.orderNumber}${note ? `. ${note}` : ''}`,
    },
  })
  await tx.investorTransaction.create({
    data: {
      investorId: s.investorId,
      type: 'profit_credit',
      amount: toDecimal(BigInt(s.capitalReturned + profitCredit)),
      balanceAfter: updated.cashBalance,
      profitAfter: updated.profitBalance,
      productId: sale.productId,
      orderId: sale.orderId,
      description: `Sale: ${s.units} x ${sale.productName} - Capital: ${s.capitalReturned}, ${s.investorShare >= 0 ? `Profit: ${s.investorShare}` : `Your share of the loss: ${-s.investorShare}`}`,
      notes: `Order: ${sale.orderNumber}${note ? `. ${note}` : ''}`,
      createdBy: actorId,
    },
  })
}

/** Record every missed sale (super admin, before the move). Safe to repeat: shared lines are skipped. */
export async function recordMissedSales(admin: { id: string; email?: string | null }) {
  const result = await db.$transaction(
    async (tx) => {
      if (await investorLedgerLive(tx)) throw new InvestorEngineError('Balances are already on the ledger: missed sales must be recorded there')
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(4242001)`
      const missed = await findMissedSales(tx)
      const today = new Date().toISOString().slice(0, 10)
      for (const sale of missed) {
        const note = `Recorded on ${today}: this sale on ${sale.orderDate.slice(0, 10)} was not shared with you at the time`
        for (const s of sale.shares) await applyShare(tx, sale, s, admin.id, note)
      }
      return missed
    },
    { timeout: 120_000 }
  )
  const totals = new Map<string, { capital: number; profit: number; units: number }>()
  for (const sale of result) {
    for (const s of sale.shares) {
      const t = totals.get(s.investorNumber) ?? { capital: 0, profit: 0, units: 0 }
      totals.set(s.investorNumber, { capital: t.capital + s.capitalReturned, profit: t.profit + s.investorShare, units: t.units + s.units })
    }
  }
  await audit({
    actor: admin,
    action: 'investor.missed_sales_recorded',
    targetType: 'investors',
    details: { sales: result.length, byInvestor: Object.fromEntries(totals), orders: [...new Set(result.map((s) => s.orderNumber))] },
  })
  return { sales: result.length, byInvestor: Object.fromEntries(totals) }
}

/**
 * The old system's sharing of a delivered order (used until the move). Same arithmetic as
 * the catch-up: oldest allocations first, profit or loss shared, each line once only.
 */
export async function shareOrderOnOldSystem(tx: Tx, orderId: string, actorId: string | null) {
  const order = await tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { orderItems: true } })
  const already = await tx.profitDistribution.findMany({ where: { orderId }, select: { productId: true } })
  const done = new Set(already.map((a) => a.productId))
  const investorPercent = await getSetting('investors.investorProfitPercent')
  const out: (MissedShare & { productName: string })[] = []
  for (const item of order.orderItems) {
    if (done.has(item.productId)) continue
    const allocations = await allocationsFor(tx, item.productId, item.variantId, new Date())
    const remaining = new Map(allocations.map((a) => [a.id, a.quantityRemaining]))
    const shares = shareLine(order, item, allocations, remaining, investorPercent)
    for (const s of shares) {
      await applyShare(tx, { orderId, orderNumber: order.orderNumber, productId: item.productId, productName: item.productName }, s, actorId, '')
      out.push({ ...s, productName: item.productName })
    }
  }
  return out
}
