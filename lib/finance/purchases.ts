import { Payout, StockPurchase } from '@prisma/client'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { AccountRef, Accounts, balanceOf, credit, debit, lockAccount, post, Posting, Tx } from '@/lib/ledger'
import { MIN_MOBILE_MONEY_AMOUNT, normalizeCameroonPhone, splitByWeights, Xaf } from '@/lib/money'
import { requestPayout, stopPayoutBeforeSending } from '@/lib/payments/payouts'
import { investorLedgerLive } from '@/lib/investors/live'
import { InvestorEngineError, MILLI } from '@/lib/investors/lots'
import { mirrorInvestor } from '@/lib/investors/mirror'
import { suspendedMessage } from '@/lib/investors/suspended-message'

/**
 * Restocking with investors' money.
 *
 * 1. Start: an admin takes money to the market (from the safe, the bank, the shop's own
 *    Mobile Money, or sent from PayWithCAMSOL to the buyer's phone). It is funded by
 *    investors' free capital (by default in proportion to what each has free) and/or
 *    SuberCraftex's own money. Investors' parts are reserved at once: they cannot be
 *    withdrawn while the buyer is at the market.
 * 2. Receive: the buyer is back. What was bought goes into stock; each funder gets their
 *    share of every line as a product lot at the landed cost (market price plus a share of
 *    transport, by value). Change goes back; what was not spent returns to free capital.
 *    Investors see every line, the transport and the receipts.
 * 3. Or cancel: nothing bought, the money goes back and the reservations are released.
 */

export class PurchaseError extends InvestorEngineError {}

const PLACES: Record<string, () => AccountRef> = { safe: Accounts.safe, bank: Accounts.bank, shop_momo: Accounts.shopMobileMoney }
const placeName: Record<string, string> = { safe: 'the safe', bank: 'the bank', shop_momo: "the shop's Mobile Money", camsol: 'PayWithCAMSOL' }

async function nextNumber(tx: Tx) {
  const year = new Date().getUTCFullYear()
  const count = await tx.stockPurchase.count({ where: { number: { startsWith: `P-${year}-` } } })
  return `P-${year}-${String(count + 1).padStart(4, '0')}`
}

async function requireLive() {
  if (!(await investorLedgerLive())) throw new PurchaseError('Move investor balances to the ledger first (Investor engine)')
}

/** Who can fund a purchase now, and a split of `amount` in proportion to free capital. */
export async function proposeSplit(amount: Xaf) {
  const investors = await db.investor.findMany({ where: { status: 'active' }, select: { id: true, investorNumber: true, fullName: true }, orderBy: { investorNumber: 'asc' } })
  const rows = await Promise.all(investors.map(async (i) => ({ ...i, free: await balanceOf(db, Accounts.investorFree(i.id)) })))
  const funders = rows.filter((r) => r.free > 0n)
  const totalFree = funders.reduce((s, r) => s + r.free, 0n)
  const fromInvestors = amount > totalFree ? totalFree : amount
  const split = funders.length && fromInvestors > 0n ? splitByWeights(fromInvestors, funders.map((f) => f.free)) : []
  return {
    totalFree,
    fromInvestors,
    fromCompany: amount - fromInvestors,
    investors: rows.map((r) => ({ investorId: r.id, investorNumber: r.investorNumber, fullName: r.fullName, free: r.free, amount: split[funders.indexOf(r)] ?? 0n })),
  }
}

export async function startPurchase(input: {
  source: string
  buyerName: string
  buyerPhone?: string | null
  fundings: { investorId: string; amount: Xaf }[]
  companyAmount: Xaf
  notes?: string | null
  admin: { id: string; email?: string | null }
}) {
  await requireLive()
  const fundings = input.fundings.filter((f) => f.amount > 0n)
  if (new Set(fundings.map((f) => f.investorId)).size !== fundings.length) throw new PurchaseError('Each investor can appear once')
  if (input.companyAmount < 0n) throw new PurchaseError('SuberCraftex amount cannot be negative')
  const total = fundings.reduce((s, f) => s + f.amount, 0n) + input.companyAmount
  if (total <= 0n) throw new PurchaseError('Give the money taken to the market')
  if (!input.buyerName.trim()) throw new PurchaseError('Say who goes to the market')
  if (input.source !== 'camsol' && !PLACES[input.source]) throw new PurchaseError('Take the money from the safe, the bank, the shop Mobile Money or PayWithCAMSOL')
  const phone = input.source === 'camsol' ? normalizeCameroonPhone(input.buyerPhone ?? '') : input.buyerPhone?.trim() || null
  if (input.source === 'camsol' && total < MIN_MOBILE_MONEY_AMOUNT) throw new PurchaseError(`Mobile Money payouts start at ${MIN_MOBILE_MONEY_AMOUNT} FCFA`)

  const purchase = await db.$transaction(async (tx) => {
    const created = await tx.stockPurchase.create({
      data: {
        number: await nextNumber(tx),
        status: input.source === 'camsol' ? 'waiting_payout' : 'open',
        source: input.source,
        buyerName: input.buyerName.trim().slice(0, 100),
        buyerPhone: phone,
        amount: total,
        companyAmount: input.companyAmount,
        notes: input.notes?.trim().slice(0, 1000) || null,
        createdById: input.admin.id,
        fundings: { create: fundings.map((f) => ({ investorId: f.investorId, amount: f.amount })) },
      },
    })

    // Reserve each investor's part: it leaves free capital at once
    for (const f of fundings) {
      const investor = await tx.investor.findUnique({ where: { id: f.investorId } })
      if (!investor) throw new PurchaseError('Investor not found')
      if (investor.status !== 'active') throw new PurchaseError(`${investor.fullName}: ${suspendedMessage(investor) ?? 'account not active'}`)
      const free = await lockAccount(tx, Accounts.investorFree(investor.id))
      if (f.amount > free) throw new PurchaseError(`${investor.fullName} has only ${free} FCFA of free capital`)
      await post(tx, {
        type: 'purchase_reserved',
        reference: `purchase_reserved:${created.id}:${investor.id}`,
        description: `Capital taken to the market for restocking ${created.number}`,
        createdById: input.admin.id,
        metadata: { purchaseId: created.id },
        postings: [debit(Accounts.investorFree(investor.id), f.amount), credit(Accounts.investorPurchase(created.id, investor.id), f.amount)],
      })
      await mirrorInvestor(tx, investor.id)
    }

    // The money leaves
    if (input.source === 'camsol') {
      const payout = await requestPayout(tx, {
        reason: 'stock_purchase',
        source: Accounts.purchaseAdvance(created.id),
        userId: input.admin.id,
        recipientName: input.buyerName.trim(),
        amount: total,
        phone: phone!,
        feePaidByCompany: true,
        relatedId: created.id,
        description: `Restocking ${created.number}: money for ${input.buyerName.trim()}`,
      })
      return tx.stockPurchase.update({ where: { id: created.id }, data: { payoutId: payout.id } })
    }
    const from = PLACES[input.source]()
    const held = await lockAccount(tx, from)
    if (held < total) {
      throw new PurchaseError(`The books show only ${held} FCFA in ${placeName[input.source]}. If that is wrong, record its opening balance in Finance first.`)
    }
    await post(tx, {
      type: 'purchase_money_out',
      reference: `purchase_out:${created.id}`,
      description: `Restocking ${created.number}: ${total} FCFA from ${placeName[input.source]} to ${input.buyerName.trim()}`,
      createdById: input.admin.id,
      postings: [debit(Accounts.purchaseAdvance(created.id), total), credit(from, total)],
    })
    return created
  })
  await audit({
    actor: input.admin,
    action: 'purchase.started',
    targetType: 'stock_purchase',
    targetId: purchase.id,
    details: { number: purchase.number, amount: total, source: input.source, fundings: fundings.map((f) => ({ investorId: f.investorId, amount: f.amount })), company: input.companyAmount },
  })
  return purchase
}

/** Give every investor's reserved part back to their free capital. */
async function releaseReservations(tx: Tx, purchase: StockPurchase, actorId: string | null, why: string) {
  const fundings = await tx.stockPurchaseFunding.findMany({ where: { purchaseId: purchase.id } })
  for (const f of fundings) {
    await post(tx, {
      type: 'purchase_released',
      reference: `purchase_released:${purchase.id}:${f.investorId}`,
      description: `Restocking ${purchase.number} ${why}: your capital is free again`,
      createdById: actorId,
      postings: [debit(Accounts.investorPurchase(purchase.id, f.investorId), f.amount), credit(Accounts.investorFree(f.investorId), f.amount)],
    })
    await tx.stockPurchaseFunding.update({ where: { id: f.id }, data: { used: 0n, returned: f.amount } })
    await mirrorInvestor(tx, f.investorId)
  }
}

/** Payout handlers: the money reached the buyer, or it could not be sent. */
export async function purchasePayoutSent(tx: Tx, payout: Payout) {
  if (payout.relatedId) await tx.stockPurchase.updateMany({ where: { id: payout.relatedId, status: 'waiting_payout' }, data: { status: 'open' } })
}
export async function purchasePayoutReturned(tx: Tx, payout: Payout, reason: string) {
  if (!payout.relatedId) return
  const purchase = await tx.stockPurchase.findUnique({ where: { id: payout.relatedId } })
  if (!purchase || purchase.status !== 'waiting_payout') return
  await releaseReservations(tx, purchase, payout.rejectedById, 'cancelled (the money could not be sent)')
  await tx.stockPurchase.update({ where: { id: purchase.id }, data: { status: 'cancelled', cancelledAt: new Date(), notes: [purchase.notes, `Payout not sent: ${reason}`].filter(Boolean).join('\n') } })
}

/** Nothing was bought: the money comes back and investors' capital is free again. */
export async function cancelPurchase(input: { purchaseId: string; returnedTo?: string | null; admin: { id: string; email?: string | null } }) {
  const purchase = await db.stockPurchase.findUnique({ where: { id: input.purchaseId } })
  if (!purchase) throw new PurchaseError('Purchase not found')
  if (purchase.status === 'waiting_payout') {
    if (!purchase.payoutId || !(await stopPayoutBeforeSending(purchase.payoutId, input.admin, 'Restocking cancelled'))) {
      throw new PurchaseError('The money is already on its way to the buyer: wait for it to arrive, then cancel and record where it came back')
    }
  } else {
    if (purchase.status !== 'open') throw new PurchaseError('Only a purchase still at the market can be cancelled')
    const back = PLACES[input.returnedTo ?? purchase.source]
    if (!back) throw new PurchaseError('Say where the money was put back: safe, bank or shop_momo')
    await db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM stock_purchases WHERE id = ${purchase.id} FOR UPDATE`
      const fresh = await tx.stockPurchase.findUniqueOrThrow({ where: { id: purchase.id } })
      if (fresh.status !== 'open') throw new PurchaseError('This purchase is no longer open')
      await post(tx, {
        type: 'purchase_money_back',
        reference: `purchase_back:${purchase.id}`,
        description: `Restocking ${purchase.number} cancelled: money put back`,
        createdById: input.admin.id,
        postings: [debit(back(), purchase.amount), credit(Accounts.purchaseAdvance(purchase.id), purchase.amount)],
      })
      await releaseReservations(tx, purchase, input.admin.id, 'cancelled')
      await tx.stockPurchase.update({ where: { id: purchase.id }, data: { status: 'cancelled', cancelledAt: new Date() } })
    })
  }
  await audit({ actor: input.admin, action: 'purchase.cancelled', targetType: 'stock_purchase', targetId: purchase.id, details: { number: purchase.number } })
}

export interface ReceivedLine {
  productId: string
  variantId?: string | null
  quantity: number
  lineTotal: Xaf
}

/** The buyer is back: goods into stock and into each funder's lots at landed cost. */
export async function receivePurchase(input: {
  purchaseId: string
  lines: ReceivedLine[]
  transport: Xaf
  changeInto?: string | null
  receiptUrls?: string[]
  note?: string | null
  admin: { id: string; email?: string | null }
}) {
  if (input.lines.length === 0) throw new PurchaseError('Add what was bought')
  for (const l of input.lines) {
    if (!Number.isInteger(l.quantity) || l.quantity < 1) throw new PurchaseError('Quantities must be whole numbers above 0')
    if (l.lineTotal <= 0n) throw new PurchaseError('Give the price paid for each line')
  }
  if (input.transport < 0n) throw new PurchaseError('Transport cannot be negative')

  const result = await db.$transaction(
    async (tx) => {
      await tx.$queryRaw`SELECT id FROM stock_purchases WHERE id = ${input.purchaseId} FOR UPDATE`
      const purchase = await tx.stockPurchase.findUnique({ where: { id: input.purchaseId }, include: { fundings: true } })
      if (!purchase) throw new PurchaseError('Purchase not found')
      if (purchase.status !== 'open') throw new PurchaseError(purchase.status === 'waiting_payout' ? 'The money has not reached the buyer yet' : 'This purchase is closed')

      const goods = input.lines.reduce((s, l) => s + l.lineTotal, 0n)
      const spent = goods + input.transport
      if (spent > purchase.amount) {
        throw new PurchaseError(`${spent} FCFA spent but only ${purchase.amount} FCFA was taken. Check the prices, or start another purchase for the extra.`)
      }
      const change = purchase.amount - spent
      const changePlace = change > 0n ? PLACES[input.changeInto ?? (purchase.source === 'camsol' ? '' : purchase.source)] : null
      if (change > 0n && !changePlace) throw new PurchaseError('Say where the change was put: safe, bank or shop_momo')

      // Funders share everything bought in proportion to what each put in
      const funders = [...purchase.fundings.map((f) => ({ investorId: f.investorId as string | null, amount: f.amount })), { investorId: null, amount: purchase.companyAmount }]
      const weights = funders.map((f) => f.amount)
      const budgets = splitByWeights(spent, weights) // what each funder's money paid for
      const transportShares = input.transport > 0n ? splitByWeights(input.transport, input.lines.map((l) => l.lineTotal)) : input.lines.map(() => 0n)
      const landed = input.lines.map((l, i) => l.lineTotal + transportShares[i])

      const usedBy = new Map<string, Xaf>()
      const lineRows: { productId: string; variantId: string | null; productName: string; quantity: number; lineTotal: Xaf; transportShare: Xaf; unitCost: Xaf }[] = []
      const perFunderCapital = funders.map((_, i) => (budgets[i] > 0n ? splitByWeights(budgets[i], landed) : landed.map(() => 0n)))

      for (const [li, line] of input.lines.entries()) {
        const product = await tx.product.findUnique({ where: { id: line.productId } })
        if (!product) throw new PurchaseError('A product was not found')
        const variantId = line.variantId || null
        if (variantId && !(await tx.productVariant.findFirst({ where: { id: variantId, productId: product.id } }))) throw new PurchaseError(`Variant not found for ${product.name}`)

        // Into stock
        const after = await tx.product.update({ where: { id: product.id }, data: { inventoryCount: { increment: line.quantity } } })
        if (variantId) await tx.productVariant.update({ where: { id: variantId }, data: { inventoryCount: { increment: line.quantity } } })
        await tx.inventoryLog.create({
          data: { productId: product.id, variantId, action: 'received', quantityChange: line.quantity, quantityAfter: after.inventoryCount, userId: input.admin.id, notes: `Bought on restocking ${purchase.number}` },
        })

        const unitsByFunder = splitByWeights(BigInt(line.quantity) * MILLI, weights)
        for (const [fi, funder] of funders.entries()) {
          if (!funder.investorId) continue
          const units = unitsByFunder[fi]
          const capital = perFunderCapital[fi][li]
          if (units <= 0n || capital <= 0n) continue
          const lot = await tx.productLot.create({
            data: {
              productId: product.id,
              variantId,
              investorId: funder.investorId,
              unitsMilli: units,
              originalUnitsMilli: units,
              unitCost: (capital * MILLI + units / 2n) / units,
              source: 'funded',
              purchaseId: purchase.id,
              createdById: input.admin.id,
            },
          })
          await post(tx, {
            type: 'lot_funded',
            reference: `lot_funded:${lot.id}`,
            description: `${Number(units) / 1000} x ${product.name} bought on ${purchase.number} at ${(capital * MILLI) / units} FCFA each (transport included)`,
            createdById: input.admin.id,
            metadata: { lotId: lot.id, purchaseId: purchase.id },
            postings: [debit(Accounts.investorPurchase(purchase.id, funder.investorId), capital), credit(Accounts.investorLot(lot.id), capital)],
          })
          usedBy.set(funder.investorId, (usedBy.get(funder.investorId) ?? 0n) + capital)
        }
        lineRows.push({
          productId: product.id,
          variantId,
          productName: product.name,
          quantity: line.quantity,
          lineTotal: line.lineTotal,
          transportShare: transportShares[li],
          unitCost: (landed[li] + BigInt(line.quantity) / 2n) / BigInt(line.quantity),
        })
      }

      // What each investor did not spend goes back to free capital
      for (const f of purchase.fundings) {
        const used = usedBy.get(f.investorId) ?? 0n
        const returned = f.amount - used
        if (returned > 0n) {
          await post(tx, {
            type: 'purchase_returned',
            reference: `purchase_returned:${purchase.id}:${f.investorId}`,
            description: `Restocking ${purchase.number}: ${returned} FCFA not spent, back to your free capital`,
            createdById: input.admin.id,
            postings: [debit(Accounts.investorPurchase(purchase.id, f.investorId), returned), credit(Accounts.investorFree(f.investorId), returned)],
          })
        }
        await tx.stockPurchaseFunding.update({ where: { id: f.id }, data: { used, returned } })
        await mirrorInvestor(tx, f.investorId)
      }

      // The money side: goods bought, change back
      const money: Posting[] = [debit(Accounts.stockPurchases(), spent), credit(Accounts.purchaseAdvance(purchase.id), purchase.amount)]
      if (change > 0n) money.push(debit(changePlace!(), change))
      await post(tx, {
        type: 'purchase_received',
        reference: `purchase_received:${purchase.id}`,
        description: `Restocking ${purchase.number}: ${goods} FCFA of goods + ${input.transport} FCFA transport${change > 0n ? `, ${change} FCFA change back` : ''}`,
        createdById: input.admin.id,
        postings: money,
      })

      return tx.stockPurchase.update({
        where: { id: purchase.id },
        data: {
          status: 'received',
          spent,
          transport: input.transport,
          changeReturned: change,
          changeInto: change > 0n ? input.changeInto ?? purchase.source : null,
          receiptUrls: (input.receiptUrls ?? []).slice(0, 20),
          notes: [purchase.notes, input.note?.trim()].filter(Boolean).join('\n') || null,
          receivedById: input.admin.id,
          receivedAt: new Date(),
          lines: { create: lineRows },
        },
        include: { fundings: true, lines: true },
      })
    },
    { timeout: 60_000 }
  )
  await audit({
    actor: input.admin,
    action: 'purchase.received',
    targetType: 'stock_purchase',
    targetId: result.id,
    details: { number: result.number, spent: result.spent, transport: result.transport, change: result.changeReturned, lines: result.lines.length },
  })
  return result
}
