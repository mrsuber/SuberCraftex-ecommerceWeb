import { OrderItem, ProductLot } from '@prisma/client'
import { suspendedMessage } from './suspended-message'
import { AccountRef, Accounts, balanceOf, credit, debit, post, Posting, Tx } from '@/lib/ledger'
import { splitByWeights, toDecimal, toXaf, Xaf } from '@/lib/money'
import { getSetting } from '@/lib/settings'
import { mirrorInvestor } from './mirror'

/**
 * Products funded or brought by investors.
 *
 * Every lot of the same product (or variant) is part of one pool, together with
 * SuberCraftex's own units (the stock no lot covers). Each sale is shared across the whole
 * pool in proportion to what each holder still has, so everyone's stock sells at the same
 * pace. A lot's share of a sale:
 *   revenue  = its part of what the customer paid for the line (after any discount)
 *   cost     = its units x its cost per unit
 *   profit   = revenue - cost (negative when sold below cost)
 *   investor = profit x investor percent (50%): profit and loss are both shared
 *   capital  = cost + investor's part of a loss (a loss is shared, so capital shrinks)
 * The profit waits in "pending" for the holding period (returns can still take it back),
 * then becomes withdrawable.
 */

export class InvestorEngineError extends Error {}

export const MILLI = 1000n

/** Goods brought by investors, at their agreed value, while SuberCraftex holds them */
export const investorGoods = (): AccountRef => ({
  key: 'EQUITY:INVESTOR_GOODS',
  kind: 'equity',
  name: 'Goods brought by investors',
  allowNegative: true,
})

const lotLabel = (lot: Pick<ProductLot, 'id'>) => lot.id.slice(0, 8)

export async function activeLots(tx: Tx, productId: string, variantId: string | null) {
  return tx.productLot.findMany({
    where: { productId, variantId, status: 'active', unitsMilli: { gt: 0 } },
    orderBy: { createdAt: 'asc' },
  })
}

/** Units on the shelf plus units held for orders not yet delivered (whole units). */
async function unitsInCare(tx: Tx, productId: string, variantId: string | null, excludeOrderId?: string) {
  const stock = variantId
    ? (await tx.productVariant.findUnique({ where: { id: variantId }, select: { inventoryCount: true } }))?.inventoryCount ?? 0
    : (await tx.product.findUnique({ where: { id: productId }, select: { inventoryCount: true } }))?.inventoryCount ?? 0
  const reserved = await tx.orderItem.aggregate({
    where: {
      productId,
      variantId,
      order: {
        orderStatus: { notIn: ['delivered', 'cancelled', 'refunded'] },
        ...(excludeOrderId ? { id: { not: excludeOrderId } } : {}),
      },
    },
    _sum: { quantity: true },
  })
  return BigInt(Math.max(0, stock) + (reserved._sum.quantity ?? 0))
}

export async function fundedUnitsMilli(tx: Tx, productId: string, variantId: string | null) {
  const sum = await tx.productLot.aggregate({
    where: { productId, variantId, status: 'active' },
    _sum: { unitsMilli: true },
  })
  return sum._sum.unitsMilli ?? 0n
}

async function requireActiveInvestor(tx: Tx, investorId: string) {
  const investor = await tx.investor.findUnique({ where: { id: investorId } })
  if (!investor) throw new InvestorEngineError('Investor not found')
  if (investor.status !== 'active') throw new InvestorEngineError(suspendedMessage(investor!) ?? 'This investor account is not active')
  return investor
}

// ------------------------------------------------------------------ funding

/** The team puts an investor's free capital into units already in stock. */
export async function fundLot(
  tx: Tx,
  input: { investorId: string; productId: string; variantId?: string | null; quantity: number; unitCost: Xaf; actorId: string; agreementVersion?: number | null }
) {
  if (!Number.isInteger(input.quantity) || input.quantity < 1) throw new InvestorEngineError('Quantity must be a whole number of units')
  if (input.unitCost <= 0n) throw new InvestorEngineError('Cost per unit must be more than zero')
  const investor = await requireActiveInvestor(tx, input.investorId)
  const variantId = input.variantId ?? null
  const product = await tx.product.findUnique({ where: { id: input.productId } })
  if (!product) throw new InvestorEngineError('Product not found')

  // Units funded by investors can never be more than the units SuberCraftex holds
  const inCare = (await unitsInCare(tx, input.productId, variantId)) * MILLI
  const funded = await fundedUnitsMilli(tx, input.productId, variantId)
  const wanted = BigInt(input.quantity) * MILLI
  if (funded + wanted > inCare) {
    const free = inCare > funded ? (inCare - funded) / MILLI : 0n
    throw new InvestorEngineError(`Only ${free} unit(s) of ${product.name} are not yet funded by investors`)
  }

  const amount = input.unitCost * BigInt(input.quantity)
  const allocation = await tx.investorProductAllocation.create({
    data: {
      investorId: investor.id,
      productId: input.productId,
      variantId,
      amountAllocated: toDecimal(amount),
      quantity: input.quantity,
      purchasePrice: toDecimal(input.unitCost),
      totalInvestment: toDecimal(amount),
      quantityRemaining: input.quantity,
      notes: 'Funded from free capital',
    },
  })
  const lot = await tx.productLot.create({
    data: {
      productId: input.productId,
      variantId,
      investorId: investor.id,
      unitsMilli: wanted,
      originalUnitsMilli: wanted,
      unitCost: input.unitCost,
      source: 'funded',
      allocationId: allocation.id,
      agreementVersion: input.agreementVersion ?? null,
      createdById: input.actorId,
    },
  })
  await post(tx, {
    type: 'lot_funded',
    reference: `lot_funded:${lot.id}`,
    description: `${input.quantity} x ${product.name} funded at ${input.unitCost} FCFA each`,
    createdById: input.actorId,
    metadata: { lotId: lot.id, investorId: investor.id },
    postings: [debit(Accounts.investorFree(investor.id), amount), credit(Accounts.investorLot(lot.id), amount)],
  })
  await mirrorInvestor(tx, investor.id, {
    type: 'allocation_product',
    amount,
    productId: input.productId,
    description: `Invested in ${input.quantity} x ${product.name} (${input.unitCost} FCFA each)`,
    createdBy: input.actorId,
  })
  return lot
}

/** An investor brings goods: SuberCraftex proposes a value; nothing counts until they accept it. */
export async function proposeInKindLot(
  tx: Tx,
  input: { investorId: string; productId: string; variantId?: string | null; quantity: number; unitCost: Xaf; note?: string; actorId: string }
) {
  if (!Number.isInteger(input.quantity) || input.quantity < 1) throw new InvestorEngineError('Quantity must be a whole number of units')
  if (input.unitCost <= 0n) throw new InvestorEngineError('Value per unit must be more than zero')
  await requireActiveInvestor(tx, input.investorId)
  const units = BigInt(input.quantity) * MILLI
  return tx.productLot.create({
    data: {
      productId: input.productId,
      variantId: input.variantId ?? null,
      investorId: input.investorId,
      unitsMilli: units,
      originalUnitsMilli: units,
      unitCost: input.unitCost,
      source: 'in_kind',
      status: 'proposed',
      proposedValueNote: input.note ?? null,
      createdById: input.actorId,
    },
  })
}

/** The investor accepts the valuation: the goods enter stock and become their capital. */
export async function acceptInKindLot(tx: Tx, lotId: string, investorUserId: string, agreementVersion: number | null) {
  await tx.$queryRaw`SELECT id FROM product_lots WHERE id = ${lotId} FOR UPDATE`
  const lot = await tx.productLot.findUniqueOrThrow({ where: { id: lotId } })
  const investor = await tx.investor.findUniqueOrThrow({ where: { id: lot.investorId } })
  if (investor.userId !== investorUserId) throw new InvestorEngineError('This proposal is for another investor')
  if (lot.status !== 'proposed') throw new InvestorEngineError('This proposal was already answered')
  const quantity = Number(lot.unitsMilli / MILLI)
  const amount = lot.unitCost * BigInt(quantity)
  const product = await tx.product.update({ where: { id: lot.productId }, data: { inventoryCount: { increment: quantity } } })
  if (lot.variantId) {
    await tx.productVariant.update({ where: { id: lot.variantId }, data: { inventoryCount: { increment: quantity } } })
  }
  await tx.inventoryLog.create({
    data: {
      productId: lot.productId,
      variantId: lot.variantId,
      action: 'received',
      quantityChange: quantity,
      quantityAfter: product.inventoryCount,
      userId: investorUserId,
      notes: `Brought by investor ${investor.investorNumber} (lot ${lotLabel(lot)})`,
    },
  })
  const allocation = await tx.investorProductAllocation.create({
    data: {
      investorId: investor.id,
      productId: lot.productId,
      variantId: lot.variantId,
      amountAllocated: toDecimal(amount),
      quantity,
      purchasePrice: toDecimal(lot.unitCost),
      totalInvestment: toDecimal(amount),
      quantityRemaining: quantity,
      notes: 'Goods brought by the investor',
    },
  })
  const active = await tx.productLot.update({
    where: { id: lot.id },
    data: { status: 'active', acceptedAt: new Date(), allocationId: allocation.id, agreementVersion },
  })
  await post(tx, {
    type: 'lot_in_kind',
    reference: `lot_in_kind:${lot.id}`,
    description: `${quantity} x ${product.name} brought by the investor at ${lot.unitCost} FCFA each`,
    createdById: investorUserId,
    postings: [debit(investorGoods(), amount), credit(Accounts.investorLot(lot.id), amount)],
  })
  await mirrorInvestor(tx, investor.id, {
    type: 'allocation_product',
    amount,
    productId: lot.productId,
    description: `Brought ${quantity} x ${product.name} (${lot.unitCost} FCFA each)`,
    totals: { invested: amount },
  })
  return active
}

// ------------------------------------------------------------------ selling

interface LineShare {
  lot: ProductLot | null // null = SuberCraftex's own units
  unitsMilli: bigint
  revenue: Xaf
}

/** Split one sold order line across the pool. */
async function shareLine(tx: Tx, item: OrderItem, lineRevenue: Xaf): Promise<LineShare[]> {
  const lots = await activeLots(tx, item.productId, item.variantId)
  if (lots.length === 0) return []
  const soldMilli = BigInt(item.quantity) * MILLI
  const inCare = (await unitsInCare(tx, item.productId, item.variantId, item.orderId)) + BigInt(item.quantity)
  const fundedMilli = lots.reduce((sum, l) => sum + l.unitsMilli, 0n)
  const companyMilli = inCare * MILLI > fundedMilli ? inCare * MILLI - fundedMilli : 0n
  const weights = [...lots.map((l) => l.unitsMilli), companyMilli]
  const totalWeight = weights.reduce((a, b) => a + b, 0n)
  // If the books say fewer units exist than were sold, every lot sells what it has at most
  const toSplit = soldMilli > totalWeight ? totalWeight : soldMilli
  const units = splitByWeights(toSplit, weights).map((u, i) => (i < lots.length && u > lots[i].unitsMilli ? lots[i].unitsMilli : u))
  const revenues = splitByWeights(lineRevenue, units.map((u) => (u > 0n ? u : 0n)).some((u) => u > 0n) ? units : weights)
  return units
    .map((u, i) => ({ lot: i < lots.length ? lots[i] : null, unitsMilli: u, revenue: revenues[i] }))
    .filter((s) => s.unitsMilli > 0n)
}

/** What the customer paid for each line, after spreading an order discount over the lines. */
function lineRevenues(items: OrderItem[], discount: Xaf): Xaf[] {
  const totals = items.map((i) => toXaf(i.total))
  const subtotal = totals.reduce((a, b) => a + b, 0n)
  if (discount <= 0n || subtotal === 0n) return totals
  const cuts = splitByWeights(discount > subtotal ? subtotal : discount, totals.map((t) => (t > 0n ? t : 0n)))
  return totals.map((t, i) => t - cuts[i])
}

export interface PooledDistribution {
  investorId: string
  lotId: string
  product: string
  units: number
  revenue: number
  cost: number
  profit: number
  investorShare: number
  capitalReturned: number
}

/**
 * Share a delivered order with the investors whose lots it sold from. Runs once per order
 * line and lot (unique lot + order item), inside the order's completion transaction.
 */
export async function distributeOrderPooled(tx: Tx, orderId: string, actorId: string | null): Promise<PooledDistribution[]> {
  const order = await tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { orderItems: true } })
  const percent = BigInt(await getSetting('investors.investorProfitPercent'))
  const holdDays = await getSetting('investors.profitHoldDays')
  const availableAt = new Date(Date.now() + holdDays * 86_400_000)
  const revenues = lineRevenues(order.orderItems, toXaf(order.discountAmount))
  const out: PooledDistribution[] = []

  for (const [index, item] of order.orderItems.entries()) {
    const shares = await shareLine(tx, item, revenues[index])
    for (const share of shares) {
      if (!share.lot) continue
      const lot = share.lot
      const exists = await tx.lotSale.findUnique({ where: { lotId_orderItemId: { lotId: lot.id, orderItemId: item.id } } })
      if (exists) continue
      const cost = (lot.unitCost * share.unitsMilli + MILLI / 2n) / MILLI
      const profit = share.revenue - cost
      const investorShare = profit >= 0n ? (profit * percent) / 100n : -((-profit * percent) / 100n)
      const capitalReturned = profit >= 0n ? cost : cost + investorShare

      // A sale below cost always shows why it was allowed
      let belowCostReason: string | null = null
      if (profit < 0n) {
        const fromOrder = order.adminNotes?.match(/Below cost approved: (.*)/)?.[1] ?? null
        const fromPrice = fromOrder
          ? null
          : await tx.auditLog.findFirst({ where: { action: 'product.below_cost_price', targetId: item.productId }, orderBy: { createdAt: 'desc' } })
        belowCostReason = fromOrder ?? ((fromPrice?.details as { reason?: string } | undefined)?.reason ?? 'price below cost')
      }

      const taken = await tx.productLot.updateMany({
        where: { id: lot.id, unitsMilli: { gte: share.unitsMilli } },
        data: { unitsMilli: { decrement: share.unitsMilli } },
      })
      if (taken.count !== 1) continue
      const after = await tx.productLot.findUniqueOrThrow({ where: { id: lot.id } })
      if (after.unitsMilli === 0n) {
        await tx.productLot.update({ where: { id: lot.id }, data: { status: 'closed', closedAt: new Date() } })
      }

      const postings: Posting[] = [debit(Accounts.investorLot(lot.id), cost), credit(Accounts.investorFree(lot.investorId), capitalReturned)]
      if (investorShare > 0n) {
        postings.push(debit(Accounts.investorProfitShare(), investorShare), credit(Accounts.investorProfitPending(lot.investorId), investorShare))
      } else if (investorShare < 0n) {
        postings.push(credit(Accounts.investorLossShare(), -investorShare))
      }
      await post(tx, {
        type: 'lot_sale',
        reference: `lot_sale:${lot.id}:${item.id}`,
        description: `Sold ${Number(share.unitsMilli) / 1000} x ${item.productName} (order ${order.orderNumber})${belowCostReason ? `, below cost: ${belowCostReason}` : ''}`,
        createdById: actorId,
        metadata: { lotId: lot.id, orderId, orderItemId: item.id, revenue: share.revenue, cost, profit },
        postings,
      })
      await tx.lotSale.create({
        data: {
          lotId: lot.id,
          orderId,
          orderItemId: item.id,
          investorId: lot.investorId,
          unitsMilli: share.unitsMilli,
          revenue: share.revenue,
          cost,
          profit,
          investorShare,
          capitalReturned,
          status: investorShare > 0n ? 'pending' : 'available',
          availableAt: investorShare > 0n ? availableAt : new Date(),
          releasedAt: investorShare > 0n ? null : new Date(),
        },
      })

      // Keep the old allocation and distribution lists in step for the existing screens and app
      if (lot.allocationId) {
        const remainingUnits = Number(after.unitsMilli / MILLI)
        const allocation = await tx.investorProductAllocation.findUnique({ where: { id: lot.allocationId } })
        if (allocation) {
          await tx.investorProductAllocation.update({
            where: { id: allocation.id },
            data: {
              quantityRemaining: remainingUnits,
              quantitySold: allocation.quantity - remainingUnits,
              profitGenerated: { increment: toDecimal(investorShare) },
              capitalReturned: { increment: toDecimal(capitalReturned) },
            },
          })
        }
      }
      await tx.profitDistribution.create({
        data: {
          investorId: lot.investorId,
          orderId,
          productId: item.productId,
          saleRevenue: toDecimal(share.revenue),
          saleCost: toDecimal(cost),
          grossProfit: toDecimal(profit),
          companyShare: toDecimal(profit - investorShare),
          investorShare: toDecimal(investorShare),
          capitalReturned: toDecimal(capitalReturned),
          description: `Sale of ${Number(share.unitsMilli) / 1000} x ${item.productName}`,
          notes: `Order: ${order.orderNumber}${belowCostReason ? ` (sold below cost, loss shared: ${belowCostReason})` : ''}`,
        },
      })
      await mirrorInvestor(tx, lot.investorId, {
        type: 'profit_credit',
        amount: capitalReturned + (investorShare > 0n ? investorShare : 0n),
        productId: item.productId,
        orderId,
        description:
          investorShare >= 0n
            ? `Sale: capital ${capitalReturned} FCFA back, profit ${investorShare} FCFA (pending ${holdDays} days)`
            : `Sale below cost: capital ${capitalReturned} FCFA back after your half of a ${-profit} FCFA loss`,
        notes: `Order: ${order.orderNumber}`,
        createdBy: actorId,
        totals: { profit: investorShare > 0n ? investorShare : 0n },
      })
      out.push({
        investorId: lot.investorId,
        lotId: lot.id,
        product: item.productName,
        units: Number(share.unitsMilli) / 1000,
        revenue: Number(share.revenue),
        cost: Number(cost),
        profit: Number(profit),
        investorShare: Number(investorShare),
        capitalReturned: Number(capitalReturned),
      })
    }
  }
  return out
}

/** For the daily job: profit whose holding period ended becomes withdrawable. */
export async function releaseHeldProfit(tx: Tx, now = new Date()) {
  const due = await tx.lotSale.findMany({ where: { status: 'pending', availableAt: { lte: now } }, take: 500 })
  for (const sale of due) {
    const claimed = await tx.lotSale.updateMany({ where: { id: sale.id, status: 'pending' }, data: { status: 'available', releasedAt: now } })
    if (claimed.count !== 1) continue
    await post(tx, {
      type: 'profit_released',
      reference: `profit_released:${sale.id}`,
      description: 'Holding period over: profit can be withdrawn',
      postings: [debit(Accounts.investorProfitPending(sale.investorId), sale.investorShare), credit(Accounts.investorProfit(sale.investorId), sale.investorShare)],
    })
    await mirrorInvestor(tx, sale.investorId)
  }
  return due.length
}

/**
 * A delivered order was returned: undo exactly what its sale did. The units go back to the
 * lots; the capital that came back is taken from free capital first, then from profit; the
 * profit is taken back from pending or, if already released, from profit (which may go
 * below zero and is recovered from future earnings).
 */
export async function returnOrderSales(tx: Tx, orderId: string, actorId: string | null) {
  const sales = await tx.lotSale.findMany({ where: { orderId, status: { not: 'returned' } } })
  for (const sale of sales) {
    const claimed = await tx.lotSale.updateMany({ where: { id: sale.id, status: { not: 'returned' } }, data: { status: 'returned', returnedAt: new Date() } })
    if (claimed.count !== 1) continue

    // The investor has left this lot (collected or bought back): the returned unit stays with
    // SuberCraftex, at cost. The investor keeps the capital; only the sale's profit is undone,
    // and a loss they carried on it is given back.
    const before = await tx.productLot.findUniqueOrThrow({ where: { id: sale.lotId } })
    if (before.status === 'collected' || before.status === 'bought_back') {
      const settle: Posting[] = []
      if (sale.investorShare > 0n) {
        settle.push(
          debit(sale.status === 'pending' ? Accounts.investorProfitPending(sale.investorId) : Accounts.investorProfit(sale.investorId), sale.investorShare),
          credit(Accounts.investorProfitShare(), sale.investorShare)
        )
      } else if (sale.investorShare < 0n) {
        settle.push(debit(Accounts.investorLossShare(), -sale.investorShare), credit(Accounts.investorFree(sale.investorId), -sale.investorShare))
      }
      if (settle.length) {
        await post(tx, {
          type: 'lot_sale_returned_after_exit',
          reference: `lot_sale_returned:${sale.id}`,
          description: 'Customer returned an item after you left this lot: the sale is undone and SuberCraftex keeps the unit at cost',
          createdById: actorId,
          postings: settle,
        })
      }
      await mirrorInvestor(tx, sale.investorId, {
        type: 'refund',
        amount: sale.investorShare > 0n ? sale.investorShare : 0n,
        orderId,
        description: 'Item returned after you left this lot: its profit was undone; SuberCraftex keeps the unit and you keep your capital',
        createdBy: actorId,
      })
      continue
    }

    await tx.productLot.update({ where: { id: sale.lotId }, data: { unitsMilli: { increment: sale.unitsMilli }, status: 'active', closedAt: null } })

    const free = await balanceOf(tx, Accounts.investorFree(sale.investorId))
    const fromFree = sale.capitalReturned < free ? sale.capitalReturned : free > 0n ? free : 0n
    const postings: Posting[] = [
      credit(Accounts.investorLot(sale.lotId), sale.cost),
      debit(Accounts.investorFree(sale.investorId), fromFree),
      debit(Accounts.investorProfit(sale.investorId), sale.capitalReturned - fromFree),
    ]
    if (sale.investorShare > 0n) {
      const wasPending = sale.status === 'pending'
      postings.push(
        debit(wasPending ? Accounts.investorProfitPending(sale.investorId) : Accounts.investorProfit(sale.investorId), sale.investorShare),
        credit(Accounts.investorProfitShare(), sale.investorShare)
      )
    } else if (sale.investorShare < 0n) {
      postings.push(debit(Accounts.investorLossShare(), -sale.investorShare))
    }
    await post(tx, {
      type: 'lot_sale_returned',
      reference: `lot_sale_returned:${sale.id}`,
      description: 'Customer returned the item: sale undone',
      createdById: actorId,
      postings,
    })
    const lot = await tx.productLot.findUniqueOrThrow({ where: { id: sale.lotId } })
    if (lot.allocationId) {
      const allocation = await tx.investorProductAllocation.findUnique({ where: { id: lot.allocationId } })
      if (allocation) {
        const remaining = Number(lot.unitsMilli / MILLI)
        await tx.investorProductAllocation.update({
          where: { id: allocation.id },
          data: {
            quantityRemaining: remaining,
            quantitySold: allocation.quantity - remaining,
            profitGenerated: { decrement: toDecimal(sale.investorShare) },
            capitalReturned: { decrement: toDecimal(sale.capitalReturned) },
          },
        })
      }
    }
    await mirrorInvestor(tx, sale.investorId, {
      type: 'refund',
      amount: sale.capitalReturned + (sale.investorShare > 0n ? sale.investorShare : 0n),
      orderId,
      description: 'Item returned by the customer: its sale was undone and the units are yours again',
      createdBy: actorId,
    })
  }
  return sales.length
}

// ------------------------------------------------------------------ leaving a lot

/** What closing (part of) a lot did, for the exit record and the investor's statement. */
export interface LotCloseResult {
  collectedUnits: number
  boughtBackMilli: bigint
  capitalCollected: Xaf
  capitalBoughtBack: Xaf
  lotStillActive: boolean
}

async function shelfStock(tx: Tx, productId: string, variantId: string | null) {
  return variantId
    ? (await tx.productVariant.findUniqueOrThrow({ where: { id: variantId }, select: { inventoryCount: true } })).inventoryCount
    : (await tx.product.findUniqueOrThrow({ where: { id: productId }, select: { inventoryCount: true } })).inventoryCount
}

/**
 * End a lot, or part of it. buy_back: SuberCraftex buys the units at cost (capital back to
 * free capital, no profit). collect: the investor takes the goods away (stock goes down);
 * only whole units can leave, and when the whole lot is collected any part-unit left by
 * pooled sales is bought back at cost. stock_loss: goods lost or damaged in SuberCraftex's
 * care; SuberCraftex repays the capital in full.
 *
 * Units can only be collected while they are on the shelf: units held by orders not yet
 * delivered are not taken from a customer.
 */
export async function closeLot(
  tx: Tx,
  lotId: string,
  how: 'buy_back' | 'collect' | 'stock_loss',
  actorId: string,
  note?: string,
  options: { unitsMilli?: bigint | null; reference?: string } = {}
): Promise<LotCloseResult> {
  await tx.$queryRaw`SELECT id FROM product_lots WHERE id = ${lotId} FOR UPDATE`
  const lot = await tx.productLot.findUniqueOrThrow({ where: { id: lotId } })
  if (lot.status !== 'active' || lot.unitsMilli === 0n) throw new InvestorEngineError('This lot has nothing left to close')
  const requested = options.unitsMilli ?? lot.unitsMilli
  if (requested <= 0n || requested > lot.unitsMilli) {
    throw new InvestorEngineError(`This lot has ${Number(lot.unitsMilli) / 1000} unit(s) left`)
  }
  const whole = requested === lot.unitsMilli
  if (how !== 'buy_back' && !whole && requested % MILLI !== 0n) throw new InvestorEngineError('Only whole units can leave the shop')
  const product = await tx.product.findUniqueOrThrow({ where: { id: lot.productId } })
  const capital = await balanceOf(tx, Accounts.investorLot(lot.id))
  // The capital that goes with these units (all of it when the lot closes)
  const shareOf = (units: bigint) => (units === lot.unitsMilli ? capital : (capital * units) / lot.unitsMilli)

  // Goods that physically leave: whole units only; a part-unit is bought back instead
  const leavingUnits = how === 'buy_back' ? 0n : requested / MILLI
  const boughtBackMilli = how === 'buy_back' ? requested : requested - leavingUnits * MILLI
  if (leavingUnits > 0n) {
    const shelf = await shelfStock(tx, lot.productId, lot.variantId)
    if (BigInt(shelf) < leavingUnits) {
      throw new InvestorEngineError(
        `Only ${Math.max(0, shelf)} unit(s) of ${product.name} are on the shelf now; the rest are held by orders not yet delivered. Collect fewer, or wait for those orders.`
      )
    }
    const n = Number(leavingUnits)
    const updated = lot.variantId
      ? await tx.productVariant.update({ where: { id: lot.variantId }, data: { inventoryCount: { decrement: n } } })
      : await tx.product.update({ where: { id: lot.productId }, data: { inventoryCount: { decrement: n } } })
    if (lot.variantId) await tx.product.update({ where: { id: lot.productId }, data: { inventoryCount: { decrement: n } } })
    await tx.inventoryLog.create({
      data: {
        productId: lot.productId,
        variantId: lot.variantId,
        action: how === 'collect' ? 'adjustment' : 'damaged',
        quantityChange: -n,
        quantityAfter: updated.inventoryCount,
        userId: actorId,
        notes: how === 'collect' ? `Collected by the investor (lot ${lotLabel(lot)})` : `Lost or damaged: ${note ?? ''}`,
      },
    })
  }

  const leavingCapital = leavingUnits > 0n ? shareOf(leavingUnits * MILLI) : 0n
  const capitalTaken = shareOf(requested)
  const boughtBackCapital = capitalTaken - leavingCapital
  const units = (m: bigint) => Number(m) / 1000

  const postings: Posting[] = [debit(Accounts.investorLot(lot.id), capitalTaken)]
  if (how === 'collect') {
    if (leavingCapital > 0n) postings.push(credit(investorGoods(), leavingCapital))
    if (boughtBackCapital > 0n) postings.push(credit(Accounts.investorFree(lot.investorId), boughtBackCapital))
  } else if (how === 'buy_back') {
    postings.push(credit(Accounts.investorFree(lot.investorId), capitalTaken))
  } else {
    postings.push(credit(Accounts.investorFree(lot.investorId), capitalTaken))
    postings.push(debit(Accounts.stockLoss(), capitalTaken), credit(investorGoods(), capitalTaken))
  }
  const parts = [
    leavingUnits > 0n ? `${how === 'collect' ? 'collected' : 'lost'} ${units(leavingUnits * MILLI)} x ${product.name}` : null,
    boughtBackMilli > 0n ? `SuberCraftex bought back ${units(boughtBackMilli)} x ${product.name} at cost` : null,
  ].filter(Boolean)
  await post(tx, {
    type: `lot_${how}`,
    reference: options.reference ?? `lot_close:${lot.id}`,
    description:
      how === 'stock_loss'
        ? `SuberCraftex repaid ${units(requested)} x ${product.name} lost in its care`
        : `Investor ${parts.join('; ')}`,
    createdById: actorId,
    metadata: { lotId: lot.id, note, unitsMilli: requested },
    postings,
  })

  const left = lot.unitsMilli - requested
  await tx.productLot.update({
    where: { id: lot.id },
    data: left > 0n ? { unitsMilli: left } : { unitsMilli: 0n, status: how === 'collect' ? 'collected' : 'bought_back', closedAt: new Date() },
  })
  if (lot.allocationId) {
    await tx.investorProductAllocation.update({ where: { id: lot.allocationId }, data: { quantityRemaining: Number(left / MILLI) } })
  }
  await mirrorInvestor(tx, lot.investorId, {
    type: how === 'collect' ? 'withdrawal_product' : 'refund',
    amount: capitalTaken,
    productId: lot.productId,
    description:
      how === 'collect'
        ? `You ${parts.join('; ')}`
        : how === 'buy_back'
          ? `SuberCraftex bought back ${units(requested)} x ${product.name}: ${capitalTaken} FCFA capital to free capital`
          : `${product.name} lost or damaged in our care: ${capitalTaken} FCFA capital repaid in full`,
    createdBy: actorId,
  })
  return {
    collectedUnits: how === 'collect' ? Number(leavingUnits) : 0,
    boughtBackMilli,
    capitalCollected: how === 'collect' ? leavingCapital : 0n,
    capitalBoughtBack: how === 'stock_loss' ? capitalTaken : boughtBackCapital,
    lotStillActive: left > 0n,
  }
}
