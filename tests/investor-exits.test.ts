import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { Accounts, balanceOf, checkLedger, credit, debit, post } from '@/lib/ledger'
import { fakeCamsol } from '@/lib/payments/camsol'
import { completeOrder, cancelOrRefundOrder } from '@/lib/commerce/fulfilment'
import { fundLot } from '@/lib/investors/lots'
import { closeLotNow, completeExit, confirmHandover, requestExit } from '@/lib/investors/exits'
import { markInvestorLedgerLive } from '@/lib/investors/live'
import { requestWithdrawal } from '@/lib/investors/funds'
import { reactivateInvestor, suspendInvestor } from '@/lib/investors/suspension'
import { takeGoodsOffShelf } from '@/lib/investors/legacy-goods'
import { setSetting } from '@/lib/settings'
import { makeProduct, makeUser, resetDb, uid } from './helpers/db'

async function books() {
  const c = await checkLedger()
  expect(c.imbalance).toBe(0n)
  expect(c.drift).toEqual([])
}

async function makeInvestor(freeCapital = 0n) {
  const user = await makeUser('investor')
  const investor = await db.investor.create({
    data: { userId: user.id, investorNumber: uid('INV-'), fullName: user.fullName!, email: user.email, phone: '677123456', status: 'active', kycStatus: 'approved', isVerified: true },
  })
  if (freeCapital > 0n) {
    await db.$transaction((tx) =>
      post(tx, { type: 'test_deposit', reference: `test_deposit:${investor.id}`, description: 'test', postings: [debit(Accounts.camsol(), freeCapital), credit(Accounts.investorFree(investor.id), freeCapital)] })
    )
  }
  return { user, investor }
}

async function placeOrder(productId: string, quantity: number, unitPrice: number, status: 'processing' | 'pending' = 'processing') {
  const order = await db.order.create({
    data: {
      orderNumber: uid('ORD-'),
      subtotal: unitPrice * quantity,
      totalAmount: unitPrice * quantity,
      paymentStatus: status === 'pending' ? 'pending' : 'paid',
      orderStatus: status,
      orderItems: { create: [{ productId, productName: 'Bag', productSku: 'BAG', quantity, price: unitPrice, total: unitPrice * quantity }] },
    },
  })
  await db.product.update({ where: { id: productId }, data: { inventoryCount: { decrement: quantity } } })
  return order
}

const stock = async (productId: string) => (await db.product.findUniqueOrThrow({ where: { id: productId } })).inventoryCount
const superAdmin = async () => ({ ...(await makeUser('admin')), superAdmin: true })

describe('leaving a product lot', () => {
  beforeEach(async () => {
    await resetDb()
    await db.$transaction((tx) => markInvestorLedgerLive(tx))
    await setSetting('investors.profitHoldDays', 7)
  })

  it('lets an investor take some units and keep the rest invested, then confirm the handover', async () => {
    const admin = await makeUser('admin')
    const { investor } = await makeInvestor(150_000n)
    const product = await makeProduct({ inventoryCount: 10 })
    const lot = await db.$transaction((tx) => fundLot(tx, { investorId: investor.id, productId: product.id, quantity: 10, unitCost: 15000n, actorId: admin.id }))

    const exit = await closeLotNow({ lotId: lot.id, how: 'collect', units: 4, note: 'Collected in person, ID checked', admin })
    expect(exit.collectedUnits).toBe(4)
    expect(await stock(product.id)).toBe(6)
    const after = await db.productLot.findUniqueOrThrow({ where: { id: lot.id } })
    expect(after.status).toBe('active')
    expect(after.unitsMilli).toBe(6000n)
    expect(await balanceOf(db, Accounts.investorLot(lot.id))).toBe(90_000n)

    await expect(confirmHandover({ exitId: exit.id, investorId: investor.id, received: false })).rejects.toThrow(/what is wrong/)
    await confirmHandover({ exitId: exit.id, investorId: investor.id, received: true })
    await expect(confirmHandover({ exitId: exit.id, investorId: investor.id, received: true })).rejects.toThrow(/already answered/)
    await books()
  })

  it('never hands over units held by orders not yet delivered', async () => {
    const admin = await makeUser('admin')
    const { investor } = await makeInvestor(150_000n)
    const product = await makeProduct({ inventoryCount: 10 })
    const lot = await db.$transaction((tx) => fundLot(tx, { investorId: investor.id, productId: product.id, quantity: 10, unitCost: 15000n, actorId: admin.id }))
    await placeOrder(product.id, 3, 25000, 'pending')
    await expect(closeLotNow({ lotId: lot.id, how: 'collect', admin })).rejects.toThrow(/Only 7 unit/)
    expect(await stock(product.id)).toBe(7)
    expect(await db.investorExit.count()).toBe(0)
  })

  it('collects the whole units and buys back the part-unit left by pooled sales', async () => {
    const admin = await makeUser('admin')
    const { investor } = await makeInvestor(75_000n)
    const product = await makeProduct({ inventoryCount: 10 })
    const lot = await db.$transaction((tx) => fundLot(tx, { investorId: investor.id, productId: product.id, quantity: 5, unitCost: 15000n, actorId: admin.id }))
    // Half a unit already sold at cost through the pool
    await db.productLot.update({ where: { id: lot.id }, data: { unitsMilli: 4500n } })
    await db.$transaction((tx) =>
      post(tx, { type: 't', reference: 'half', description: 'half sold', postings: [debit(Accounts.investorLot(lot.id), 7500n), credit(Accounts.investorFree(investor.id), 7500n)] })
    )

    const exit = await closeLotNow({ lotId: lot.id, how: 'collect', admin })
    expect(exit.collectedUnits).toBe(4)
    expect(exit.boughtBackMilli).toBe(500n)
    expect(await stock(product.id)).toBe(6)
    expect(await balanceOf(db, Accounts.investorLot(lot.id))).toBe(0n)
    // 7 500 from the half sold earlier + 7 500 for the half bought back
    expect(await balanceOf(db, Accounts.investorFree(investor.id))).toBe(15_000n)
    expect((await db.productLot.findUniqueOrThrow({ where: { id: lot.id } })).status).toBe('collected')
    await books()
  })

  it('records what the investor asked for, and needs a reason to do otherwise', async () => {
    const admin = await superAdmin()
    const { investor } = await makeInvestor(150_000n)
    const product = await makeProduct({ inventoryCount: 10 })
    const lot = await db.$transaction((tx) => fundLot(tx, { investorId: investor.id, productId: product.id, quantity: 10, unitCost: 15000n, actorId: admin.id }))
    await expect(requestExit({ investorId: investor.id, kind: 'product', lotId: lot.id, option: 'collect', units: 11 })).rejects.toThrow(/10 unit/)
    const exit = await requestExit({ investorId: investor.id, kind: 'product', lotId: lot.id, option: 'collect', units: 3 })
    expect(exit.valuation).toBe(45_000n)
    expect(exit.requestedOption).toBe('collect')

    await expect(completeExit(exit.id, { option: 'buy_back' }, admin)).rejects.toThrow(/asked to collect/)
    await completeExit(exit.id, { option: 'buy_back', note: 'Investor agreed by phone to be paid instead' }, admin)
    const done = await db.investorExit.findUniqueOrThrow({ where: { id: exit.id } })
    expect(done).toMatchObject({ status: 'completed', option: 'buy_back', collectedUnits: 0, boughtBackMilli: 3000n, price: 45_000n })
    expect(await stock(product.id)).toBe(10)
    expect(await balanceOf(db, Accounts.investorFree(investor.id))).toBe(45_000n)
    await books()
  })

  it('keeps a unit returned after the investor left with SuberCraftex; the investor keeps their capital', async () => {
    const admin = await makeUser('admin')
    const { investor } = await makeInvestor(30_000n)
    const product = await makeProduct({ inventoryCount: 2, price: 25000 })
    const lot = await db.$transaction((tx) => fundLot(tx, { investorId: investor.id, productId: product.id, quantity: 2, unitCost: 15000n, actorId: admin.id }))
    const order = await placeOrder(product.id, 1, 25000)
    await db.$transaction((tx) => completeOrder(tx, order.id, { actorId: null }))
    expect(await balanceOf(db, Accounts.investorProfitPending(investor.id))).toBe(5_000n)

    await closeLotNow({ lotId: lot.id, how: 'collect', admin })
    expect(await stock(product.id)).toBe(0)

    await db.$transaction((tx) => cancelOrRefundOrder(tx, order.id, { mode: 'refund', actorId: null }))
    const closed = await db.productLot.findUniqueOrThrow({ where: { id: lot.id } })
    expect(closed.status).toBe('collected')
    expect(closed.unitsMilli).toBe(0n)
    expect(await balanceOf(db, Accounts.investorProfitPending(investor.id))).toBe(0n)
    expect(await balanceOf(db, Accounts.investorFree(investor.id))).toBe(15_000n)
    expect(await stock(product.id)).toBe(1)
    await books()
  })

  it('takes goods off the shelf in the old flow, never more than are on it', async () => {
    const admin = await makeUser('admin')
    const product = await makeProduct({ inventoryCount: 3 })
    await db.$transaction((tx) => takeGoodsOffShelf(tx, { productId: product.id, variantId: null, quantity: 2, userId: admin.id, note: 'test' }))
    expect(await stock(product.id)).toBe(1)
    await expect(db.$transaction((tx) => takeGoodsOffShelf(tx, { productId: product.id, variantId: null, quantity: 2, userId: admin.id, note: 'test' }))).rejects.toThrow(/Only 1 unit/)
    expect(await db.inventoryLog.count({ where: { productId: product.id } })).toBe(1)
  })
})

describe('suspending an investor', () => {
  beforeEach(async () => {
    await resetDb()
    fakeCamsol().reset()
    await db.$transaction((tx) => markInvestorLedgerLive(tx))
    await setSetting('payouts.feePercent', 5)
  })

  it('freezes money in and out, returns unsent withdrawals, and keeps investments earning', async () => {
    const admin = await makeUser('admin')
    const { investor, user } = await makeInvestor(100_000n)
    const product = await makeProduct({ inventoryCount: 10 })
    const { payout } = await requestWithdrawal({ investorId: investor.id, userId: user.id, from: 'cash', amount: 20_000n, phone: '677123456' })
    expect(await balanceOf(db, Accounts.investorFree(investor.id))).toBe(79_000n)

    await expect(suspendInvestor({ investorId: investor.id, reason: '', admin })).rejects.toThrow(/reason/)
    const out = await suspendInvestor({ investorId: investor.id, reason: 'KYC document expired', admin })
    expect(out.payoutsStopped).toBe(1)
    expect((await db.payout.findUniqueOrThrow({ where: { id: payout.id } })).status).toBe('rejected')
    expect(await balanceOf(db, Accounts.investorFree(investor.id))).toBe(100_000n)
    expect(await db.auditLog.count({ where: { action: 'investor.suspended', targetId: investor.id } })).toBe(1)

    await expect(requestWithdrawal({ investorId: investor.id, userId: user.id, from: 'cash', amount: 1_000n, phone: '677123456' })).rejects.toThrow(/suspended \(KYC document expired\)/)
    await expect(db.$transaction((tx) => fundLot(tx, { investorId: investor.id, productId: product.id, quantity: 1, unitCost: 15000n, actorId: admin.id }))).rejects.toThrow(/suspended/)

    await reactivateInvestor({ investorId: investor.id, admin })
    const back = await db.investor.findUniqueOrThrow({ where: { id: investor.id } })
    expect(back).toMatchObject({ status: 'active', suspendedReason: null })
    await db.$transaction((tx) => fundLot(tx, { investorId: investor.id, productId: product.id, quantity: 1, unitCost: 15000n, actorId: admin.id }))
    await books()
  })

  it('still lets a suspended investor ask to leave an investment', async () => {
    const admin = await makeUser('admin')
    const { investor } = await makeInvestor(30_000n)
    const product = await makeProduct({ inventoryCount: 2 })
    const lot = await db.$transaction((tx) => fundLot(tx, { investorId: investor.id, productId: product.id, quantity: 2, unitCost: 15000n, actorId: admin.id }))
    await suspendInvestor({ investorId: investor.id, reason: 'Under review', admin })
    const exit = await requestExit({ investorId: investor.id, kind: 'product', lotId: lot.id, option: 'buy_back' })
    expect(exit.status).toBe('requested')
  })
})
