import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { sendEmail } from '@/lib/email/mailer'
import { stopPayoutBeforeSending } from '@/lib/payments/payouts'
import { InvestorEngineError } from './lots'

/**
 * Suspending an investor is a freeze, never a confiscation:
 * - money in and out stops: deposits, withdrawals and new investments are refused, and
 *   withdrawals not yet sent go back to their balance;
 * - what is already invested keeps earning, and they can still dispute or ask to leave;
 * - the reason is recorded, shown to the investor and emailed to them.
 */

async function tell(email: string | null | undefined, subject: string, text: string) {
  if (!email) return
  try {
    await sendEmail({ to: email, subject, text, html: text.split('\n').map((l) => `<p>${l.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</p>`).join('') })
  } catch (error) {
    console.error('[investors] suspension email failed', error)
  }
}

export async function suspendInvestor(input: { investorId: string; reason: string; admin: { id: string; email?: string | null } }) {
  const reason = input.reason.trim()
  if (reason.length < 5) throw new InvestorEngineError('Give the reason for the suspension: the investor will read it')
  const investor = await db.investor.findUnique({ where: { id: input.investorId } })
  if (!investor) throw new InvestorEngineError('Investor not found')
  if (investor.status === 'suspended') throw new InvestorEngineError('This investor is already suspended')

  await db.investor.update({
    where: { id: investor.id },
    data: { status: 'suspended', suspendedReason: reason.slice(0, 1000), suspendedAt: new Date(), suspendedById: input.admin.id },
  })

  // Withdrawals by Mobile Money that have not left yet come back to the balance
  const payouts = await db.payout.findMany({
    where: { reason: 'investor_withdrawal', userId: investor.userId, status: { in: ['awaiting_approval', 'pending'] } },
  })
  let stopped = 0
  for (const payout of payouts) {
    if (await stopPayoutBeforeSending(payout.id, input.admin, `Account suspended: ${reason}`)) stopped++
  }
  const inFlight = await db.payout.count({ where: { reason: 'investor_withdrawal', userId: investor.userId, status: { in: ['processing', 'review'] } } })

  // Old-style money withdrawals not yet approved are refused (no money had moved for them).
  // Requests to take goods or leave a machine stay open: leaving is always allowed.
  const legacy = await db.withdrawalRequest.updateMany({
    where: { investorId: investor.id, status: 'pending', type: { in: ['cash', 'profit'] }, OR: [{ momoProvider: null }, { momoProvider: { not: 'PayWithCAMSOL' } }] },
    data: { status: 'rejected', rejectionReason: `Account suspended: ${reason}`, reviewedBy: input.admin.id, reviewedAt: new Date() },
  })

  await audit({
    actor: input.admin,
    action: 'investor.suspended',
    targetType: 'investor',
    targetId: investor.id,
    details: { reason, payoutsStopped: stopped, payoutsAlreadySent: inFlight, requestsRefused: legacy.count },
  })
  await tell(
    investor.email,
    'Your SuberCraftex investor account is suspended',
    [
      `Hello ${investor.fullName},`,
      `Your investor account was suspended on ${new Date().toISOString().slice(0, 10)}.`,
      `Reason: ${reason}`,
      'While it is suspended, deposits, withdrawals and new investments are paused. Withdrawals not yet sent have been returned to your balance. Your investments keep earning as usual, and you can still raise a dispute or ask to leave an investment from your dashboard.',
      'Please contact SuberCraftex to resolve this.',
    ].join('\n')
  )
  return { payoutsStopped: stopped, payoutsAlreadySent: inFlight, requestsRefused: legacy.count }
}

export async function reactivateInvestor(input: { investorId: string; note?: string | null; admin: { id: string; email?: string | null } }) {
  const investor = await db.investor.findUnique({ where: { id: input.investorId } })
  if (!investor) throw new InvestorEngineError('Investor not found')
  if (investor.status !== 'suspended') throw new InvestorEngineError('This investor is not suspended')
  await db.investor.update({
    where: { id: investor.id },
    data: { status: 'active', suspendedReason: null, suspendedAt: null, suspendedById: null },
  })
  await audit({
    actor: input.admin,
    action: 'investor.reactivated',
    targetType: 'investor',
    targetId: investor.id,
    details: { note: input.note ?? null, wasSuspendedFor: investor.suspendedReason, since: investor.suspendedAt },
  })
  await tell(
    investor.email,
    'Your SuberCraftex investor account is active again',
    [`Hello ${investor.fullName},`, 'Your investor account is active again: deposits, withdrawals and investments are open.', input.note ? `Note: ${input.note}` : ''].filter(Boolean).join('\n')
  )
}

export { suspendedMessage } from './suspended-message'
