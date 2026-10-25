import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { Accounts, AccountRef, balanceOf } from '@/lib/ledger'
import { Xaf } from '@/lib/money'
import { getSetting } from '@/lib/settings'
import { closeLot, InvestorEngineError } from './lots'
import { companyBuysHolding, holdingValue, sellMachine, transferHoldingToInvestor } from './machines'

/**
 * Leaving a product lot or a machine share, as the agreement describes:
 * notice, a valuation everyone can see, then one of the agreed ways out.
 */

export async function requestExit(input: { investorId: string; kind: 'product' | 'machine'; lotId?: string; holdingId?: string; notes?: string | null }) {
  const noticeDays = await getSetting('investors.exitNoticeDays')
  const noticeEndsAt = new Date(Date.now() + noticeDays * 86_400_000)
  let valuation: Xaf
  if (input.kind === 'product') {
    const lot = input.lotId ? await db.productLot.findUnique({ where: { id: input.lotId } }) : null
    if (!lot || lot.investorId !== input.investorId || lot.status !== 'active') throw new InvestorEngineError('Product lot not found')
    valuation = await balanceOf(db, Accounts.investorLot(lot.id))
  } else {
    const holding = input.holdingId ? await db.equipmentHolding.findUnique({ where: { id: input.holdingId } }) : null
    if (!holding || holding.investorId !== input.investorId || holding.status !== 'active') throw new InvestorEngineError('Machine share not found')
    const lockMonths = await getSetting('investors.machineLockMonths')
    const unlocks = new Date(holding.acquiredAt)
    unlocks.setUTCMonth(unlocks.getUTCMonth() + lockMonths)
    if (unlocks > new Date()) {
      throw new InvestorEngineError(`A machine share must be held at least ${lockMonths} months. You can ask to leave from ${unlocks.toISOString().slice(0, 10)}.`)
    }
    valuation = (await db.$transaction((tx) => holdingValue(tx, holding))).bookValue
  }
  const open = await db.investorExit.findFirst({
    where: { investorId: input.investorId, status: { in: ['requested', 'offered', 'agreed'] }, ...(input.lotId ? { lotId: input.lotId } : { holdingId: input.holdingId }) },
  })
  if (open) throw new InvestorEngineError('You already asked to leave this investment')
  const exit = await db.investorExit.create({
    data: {
      investorId: input.investorId,
      kind: input.kind,
      lotId: input.lotId ?? null,
      holdingId: input.holdingId ?? null,
      noticeEndsAt,
      valuation,
      valuationMethod: 'book_value',
      notes: input.notes ?? null,
    },
  })
  await db.notification.create({
    data: {
      type: 'withdrawal_request',
      priority: 'high',
      title: 'An investor asked to leave an investment',
      message: `${input.kind === 'product' ? 'Product lot' : 'Machine share'} valued at ${valuation} FCFA. Notice ends ${noticeEndsAt.toISOString().slice(0, 10)}.`,
      referenceId: exit.id,
      referenceType: 'investor_exit',
      actionUrl: `/dashboard/investors/${input.investorId}`,
    },
  })
  return exit
}

export type ExitOption =
  | { option: 'buy_back' }
  | { option: 'collect' }
  | { option: 'co_owner'; buyerInvestorId: string; price: Xaf }
  | { option: 'company'; price: Xaf; instalments: number }
  | { option: 'sell'; proceeds: Xaf; into: 'camsol' | 'safe' | 'bank' }

const PLACES: Record<string, () => AccountRef> = { camsol: Accounts.camsol, safe: Accounts.safe, bank: Accounts.bank }

/** An admin completes an exit the agreed way. The notice period must have ended (super admins may waive it). */
export async function completeExit(exitId: string, choice: ExitOption, admin: { id: string; email?: string | null; superAdmin: boolean }) {
  const exit = await db.investorExit.findUnique({ where: { id: exitId } })
  if (!exit || ['completed', 'cancelled'].includes(exit.status)) throw new InvestorEngineError('This exit is not open')
  if (exit.noticeEndsAt > new Date() && !admin.superAdmin) {
    throw new InvestorEngineError(`The notice period ends ${exit.noticeEndsAt.toISOString().slice(0, 10)}`)
  }
  await db.$transaction(async (tx) => {
    if (exit.kind === 'product') {
      if (choice.option !== 'buy_back' && choice.option !== 'collect') throw new InvestorEngineError('Choose buy back or collect for a product lot (or let it sell)')
      await closeLot(tx, exit.lotId!, choice.option, admin.id, 'Investor left the lot')
      await tx.investorExit.update({ where: { id: exit.id }, data: { status: 'completed', option: choice.option, completedAt: new Date(), handledById: admin.id } })
      return
    }
    const holding = await tx.equipmentHolding.findUniqueOrThrow({ where: { id: exit.holdingId! } })
    if (choice.option === 'co_owner') {
      const coOwner = await tx.equipmentHolding.findFirst({ where: { equipmentId: holding.equipmentId, investorId: choice.buyerInvestorId, status: 'active' } })
      if (!coOwner) throw new InvestorEngineError('The buyer must already co-own this machine')
      await transferHoldingToInvestor(tx, { holdingId: holding.id, buyerInvestorId: choice.buyerInvestorId, price: choice.price, actorId: admin.id })
    } else if (choice.option === 'company') {
      await companyBuysHolding(tx, { holdingId: holding.id, price: choice.price, instalments: choice.instalments, actorId: admin.id })
    } else if (choice.option === 'sell') {
      const into = PLACES[choice.into]
      if (!into) throw new InvestorEngineError('Choose where the sale money went')
      await sellMachine(tx, { equipmentId: holding.equipmentId, proceeds: choice.proceeds, into: into(), actorId: admin.id })
    } else {
      throw new InvestorEngineError('Choose a co-owner, SuberCraftex, or selling the machine')
    }
    await tx.investorExit.update({
      where: { id: exit.id },
      data: {
        status: 'completed',
        option: choice.option,
        price: 'price' in choice ? choice.price : 'proceeds' in choice ? choice.proceeds : null,
        buyerInvestorId: choice.option === 'co_owner' ? choice.buyerInvestorId : null,
        instalments: choice.option === 'company' ? choice.instalments : 1,
        completedAt: new Date(),
        handledById: admin.id,
      },
    })
  })
  await audit({ actor: admin, action: 'investor.exit_completed', targetType: 'investor_exit', targetId: exit.id, details: { choice } })
}

export async function cancelExit(exitId: string, by: { id: string; email?: string | null }) {
  const exit = await db.investorExit.update({ where: { id: exitId }, data: { status: 'cancelled', handledById: by.id } })
  await audit({ actor: by, action: 'investor.exit_cancelled', targetType: 'investor_exit', targetId: exit.id })
  return exit
}
