import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { Accounts, AccountRef, balanceOf } from '@/lib/ledger'
import { Xaf } from '@/lib/money'
import { getSetting } from '@/lib/settings'
import { closeLot, InvestorEngineError, MILLI } from './lots'
import { companyBuysHolding, holdingValue, sellMachine, transferHoldingToInvestor } from './machines'

/**
 * Leaving a product lot or a machine share, as the agreement describes:
 * notice, a valuation everyone can see, then one of the agreed ways out.
 */

export async function requestExit(input: {
  investorId: string
  kind: 'product' | 'machine'
  lotId?: string
  holdingId?: string
  notes?: string | null
  /** Product lots: take the goods (collect) or be paid at cost (buy_back) */
  option?: 'collect' | 'buy_back' | null
  /** Product lots: whole units to leave with; empty = the whole lot */
  units?: number | null
}) {
  const noticeDays = await getSetting('investors.exitNoticeDays')
  const noticeEndsAt = new Date(Date.now() + noticeDays * 86_400_000)
  let valuation: Xaf
  let unitsMilli: bigint | null = null
  if (input.kind === 'product') {
    const lot = input.lotId ? await db.productLot.findUnique({ where: { id: input.lotId } }) : null
    if (!lot || lot.investorId !== input.investorId || lot.status !== 'active') throw new InvestorEngineError('Product lot not found')
    if (input.option && !['collect', 'buy_back'].includes(input.option)) throw new InvestorEngineError('Choose to collect the goods or to be paid at cost')
    if (input.units != null) {
      if (!Number.isInteger(input.units) || input.units < 1) throw new InvestorEngineError('Give a whole number of units')
      unitsMilli = BigInt(input.units) * MILLI
      if (unitsMilli > lot.unitsMilli) throw new InvestorEngineError(`This lot has ${Number(lot.unitsMilli) / 1000} unit(s) left`)
      if (unitsMilli === lot.unitsMilli) unitsMilli = null
    }
    const capital = await balanceOf(db, Accounts.investorLot(lot.id))
    valuation = unitsMilli ? (capital * unitsMilli) / lot.unitsMilli : capital
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
      requestedOption: input.kind === 'product' ? input.option ?? null : null,
      unitsMilli,
    },
  })
  await db.notification.create({
    data: {
      type: 'withdrawal_request',
      priority: 'high',
      title: 'An investor asked to leave an investment',
      message: `${input.kind === 'product' ? `Product lot${unitsMilli ? ` (${Number(unitsMilli) / 1000} units)` : ''}${input.option ? `, wants to ${input.option === 'collect' ? 'collect the goods' : 'be paid at cost'}` : ''}` : 'Machine share'} valued at ${valuation} FCFA. Notice ends ${noticeEndsAt.toISOString().slice(0, 10)}.`,
      referenceId: exit.id,
      referenceType: 'investor_exit',
      actionUrl: `/dashboard/investors/${input.investorId}`,
    },
  })
  return exit
}

export type ExitOption =
  | { option: 'buy_back'; note?: string | null }
  | { option: 'collect'; note?: string | null }
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
      // Doing something other than what the investor asked needs a written reason
      if (exit.requestedOption && exit.requestedOption !== choice.option && !choice.note?.trim()) {
        throw new InvestorEngineError(`The investor asked to ${exit.requestedOption === 'collect' ? 'collect the goods' : 'be paid at cost'}: say why it is done differently`)
      }
      // Units sold during the notice period are no longer there to leave with
      const lot = await tx.productLot.findUniqueOrThrow({ where: { id: exit.lotId! } })
      const result = await closeLot(tx, lot.id, choice.option, admin.id, choice.note?.trim() || 'Investor left the lot', {
        unitsMilli: exit.unitsMilli && exit.unitsMilli < lot.unitsMilli ? exit.unitsMilli : null,
        reference: `lot_close:${exit.lotId}:${exit.id}`,
      })
      await tx.investorExit.update({
        where: { id: exit.id },
        data: {
          status: 'completed',
          option: choice.option,
          completedAt: new Date(),
          handledById: admin.id,
          price: result.capitalCollected + result.capitalBoughtBack,
          collectedUnits: result.collectedUnits,
          boughtBackMilli: result.boughtBackMilli,
          ...(result.collectedUnits > 0
            ? { handedOverAt: new Date(), handedOverById: admin.id, handoverNote: choice.note?.trim() || null }
            : {}),
        },
      })
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

/**
 * An admin closes (part of) a lot directly: goods collected, bought back, or lost. It is
 * kept as a completed exit so the investor sees it and confirms receiving collected goods.
 */
export async function closeLotNow(input: { lotId: string; how: 'buy_back' | 'collect' | 'stock_loss'; units?: number | null; note?: string | null; admin: { id: string; email?: string | null } }) {
  const lot = await db.productLot.findUnique({ where: { id: input.lotId } })
  if (!lot) throw new InvestorEngineError('Lot not found')
  let unitsMilli: bigint | null = null
  if (input.units != null) {
    if (!Number.isInteger(input.units) || input.units < 1) throw new InvestorEngineError('Give a whole number of units')
    unitsMilli = BigInt(input.units) * MILLI
  }
  const exit = await db.$transaction(async (tx) => {
    const created = await tx.investorExit.create({
      data: { investorId: lot.investorId, kind: 'product', lotId: lot.id, status: 'requested', option: input.how, noticeEndsAt: new Date(), unitsMilli, notes: input.note ?? null, valuationMethod: 'book_value' },
    })
    const result = await closeLot(tx, lot.id, input.how, input.admin.id, input.note ?? undefined, { unitsMilli, reference: `lot_close:${lot.id}:${created.id}` })
    return tx.investorExit.update({
      where: { id: created.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        handledById: input.admin.id,
        valuation: result.capitalCollected + result.capitalBoughtBack,
        price: result.capitalCollected + result.capitalBoughtBack,
        collectedUnits: result.collectedUnits,
        boughtBackMilli: result.boughtBackMilli,
        ...(input.how === 'collect' && result.collectedUnits > 0
          ? { handedOverAt: new Date(), handedOverById: input.admin.id, handoverNote: input.note ?? null }
          : {}),
      },
    })
  })
  await audit({ actor: input.admin, action: `lot.${input.how}`, targetType: 'lot', targetId: lot.id, details: { units: input.units ?? 'all', note: input.note, exitId: exit.id } })
  return exit
}

/** The investor confirms they received the goods handed over, or says what is wrong. */
export async function confirmHandover(input: { exitId: string; investorId: string; received: boolean; note?: string | null }) {
  const exit = await db.investorExit.findUnique({ where: { id: input.exitId } })
  if (!exit || exit.investorId !== input.investorId || !exit.handedOverAt) throw new InvestorEngineError('Handover not found')
  if (exit.investorConfirmedAt || exit.investorDisputeNote) throw new InvestorEngineError('You already answered for this handover')
  if (!input.received && !input.note?.trim()) throw new InvestorEngineError('Say what is wrong with the handover')
  const updated = await db.investorExit.update({
    where: { id: exit.id },
    data: input.received ? { investorConfirmedAt: new Date() } : { investorDisputeNote: input.note!.trim().slice(0, 1000) },
  })
  if (!input.received) {
    await db.notification.create({
      data: {
        type: 'system',
        priority: 'high',
        title: 'Investor disputes a goods handover',
        message: `Handover of ${exit.collectedUnits} unit(s): ${input.note!.trim().slice(0, 300)}`,
        referenceId: exit.id,
        referenceType: 'investor_exit',
        actionUrl: `/dashboard/investors/${exit.investorId}`,
      },
    })
  }
  return updated
}
