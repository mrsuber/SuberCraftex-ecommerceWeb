import { Payout, PayoutReason } from '@prisma/client'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { AccountRef, Accounts, credit, debit, post, reverse, Tx } from '@/lib/ledger'
import { MIN_MOBILE_MONEY_AMOUNT, mobileProviderOf, MoneyInputError, normalizeCameroonPhone, percentCeil, Xaf } from '@/lib/money'
import { getSetting } from '@/lib/settings'
import { camsolRequired, CamsolRejectedError, CamsolUnavailableError, PayoutResult } from './camsol'

/**
 * Money going out by Mobile Money: investor withdrawals, salaries, customer refunds.
 *
 * Asking for a payout moves amount (+ fee) from the wallet to "payouts on their way" at once,
 * so the same money can never be asked for twice. Payouts wait for an admin, because money
 * collected may still sit as pending at PayWithCAMSOL and the live balance must cover them;
 * amounts at or below the automatic limit (default 0: none) go straight out.
 * On success the money leaves the PayWithCAMSOL account. On failure or rejection the
 * reservation is reversed: the wallet gets everything back.
 *
 * PayWithCAMSOL charges its fee (5% by default) on top: sending 10 000 costs 10 500.
 */

export class PayoutError extends Error {}

export interface PayoutHandler {
  onSucceeded?(tx: Tx, payout: Payout): Promise<void>
  /** Failed or rejected: the money is already back in the wallet */
  onReturned?(tx: Tx, payout: Payout, reason: string): Promise<void>
}

const handlers = new Map<PayoutReason, PayoutHandler>()
export function registerPayoutHandler(reason: PayoutReason, handler: PayoutHandler) {
  handlers.set(reason, handler)
}

/** Handlers live in ./handlers (which imports this file), so they are loaded on first use. */
async function ensureHandlers() {
  if (handlers.size > 0) return
  const { registerPaymentHandlers } = await import('./handlers')
  registerPaymentHandlers()
}

export async function payoutFee(amount: Xaf): Promise<Xaf> {
  const percent = await getSetting('payouts.feePercent')
  return percent > 0 ? percentCeil(amount, percent) : 0n
}

/** The most that can be sent from a balance when the fee comes out of it too. */
export async function sendableFrom(balance: Xaf): Promise<Xaf> {
  if (balance <= 0n) return 0n
  const percent = await getSetting('payouts.feePercent')
  const basis = BigInt(Math.round(percent * 100))
  let amount = (balance * 10_000n) / (10_000n + basis)
  while (amount > 0n && amount + percentCeil(amount, percent) > balance) amount -= 1n
  while (amount + 1n + percentCeil(amount + 1n, percent) <= balance) amount += 1n
  return amount
}

export interface PayoutQuote {
  amount: Xaf
  fee: Xaf
  /** What leaves the wallet */
  fromWallet: Xaf
  feePaidByCompany: boolean
}

export async function quotePayout(amount: Xaf, feePaidByCompany = false): Promise<PayoutQuote> {
  const fee = await payoutFee(amount)
  return { amount, fee, fromWallet: feePaidByCompany ? amount : amount + fee, feePaidByCompany }
}

export interface RequestPayoutInput {
  reason: PayoutReason
  source: AccountRef
  userId: string
  recipientName?: string | null
  amount: Xaf
  phone: string
  relatedId?: string | null
  feePaidByCompany?: boolean
  description: string
}

/** Reserve the money and create the payout. Runs inside the caller's transaction. */
export async function requestPayout(tx: Tx, input: RequestPayoutInput): Promise<Payout> {
  await ensureHandlers()
  if (input.amount < MIN_MOBILE_MONEY_AMOUNT) {
    throw new MoneyInputError(`Mobile Money payouts start at ${MIN_MOBILE_MONEY_AMOUNT} FCFA`)
  }
  const phone = normalizeCameroonPhone(input.phone)
  const provider = mobileProviderOf(phone)
  if (!provider) throw new MoneyInputError('This number is not an MTN or Orange number')
  const quote = await quotePayout(input.amount, input.feePaidByCompany)
  const limit = BigInt(await getSetting('payouts.autoApproveLimit'))
  const payout = await tx.payout.create({
    data: {
      reason: input.reason,
      sourceAccountKey: input.source.key,
      userId: input.userId,
      recipientName: input.recipientName ?? null,
      amount: quote.amount,
      fee: quote.fee,
      feePaidByCompany: quote.feePaidByCompany,
      phone,
      provider,
      relatedId: input.relatedId ?? null,
      status: limit > 0n && quote.amount <= limit ? 'pending' : 'awaiting_approval',
    },
  })
  await post(tx, {
    type: `payout_reserved:${input.reason}`,
    reference: `payout_reserve:${payout.id}`,
    description: input.description,
    metadata: { payoutId: payout.id },
    postings: [
      debit(input.source, quote.fromWallet),
      ...(quote.feePaidByCompany && quote.fee > 0n ? [debit(Accounts.payoutFees(), quote.fee)] : []),
      credit(Accounts.payoutsInFlight(), quote.amount + quote.fee),
    ],
  })
  return payout
}

/** An admin approves a payout after checking the PayWithCAMSOL live balance covers it. */
export async function approvePayout(payoutId: string, admin: { id: string; email?: string | null }) {
  await ensureHandlers()
  const claimed = await db.payout.updateMany({
    where: { id: payoutId, status: 'awaiting_approval' },
    data: { status: 'pending', approvedById: admin.id, approvedAt: new Date() },
  })
  if (claimed.count !== 1) throw new PayoutError('This payout is not waiting for approval')
  await audit({ actor: admin, action: 'payout.approved', targetType: 'payout', targetId: payoutId })
  return sendPayout(payoutId)
}

export async function rejectPayout(payoutId: string, admin: { id: string; email?: string | null }, reason: string) {
  await ensureHandlers()
  const payout = await db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM payouts WHERE id = ${payoutId} FOR UPDATE`
    const current = await tx.payout.findUniqueOrThrow({ where: { id: payoutId } })
    if (current.status !== 'awaiting_approval') throw new PayoutError('Only payouts waiting for approval can be rejected')
    return returnMoney(tx, current, 'rejected', reason || 'Rejected by SuberCraftex', admin.id)
  })
  await audit({ actor: admin, action: 'payout.rejected', targetType: 'payout', targetId: payoutId, details: { reason } })
  return payout
}

/**
 * Stop a payout that has not left yet (waiting for approval, or approved but not sent):
 * the money goes back to the wallet. Returns false when it was already sent.
 */
export async function stopPayoutBeforeSending(payoutId: string, admin: { id: string; email?: string | null }, reason: string): Promise<boolean> {
  await ensureHandlers()
  const stopped = await db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM payouts WHERE id = ${payoutId} FOR UPDATE`
    const current = await tx.payout.findUniqueOrThrow({ where: { id: payoutId } })
    if (current.status !== 'awaiting_approval' && current.status !== 'pending') return false
    await returnMoney(tx, current, 'rejected', reason, admin.id)
    return true
  })
  if (stopped) await audit({ actor: admin, action: 'payout.stopped', targetType: 'payout', targetId: payoutId, details: { reason } })
  return stopped
}

/** Send an approved payout to PayWithCAMSOL. Safe to repeat: the payout id is the Idempotency-Key. */
export async function sendPayout(payoutId: string): Promise<Payout> {
  await ensureHandlers()
  const claimed = await db.payout.updateMany({
    where: { id: payoutId, status: 'pending' },
    data: { status: 'processing', lastCheckedAt: new Date() },
  })
  const payout = await db.payout.findUniqueOrThrow({ where: { id: payoutId } })
  if (claimed.count !== 1) return payout
  let result: PayoutResult
  try {
    const gateway = await camsolRequired()
    result = await gateway.sendPayout({
      idempotencyKey: payout.id,
      clientReference: payout.id,
      amount: payout.amount,
      phone: payout.phone,
      provider: payout.provider as 'MTN' | 'ORANGE',
      recipientName: payout.recipientName ?? undefined,
      description: `SuberCraftex ${payout.reason.replace('_', ' ')}`,
    })
  } catch (error) {
    if (error instanceof CamsolRejectedError) {
      return db.$transaction((tx) => returnMoney(tx, payout, 'failed', error.message))
    }
    if (error instanceof CamsolUnavailableError) {
      // Unknown whether it went out: back to pending, the scheduler retries with the same key
      return db.payout.update({ where: { id: payout.id }, data: { status: 'pending', failureReason: error.message } })
    }
    throw error
  }
  const updated = await db.payout.update({
    where: { id: payout.id },
    data: { camsolReference: result.reference, failureReason: null },
  })
  return applyPayoutResult(updated.id, result)
}

/** Ask PayWithCAMSOL how a sent payout is doing. */
export async function refreshPayout(payoutId: string): Promise<Payout> {
  await ensureHandlers()
  const payout = await db.payout.findUniqueOrThrow({ where: { id: payoutId } })
  if (payout.status === 'pending') return sendPayout(payout.id)
  if (!['processing', 'review'].includes(payout.status) || !payout.camsolReference) return payout
  await db.payout.update({ where: { id: payout.id }, data: { lastCheckedAt: new Date() } })
  try {
    const result = await (await camsolRequired()).getPayout(payout.camsolReference)
    return result ? applyPayoutResult(payout.id, result) : payout
  } catch (error) {
    if (error instanceof CamsolUnavailableError) return payout
    throw error
  }
}

async function applyPayoutResult(payoutId: string, result: PayoutResult): Promise<Payout> {
  return db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM payouts WHERE id = ${payoutId} FOR UPDATE`
    const payout = await tx.payout.findUniqueOrThrow({ where: { id: payoutId } })
    if (!['processing', 'review'].includes(payout.status)) return payout
    if (result.state === 'SUCCEEDED') {
      await post(tx, {
        type: `payout_sent:${payout.reason}`,
        reference: `payout_sent:${payout.id}`,
        description: `Payout to ${payout.phone}`,
        metadata: { payoutId: payout.id, camsolReference: payout.camsolReference },
        postings: [debit(Accounts.payoutsInFlight(), payout.amount + payout.fee), credit(Accounts.camsol(), payout.amount + payout.fee)],
      })
      const done = await tx.payout.update({ where: { id: payout.id }, data: { status: 'succeeded', completedAt: new Date() } })
      await handlers.get(payout.reason)?.onSucceeded?.(tx, done)
      return done
    }
    if (result.state === 'FAILED') return returnMoney(tx, payout, 'failed', result.failureReason ?? 'PayWithCAMSOL could not send it')
    if (result.state === 'REVIEW' && payout.status !== 'review') {
      return tx.payout.update({ where: { id: payout.id }, data: { status: 'review' } })
    }
    return payout
  })
}

async function returnMoney(tx: Tx, payout: Payout, status: 'failed' | 'rejected', reason: string, actorId?: string) {
  await reverse(tx, `payout_reserve:${payout.id}`, `Payout ${status}: ${reason}`, actorId)
  const updated = await tx.payout.update({
    where: { id: payout.id },
    data: {
      status,
      failureReason: reason,
      rejectedById: status === 'rejected' ? actorId ?? null : null,
      completedAt: new Date(),
    },
  })
  await handlers.get(payout.reason)?.onReturned?.(tx, updated, reason)
  return updated
}

/** For the scheduler: send approved payouts and check the ones on their way. */
export async function sweepPayouts(limit = 50) {
  const due = await db.payout.findMany({
    where: { status: { in: ['pending', 'processing', 'review'] } },
    orderBy: { lastCheckedAt: { sort: 'asc', nulls: 'first' } },
    take: limit,
  })
  let checked = 0
  for (const payout of due) {
    try {
      await refreshPayout(payout.id)
      checked += 1
    } catch (error) {
      console.warn(`[payouts] ${payout.id} check failed: ${(error as Error).message}`)
    }
  }
  return { checked }
}

/** What waits for an admin, and what the PayWithCAMSOL live balance must cover. */
export async function payoutsToSend() {
  const waiting = await db.payout.findMany({ where: { status: 'awaiting_approval' }, orderBy: { createdAt: 'asc' } })
  const total = waiting.reduce((sum, p) => sum + p.amount + p.fee, 0n)
  return { waiting, total }
}
