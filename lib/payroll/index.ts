import { PayrollLine, Prisma, StaffCharge } from '@prisma/client'
import { db } from '@/lib/db'
import { AccountRef, Accounts, balanceOf, credit, debit, lockAccount, post, Posting, statementOf, Tx } from '@/lib/ledger'
import { MIN_MOBILE_MONEY_AMOUNT, minXaf, normalizeCameroonPhone, Xaf } from '@/lib/money'
import { getSetting, getSettings } from '@/lib/settings'
import { quotePayout, requestPayout, sendableFrom } from '@/lib/payments/payouts'
import { sendEmail } from '@/lib/email/mailer'
import { computeLine, Item, paidDays } from './compute'

/** Tell an employee by email; a failed email never undoes the money. */
async function tell(userId: string, subject: string, text: string) {
  try {
    const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } })
    if (user?.email) await sendEmail({ to: user.email, subject, text, html: `<p>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</p>` })
  } catch (error) {
    console.error('[payroll] email failed', error)
  }
}

/**
 * Salaries for every employee, through the ledger.
 *
 * Each month an admin prepares a pay run (a draft payslip per active employee), checks it,
 * adds bonuses or unpaid days, then approves it once. Approval books the salary cost and
 * the employer contributions, pays each net salary into the person's salary wallet, holds
 * the deductions as owed (to CNPS, the tax office) and takes back advances and charges the
 * person accepted. From the wallet the employee withdraws by Mobile Money, or is paid in cash.
 */

export class PayrollError extends Error {}

export const monthStart = (month: string | Date) => {
  const d = typeof month === 'string' ? new Date(`${month}-01T00:00:00Z`) : month
  if (Number.isNaN(d.getTime())) throw new PayrollError('Month must look like 2026-10')
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
}
const monthEnd = (start: Date) => new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0, 23, 59, 59))
const monthLabel = (start: Date) => start.toISOString().slice(0, 7)

async function rules() {
  const s = await getSettings(['payroll.deductions', 'payroll.incomeTax', 'payroll.maxRecoveryPercent'])
  return { deductions: s['payroll.deductions'], tax: s['payroll.incomeTax'], maxRecoveryPercent: s['payroll.maxRecoveryPercent'] }
}

/** What an hour of this person's work costs SuberCraftex, employer contributions included. */
export async function hourlyCost(client: Tx | typeof db, userId: string): Promise<Xaf | null> {
  const pay = await client.staffPay.findUnique({ where: { userId } })
  if (!pay || !pay.isActive) return null
  const [hours, r] = await Promise.all([getSetting('payroll.standardMonthlyHours'), rules()])
  const line = computeLine(
    { baseSalary: pay.monthlySalary, paidDays: 1, daysInMonth: 1, bonus: 0n, deductionCodes: pay.deductionCodes, incomeTax: false, advances: [], charges: [] },
    { ...r, maxRecoveryPercent: 0 }
  )
  return (line.gross + line.employerTotal + BigInt(hours) / 2n) / BigInt(hours)
}

// ------------------------------------------------------------------ pay runs

async function owed(tx: Tx, userId: string) {
  const advances = await tx.salaryAdvance.findMany({ where: { userId, status: 'approved' }, orderBy: { requestedAt: 'asc' } })
  const charges = await tx.staffCharge.findMany({ where: { userId, status: 'acknowledged' }, orderBy: { createdAt: 'asc' } })
  const chargeRows: { id: string; take: Xaf }[] = []
  for (const c of charges) {
    let left = c.amount - c.recovered
    // A driver's shortage can be settled only while the cash is still missing
    const settles = await settlesAccount(tx, c)
    if (settles) left = minXaf(left, await balanceOf(tx, settles))
    if (left > 0n) chargeRows.push({ id: c.id, take: left })
  }
  return {
    advances: advances.map((a) => ({ id: a.id, take: minXaf(a.monthlyRecovery, a.amount - a.recovered) })).filter((a) => a.take > 0n),
    charges: chargeRows,
  }
}

async function settlesAccount(tx: Tx, charge: StaffCharge): Promise<AccountRef | null> {
  if (!charge.settlesAccountKey) return null
  const row = await tx.ledgerAccount.findUnique({ where: { key: charge.settlesAccountKey } })
  return row ? { key: row.key, kind: row.kind, name: row.name } : null
}

async function fillLine(tx: Tx, line: Pick<PayrollLine, 'userId' | 'baseSalary' | 'unpaidDays' | 'bonus'>, month: Date) {
  const pay = await tx.staffPay.findUniqueOrThrow({ where: { userId: line.userId } })
  const { days, paid } = paidDays(month, pay.startedAt, pay.endedAt, line.unpaidDays)
  const result = computeLine(
    {
      baseSalary: line.baseSalary,
      paidDays: paid,
      daysInMonth: days,
      bonus: line.bonus,
      deductionCodes: pay.deductionCodes,
      incomeTax: pay.incomeTax,
      ...(await owed(tx, line.userId)),
    },
    await rules()
  )
  if (result.employeeTotal > result.gross) throw new PayrollError('Deductions are larger than the salary: check the contribution rates')
  return result
}

const lineData = (r: Awaited<ReturnType<typeof fillLine>>) => ({
  gross: r.gross,
  deductions: r.deductions as unknown as Prisma.InputJsonValue,
  employerCharges: r.employerCharges as unknown as Prisma.InputJsonValue,
  advanceRecovered: r.advanceRecovered,
  chargesRecovered: r.chargesRecovered,
  net: r.net,
})

async function refreshTotals(tx: Tx, runId: string) {
  const lines = await tx.payrollLine.findMany({ where: { runId } })
  const employer = lines.reduce((s, l) => s + (l.employerCharges as unknown as Item[]).reduce((t, i) => t + BigInt(i.amount), 0n), 0n)
  return tx.payrollRun.update({
    where: { id: runId },
    data: {
      totalGross: lines.reduce((s, l) => s + l.gross, 0n),
      totalNet: lines.reduce((s, l) => s + l.net, 0n),
      totalEmployer: employer,
    },
  })
}

/** A draft payslip for every employee active during the month. Preparing again refreshes it. */
export async function preparePayrollRun(month: string | Date, actorId: string) {
  const start = monthStart(month)
  const end = monthEnd(start)
  if (start > new Date()) throw new PayrollError('That month has not started yet')
  return db.$transaction(async (tx) => {
    let run = await tx.payrollRun.findUnique({ where: { periodStart: start } })
    if (run && run.status === 'approved') throw new PayrollError(`Salaries for ${monthLabel(start)} were already paid`)
    if (!run) run = await tx.payrollRun.create({ data: { periodStart: start, preparedById: actorId } })
    else if (run.status === 'cancelled') run = await tx.payrollRun.update({ where: { id: run.id }, data: { status: 'draft', preparedById: actorId } })

    const staff = await tx.staffPay.findMany({
      where: { startedAt: { lte: end }, OR: [{ endedAt: null }, { endedAt: { gte: start } }], AND: [{ OR: [{ isActive: true }, { endedAt: { gte: start } }] }] },
      include: { user: { select: { fullName: true, email: true } } },
    })
    const existing = await tx.payrollLine.findMany({ where: { runId: run.id } })
    for (const pay of staff) {
      const before = existing.find((l) => l.userId === pay.userId)
      const base = { userId: pay.userId, baseSalary: pay.monthlySalary, unpaidDays: before?.unpaidDays ?? 0, bonus: before?.bonus ?? 0n }
      const data = lineData(await fillLine(tx, base, start))
      const common = { fullName: pay.user.fullName ?? pay.user.email, jobTitle: pay.jobTitle, baseSalary: pay.monthlySalary, ...data }
      if (before) await tx.payrollLine.update({ where: { id: before.id }, data: common })
      else await tx.payrollLine.create({ data: { runId: run.id, userId: pay.userId, ...common } })
    }
    // People no longer on the payroll drop out of a draft
    const keep = new Set(staff.map((s) => s.userId))
    await tx.payrollLine.deleteMany({ where: { runId: run.id, userId: { notIn: [...keep] } } })
    return refreshTotals(tx, run.id)
  })
}

/** Change a draft payslip: unpaid days, a bonus. */
export async function updatePayrollLine(lineId: string, input: { unpaidDays?: number; bonus?: Xaf; bonusNote?: string | null }) {
  return db.$transaction(async (tx) => {
    const line = await tx.payrollLine.findUniqueOrThrow({ where: { id: lineId }, include: { run: true } })
    if (line.run.status !== 'draft') throw new PayrollError('Only a draft pay run can be changed')
    const unpaidDays = input.unpaidDays ?? line.unpaidDays
    if (!Number.isInteger(unpaidDays) || unpaidDays < 0 || unpaidDays > 31) throw new PayrollError('Unpaid days must be between 0 and 31')
    const bonus = input.bonus ?? line.bonus
    if (bonus > 0n && !(input.bonusNote ?? line.bonusNote)?.trim()) throw new PayrollError('Say what the bonus is for: it appears on the payslip')
    const data = lineData(await fillLine(tx, { userId: line.userId, baseSalary: line.baseSalary, unpaidDays, bonus }, line.run.periodStart))
    const updated = await tx.payrollLine.update({
      where: { id: line.id },
      data: { unpaidDays, bonus, bonusNote: input.bonusNote !== undefined ? input.bonusNote?.trim() || null : line.bonusNote, ...data },
    })
    await refreshTotals(tx, line.runId)
    return updated
  })
}

/**
 * Pay the run: every figure is worked out again (advances or charges may have changed since
 * the draft), then fixed. Each payslip is one ledger transaction.
 */
export async function approvePayrollRun(runId: string, admin: { id: string }) {
  const paid: { userId: string; subject: string; text: string }[] = []
  const run = await db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM payroll_runs WHERE id = ${runId} FOR UPDATE`
    const run = await tx.payrollRun.findUniqueOrThrow({ where: { id: runId } })
    if (run.status !== 'draft') throw new PayrollError('This pay run is not a draft')
    const lines = await tx.payrollLine.findMany({ where: { runId } })
    if (lines.length === 0) throw new PayrollError('No one is on this pay run')
    const label = monthLabel(run.periodStart)

    for (const line of lines) {
      const r = await fillLine(tx, line, run.periodStart)
      await tx.payrollLine.update({ where: { id: line.id }, data: lineData(r) })
      if (r.gross === 0n) continue

      const owedTo = new Map<string, { label: string; amount: Xaf }>()
      for (const item of [...r.deductions, ...r.employerCharges]) {
        const now = owedTo.get(item.code)
        owedTo.set(item.code, { label: item.label, amount: (now?.amount ?? 0n) + BigInt(item.amount) })
      }
      const postings: Posting[] = [
        debit(Accounts.salaries(), r.gross),
        ...(r.employerTotal > 0n ? [debit(Accounts.employerContributions(), r.employerTotal)] : []),
        ...(r.net > 0n ? [credit(Accounts.salaryWallet(line.userId), r.net)] : []),
        ...[...owedTo].map(([code, v]) => credit(Accounts.payrollDeduction(code, `${v.label} owed`), v.amount)),
        ...(r.advanceRecovered > 0n ? [credit(Accounts.employeeAdvance(line.userId), r.advanceRecovered)] : []),
      ]
      for (const take of r.chargeTakes) {
        const charge = await tx.staffCharge.findUniqueOrThrow({ where: { id: take.id } })
        postings.push(credit((await settlesAccount(tx, charge)) ?? Accounts.staffRecoveries(), take.amount))
        const recovered = charge.recovered + take.amount
        await tx.staffCharge.update({ where: { id: charge.id }, data: { recovered, status: recovered >= charge.amount ? 'recovered' : 'acknowledged' } })
      }
      for (const take of r.advanceTakes) {
        const advance = await tx.salaryAdvance.findUniqueOrThrow({ where: { id: take.id } })
        const recovered = advance.recovered + take.amount
        await tx.salaryAdvance.update({ where: { id: advance.id }, data: { recovered, status: recovered >= advance.amount ? 'repaid' : 'approved' } })
      }
      await post(tx, {
        type: 'payroll',
        reference: `payroll:${run.id}:${line.userId}`,
        description: `Salary ${label} for ${line.fullName}`,
        createdById: admin.id,
        metadata: { runId: run.id, lineId: line.id },
        postings,
      })
      paid.push({ userId: line.userId, subject: `Salary for ${label}`, text: `${r.net} FCFA was paid into your SuberCraftex salary wallet. Your payslip is in your account, under Salary.` })
    }
    await refreshTotals(tx, run.id)
    return tx.payrollRun.update({ where: { id: run.id }, data: { status: 'approved', approvedById: admin.id, approvedAt: new Date() } })
  }, { timeout: 60_000 })
  await Promise.all(paid.map((p) => tell(p.userId, p.subject, p.text)))
  return run
}

export async function cancelPayrollRun(runId: string) {
  const run = await db.payrollRun.findUniqueOrThrow({ where: { id: runId } })
  if (run.status !== 'draft') throw new PayrollError('Only a draft pay run can be cancelled')
  return db.payrollRun.update({ where: { id: runId }, data: { status: 'cancelled' } })
}

// ------------------------------------------------------------------ wallet

export async function salaryWallet(userId: string) {
  const account = Accounts.salaryWallet(userId)
  const balance = await balanceOf(db, account)
  return { balance, sendable: await sendableFromWallet(balance), statement: await statementOf(db, account, 100) }
}

async function sendableFromWallet(balance: Xaf) {
  return (await getSetting('payouts.salaryFeePaidByCompany')) ? balance : sendableFrom(balance)
}

/** The employee sends part of their salary wallet to their phone. */
export async function withdrawSalary(input: { userId: string; amount: Xaf; phone?: string | null }) {
  if (input.amount < MIN_MOBILE_MONEY_AMOUNT) throw new PayrollError(`Withdrawals start at ${MIN_MOBILE_MONEY_AMOUNT} FCFA`)
  const pay = await db.staffPay.findUnique({ where: { userId: input.userId }, include: { user: true } })
  if (!pay) throw new PayrollError('You have no salary wallet')
  const phone = normalizeCameroonPhone(input.phone || pay.payoutPhone || pay.user.phone)
  const companyPays = await getSetting('payouts.salaryFeePaidByCompany')
  const quote = await quotePayout(input.amount, companyPays)
  return db.$transaction(async (tx) => {
    const held = await lockAccount(tx, Accounts.salaryWallet(input.userId))
    if (quote.fromWallet > held) throw new PayrollError(`Your salary wallet holds ${held} FCFA; the most you can send is ${await sendableFromWallet(held)} FCFA`)
    return requestPayout(tx, {
      reason: 'salary',
      source: Accounts.salaryWallet(input.userId),
      userId: input.userId,
      recipientName: pay.user.fullName,
      amount: input.amount,
      phone,
      feePaidByCompany: companyPays,
      description: `Salary withdrawal by ${pay.user.fullName ?? pay.user.email}`,
    })
  })
}

const CASH_FROM: Record<string, () => AccountRef> = { safe: Accounts.safe, bank: Accounts.bank }

/** An admin pays part of the salary wallet in cash (or by bank transfer) and records it. */
export async function paySalaryInCash(input: { userId: string; amount: Xaf; from: string; admin: { id: string }; note?: string | null }) {
  const from = CASH_FROM[input.from]
  if (!from) throw new PayrollError('Pay from the safe or the bank')
  if (input.amount <= 0n) throw new PayrollError('Amount must be above 0')
  return db.$transaction(async (tx) => {
    const held = await lockAccount(tx, Accounts.salaryWallet(input.userId))
    if (input.amount > held) throw new PayrollError(`The salary wallet holds only ${held} FCFA`)
    const ref = `salary_cash:${input.userId}:${Date.now()}`
    await post(tx, {
      type: 'salary_paid_cash',
      reference: ref,
      description: `Salary paid from the ${input.from}${input.note ? `: ${input.note}` : ''}`,
      createdById: input.admin.id,
      postings: [debit(Accounts.salaryWallet(input.userId), input.amount), credit(from(), input.amount)],
    })
    return { reference: ref }
  })
}

// ------------------------------------------------------------------ advances

export async function requestAdvance(input: { userId: string; amount: Xaf; reason: string; months?: number }) {
  const pay = await db.staffPay.findUnique({ where: { userId: input.userId } })
  if (!pay || !pay.isActive) throw new PayrollError('Only current staff can ask for an advance')
  if (!input.reason.trim()) throw new PayrollError('Say what the advance is for')
  const months = Math.max(1, Math.min(6, Math.floor(input.months ?? 1)))
  const maxPercent = await getSetting('payroll.advanceMaxPercent')
  const open = await db.salaryAdvance.findMany({ where: { userId: input.userId, status: { in: ['requested', 'approved'] } } })
  const outstanding = open.reduce((s, a) => s + a.amount - a.recovered, 0n)
  const limit = (pay.monthlySalary * BigInt(Math.round(maxPercent * 100))) / 10_000n - outstanding
  if (input.amount <= 0n) throw new PayrollError('Amount must be above 0')
  if (input.amount > limit) throw new PayrollError(`The most you can ask for now is ${limit > 0n ? limit : 0n} FCFA`)
  return db.salaryAdvance.create({
    data: {
      userId: input.userId,
      amount: input.amount,
      reason: input.reason.trim().slice(0, 500),
      monthlyRecovery: (input.amount + BigInt(months) - 1n) / BigInt(months),
    },
  })
}

/** Approve (paid by Mobile Money, fee on SuberCraftex, or in cash from the safe) or refuse. */
export async function decideAdvance(input: { advanceId: string; approve: boolean; paidBy?: 'mobile_money' | 'cash'; note?: string | null; admin: { id: string } }) {
  return db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM salary_advances WHERE id = ${input.advanceId} FOR UPDATE`
    const advance = await tx.salaryAdvance.findUniqueOrThrow({ where: { id: input.advanceId }, include: { user: { include: { staffPay: true } } } })
    if (advance.status !== 'requested') throw new PayrollError('This advance was already decided')
    const decided = { decidedById: input.admin.id, decidedAt: new Date(), decisionNote: input.note?.trim() || null }
    if (!input.approve) return tx.salaryAdvance.update({ where: { id: advance.id }, data: { ...decided, status: 'rejected' } })

    let payoutId: string | null = null
    if (input.paidBy === 'mobile_money') {
      const phone = advance.user.staffPay?.payoutPhone || advance.user.phone
      const payout = await requestPayout(tx, {
        reason: 'salary_advance',
        source: Accounts.employeeAdvance(advance.userId),
        userId: advance.userId,
        recipientName: advance.user.fullName,
        amount: advance.amount,
        phone: normalizeCameroonPhone(phone),
        feePaidByCompany: true,
        relatedId: advance.id,
        description: `Salary advance for ${advance.user.fullName ?? advance.user.email}`,
      })
      payoutId = payout.id
    } else if (input.paidBy === 'cash') {
      await post(tx, {
        type: 'salary_advance_cash',
        reference: `salary_advance:${advance.id}`,
        description: `Salary advance in cash for ${advance.user.fullName ?? advance.user.email}`,
        createdById: input.admin.id,
        postings: [debit(Accounts.employeeAdvance(advance.userId), advance.amount), credit(Accounts.safe(), advance.amount)],
      })
    } else {
      throw new PayrollError('Choose how the advance is paid: mobile_money or cash')
    }
    return tx.salaryAdvance.update({ where: { id: advance.id }, data: { ...decided, status: 'approved', paidBy: input.paidBy, payoutId } })
  })
}

/** The advance payout failed or was rejected: nothing was paid, so nothing is owed. */
export async function advancePayoutReturned(tx: Tx, advanceId: string, reason: string) {
  await tx.salaryAdvance.update({ where: { id: advanceId }, data: { status: 'rejected', decisionNote: `Payout did not go through: ${reason}` } })
}

// ------------------------------------------------------------------ charges

/**
 * Propose a charge. For a driver's cash shortage, the amount must still be missing from what
 * they hold. Nothing is taken until the employee accepts.
 */
export async function proposeCharge(input: { userId: string; kind: 'driver_shortage' | 'damage' | 'other'; amount: Xaf; reason: string; admin: { id: string } }) {
  if (input.amount <= 0n) throw new PayrollError('Amount must be above 0')
  if (!input.reason.trim()) throw new PayrollError('Explain the charge: the employee reads it before accepting')
  const pay = await db.staffPay.findUnique({ where: { userId: input.userId } })
  if (!pay) throw new PayrollError('This person is not on the payroll')
  let settlesAccountKey: string | null = null
  if (input.kind === 'driver_shortage') {
    const driver = await db.driver.findUnique({ where: { userId: input.userId } })
    if (!driver) throw new PayrollError('This person is not a driver')
    const account = Accounts.driverCash(driver.id, driver.fullName)
    const held = await balanceOf(db, account)
    if (input.amount > held) throw new PayrollError(`${driver.fullName} is short at most ${held} FCFA`)
    // Make sure the account exists so its key resolves later
    await db.$transaction((tx) => lockAccount(tx, account))
    settlesAccountKey = account.key
  }
  const charge = await db.staffCharge.create({
    data: { userId: input.userId, kind: input.kind, amount: input.amount, reason: input.reason.trim().slice(0, 1000), createdById: input.admin.id, settlesAccountKey },
  })
  await tell(input.userId, 'A charge needs your answer', `${input.amount} FCFA: ${charge.reason}. Accept it or dispute it in your account, under Salary. Nothing is taken from your salary unless you accept.`)
  return charge
}

export async function respondToCharge(input: { chargeId: string; userId: string; accept: boolean; note?: string | null }) {
  const charge = await db.staffCharge.findUnique({ where: { id: input.chargeId } })
  if (!charge || charge.userId !== input.userId) throw new PayrollError('Charge not found')
  if (charge.status !== 'proposed') throw new PayrollError('You already answered this charge')
  if (!input.accept && !input.note?.trim()) throw new PayrollError('Say why you do not agree')
  return db.staffCharge.update({
    where: { id: charge.id },
    data: { status: input.accept ? 'acknowledged' : 'disputed', employeeNote: input.note?.trim() || null, respondedAt: new Date() },
  })
}

/** A super admin settles a dispute: uphold it (taken from salary) or withdraw it. */
export async function decideDispute(input: { chargeId: string; uphold: boolean; admin: { id: string } }) {
  const charge = await db.staffCharge.findUniqueOrThrow({ where: { id: input.chargeId } })
  if (!['disputed', 'proposed', 'acknowledged'].includes(charge.status)) throw new PayrollError('This charge is closed')
  if (input.uphold && charge.status !== 'disputed') throw new PayrollError('Only a disputed charge can be upheld')
  return db.staffCharge.update({ where: { id: charge.id }, data: { status: input.uphold ? 'acknowledged' : 'withdrawn', decidedById: input.admin.id } })
}

// ------------------------------------------------------------------ the employee's view

export async function staffOverview(userId: string) {
  const pay = await db.staffPay.findUnique({ where: { userId } })
  if (!pay) return null
  const [wallet, payslips, advances, charges] = await Promise.all([
    salaryWallet(userId),
    db.payrollLine.findMany({ where: { userId, run: { status: 'approved' } }, include: { run: true }, orderBy: { run: { periodStart: 'desc' } }, take: 24 }),
    db.salaryAdvance.findMany({ where: { userId }, orderBy: { requestedAt: 'desc' }, take: 20 }),
    db.staffCharge.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 20 }),
  ])
  return { pay, wallet, payslips, advances, charges }
}
