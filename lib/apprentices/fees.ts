import { randomBytes } from 'crypto'
import { PaymentCollection } from '@prisma/client'
import { db } from '@/lib/db'
import { AccountRef, Accounts, balanceOf, credit, debit, lockAccount, post, Posting, Tx } from '@/lib/ledger'
import { minXaf, normalizeCameroonPhone, splitByWeights, Xaf } from '@/lib/money'
import { getSetting } from '@/lib/settings'
import { sendEmail } from '@/lib/email/mailer'
import { requestPayout } from '@/lib/payments/payouts'

/**
 * Apprentice fees, kept like a school's books.
 *
 * A fee plan becomes a schedule of instalments for one apprentice. Money paid before an
 * instalment is due is held as "fees paid in advance" (owed back if they leave). On its due
 * date an instalment becomes income: from what was paid in advance, the rest as fees owed.
 * A payment settles what is owed first, oldest instalment first, then pays ahead.
 * Seven days late, the apprentice gets a reminder; thirty days late, new assignments pause;
 * a certificate needs every fee paid.
 */

export class FeeError extends Error {}

const DAY = 86_400_000
const today = () => {
  const d = new Date()
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}
const addMonths = (d: Date, months: number) => {
  const out = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, 1))
  const last = new Date(Date.UTC(out.getUTCFullYear(), out.getUTCMonth() + 1, 0)).getUTCDate()
  out.setUTCDate(Math.min(d.getUTCDate(), last))
  return out
}
const receiptNumber = () => `RCP-${new Date().getUTCFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`

// ------------------------------------------------------------------ giving a plan

export async function assignFeePlan(input: {
  apprenticeId: string
  planId: string
  enrollmentId?: string | null
  startDate: Date
  discount?: Xaf
  discountReason?: string | null
  admin: { id: string }
}) {
  const plan = await db.apprenticeFeePlan.findUnique({ where: { id: input.planId } })
  if (!plan || !plan.isActive) throw new FeeError('Fee plan not found')
  const apprentice = await db.apprentice.findUnique({ where: { id: input.apprenticeId } })
  if (!apprentice) throw new FeeError('Apprentice not found')
  if (plan.serviceTrack && plan.serviceTrack !== apprentice.serviceTrack) {
    const enrolled = await db.apprenticeEnrollment.count({ where: { apprenticeId: apprentice.id, serviceTrack: plan.serviceTrack } })
    if (!enrolled) throw new FeeError('This plan is for another track')
  }
  const total = plan.registrationFee + plan.tuition
  const discount = input.discount ?? 0n
  if (discount < 0n || discount > total) throw new FeeError('The discount must be between 0 and the total')
  if (discount > 0n && !input.discountReason?.trim()) throw new FeeError('Say why there is a discount')
  if (Number.isNaN(input.startDate.getTime())) throw new FeeError('Start date is not valid')

  const start = new Date(Date.UTC(input.startDate.getUTCFullYear(), input.startDate.getUTCMonth(), input.startDate.getUTCDate()))
  const parts: { label: string; due: Date; weight: bigint }[] = []
  if (plan.registrationFee > 0n) parts.push({ label: 'Registration', due: start, weight: plan.registrationFee })
  const n = Math.max(1, plan.instalments)
  const tuitionParts = splitByWeights(plan.tuition, Array.from({ length: n }, () => 1n))
  tuitionParts.forEach((amount, i) => parts.push({ label: n === 1 ? 'Tuition' : `Instalment ${i + 1} of ${n}`, due: addMonths(start, i * plan.intervalMonths), weight: amount }))
  // A discount is shared over every part in proportion
  const amounts = splitByWeights(total - discount, parts.map((p) => p.weight))

  return db.apprenticeFeeSchedule.create({
    data: {
      apprenticeId: apprentice.id,
      planId: plan.id,
      enrollmentId: input.enrollmentId ?? null,
      planName: plan.name,
      total: total - discount,
      discount,
      discountReason: input.discountReason?.trim() || null,
      startDate: start,
      createdById: input.admin.id,
      instalments: {
        create: parts
          .map((p, i) => ({ apprenticeId: apprentice.id, label: p.label, dueDate: p.due, amount: amounts[i] }))
          .filter((p) => p.amount > 0n),
      },
    },
    include: { instalments: { orderBy: { dueDate: 'asc' } } },
  })
}

// ------------------------------------------------------------------ where things stand

export async function feeStanding(client: Tx | typeof db, apprenticeId: string) {
  const open = await client.apprenticeFeeInstalment.findMany({
    where: { apprenticeId, status: { in: ['scheduled', 'invoiced'] }, schedule: { status: { not: 'cancelled' } } },
    orderBy: { dueDate: 'asc' },
  })
  const now = today()
  const outstanding = open.reduce((s, i) => s + i.amount - i.paid, 0n)
  const late = open.filter((i) => i.status === 'invoiced' && i.paid < i.amount)
  const overdue = late.reduce((s, i) => s + i.amount - i.paid, 0n)
  const daysOverdue = late.length ? Math.floor((now.getTime() - late[0].dueDate.getTime()) / DAY) : 0
  const [pauseAfter, owedInvoiced, schedules] = await Promise.all([
    getSetting('apprentices.pauseAfterDays'),
    balanceOf(client, Accounts.apprenticeFeesDue(apprenticeId)),
    client.apprenticeFeeSchedule.count({ where: { apprenticeId } }),
  ])
  return {
    hasFees: schedules > 0,
    outstanding,
    overdue,
    owedNow: owedInvoiced,
    daysOverdue,
    nextDue: open.find((i) => i.paid < i.amount) ?? null,
    paused: overdue > 0n && daysOverdue >= pauseAfter,
    certificateAllowed: outstanding === 0n && owedInvoiced === 0n,
  }
}

/** New work is refused while fees are long overdue. */
export async function assertNotPausedForFees(apprenticeId: string) {
  const s = await feeStanding(db, apprenticeId)
  if (s.paused) throw new FeeError(`New assignments are paused: ${s.overdue} FCFA of fees is ${s.daysOverdue} days overdue`)
}

export async function assertFeesPaid(apprenticeId: string) {
  const s = await feeStanding(db, apprenticeId)
  if (!s.certificateAllowed) throw new FeeError(`A certificate needs every fee paid: ${s.outstanding} FCFA is still to pay`)
}

/** Money paid in advance that no remaining instalment will use: owed back to the apprentice. */
export async function refundable(client: Tx | typeof db, apprenticeId: string): Promise<Xaf> {
  const advance = await balanceOf(client, Accounts.apprenticeFeesInAdvance(apprenticeId))
  const held = await client.apprenticeFeeInstalment.aggregate({
    where: { apprenticeId, status: 'scheduled', schedule: { status: { not: 'cancelled' } } },
    _sum: { paid: true },
  })
  const r = advance - (held._sum.paid ?? 0n)
  return r > 0n ? r : 0n
}

// ------------------------------------------------------------------ payments

/** Where a payment goes in the books: what is owed first, then paid in advance. */
export async function feeCredits(tx: Tx, apprenticeId: string, amount: Xaf): Promise<Posting[]> {
  const owed = await balanceOf(tx, Accounts.apprenticeFeesDue(apprenticeId))
  const toOwed = minXaf(owed, amount)
  return [
    ...(toOwed > 0n ? [credit(Accounts.apprenticeFeesDue(apprenticeId), toOwed)] : []),
    ...(amount - toOwed > 0n ? [credit(Accounts.apprenticeFeesInAdvance(apprenticeId), amount - toOwed)] : []),
  ]
}

/** Mark instalments paid, oldest first, and keep the receipt. */
async function applyPayment(tx: Tx, input: { apprenticeId: string; amount: Xaf; method: string; collectionReference?: string | null; receivedById?: string | null; note?: string | null }) {
  let left = input.amount
  const open = await tx.apprenticeFeeInstalment.findMany({
    where: { apprenticeId: input.apprenticeId, status: { in: ['invoiced', 'scheduled'] }, schedule: { status: { not: 'cancelled' } } },
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'asc' }],
  })
  // Invoiced (owed) instalments first, matching the ledger
  for (const inst of [...open.filter((i) => i.status === 'invoiced'), ...open.filter((i) => i.status === 'scheduled')]) {
    if (left <= 0n) break
    const take = minXaf(left, inst.amount - inst.paid)
    if (take <= 0n) continue
    const paid = inst.paid + take
    await tx.apprenticeFeeInstalment.update({
      where: { id: inst.id },
      data: { paid, status: paid >= inst.amount && inst.status === 'invoiced' ? 'paid' : inst.status },
    })
    left -= take
  }
  await closeFinishedSchedules(tx, input.apprenticeId)
  return tx.apprenticeFeePayment.create({
    data: {
      apprenticeId: input.apprenticeId,
      receiptNumber: receiptNumber(),
      amount: input.amount,
      method: input.method,
      collectionReference: input.collectionReference ?? null,
      receivedById: input.receivedById ?? null,
      note: input.note ?? null,
    },
  })
}

async function closeFinishedSchedules(tx: Tx, apprenticeId: string) {
  const schedules = await tx.apprenticeFeeSchedule.findMany({ where: { apprenticeId, status: 'active' }, include: { instalments: true } })
  for (const s of schedules) {
    if (s.instalments.every((i) => ['paid', 'waived', 'cancelled'].includes(i.status))) {
      await tx.apprenticeFeeSchedule.update({ where: { id: s.id }, data: { status: 'completed' } })
    }
  }
}

const CASH_INTO: Record<string, () => AccountRef> = { safe: Accounts.safe, bank: Accounts.bank, shop_momo: Accounts.shopMobileMoney }

/** Cash (or a transfer to the shop's own number) received at the shop. */
export async function recordCashFeePayment(input: { apprenticeId: string; amount: Xaf; into: string; admin: { id: string }; note?: string | null }) {
  const into = CASH_INTO[input.into]
  if (!into) throw new FeeError('Say where the money went: safe, bank or shop_momo')
  if (input.amount <= 0n) throw new FeeError('Amount must be above 0')
  return db.$transaction(async (tx) => {
    const { outstanding } = await feeStanding(tx, input.apprenticeId)
    if (input.amount > outstanding) throw new FeeError(`Only ${outstanding} FCFA is still to pay`)
    const payment = await applyPayment(tx, { apprenticeId: input.apprenticeId, amount: input.amount, method: input.into === 'shop_momo' ? 'shop_mobile_money' : 'cash', receivedById: input.admin.id, note: input.note })
    await post(tx, {
      type: 'apprentice_fee_cash',
      reference: `apprentice_fee:${payment.id}`,
      description: `Apprentice fees, receipt ${payment.receiptNumber}`,
      createdById: input.admin.id,
      postings: [debit(into(), input.amount), ...(await feeCredits(tx, input.apprenticeId, input.amount))],
    })
    return payment
  })
}

/** The PayWithCAMSOL payment handler (purpose apprentice_fee, target = apprentice id). */
export const apprenticeFeeHandler = {
  credits: (tx: Tx, c: PaymentCollection) => feeCredits(tx, c.targetId, c.amount),
  async onPaid(tx: Tx, c: PaymentCollection) {
    await applyPayment(tx, { apprenticeId: c.targetId, amount: c.amount, method: 'mobile_money', collectionReference: c.reference })
  },
}

// ------------------------------------------------------------------ due dates

/** Instalments whose date has come become income: from what was paid ahead, the rest owed. */
export async function invoiceDueInstalments(now = today()) {
  const due = await db.apprenticeFeeInstalment.findMany({
    where: { status: 'scheduled', dueDate: { lte: now }, schedule: { status: 'active' } },
    orderBy: { dueDate: 'asc' },
    take: 500,
  })
  for (const inst of due) {
    await db.$transaction(async (tx) => {
      const fresh = await tx.apprenticeFeeInstalment.findUniqueOrThrow({ where: { id: inst.id } })
      if (fresh.status !== 'scheduled') return
      const unpaid = fresh.amount - fresh.paid
      await post(tx, {
        type: 'apprentice_fee_due',
        reference: `apprentice_fee_due:${fresh.id}`,
        description: `Apprentice fees due: ${fresh.label}`,
        postings: [
          ...(fresh.paid > 0n ? [debit(Accounts.apprenticeFeesInAdvance(fresh.apprenticeId), fresh.paid)] : []),
          ...(unpaid > 0n ? [debit(Accounts.apprenticeFeesDue(fresh.apprenticeId), unpaid)] : []),
          credit(Accounts.apprenticeFeeIncome(), fresh.amount),
        ],
      })
      await tx.apprenticeFeeInstalment.update({ where: { id: fresh.id }, data: { status: unpaid > 0n ? 'invoiced' : 'paid', invoicedAt: new Date() } })
      await closeFinishedSchedules(tx, fresh.apprenticeId)
    })
  }
  return due.length
}

/** One reminder per late instalment, once it is the set number of days late. */
export async function sendFeeReminders(now = today()) {
  const days = await getSetting('apprentices.reminderDays')
  const late = await db.apprenticeFeeInstalment.findMany({
    where: { status: 'invoiced', remindedAt: null, dueDate: { lte: new Date(now.getTime() - days * DAY) } },
    include: { apprentice: true },
    take: 200,
  })
  for (const inst of late) {
    const owed = inst.amount - inst.paid
    if (owed <= 0n) continue
    try {
      await sendEmail({
        to: inst.apprentice.email,
        subject: 'SuberCraftex: training fees overdue',
        text: `Hello ${inst.apprentice.fullName}, ${owed} FCFA for "${inst.label}" was due on ${inst.dueDate.toISOString().slice(0, 10)}. You can pay by Mobile Money from your apprentice dashboard, or in cash at the shop. New assignments pause when fees are ${await getSetting('apprentices.pauseAfterDays')} days late.`,
        html: `<p>Hello ${inst.apprentice.fullName.replace(/</g, '&lt;')},</p><p>${owed} FCFA for "${inst.label.replace(/</g, '&lt;')}" was due on ${inst.dueDate.toISOString().slice(0, 10)}.</p><p>You can pay by Mobile Money from your apprentice dashboard, or in cash at the shop.</p>`,
      })
      await db.apprenticeFeeInstalment.update({ where: { id: inst.id }, data: { remindedAt: new Date() } })
    } catch (error) {
      console.error('[fees] reminder failed', error)
    }
  }
  return late.length
}

// ------------------------------------------------------------------ waivers and leaving

/** Forgive what is unpaid on an instalment, with a reason. */
export async function waiveInstalment(input: { instalmentId: string; reason: string; admin: { id: string } }) {
  if (!input.reason.trim()) throw new FeeError('Say why the fee is waived')
  return db.$transaction(async (tx) => {
    const inst = await tx.apprenticeFeeInstalment.findUniqueOrThrow({ where: { id: input.instalmentId } })
    if (!['scheduled', 'invoiced'].includes(inst.status)) throw new FeeError('This instalment is closed')
    const unpaid = inst.amount - inst.paid
    if (unpaid <= 0n) throw new FeeError('Nothing is left to waive')
    if (inst.status === 'invoiced') {
      await post(tx, {
        type: 'apprentice_fee_waived',
        reference: `apprentice_fee_waived:${inst.id}`,
        description: `Apprentice fee waived: ${input.reason.trim()}`,
        createdById: input.admin.id,
        postings: [debit(Accounts.apprenticeFeeIncome(), unpaid), credit(Accounts.apprenticeFeesDue(inst.apprenticeId), unpaid)],
      })
    }
    const status = inst.paid === 0n ? 'waived' : inst.status === 'invoiced' ? 'paid' : 'scheduled'
    const updated = await tx.apprenticeFeeInstalment.update({ where: { id: inst.id }, data: { amount: inst.paid, status, waivedReason: input.reason.trim() } })
    await closeFinishedSchedules(tx, inst.apprenticeId)
    return updated
  })
}

/**
 * The apprentice leaves: instalments not yet due are dropped. Fees already due stay owed.
 * What they paid ahead for months not taught is refunded, or kept with a reason.
 */
export async function cancelSchedule(input: { scheduleId: string; admin: { id: string } }) {
  return db.$transaction(async (tx) => {
    const schedule = await tx.apprenticeFeeSchedule.findUniqueOrThrow({ where: { id: input.scheduleId } })
    if (schedule.status === 'cancelled') throw new FeeError('Already cancelled')
    await tx.apprenticeFeeInstalment.updateMany({ where: { scheduleId: schedule.id, status: 'scheduled' }, data: { status: 'cancelled' } })
    await tx.apprenticeFeeSchedule.update({ where: { id: schedule.id }, data: { status: 'cancelled', cancelledAt: new Date() } })
    return refundable(tx, schedule.apprenticeId)
  })
}

/** Give back money paid in advance that no instalment will use. */
export async function refundAdvance(input: { apprenticeId: string; how: 'mobile_money' | 'cash' | 'keep'; reason?: string | null; phone?: string | null; admin: { id: string } }) {
  return db.$transaction(async (tx) => {
    await lockAccount(tx, Accounts.apprenticeFeesInAdvance(input.apprenticeId))
    const amount = await refundable(tx, input.apprenticeId)
    if (amount <= 0n) throw new FeeError('Nothing paid in advance is left to refund')
    const apprentice = await tx.apprentice.findUniqueOrThrow({ where: { id: input.apprenticeId } })
    if (input.how === 'keep') {
      if (!input.reason?.trim()) throw new FeeError('Say why the advance is kept (for example, the agreed notice)')
      await post(tx, {
        type: 'apprentice_fee_kept',
        reference: `apprentice_fee_kept:${input.apprenticeId}:${Date.now()}`,
        description: `Fees paid ahead kept: ${input.reason.trim()}`,
        createdById: input.admin.id,
        postings: [debit(Accounts.apprenticeFeesInAdvance(input.apprenticeId), amount), credit(Accounts.apprenticeFeeIncome(), amount)],
      })
      return { amount, how: 'keep' as const }
    }
    if (input.how === 'cash') {
      const payment = await tx.apprenticeFeePayment.create({
        data: { apprenticeId: apprentice.id, receiptNumber: receiptNumber(), amount: -amount, method: 'refund', receivedById: input.admin.id, note: input.reason ?? 'Refund in cash' },
      })
      await post(tx, {
        type: 'apprentice_fee_refund',
        reference: `apprentice_fee_refund:${payment.id}`,
        description: `Fees refunded in cash to ${apprentice.fullName}`,
        createdById: input.admin.id,
        postings: [debit(Accounts.apprenticeFeesInAdvance(apprentice.id), amount), credit(Accounts.safe(), amount)],
      })
      return { amount, how: 'cash' as const }
    }
    const payout = await requestPayout(tx, {
      reason: 'apprentice_refund',
      source: Accounts.apprenticeFeesInAdvance(apprentice.id),
      userId: apprentice.userId,
      recipientName: apprentice.fullName,
      amount,
      phone: normalizeCameroonPhone(input.phone || apprentice.phone),
      feePaidByCompany: true,
      relatedId: apprentice.id,
      description: `Fees refunded to ${apprentice.fullName}`,
    })
    return { amount, how: 'mobile_money' as const, payoutId: payout.id }
  })
}

/** The refund reached the apprentice's phone: keep it on their receipts. */
export async function refundPaid(tx: Tx, payout: { id: string; relatedId: string | null; amount: Xaf }) {
  if (!payout.relatedId) return
  await tx.apprenticeFeePayment.create({
    data: { apprenticeId: payout.relatedId, receiptNumber: receiptNumber(), amount: -payout.amount, method: 'refund', payoutId: payout.id, note: 'Refund by Mobile Money' },
  })
}

// ------------------------------------------------------------------ views

export async function apprenticeFees(apprenticeId: string) {
  const [standing, schedules, payments, refund] = await Promise.all([
    feeStanding(db, apprenticeId),
    db.apprenticeFeeSchedule.findMany({ where: { apprenticeId }, include: { instalments: { orderBy: { dueDate: 'asc' } } }, orderBy: { createdAt: 'desc' } }),
    db.apprenticeFeePayment.findMany({ where: { apprenticeId }, orderBy: { createdAt: 'desc' }, take: 100 }),
    refundable(db, apprenticeId),
  ])
  return { standing, schedules, payments, refundable: refund }
}
