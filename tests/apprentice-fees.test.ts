import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { Accounts, balanceOf, checkLedger, credit, debit, post } from '@/lib/ledger'
import { fakeCamsol } from '@/lib/payments/camsol'
import { refreshCollection, startCollection } from '@/lib/payments'
import {
  assertFeesPaid,
  assertNotPausedForFees,
  assignFeePlan,
  cancelSchedule,
  feeStanding,
  invoiceDueInstalments,
  recordCashFeePayment,
  refundAdvance,
  refundable,
  waiveInstalment,
} from '@/lib/apprentices/fees'
import { makeUser, resetDb, uid } from './helpers/db'

async function books() {
  const c = await checkLedger()
  expect(c.imbalance).toBe(0n)
  expect(c.drift).toEqual([])
}

async function makeApprentice() {
  const user = await makeUser('apprentice', { phone: '677123456' })
  const mentor = await makeUser('tailor')
  return db.apprentice.create({
    data: {
      userId: user.id,
      apprenticeNumber: uid('APP-'),
      fullName: user.fullName!,
      email: user.email,
      phone: '677123456',
      department: 'tailoring',
      mentorId: mentor.id,
      mentorType: 'tailor',
      startDate: new Date('2026-01-01'),
      status: 'active',
    },
  })
}

const day = (s: string) => new Date(`${s}T00:00:00Z`)

describe('apprentice fees', () => {
  let admin: Awaited<ReturnType<typeof makeUser>>
  let plan: { id: string }

  beforeEach(async () => {
    await resetDb()
    fakeCamsol().reset()
    admin = await makeUser('admin')
    plan = await db.apprenticeFeePlan.create({ data: { name: 'Tailoring, 6 months', registrationFee: 10_000n, tuition: 90_000n, instalments: 3, intervalMonths: 2 } })
  })

  it('splits a plan into dated instalments, sharing a discount over them', async () => {
    const a = await makeApprentice()
    await expect(assignFeePlan({ apprenticeId: a.id, planId: plan.id, startDate: day('2026-01-31'), discount: 10_000n, admin })).rejects.toThrow(/why/)
    const s = await assignFeePlan({ apprenticeId: a.id, planId: plan.id, startDate: day('2026-01-31'), discount: 10_000n, discountReason: 'Sibling', admin })
    expect(s.total).toBe(90_000n)
    expect(s.instalments.map((i) => [i.label, i.dueDate.toISOString().slice(0, 10), i.amount])).toEqual([
      ['Registration', '2026-01-31', 9_000n],
      ['Instalment 1 of 3', '2026-01-31', 27_000n],
      ['Instalment 2 of 3', '2026-03-31', 27_000n],
      ['Instalment 3 of 3', '2026-05-31', 27_000n],
    ])
  })

  it('counts paid-ahead money as owed back until due, then as income; payments settle what is owed first', async () => {
    const a = await makeApprentice()
    await assignFeePlan({ apprenticeId: a.id, planId: plan.id, startDate: day('2026-01-01'), admin })
    await expect(recordCashFeePayment({ apprenticeId: a.id, amount: 100_001n, into: 'safe', admin })).rejects.toThrow(/Only 100000/)

    // 50 000 before anything is due: all held in advance
    await recordCashFeePayment({ apprenticeId: a.id, amount: 50_000n, into: 'safe', admin })
    expect(await balanceOf(db, Accounts.apprenticeFeesInAdvance(a.id))).toBe(50_000n)

    // January: registration (10 000) and instalment 1 (30 000) due, both already paid
    await invoiceDueInstalments(day('2026-01-01'))
    expect(await balanceOf(db, Accounts.apprenticeFeeIncome())).toBe(40_000n)
    expect(await balanceOf(db, Accounts.apprenticeFeesInAdvance(a.id))).toBe(10_000n)

    // March: instalment 2 due, 10 000 paid ahead, 20 000 owed
    await invoiceDueInstalments(day('2026-03-01'))
    expect(await balanceOf(db, Accounts.apprenticeFeesDue(a.id))).toBe(20_000n)
    expect(await balanceOf(db, Accounts.apprenticeFeesInAdvance(a.id))).toBe(0n)

    // Mobile Money 35 000: 20 000 settles what is owed, 15 000 pays ahead
    const c = await startCollection({ purpose: 'apprentice_fee', targetId: a.id, amount: 35_000n, phone: '677123456', description: 'fees' })
    fakeCamsol().confirmCollection(c.providerReference!)
    await refreshCollection(c.reference, { force: true })
    expect(await balanceOf(db, Accounts.apprenticeFeesDue(a.id))).toBe(0n)
    expect(await balanceOf(db, Accounts.apprenticeFeesInAdvance(a.id))).toBe(15_000n)
    const standing = await feeStanding(db, a.id)
    expect(standing.outstanding).toBe(15_000n)
    expect(standing.certificateAllowed).toBe(false)
    await expect(assertFeesPaid(a.id)).rejects.toThrow(/15000/)
    expect(await db.apprenticeFeePayment.count({ where: { apprenticeId: a.id } })).toBe(2)
    await books()
  })

  it('pauses new work 30 days late, and waiving the fee lifts it', async () => {
    const a = await makeApprentice()
    const s = await assignFeePlan({ apprenticeId: a.id, planId: plan.id, startDate: new Date(Date.now() - 40 * 86_400_000), admin })
    await invoiceDueInstalments()
    await expect(assertNotPausedForFees(a.id)).rejects.toThrow(/paused/)
    for (const inst of s.instalments.filter((i) => i.dueDate <= new Date())) {
      await waiveInstalment({ instalmentId: inst.id, reason: 'Hardship', admin })
    }
    await expect(assertNotPausedForFees(a.id)).resolves.toBeUndefined()
    expect(await balanceOf(db, Accounts.apprenticeFeesDue(a.id))).toBe(0n)
    await books()
  })

  it('refunds what was paid ahead when an apprentice leaves; fees already due stay owed', async () => {
    const a = await makeApprentice()
    const s = await assignFeePlan({ apprenticeId: a.id, planId: plan.id, startDate: day('2026-01-01'), admin })
    await recordCashFeePayment({ apprenticeId: a.id, amount: 70_000n, into: 'safe', admin })
    await invoiceDueInstalments(day('2026-01-01'))
    // 40 000 used for January, 30 000 ahead for instalment 2
    expect(await refundable(db, a.id)).toBe(0n)
    await cancelSchedule({ scheduleId: s.id, admin })
    expect(await refundable(db, a.id)).toBe(30_000n)
    await expect(refundAdvance({ apprenticeId: a.id, how: 'keep', admin })).rejects.toThrow(/why/)
    await refundAdvance({ apprenticeId: a.id, how: 'cash', admin })
    expect(await balanceOf(db, Accounts.apprenticeFeesInAdvance(a.id))).toBe(0n)
    expect(await balanceOf(db, Accounts.safe())).toBe(40_000n)
    await expect(refundAdvance({ apprenticeId: a.id, how: 'cash', admin })).rejects.toThrow(/Nothing/)
    await books()
  })

  it('refunds by Mobile Money from the advance, with the fee on SuberCraftex', async () => {
    const a = await makeApprentice()
    const s = await assignFeePlan({ apprenticeId: a.id, planId: plan.id, startDate: day('2027-01-01'), admin })
    await db.$transaction((tx) =>
      post(tx, { type: 'opening', reference: 'opening:camsol', description: 'camsol', postings: [debit(Accounts.camsol(), 100_000n), credit(Accounts.openingBalances(), 100_000n)] })
    )
    await recordCashFeePayment({ apprenticeId: a.id, amount: 20_000n, into: 'safe', admin })
    await cancelSchedule({ scheduleId: s.id, admin })
    const out = await refundAdvance({ apprenticeId: a.id, how: 'mobile_money', admin })
    expect(out.amount).toBe(20_000n)
    expect(await balanceOf(db, Accounts.apprenticeFeesInAdvance(a.id))).toBe(0n)
    await books()
  })
})
