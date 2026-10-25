import { PaymentCollection, Payout } from '@prisma/client'
import { randomBytes } from 'crypto'
import { db } from '@/lib/db'
import { Accounts, credit, Tx } from '@/lib/ledger'
import { MIN_MOBILE_MONEY_AMOUNT, MoneyInputError, toDecimal, Xaf } from '@/lib/money'
import { quotePayout, requestPayout, sendableFrom } from '@/lib/payments/payouts'
import { investorBalances, mirrorInvestor } from './mirror'
import { InvestorEngineError } from './lots'

/**
 * Money in and out for investors.
 * Deposits come by Mobile Money (PayWithCAMSOL) straight into free capital, once the
 * investor's identity is verified and the current agreement accepted.
 * Withdrawals (free capital or available profit) reserve the money at once and go out as a
 * payout after an admin checks the PayWithCAMSOL balance.
 */

export async function creditDeposit(tx: Tx, collection: PaymentCollection) {
  const investorId = collection.targetId
  await tx.investorDeposit.create({
    data: {
      investorId,
      grossAmount: toDecimal(collection.amount),
      charges: 0,
      amount: toDecimal(collection.amount),
      paymentMethod: 'mobile_money',
      referenceNumber: collection.providerReference ?? collection.reference,
      notes: 'Mobile Money deposit through PayWithCAMSOL',
      confirmationStatus: 'confirmed',
      confirmedAt: new Date(),
      adminConfirmedAt: new Date(),
    },
  })
  await mirrorInvestor(tx, investorId, {
    type: 'deposit',
    amount: collection.amount,
    description: `Mobile Money deposit from ${collection.phone}`,
    totals: { invested: collection.amount },
  })
}

export const depositCredits = (collection: PaymentCollection) => [credit(Accounts.investorFree(collection.targetId), collection.amount)]

export type WithdrawFrom = 'cash' | 'profit'

const sourceOf = (investorId: string, from: WithdrawFrom) =>
  from === 'cash' ? Accounts.investorFree(investorId) : Accounts.investorProfit(investorId)

export async function withdrawalQuote(investorId: string, from: WithdrawFrom, amount: Xaf | null) {
  const balances = await db.$transaction((tx) => investorBalances(tx, investorId))
  const balance = from === 'cash' ? balances.free : balances.profit
  const max = await sendableFrom(balance)
  const quote = amount ? await quotePayout(amount) : null
  return { balance, max, quote }
}

export async function requestWithdrawal(input: {
  investorId: string
  userId: string
  from: WithdrawFrom
  amount: Xaf
  phone: string
  name?: string | null
  reason?: string | null
}) {
  if (input.amount < MIN_MOBILE_MONEY_AMOUNT) {
    throw new MoneyInputError(`Withdrawals start at ${MIN_MOBILE_MONEY_AMOUNT} FCFA (the Mobile Money minimum)`)
  }
  const investor = await db.investor.findUniqueOrThrow({ where: { id: input.investorId } })
  if (investor.status !== 'active') throw new InvestorEngineError('Investor account is not active')
  const { max, quote } = await withdrawalQuote(input.investorId, input.from, input.amount)
  if (!quote || quote.fromWallet > (await withdrawalQuote(input.investorId, input.from, null)).balance) {
    throw new InvestorEngineError(
      `Not enough ${input.from === 'cash' ? 'free capital' : 'available profit'}: with the PayWithCAMSOL fee, the most you can send is ${max} FCFA`
    )
  }
  return db.$transaction(async (tx) => {
    const request = await tx.withdrawalRequest.create({
      data: {
        investorId: investor.id,
        requestNumber: `WDR-${new Date().getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`,
        type: input.from,
        status: 'pending',
        amount: toDecimal(input.amount),
        momoNumber: input.phone,
        momoName: input.name ?? investor.fullName,
        momoProvider: 'PayWithCAMSOL',
        requestReason: input.reason ?? null,
        requestedBy: input.userId,
        investorNotes: `PayWithCAMSOL fee ${quote.fee} FCFA; ${quote.fromWallet} FCFA reserved from your account`,
      },
    })
    const payout = await requestPayout(tx, {
      reason: 'investor_withdrawal',
      source: sourceOf(investor.id, input.from),
      userId: input.userId,
      recipientName: input.name ?? investor.fullName,
      amount: input.amount,
      phone: input.phone,
      relatedId: request.id,
      description: `Withdrawal ${request.requestNumber}`,
    })
    await mirrorInvestor(tx, investor.id)
    return { request, payout, quote }
  })
}

/** Payout outcomes move the withdrawal request along and keep the old screens right. */
export async function onWithdrawalPaid(tx: Tx, payout: Payout) {
  if (!payout.relatedId) return
  const request = await tx.withdrawalRequest.update({
    where: { id: payout.relatedId },
    data: { status: 'completed', processedAt: new Date(), approvedAmount: toDecimal(payout.amount), processedBy: payout.approvedById },
  })
  await mirrorInvestor(tx, request.investorId, {
    type: request.type === 'profit' ? 'withdrawal_profit' : 'withdrawal_cash',
    amount: payout.amount,
    withdrawalId: request.id,
    description: `Sent ${payout.amount} FCFA to ${payout.phone} (PayWithCAMSOL fee ${payout.fee} FCFA)`,
    totals: { withdrawn: payout.amount },
  })
}

export async function onWithdrawalReturned(tx: Tx, payout: Payout, reason: string) {
  if (!payout.relatedId) return
  const request = await tx.withdrawalRequest.update({
    where: { id: payout.relatedId },
    data: { status: 'rejected', rejectionReason: reason, reviewedAt: new Date(), reviewedBy: payout.rejectedById },
  })
  await mirrorInvestor(tx, request.investorId)
  await tx.notification.create({
    data: {
      type: 'withdrawal_request',
      title: `Withdrawal ${request.requestNumber} not sent`,
      message: `${reason}. The money is back in the investor's account.`,
      referenceId: request.id,
      referenceType: 'withdrawal',
    },
  })
}

/** Where money paid by hand (not through PayWithCAMSOL) sits, by how it was paid */
export function manualMoneyAccount(method: string | null | undefined) {
  if (method === 'mobile_money') return Accounts.shopMobileMoney()
  if (method === 'bank_transfer' || method === 'check') return Accounts.bank()
  return Accounts.safe()
}

/** A deposit paid by hand and confirmed by the investor: into free capital, once. */
export async function creditManualDeposit(tx: Tx, deposit: { id: string; investorId: string; amount: { toString(): string }; paymentMethod: string; referenceNumber: string | null }, actorId: string) {
  const { post, debit, credit } = await import('@/lib/ledger')
  const { toXaf } = await import('@/lib/money')
  const amount = toXaf(deposit.amount.toString())
  await post(tx, {
    type: 'investor_deposit_manual',
    reference: `manual_deposit:${deposit.id}`,
    description: `Deposit by ${deposit.paymentMethod.replace('_', ' ')}${deposit.referenceNumber ? ` (ref ${deposit.referenceNumber})` : ''}`,
    createdById: actorId,
    postings: [debit(manualMoneyAccount(deposit.paymentMethod), amount), credit(Accounts.investorFree(deposit.investorId), amount)],
  })
  await mirrorInvestor(tx, deposit.investorId, {
    type: 'deposit',
    amount,
    description: `Deposit confirmed - ${deposit.paymentMethod}${deposit.referenceNumber ? ` (Ref: ${deposit.referenceNumber})` : ''}`,
    createdBy: actorId,
    totals: { invested: amount },
  })
}

/** A withdrawal an admin paid by hand (old flow) and the investor confirmed: out of their account. */
export async function debitManualWithdrawal(tx: Tx, request: { id: string; investorId: string; type: string; momoProvider: string | null }, amount: Xaf, actorId: string) {
  const { post, debit, credit } = await import('@/lib/ledger')
  const from = request.type === 'profit' ? Accounts.investorProfit(request.investorId) : Accounts.investorFree(request.investorId)
  await post(tx, {
    type: 'investor_withdrawal_manual',
    reference: `manual_withdrawal:${request.id}`,
    description: 'Withdrawal paid by hand and confirmed by the investor',
    createdById: actorId,
    postings: [debit(from, amount), credit(Accounts.shopMobileMoney(), amount)],
  })
  await mirrorInvestor(tx, request.investorId, {
    type: request.type === 'profit' ? 'withdrawal_profit' : 'withdrawal_cash',
    amount,
    withdrawalId: request.id,
    description: `${request.type === 'profit' ? 'Profit' : 'Cash'} withdrawal confirmed`,
    createdBy: actorId,
    totals: { withdrawn: amount },
  })
}
