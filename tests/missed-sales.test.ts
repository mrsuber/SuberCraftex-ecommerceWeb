import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { Accounts, balanceOf, checkLedger } from '@/lib/ledger'
import { findMissedSales, recordMissedSales, shareOrderOnOldSystem } from '@/lib/investors/missed-sales'
import { previewMigration, runMigration } from '@/lib/investors/migration'
import { makeProduct, makeUser, resetDb, uid } from './helpers/db'

async function oldInvestor(cash: number) {
  const user = await makeUser('investor')
  return db.investor.create({
    data: {
      userId: user.id,
      investorNumber: uid('INV-'),
      fullName: user.fullName!,
      email: user.email,
      phone: '677123456',
      status: 'active',
      kycStatus: 'approved',
      isVerified: true,
      cashBalance: cash,
      totalInvested: cash,
    },
  })
}

async function allocate(investorId: string, productId: string, quantity: number, unitCost: number, at: Date) {
  return db.investorProductAllocation.create({
    data: {
      investorId,
      productId,
      quantity,
      quantityRemaining: quantity,
      purchasePrice: unitCost,
      amountAllocated: unitCost * quantity,
      totalInvestment: unitCost * quantity,
      allocatedAt: at,
    },
  })
}

/** A till sale the old system never shared: delivered, paid, stock already taken */
async function tillSale(productId: string, quantity: number, price: number, at: Date, discount = 0) {
  await db.product.update({ where: { id: productId }, data: { inventoryCount: { decrement: quantity } } })
  return db.order.create({
    data: {
      orderNumber: uid('POS-'),
      isPosOrder: true,
      subtotal: price * quantity,
      discountAmount: discount,
      totalAmount: price * quantity - discount,
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      deliveredAt: at,
      createdAt: at,
      orderItems: { create: [{ productId, productName: 'Sandals', productSku: uid('S'), quantity, price, total: price * quantity }] },
    },
  })
}

const day = (s: string) => new Date(`${s}T10:00:00Z`)

describe('sales the old system never shared', () => {
  beforeEach(async () => {
    await resetDb()
  })

  it('finds them, records capital plus half the profit (or half a loss), once only', async () => {
    const admin = await makeUser('admin')
    const investor = await oldInvestor(0)
    const sandals = await makeProduct({ inventoryCount: 1 })
    const thread = await makeProduct({ inventoryCount: 10 })
    const cheap = await makeProduct({ inventoryCount: 1 })
    await allocate(investor.id, sandals.id, 1, 3000, day('2026-03-02'))
    await allocate(investor.id, thread.id, 10, 100, day('2026-02-01'))
    await allocate(investor.id, cheap.id, 1, 3000, day('2026-03-02'))
    // Sold before the allocation: SuberCraftex's own unit, not shared
    await tillSale(thread.id, 0, 200, day('2026-01-15'))
    await tillSale(sandals.id, 1, 4500, day('2026-09-13'))
    await tillSale(thread.id, 1, 200, day('2026-03-10'))
    await tillSale(cheap.id, 1, 2500, day('2026-04-12'))

    const missed = await findMissedSales()
    expect(missed).toHaveLength(3)
    const bySandals = missed.find((m) => m.productId === sandals.id)!.shares[0]
    expect(bySandals).toMatchObject({ units: 1, revenue: 4500, cost: 3000, profit: 1500, investorShare: 750, capitalReturned: 3000 })
    const byCheap = missed.find((m) => m.productId === cheap.id)!.shares[0]
    expect(byCheap).toMatchObject({ revenue: 2500, profit: -500, investorShare: -250, capitalReturned: 2750 })

    // The move refuses while they are unrecorded
    await expect(runMigration(admin)).rejects.toThrow(/never shared/)

    const out = await recordMissedSales(admin)
    expect(out.sales).toBe(3)
    const after = await db.investor.findUniqueOrThrow({ where: { id: investor.id } })
    // Capital back: 3000 + 100 + 2750; profit: 750 + 50
    expect(Number(after.cashBalance)).toBe(5850)
    expect(Number(after.profitBalance)).toBe(800)
    expect((await db.investorProductAllocation.findFirstOrThrow({ where: { productId: thread.id } })).quantityRemaining).toBe(9)
    expect(await db.profitDistribution.count()).toBe(3)

    // Nothing left, and nothing doubles
    expect(await findMissedSales()).toEqual([])
    expect((await recordMissedSales(admin)).sales).toBe(0)
    expect(await db.profitDistribution.count()).toBe(3)

    // No unit is funded beyond stock any more, history still matches, and the move works
    const preview = await previewMigration()
    expect(preview.products.filter((p) => p.overFundedUnits > 0)).toEqual([])
    expect(preview.investors.every((i) => i.historyMatches)).toBe(true)
    await runMigration(admin)
    expect(await balanceOf(db, Accounts.investorFree(investor.id))).toBe(5850n)
    expect(await balanceOf(db, Accounts.investorProfit(investor.id))).toBe(800n)
    const c = await checkLedger()
    expect(c.imbalance).toBe(0n)
  })

  it('spreads an order discount over the line before sharing', async () => {
    const investor = await oldInvestor(0)
    const product = await makeProduct({ inventoryCount: 2 })
    await allocate(investor.id, product.id, 2, 3000, day('2026-03-02'))
    await tillSale(product.id, 2, 5000, day('2026-04-01'), 1000)
    const [sale] = await findMissedSales()
    expect(sale.shares[0]).toMatchObject({ units: 2, revenue: 9000, cost: 6000, profit: 3000, investorShare: 1500 })
  })

  it('shares a new till sale on the old system once, even if asked twice', async () => {
    const investor = await oldInvestor(0)
    const product = await makeProduct({ inventoryCount: 1 })
    await allocate(investor.id, product.id, 1, 3000, day('2026-03-02'))
    const order = await tillSale(product.id, 1, 4000, new Date())
    await db.$transaction((tx) => shareOrderOnOldSystem(tx, order.id, null))
    await db.$transaction((tx) => shareOrderOnOldSystem(tx, order.id, null))
    const after = await db.investor.findUniqueOrThrow({ where: { id: investor.id } })
    expect(Number(after.cashBalance)).toBe(3000)
    expect(Number(after.profitBalance)).toBe(500)
    expect(await db.profitDistribution.count()).toBe(1)
  })
})
