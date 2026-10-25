import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { Accounts, balanceOf, checkLedger, credit, debit, post } from '@/lib/ledger'
import { fakeCamsol } from '@/lib/payments/camsol'
import { refreshCollection, startCollection } from '@/lib/payments'
import { approvePayout, refreshPayout } from '@/lib/payments/payouts'
import { completeOrder, cancelOrRefundOrder } from '@/lib/commerce/fulfilment'
import { closeLot, distributeOrderPooled, fundLot, proposeInKindLot, acceptInKindLot, releaseHeldProfit } from '@/lib/investors/lots'
import { buyIntoMachine, closeMonth, companyBuysHolding, holdingValue, previewMonth, transferHoldingToInvestor } from '@/lib/investors/machines'
import { markInvestorLedgerLive } from '@/lib/investors/live'
import { previewMigration, runMigration } from '@/lib/investors/migration'
import { requestWithdrawal } from '@/lib/investors/funds'
import { setSetting } from '@/lib/settings'
import { investorPortfolio, investorStatement, statementCsv } from '@/lib/investors/portfolio'
import { acceptAgreement, acceptedCurrentVersion, currentAgreement } from '@/lib/investors/agreement'
import { RISK_KEYS } from '@/lib/investors/agreement-text'
import { makeProduct, makeUser, resetDb, uid } from './helpers/db'

async function books() {
  const c = await checkLedger()
  expect(c.imbalance).toBe(0n)
  expect(c.drift).toEqual([])
}

async function makeInvestor(freeCapital = 0n) {
  const user = await makeUser('investor')
  const investor = await db.investor.create({
    data: {
      userId: user.id,
      investorNumber: uid('INV-'),
      fullName: user.fullName!,
      email: user.email,
      phone: '677123456',
      status: 'active',
      kycStatus: 'approved',
      isVerified: true,
    },
  })
  if (freeCapital > 0n) {
    await db.$transaction((tx) =>
      post(tx, {
        type: 'test_deposit',
        reference: `test_deposit:${investor.id}`,
        description: 'test',
        postings: [debit(Accounts.camsol(), freeCapital), credit(Accounts.investorFree(investor.id), freeCapital)],
      })
    )
  }
  return { user, investor }
}

async function deliveredOrder(productId: string, quantity: number, unitPrice: number, discount = 0) {
  const order = await db.order.create({
    data: {
      orderNumber: uid('ORD-'),
      subtotal: unitPrice * quantity,
      discountAmount: discount,
      totalAmount: unitPrice * quantity - discount,
      paymentStatus: 'paid',
      orderStatus: 'processing',
      orderItems: { create: [{ productId, productName: 'Bag', productSku: 'BAG', quantity, price: unitPrice, total: unitPrice * quantity }] },
    },
  })
  // Stock was taken when the order was placed
  await db.product.update({ where: { id: productId }, data: { inventoryCount: { decrement: quantity } } })
  return order
}

describe('product pools', () => {
  beforeEach(async () => {
    await resetDb()
    await db.$transaction((tx) => markInvestorLedgerLive(tx))
    await setSetting('investors.profitHoldDays', 7)
  })

  it('never lets investors fund more units than exist', async () => {
    const { investor } = await makeInvestor(1_000_000n)
    const product = await makeProduct({ inventoryCount: 10 })
    await db.$transaction((tx) => fundLot(tx, { investorId: investor.id, productId: product.id, quantity: 8, unitCost: 15000n, actorId: 'a' }))
    await expect(
      db.$transaction((tx) => fundLot(tx, { investorId: investor.id, productId: product.id, quantity: 3, unitCost: 15000n, actorId: 'a' }))
    ).rejects.toThrow(/Only 2 unit/)
  })

  it('shares each sale across every lot and SuberCraftex in proportion, with 50% of profit', async () => {
    const a = await makeInvestor(1_000_000n)
    const b = await makeInvestor(1_000_000n)
    const product = await makeProduct({ inventoryCount: 10, price: 25000 })
    // A holds 5, B holds 3, SuberCraftex the other 2
    await db.$transaction((tx) => fundLot(tx, { investorId: a.investor.id, productId: product.id, quantity: 5, unitCost: 15000n, actorId: 'x' }))
    await db.$transaction((tx) => fundLot(tx, { investorId: b.investor.id, productId: product.id, quantity: 3, unitCost: 14000n, actorId: 'x' }))

    const order = await deliveredOrder(product.id, 1, 25000)
    const out = await db.$transaction((tx) => distributeOrderPooled(tx, order.id, null))
    const forA = out.find((o) => o.investorId === a.investor.id)!
    const forB = out.find((o) => o.investorId === b.investor.id)!
    expect(forA).toMatchObject({ units: 0.5, revenue: 12500, cost: 7500, profit: 5000, investorShare: 2500, capitalReturned: 7500 })
    expect(forB).toMatchObject({ units: 0.3, revenue: 7500, cost: 4200, profit: 3300, investorShare: 1650, capitalReturned: 4200 })

    // Profit waits for the holding period
    expect(await balanceOf(db, Accounts.investorProfitPending(a.investor.id))).toBe(2500n)
    expect(await balanceOf(db, Accounts.investorProfit(a.investor.id))).toBe(0n)
    expect(await balanceOf(db, Accounts.investorFree(a.investor.id))).toBe(1_000_000n - 75_000n + 7_500n)
    await db.$transaction((tx) => releaseHeldProfit(tx, new Date(Date.now() + 8 * 86_400_000)))
    expect(await balanceOf(db, Accounts.investorProfit(a.investor.id))).toBe(2500n)
    expect(await balanceOf(db, Accounts.investorProfitPending(a.investor.id))).toBe(0n)

    // Running it again changes nothing
    await db.$transaction((tx) => distributeOrderPooled(tx, order.id, null))
    expect(await db.lotSale.count()).toBe(2)
    // The old screens see the same numbers
    const mirrored = await db.investor.findUniqueOrThrow({ where: { id: a.investor.id } })
    expect(Number(mirrored.profitBalance)).toBe(2500)
    await books()
  })

  it('splits a loss 50/50 when sold below cost', async () => {
    const { investor } = await makeInvestor(100_000n)
    const product = await makeProduct({ inventoryCount: 1, price: 14000 })
    await db.$transaction((tx) => fundLot(tx, { investorId: investor.id, productId: product.id, quantity: 1, unitCost: 15000n, actorId: 'x' }))
    const order = await deliveredOrder(product.id, 1, 14000)
    const [sale] = await db.$transaction((tx) => distributeOrderPooled(tx, order.id, null))
    expect(sale).toMatchObject({ profit: -1000, investorShare: -500, capitalReturned: 14500 })
    expect(await balanceOf(db, Accounts.investorFree(investor.id))).toBe(100_000n - 15_000n + 14_500n)
    expect(await balanceOf(db, Accounts.investorLossShare())).toBe(500n)
    await books()
  })

  it('spreads an order discount over its lines before sharing', async () => {
    const { investor } = await makeInvestor(100_000n)
    const product = await makeProduct({ inventoryCount: 1, price: 25000 })
    await db.$transaction((tx) => fundLot(tx, { investorId: investor.id, productId: product.id, quantity: 1, unitCost: 15000n, actorId: 'x' }))
    const order = await deliveredOrder(product.id, 1, 25000, 2500)
    const [sale] = await db.$transaction((tx) => distributeOrderPooled(tx, order.id, null))
    expect(sale).toMatchObject({ revenue: 22500, profit: 7500, investorShare: 3750 })
  })

  it('undoes a sale when the customer returns it, even after the profit was released and withdrawn', async () => {
    const { investor } = await makeInvestor(15_000n)
    const product = await makeProduct({ inventoryCount: 1, price: 25000 })
    await db.$transaction((tx) => fundLot(tx, { investorId: investor.id, productId: product.id, quantity: 1, unitCost: 15000n, actorId: 'x' }))
    const order = await deliveredOrder(product.id, 1, 25000)
    await db.$transaction((tx) => completeOrder(tx, order.id, { actorId: null }))
    await db.$transaction((tx) => releaseHeldProfit(tx, new Date(Date.now() + 8 * 86_400_000)))
    // The investor withdraws the 15 000 capital that came back
    await db.$transaction((tx) =>
      post(tx, { type: 't', reference: 'spent', description: 'x', postings: [debit(Accounts.investorFree(investor.id), 15000n), credit(Accounts.camsol(), 15000n)] })
    )

    await db.$transaction((tx) => cancelOrRefundOrder(tx, order.id, { mode: 'refund', actorId: null }))
    const lot = await db.productLot.findFirstOrThrow({ where: { investorId: investor.id } })
    expect(lot.unitsMilli).toBe(1000n)
    expect(lot.status).toBe('active')
    expect(await balanceOf(db, Accounts.investorLot(lot.id))).toBe(15000n)
    // 15 000 capital + 5 000 profit taken back from profit, which goes below zero
    expect(await balanceOf(db, Accounts.investorProfit(investor.id))).toBe(-15000n)
    expect((await db.product.findUniqueOrThrow({ where: { id: product.id } })).inventoryCount).toBe(1)
    await books()
  })

  it('accepts goods brought by an investor only once they agree the value; lost goods are repaid in full', async () => {
    const { investor, user } = await makeInvestor()
    const admin = await makeUser('admin')
    const product = await makeProduct({ inventoryCount: 0 })
    const proposed = await db.$transaction((tx) => proposeInKindLot(tx, { investorId: investor.id, productId: product.id, quantity: 4, unitCost: 10000n, actorId: admin.id }))
    expect((await db.product.findUniqueOrThrow({ where: { id: product.id } })).inventoryCount).toBe(0)
    await db.$transaction((tx) => acceptInKindLot(tx, proposed.id, user.id, 2))
    expect((await db.product.findUniqueOrThrow({ where: { id: product.id } })).inventoryCount).toBe(4)
    expect(await balanceOf(db, Accounts.investorLot(proposed.id))).toBe(40000n)

    await db.$transaction((tx) => closeLot(tx, proposed.id, 'stock_loss', admin.id, 'water damage'))
    expect(await balanceOf(db, Accounts.investorFree(investor.id))).toBe(40000n)
    expect(await balanceOf(db, Accounts.stockLoss())).toBe(40000n)
    await books()
  })
})

describe('machines', () => {
  beforeEach(async () => {
    await resetDb()
    await db.$transaction((tx) => markInvestorLedgerLive(tx))
  })

  async function machine() {
    return db.equipment.create({
      data: {
        name: 'Embroidery machine',
        equipmentNumber: uid('EQP-'),
        purchasePrice: 2_000_000,
        currentValue: 2_000_000,
        purchaseDate: new Date('2026-01-15T00:00:00Z'),
        category: 'tailoring_machine',
        usefulLifeMonths: 60,
        residualValue: 200_000,
        depreciationStart: new Date('2026-01-01T00:00:00Z'),
        powerKw: 1.5,
        floorAreaM2: 4,
      },
    })
  }

  const job = (equipmentId: string, revenue: number, costs: number, hours: number, date: string) =>
    db.equipmentJobUsage.create({
      data: { equipmentId, jobDescription: 'job', revenue, materialCost: costs, laborCost: 0, totalExpenses: costs, netProfit: revenue - costs, companyProfit: 0, investorPoolProfit: 0, hoursUsed: hours, jobDate: new Date(date) },
    })

  it('closes a month: depreciation to the reserve, shared costs, 50/50, pool by units (SuberCraftex co-owns 40%)', async () => {
    const e = await machine()
    const a = await makeInvestor(1_000_000n)
    const b = await makeInvestor(1_000_000n)
    await db.$transaction((tx) => buyIntoMachine(tx, { investorId: a.investor.id, equipmentId: e.id, amount: 800_000n, actorId: 'x' }))
    await db.$transaction((tx) => buyIntoMachine(tx, { investorId: b.investor.id, equipmentId: e.id, amount: 400_000n, actorId: 'x' }))
    await expect(
      db.$transaction((tx) => buyIntoMachine(tx, { investorId: b.investor.id, equipmentId: e.id, amount: 900_000n, actorId: 'x' }))
    ).rejects.toThrow(/At most 800000/)

    // March: 500 000 income, 300 000 job costs, 100 h; bill 60 000 for 400 kWh; rent 150 000 for 50 m²
    await job(e.id, 500_000, 300_000, 100, '2026-03-10T10:00:00Z')
    await db.sharedCost.create({ data: { kind: 'electricity', periodStart: new Date('2026-03-01T00:00:00Z'), amount: 60_000n, totalKwh: 400 } })
    await db.sharedCost.create({ data: { kind: 'rent', periodStart: new Date('2026-03-01T00:00:00Z'), amount: 150_000n, totalAreaM2: 50 } })

    const preview = await db.$transaction((tx) => previewMonth(tx, e.id, new Date('2026-03-01T00:00:00Z')))
    expect(preview.electricity).toBe(22_500n) // 1.5 kW x 100 h = 150 kWh of 400
    expect(preview.rent).toBe(12_000n) // 4 m² of 50
    expect(preview.depreciation).toBe(30_000n) // (2 000 000 - 200 000) / 60
    expect(preview.profit).toBe(500_000n - 300_000n - 22_500n - 12_000n - 30_000n)

    const { statement } = await db.$transaction((tx) => closeMonth(tx, e.id, new Date('2026-03-01T00:00:00Z'), 'admin'))
    const profit = 135_500n
    expect(statement.investorPool).toBe(profit / 2n)
    const holderA = statement.holders.find((h) => h.investorId === a.investor.id)!
    expect(holderA.profit).toBe((profit / 2n) * 40n / 100n) // 40% of the pool
    expect(await balanceOf(db, Accounts.investorProfit(a.investor.id))).toBe(holderA.profit)
    expect(await balanceOf(db, Accounts.machineReserve(holderA.holdingId))).toBe(12_000n)
    expect(await balanceOf(db, Accounts.investorMachine(holderA.holdingId))).toBe(800_000n - 12_000n)
    await expect(db.$transaction((tx) => closeMonth(tx, e.id, new Date('2026-03-01T00:00:00Z'), 'admin'))).rejects.toThrow(/already closed/)
    await books()
  })

  it('carries a loss forward and recovers it before sharing again', async () => {
    const e = await machine()
    const a = await makeInvestor(1_000_000n)
    await db.$transaction((tx) => buyIntoMachine(tx, { investorId: a.investor.id, equipmentId: e.id, amount: 1_000_000n, actorId: 'x' }))
    // April: income 20 000, depreciation 30 000: a 10 000 loss
    await job(e.id, 20_000, 0, 10, '2026-04-05T10:00:00Z')
    const april = await db.$transaction((tx) => closeMonth(tx, e.id, new Date('2026-04-01T00:00:00Z'), 'admin'))
    expect(april.statement.profit).toBe(-10_000n)
    expect(april.statement.investorPool).toBe(0n)
    expect((await db.equipment.findUniqueOrThrow({ where: { id: e.id } })).carriedLoss).toBe(10_000n)
    // May: 70 000 income: 40 000 profit, first 10 000 clears the loss, 30 000 shared
    await job(e.id, 70_000, 0, 10, '2026-05-05T10:00:00Z')
    const may = await db.$transaction((tx) => closeMonth(tx, e.id, new Date('2026-05-01T00:00:00Z'), 'admin'))
    expect(may.statement.lossRecovered).toBe(10_000n)
    expect(may.statement.distributable).toBe(30_000n)
    expect(may.statement.investorPool).toBe(15_000n)
    expect((await db.equipment.findUniqueOrThrow({ where: { id: e.id } })).carriedLoss).toBe(0n)
    await books()
  })

  it('lets a co-owner buy a leaving investor out, or SuberCraftex in instalments', async () => {
    const e = await machine()
    const a = await makeInvestor(1_000_000n)
    const b = await makeInvestor(1_000_000n)
    const ha = await db.$transaction((tx) => buyIntoMachine(tx, { investorId: a.investor.id, equipmentId: e.id, amount: 800_000n, actorId: 'x' }))
    await db.$transaction((tx) => buyIntoMachine(tx, { investorId: b.investor.id, equipmentId: e.id, amount: 400_000n, actorId: 'x' }))
    const value = await db.$transaction((tx) => holdingValue(tx, ha))
    expect(value.bookValue).toBe(800_000n)

    await db.$transaction((tx) => transferHoldingToInvestor(tx, { holdingId: ha.id, buyerInvestorId: b.investor.id, price: 500_000n, actorId: 'admin' }))
    expect(await balanceOf(db, Accounts.investorFree(a.investor.id))).toBe(200_000n + 500_000n)
    expect(await balanceOf(db, Accounts.investorFree(b.investor.id))).toBe(600_000n - 500_000n)
    const bHoldings = await db.equipmentHolding.findMany({ where: { investorId: b.investor.id, status: 'active' } })
    expect(bHoldings.reduce((s, h) => s + h.units, 0n)).toBe(600_000n)

    const bh = bHoldings[0]
    await db.$transaction((tx) => companyBuysHolding(tx, { holdingId: bh.id, price: 380_000n, instalments: 3, actorId: 'admin' }))
    expect(await balanceOf(db, Accounts.investorExitDue(b.investor.id))).toBe(380_000n)
    await books()
  })
})

describe('investor money in and out', () => {
  beforeEach(async () => {
    await resetDb()
    fakeCamsol().reset()
    await db.$transaction((tx) => markInvestorLedgerLive(tx))
    await setSetting('payouts.feePercent', 5)
  })

  it('credits a Mobile Money deposit to free capital', async () => {
    const { investor } = await makeInvestor()
    const c = await startCollection({ purpose: 'investor_deposit', targetId: investor.id, amount: 50_000n, phone: '677123456', description: 'deposit' })
    fakeCamsol().confirmCollection(c.providerReference!)
    await refreshCollection(c.reference, { force: true })
    expect(await balanceOf(db, Accounts.investorFree(investor.id))).toBe(50_000n)
    expect(await db.investorDeposit.count({ where: { investorId: investor.id, confirmationStatus: 'confirmed' } })).toBe(1)
    expect(Number((await db.investor.findUniqueOrThrow({ where: { id: investor.id } })).cashBalance)).toBe(50_000)
    await books()
  })

  it('reserves a withdrawal with its fee, and completes the request when the payout succeeds', async () => {
    const admin = await makeUser('admin')
    const { investor, user } = await makeInvestor(21_000n)
    await expect(requestWithdrawal({ investorId: investor.id, userId: user.id, from: 'cash', amount: 21_000n, phone: '677123456' })).rejects.toThrow(/most you can send is 20000/)
    const { request, payout } = await requestWithdrawal({ investorId: investor.id, userId: user.id, from: 'cash', amount: 20_000n, phone: '677123456' })
    expect(await balanceOf(db, Accounts.investorFree(investor.id))).toBe(0n)
    await approvePayout(payout.id, admin)
    await refreshPayout(payout.id)
    expect((await db.withdrawalRequest.findUniqueOrThrow({ where: { id: request.id } })).status).toBe('completed')
    expect(Number((await db.investor.findUniqueOrThrow({ where: { id: investor.id } })).totalWithdrawn)).toBe(20_000)
    await books()
  })
})

describe('moving existing balances into the ledger', () => {
  beforeEach(resetDb)

  it('previews problems, then brings every balance over unchanged, capping units beyond stock', async () => {
    const admin = await makeUser('admin')
    const a = await makeInvestor()
    const b = await makeInvestor()
    await db.investor.update({ where: { id: a.investor.id }, data: { cashBalance: 120_000, profitBalance: 8_000, agreementAccepted: true } })
    await db.investor.update({ where: { id: b.investor.id }, data: { cashBalance: 50_000, profitBalance: 0 } })
    const product = await makeProduct({ inventoryCount: 10 })
    // 12 units funded but only 10 exist
    for (const [investorId, qty] of [[a.investor.id, 8], [b.investor.id, 4]] as const) {
      await db.investorProductAllocation.create({
        data: { investorId, productId: product.id, amountAllocated: qty * 15000, quantity: qty, purchasePrice: 15000, totalInvestment: qty * 15000, quantityRemaining: qty },
      })
    }
    const preview = await previewMigration()
    expect(preview.live).toBe(false)
    expect(preview.products[0]).toMatchObject({ fundedUnits: 12, inStock: 10, overFundedUnits: 2 })

    const result = await runMigration(admin)
    expect(result.adjustments.length).toBe(2)
    expect(await balanceOf(db, Accounts.investorProfit(a.investor.id))).toBe(8_000n)
    const lots = await db.productLot.findMany({ orderBy: { unitsMilli: 'desc' } })
    expect(lots.reduce((s, l) => s + l.unitsMilli, 0n)).toBe(10_000n)
    // Capital for the 2 missing units went back to free capital: nothing lost
    const totalA = (await balanceOf(db, Accounts.investorFree(a.investor.id))) + (await balanceOf(db, Accounts.investorLot(lots[0].id)))
    expect(totalA).toBe(120_000n + 8n * 15000n)
    expect(await db.investorAgreementAcceptance.count()).toBe(1)
    await expect(runMigration(admin)).rejects.toThrow(/already/)
    await books()
  })
})

describe('what the investor sees', () => {
  beforeEach(async () => {
    await resetDb()
    await db.$transaction((tx) => markInvestorLedgerLive(tx))
    await setSetting('investors.profitHoldDays', 0)
  })

  it('shows balances, lots and every movement from the ledger', async () => {
    const { investor } = await makeInvestor(300_000n)
    const product = await makeProduct({ inventoryCount: 10 })
    await db.$transaction((tx) => fundLot(tx, { investorId: investor.id, productId: product.id, quantity: 10, unitCost: 15000n, actorId: 'a' }))
    const p = await investorPortfolio(investor.id)
    expect(p.balances.free).toBe(150_000)
    expect(p.balances.inProducts).toBe(150_000)
    expect(p.lots).toHaveLength(1)
    expect(p.lots[0].unitsLeft).toBe(10)
    const rows = await investorStatement(investor.id)
    expect(rows.length).toBeGreaterThanOrEqual(3)
    const csv = statementCsv(rows)
    expect(csv.split('\n')[0]).toContain('Balance after')
    expect(csv.split('\n')).toHaveLength(rows.length + 1)
  })

  it('records an agreement only with every risk ticked and the full name typed', async () => {
    const { investor } = await makeInvestor()
    const current = await currentAgreement()
    const base = { investorId: investor.id, versionId: current.id, language: 'en' as const }
    await expect(acceptAgreement({ ...base, typedName: 'Someone Else', risks: [...RISK_KEYS] })).rejects.toThrow(/full name/)
    await expect(acceptAgreement({ ...base, typedName: investor.fullName, risks: RISK_KEYS.slice(1) })).rejects.toThrow(/every risk/)
    await acceptAgreement({ ...base, typedName: `  ${investor.fullName.toUpperCase()} `, risks: [...RISK_KEYS] })
    expect(await acceptedCurrentVersion(db, investor.id)).toBe(current.version)
    const row = await db.investorAgreementAcceptance.findFirstOrThrow({ where: { investorId: investor.id } })
    expect(Object.keys(row.risksAcknowledged as object).sort()).toEqual([...RISK_KEYS].sort())
  })
})
