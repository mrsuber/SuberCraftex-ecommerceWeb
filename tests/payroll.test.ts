import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { Accounts, balanceOf, checkLedger, credit, debit, post } from '@/lib/ledger'
import { fakeCamsol } from '@/lib/payments/camsol'
import { approvePayout, refreshPayout } from '@/lib/payments/payouts'
import {
  approvePayrollRun,
  decideAdvance,
  hourlyCost,
  preparePayrollRun,
  proposeCharge,
  requestAdvance,
  respondToCharge,
  updatePayrollLine,
  withdrawSalary,
} from '@/lib/payroll'
import { computeLine, incomeTax, paidDays } from '@/lib/payroll/compute'
import { SETTING_DEFAULTS, setSetting } from '@/lib/settings'
import { makeUser, resetDb } from './helpers/db'

async function books() {
  const c = await checkLedger()
  expect(c.imbalance).toBe(0n)
  expect(c.drift).toEqual([])
}

async function employee(salary: bigint, extra: Record<string, unknown> = {}, role = 'cashier') {
  const user = await makeUser(role, { phone: '677123456' })
  await db.staffPay.create({ data: { userId: user.id, jobTitle: 'Cashier', monthlySalary: salary, startedAt: new Date('2025-01-01'), ...extra } })
  return user
}

async function fundSafe(amount: bigint) {
  await db.$transaction((tx) =>
    post(tx, { type: 'opening', reference: `opening:safe:${amount}`, description: 'safe', postings: [debit(Accounts.safe(), amount), credit(Accounts.openingBalances(), amount)] })
  )
}

const rules = { deductions: SETTING_DEFAULTS['payroll.deductions'], tax: { ...SETTING_DEFAULTS['payroll.incomeTax'], enabled: true }, maxRecoveryPercent: 33 }

describe('salary arithmetic', () => {
  it('works out income tax from yearly bands, with the surcharge', () => {
    // 300 000 a month: 3 600 000 a year, less 30% costs, less 151 200 CNPS, less 500 000 = 1 868 800 at 10%
    expect(incomeTax(300_000n, 12_600n, rules.tax)).toEqual({ tax: 15_573n, surcharge: 1_557n })
    expect(incomeTax(50_000n, 2_100n, rules.tax)).toEqual({ tax: 0n, surcharge: 0n })
  })

  it('caps contributions at the ceiling and pays part of a month by calendar days', () => {
    const line = computeLine(
      { baseSalary: 1_000_000n, paidDays: 30, daysInMonth: 30, bonus: 0n, deductionCodes: [], incomeTax: false, advances: [], charges: [] },
      rules
    )
    expect(line.deductions).toEqual([{ code: 'CNPS_PENSION', label: 'CNPS pension', amount: 31_500 }])
    expect(line.employerTotal).toBe(31_500n + 52_500n + 17_500n)
    expect(paidDays(new Date('2026-01-01'), new Date('2026-01-16'), null, 0)).toEqual({ days: 31, paid: 16 })
    expect(paidDays(new Date('2026-01-01'), new Date('2025-06-01'), new Date('2026-01-10'), 2)).toEqual({ days: 31, paid: 8 })
  })

  it('never takes back more than the recovery limit in one month', () => {
    const line = computeLine(
      { baseSalary: 100_000n, paidDays: 31, daysInMonth: 31, bonus: 0n, deductionCodes: ['NONE'], incomeTax: false, advances: [{ id: 'a', take: 80_000n }], charges: [{ id: 'c', take: 5_000n }] },
      rules
    )
    expect(line.advanceRecovered).toBe(33_000n)
    expect(line.chargesRecovered).toBe(0n)
    expect(line.net).toBe(67_000n)
  })
})

describe('pay runs', () => {
  beforeEach(async () => {
    await resetDb()
    fakeCamsol().reset()
    await setSetting('payouts.feePercent', 5)
  })

  it('pays salaries into wallets, holds contributions owed and takes back an advance and an accepted charge', async () => {
    const admin = await makeUser('admin')
    const worker = await employee(200_000n)
    await fundSafe(100_000n)

    const advance = await requestAdvance({ userId: worker.id, amount: 60_000n, reason: 'School fees', months: 2 })
    await expect(requestAdvance({ userId: worker.id, amount: 50_000n, reason: 'More' })).rejects.toThrow(/most you can ask for now is 40000/)
    await decideAdvance({ advanceId: advance.id, approve: true, paidBy: 'cash', admin })
    expect(await balanceOf(db, Accounts.employeeAdvance(worker.id))).toBe(60_000n)

    const accepted = await proposeCharge({ userId: worker.id, kind: 'damage', amount: 10_000n, reason: 'Broken mannequin', admin })
    await respondToCharge({ chargeId: accepted.id, userId: worker.id, accept: true })
    const disputed = await proposeCharge({ userId: worker.id, kind: 'other', amount: 7_000n, reason: 'Late', admin })
    await expect(respondToCharge({ chargeId: disputed.id, userId: worker.id, accept: false })).rejects.toThrow(/why/)
    await respondToCharge({ chargeId: disputed.id, userId: worker.id, accept: false, note: 'I was on leave' })

    const run = await preparePayrollRun('2026-01', admin.id)
    const [line] = await db.payrollLine.findMany({ where: { runId: run.id } })
    expect(line.gross).toBe(200_000n)
    expect(line.advanceRecovered).toBe(30_000n)
    expect(line.chargesRecovered).toBe(10_000n)
    expect(line.net).toBe(200_000n - 8_400n - 30_000n - 10_000n)

    await approvePayrollRun(run.id, admin)
    expect(await balanceOf(db, Accounts.salaryWallet(worker.id))).toBe(151_600n)
    expect(await balanceOf(db, Accounts.payrollDeduction('CNPS_PENSION', ''))).toBe(16_800n)
    expect(await balanceOf(db, Accounts.employeeAdvance(worker.id))).toBe(30_000n)
    expect((await db.staffCharge.findUniqueOrThrow({ where: { id: accepted.id } })).status).toBe('recovered')
    expect((await db.staffCharge.findUniqueOrThrow({ where: { id: disputed.id } })).recovered).toBe(0n)
    await expect(approvePayrollRun(run.id, admin)).rejects.toThrow(/not a draft/)
    await expect(preparePayrollRun('2026-01', admin.id)).rejects.toThrow(/already paid/)

    // Second month finishes the advance
    const feb = await preparePayrollRun('2026-02', admin.id)
    await approvePayrollRun(feb.id, admin)
    expect((await db.salaryAdvance.findUniqueOrThrow({ where: { id: advance.id } })).status).toBe('repaid')
    await books()
  })

  it('counts unpaid days, bonuses with a reason, and a mid-month start', async () => {
    const admin = await makeUser('admin')
    const late = await employee(310_000n, { startedAt: new Date('2026-01-16') })
    const run = await preparePayrollRun('2026-01', admin.id)
    const line = await db.payrollLine.findFirstOrThrow({ where: { runId: run.id, userId: late.id } })
    expect(line.gross).toBe(160_000n)
    await expect(updatePayrollLine(line.id, { bonus: 5_000n })).rejects.toThrow(/what the bonus is for/)
    const updated = await updatePayrollLine(line.id, { unpaidDays: 1, bonus: 5_000n, bonusNote: 'Christmas rush' })
    expect(updated.gross).toBe(150_000n + 5_000n)
  })

  it('takes a driver shortage only after the driver accepts it, and settles the cash they held', async () => {
    const admin = await makeUser('admin')
    const user = await employee(100_000n, {}, 'driver')
    const driver = await db.driver.create({ data: { userId: user.id, fullName: 'Driver', phone: '677123456', email: user.email, vehicleType: 'bike', vehicleNumber: 'X', licenseNumber: 'Y' } })
    await db.$transaction((tx) =>
      post(tx, { type: 'test', reference: 'cod', description: 'cash on delivery', postings: [debit(Accounts.driverCash(driver.id), 5_000n), credit(Accounts.productSales(), 5_000n)] })
    )
    await expect(proposeCharge({ userId: user.id, kind: 'driver_shortage', amount: 6_000n, reason: 'Short', admin })).rejects.toThrow(/at most 5000/)
    const charge = await proposeCharge({ userId: user.id, kind: 'driver_shortage', amount: 5_000n, reason: 'Order 12 cash not handed in', admin })

    const jan = await preparePayrollRun('2026-01', admin.id)
    await approvePayrollRun(jan.id, admin)
    expect(await balanceOf(db, Accounts.driverCash(driver.id))).toBe(5_000n)

    await respondToCharge({ chargeId: charge.id, userId: user.id, accept: true })
    const feb = await preparePayrollRun('2026-02', admin.id)
    await approvePayrollRun(feb.id, admin)
    expect(await balanceOf(db, Accounts.driverCash(driver.id))).toBe(0n)
    expect((await db.staffCharge.findUniqueOrThrow({ where: { id: charge.id } })).status).toBe('recovered')
    await books()
  })

  it('sends a salary withdrawal with the fee paid by SuberCraftex', async () => {
    const admin = await makeUser('admin')
    const worker = await employee(100_000n)
    const run = await preparePayrollRun('2026-01', admin.id)
    await approvePayrollRun(run.id, admin)
    const wallet = await balanceOf(db, Accounts.salaryWallet(worker.id))
    await db.$transaction((tx) =>
      post(tx, { type: 'opening', reference: 'opening:camsol', description: 'camsol', postings: [debit(Accounts.camsol(), 200_000n), credit(Accounts.openingBalances(), 200_000n)] })
    )
    await expect(withdrawSalary({ userId: worker.id, amount: wallet + 1n })).rejects.toThrow(/holds/)
    const payout = await withdrawSalary({ userId: worker.id, amount: wallet })
    expect(payout.feePaidByCompany).toBe(true)
    expect(await balanceOf(db, Accounts.salaryWallet(worker.id))).toBe(0n)
    await approvePayout(payout.id, admin)
    expect((await refreshPayout(payout.id)).status).toBe('succeeded')
    expect(await balanceOf(db, Accounts.payoutFees())).toBe(payout.fee)
    await books()
  })

  it('turns a salary into an hourly cost, with employer contributions', async () => {
    const worker = await employee(173_000n)
    // 173 000 + 4.2% + 7% + 1.75% employer = 195 404, over 173 hours
    expect(await hourlyCost(db, worker.id)).toBe(1_130n)
  })
})
