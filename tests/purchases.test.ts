import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { Accounts, balanceOf, checkLedger, credit, debit, post } from '@/lib/ledger'
import { fakeCamsol } from '@/lib/payments/camsol'
import { markInvestorLedgerLive } from '@/lib/investors/live'
import { requestWithdrawal } from '@/lib/investors/funds'
import { suspendInvestor } from '@/lib/investors/suspension'
import { cancelPurchase, proposeSplit, receivePurchase, startPurchase } from '@/lib/finance/purchases'
import { setSetting } from '@/lib/settings'
import { makeProduct, makeUser, resetDb, uid } from './helpers/db'

async function books() {
  const c = await checkLedger()
  expect(c.imbalance).toBe(0n)
  expect(c.drift).toEqual([])
}

async function investorWith(free: bigint) {
  const user = await makeUser('investor')
  const investor = await db.investor.create({
    data: { userId: user.id, investorNumber: uid('INV-'), fullName: user.fullName!, email: user.email, phone: '677123456', status: 'active', kycStatus: 'approved', isVerified: true },
  })
  await db.$transaction((tx) =>
    post(tx, { type: 'test', reference: `free:${investor.id}`, description: 't', postings: [debit(Accounts.openingBalances(), free), credit(Accounts.investorFree(investor.id), free)] })
  )
  return { investor, user }
}

async function opening(place: 'safe' | 'camsol', amount: bigint) {
  const account = place === 'safe' ? Accounts.safe() : Accounts.camsol()
  await db.$transaction((tx) => post(tx, { type: 'opening', reference: `opening:${place}`, description: 'o', postings: [debit(account, amount), credit(Accounts.openingBalances(), amount)] }))
}

describe('restocking with investor money', () => {
  beforeEach(async () => {
    await resetDb()
    fakeCamsol().reset()
    await db.$transaction((tx) => markInvestorLedgerLive(tx))
    await setSetting('payouts.feePercent', 5)
  })

  it('reserves capital, then turns it into lots at landed cost with change and the unspent part returned', async () => {
    const admin = await makeUser('admin')
    const a = await investorWith(100_000n)
    const b = await investorWith(50_000n)
    await opening('safe', 200_000n)
    const sandals = await makeProduct({ inventoryCount: 0 })
    const thread = await makeProduct({ inventoryCount: 2 })

    const split = await proposeSplit(90_000n)
    expect(split.investors.find((i) => i.investorId === a.investor.id)?.amount).toBe(60_000n)
    expect(split.investors.find((i) => i.investorId === b.investor.id)?.amount).toBe(30_000n)

    const purchase = await startPurchase({
      source: 'safe',
      buyerName: 'Mohamad',
      fundings: [{ investorId: a.investor.id, amount: 60_000n }, { investorId: b.investor.id, amount: 30_000n }],
      companyAmount: 10_000n,
      admin,
    })
    expect(purchase.number).toMatch(/^P-\d{4}-0001$/)
    expect(await balanceOf(db, Accounts.investorFree(a.investor.id))).toBe(40_000n)
    expect(await balanceOf(db, Accounts.safe())).toBe(100_000n)
    // Money at the market cannot be withdrawn
    await expect(requestWithdrawal({ investorId: a.investor.id, userId: a.user.id, from: 'cash', amount: 45_000n, phone: '677123456' })).rejects.toThrow(/most you can send/)

    await expect(receivePurchase({ purchaseId: purchase.id, lines: [{ productId: sandals.id, quantity: 10, lineTotal: 120_000n }], transport: 0n, admin })).rejects.toThrow(/only 100000/)

    const done = await receivePurchase({
      purchaseId: purchase.id,
      lines: [
        { productId: sandals.id, quantity: 10, lineTotal: 50_000n },
        { productId: thread.id, quantity: 4, lineTotal: 30_000n },
      ],
      transport: 8_000n,
      changeInto: 'safe',
      receiptUrls: ['/api/uploads/purchase-receipts/r1.jpg'],
      admin,
    })
    expect(done).toMatchObject({ status: 'received', spent: 88_000n, changeReturned: 12_000n })
    expect(done.lines.map((l) => [l.transportShare, l.unitCost])).toEqual([[5_000n, 5_500n], [3_000n, 8_250n]])

    // Stock went up
    expect((await db.product.findUniqueOrThrow({ where: { id: sandals.id } })).inventoryCount).toBe(10)
    expect((await db.product.findUniqueOrThrow({ where: { id: thread.id } })).inventoryCount).toBe(6)

    // A put in 60% of the money: 6 of 10 sandals at 5 500, 2.4 of 4 threads, 52 800 used, 7 200 back
    const lotsA = await db.productLot.findMany({ where: { investorId: a.investor.id }, orderBy: { unitsMilli: 'desc' } })
    expect(lotsA.map((l) => [l.productId, l.unitsMilli])).toEqual([[sandals.id, 6000n], [thread.id, 2400n]])
    expect(await balanceOf(db, Accounts.investorLot(lotsA[0].id))).toBe(33_000n)
    expect(await balanceOf(db, Accounts.investorLot(lotsA[1].id))).toBe(19_800n)
    expect(await balanceOf(db, Accounts.investorFree(a.investor.id))).toBe(47_200n)
    expect(await balanceOf(db, Accounts.investorPurchase(purchase.id, a.investor.id))).toBe(0n)
    const fundingB = await db.stockPurchaseFunding.findFirstOrThrow({ where: { investorId: b.investor.id } })
    expect(fundingB).toMatchObject({ used: 26_400n, returned: 3_600n })

    // Change back in the safe; the purchase is closed
    expect(await balanceOf(db, Accounts.safe())).toBe(112_000n)
    expect(await balanceOf(db, Accounts.purchaseAdvance(purchase.id))).toBe(0n)
    await expect(cancelPurchase({ purchaseId: purchase.id, admin })).rejects.toThrow(/at the market/)
    await books()
  })

  it('cancels a purchase: the money goes back and the capital is free again', async () => {
    const admin = await makeUser('admin')
    const a = await investorWith(50_000n)
    await opening('safe', 50_000n)
    const purchase = await startPurchase({ source: 'safe', buyerName: 'Awa', fundings: [{ investorId: a.investor.id, amount: 40_000n }], companyAmount: 0n, admin })
    await cancelPurchase({ purchaseId: purchase.id, admin })
    expect(await balanceOf(db, Accounts.investorFree(a.investor.id))).toBe(50_000n)
    expect(await balanceOf(db, Accounts.safe())).toBe(50_000n)
    expect((await db.stockPurchase.findUniqueOrThrow({ where: { id: purchase.id } })).status).toBe('cancelled')
    await books()
  })

  it('refuses money the books do not show, more than an investor has, or a suspended investor', async () => {
    const admin = await makeUser('admin')
    const a = await investorWith(10_000n)
    await expect(startPurchase({ source: 'safe', buyerName: 'X', fundings: [{ investorId: a.investor.id, amount: 5_000n }], companyAmount: 0n, admin })).rejects.toThrow(/opening balance/)
    await opening('safe', 100_000n)
    await expect(startPurchase({ source: 'safe', buyerName: 'X', fundings: [{ investorId: a.investor.id, amount: 20_000n }], companyAmount: 0n, admin })).rejects.toThrow(/only 10000/)
    await suspendInvestor({ investorId: a.investor.id, reason: 'Under review', admin })
    await expect(startPurchase({ source: 'safe', buyerName: 'X', fundings: [{ investorId: a.investor.id, amount: 5_000n }], companyAmount: 0n, admin })).rejects.toThrow(/suspended/)
    // Nothing half-done
    expect(await db.stockPurchase.count()).toBe(0)
    expect(await balanceOf(db, Accounts.investorFree(a.investor.id))).toBe(10_000n)
    await books()
  })

  it('sends the money by PayWithCAMSOL to the buyer, and releases everything if the payout is stopped', async () => {
    const admin = await makeUser('admin')
    const a = await investorWith(50_000n)
    await opening('camsol', 100_000n)
    const purchase = await startPurchase({ source: 'camsol', buyerName: 'Musa', buyerPhone: '677123456', fundings: [{ investorId: a.investor.id, amount: 30_000n }], companyAmount: 0n, admin })
    expect(purchase.status).toBe('waiting_payout')
    const payout = await db.payout.findUniqueOrThrow({ where: { id: purchase.payoutId! } })
    expect(payout).toMatchObject({ reason: 'stock_purchase', amount: 30_000n, feePaidByCompany: true })
    await expect(receivePurchase({ purchaseId: purchase.id, lines: [{ productId: (await makeProduct()).id, quantity: 1, lineTotal: 1_000n }], transport: 0n, admin })).rejects.toThrow(/not reached the buyer/)

    await cancelPurchase({ purchaseId: purchase.id, admin })
    expect((await db.stockPurchase.findUniqueOrThrow({ where: { id: purchase.id } })).status).toBe('cancelled')
    expect(await balanceOf(db, Accounts.investorFree(a.investor.id))).toBe(50_000n)
    expect(await balanceOf(db, Accounts.camsol())).toBe(100_000n)
    await books()
  })
})
