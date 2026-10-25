import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { Accounts, balanceOf, checkLedger, credit, debit, InsufficientFundsError, post, reverse } from '@/lib/ledger'
import { resetDb } from './helpers/db'

const deposit = (investorId: string, amount: bigint, ref: string) =>
  db.$transaction((tx) =>
    post(tx, {
      type: 'investor_deposit',
      reference: ref,
      description: 'Deposit',
      postings: [debit(Accounts.camsol(), amount), credit(Accounts.investorFree(investorId), amount)],
    })
  )

const withdraw = (investorId: string, amount: bigint, ref: string) =>
  db.$transaction((tx) =>
    post(tx, {
      type: 'withdrawal_reserved',
      reference: ref,
      description: 'Withdrawal',
      postings: [debit(Accounts.investorFree(investorId), amount), credit(Accounts.payoutsInFlight(), amount)],
    })
  )

describe('ledger', () => {
  beforeEach(resetDb)

  it('keeps where money sits apart from who it belongs to, and always balances', async () => {
    await deposit('inv1', 25_000n, 'dep:1')
    expect(await balanceOf(db, Accounts.camsol())).toBe(25_000n)
    expect(await balanceOf(db, Accounts.investorFree('inv1'))).toBe(25_000n)
    const check = await checkLedger()
    expect(check.imbalance).toBe(0n)
    expect(check.drift).toEqual([])
  })

  it('posts the same reference only once', async () => {
    const first = await deposit('inv1', 10_000n, 'dep:same')
    const second = await deposit('inv1', 10_000n, 'dep:same')
    expect(first.duplicate).toBe(false)
    expect(second.duplicate).toBe(true)
    expect(await balanceOf(db, Accounts.investorFree('inv1'))).toBe(10_000n)
  })

  it('refuses unbalanced or empty transactions', async () => {
    await expect(
      db.$transaction((tx) =>
        post(tx, {
          type: 'bad',
          reference: 'bad:1',
          description: 'x',
          postings: [debit(Accounts.camsol(), 100n), credit(Accounts.investorFree('a'), 90n)],
        })
      )
    ).rejects.toThrow(/balance/)
    expect(await db.ledgerTransaction.count()).toBe(0)
  })

  it('never lets a wallet go below zero, even with two withdrawals at once', async () => {
    await deposit('inv1', 10_000n, 'dep:2')
    await expect(withdraw('inv1', 10_001n, 'w:too-much')).rejects.toBeInstanceOf(InsufficientFundsError)
    const results = await Promise.allSettled([withdraw('inv1', 7_000n, 'w:a'), withdraw('inv1', 7_000n, 'w:b')])
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1)
    expect(await balanceOf(db, Accounts.investorFree('inv1'))).toBe(3_000n)
    expect((await checkLedger()).imbalance).toBe(0n)
  })

  it('lets profit wallets go negative after a return, but not capital', async () => {
    await db.$transaction((tx) =>
      post(tx, {
        type: 'return_clawback',
        reference: 'claw:1',
        description: 'Profit taken back after a return',
        postings: [debit(Accounts.investorProfit('inv1'), 2_500n), credit(Accounts.investorProfitShare(), 2_500n)],
      })
    )
    expect(await balanceOf(db, Accounts.investorProfit('inv1'))).toBe(-2_500n)
  })

  it('reverses a transaction with its mirror image', async () => {
    await deposit('inv1', 5_000n, 'dep:3')
    await db.$transaction((tx) => reverse(tx, 'dep:3', 'Mistake'))
    expect(await balanceOf(db, Accounts.investorFree('inv1'))).toBe(0n)
    expect(await balanceOf(db, Accounts.camsol())).toBe(0n)
    const reversal = await db.ledgerTransaction.findUniqueOrThrow({ where: { reference: 'reversal:dep:3' } })
    expect(reversal.reversesId).not.toBeNull()
  })
})
