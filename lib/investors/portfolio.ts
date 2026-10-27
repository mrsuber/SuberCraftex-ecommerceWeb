import { db } from '@/lib/db'
import { Accounts, balanceOf, displayBalance } from '@/lib/ledger'
import { acceptedCurrentVersion, currentAgreement } from './agreement'
import { investorLedgerLive } from './live'
import { holdingCapital, holdingReserve, holdingValue } from './machines'
import { MILLI } from './lots'

const n = (v: bigint) => Number(v)

/**
 * Everything an investor can see about their money, from the ledger: balances, where their
 * capital is, each machine's statements, pending proposals, exits and every movement.
 */
export async function investorPortfolio(investorId: string) {
  const investor = await db.investor.findUniqueOrThrow({ where: { id: investorId } })
  const live = await investorLedgerLive()

  const [free, profit, pending, exitDue] = await Promise.all([
    balanceOf(db, Accounts.investorFree(investorId)),
    balanceOf(db, Accounts.investorProfit(investorId)),
    balanceOf(db, Accounts.investorProfitPending(investorId)),
    balanceOf(db, Accounts.investorExitDue(investorId)),
  ])

  const lots = await db.productLot.findMany({ where: { investorId }, orderBy: { createdAt: 'desc' } })
  const products = await db.product.findMany({ where: { id: { in: lots.map((l) => l.productId) } }, select: { id: true, name: true, featuredImage: true, price: true } })
  const lotRows = await Promise.all(
    lots.map(async (lot) => {
      const product = products.find((p) => p.id === lot.productId)
      const sales = await db.lotSale.aggregate({
        where: { lotId: lot.id, status: { not: 'returned' } },
        _sum: { unitsMilli: true, investorShare: true, revenue: true },
      })
      return {
        id: lot.id,
        productId: lot.productId,
        productName: product?.name ?? 'Product',
        image: product?.featuredImage ?? null,
        status: lot.status,
        source: lot.source,
        unitsLeft: Number(lot.unitsMilli) / 1000,
        unitsStart: Number(lot.originalUnitsMilli) / 1000,
        unitsSold: Number(sales._sum.unitsMilli ?? 0n) / 1000,
        unitCost: n(lot.unitCost),
        capital: n(await balanceOf(db, Accounts.investorLot(lot.id))),
        profitEarned: n(sales._sum.investorShare ?? 0n),
        salesRevenue: n(sales._sum.revenue ?? 0n),
        proposedValueNote: lot.proposedValueNote,
        createdAt: lot.createdAt,
      }
    })
  )

  const holdings = await db.equipmentHolding.findMany({ where: { investorId }, include: { equipment: true }, orderBy: { acquiredAt: 'desc' } })
  const machineRows = await Promise.all(
    holdings.map(async (h) => {
      const value = await db.$transaction((tx) => holdingValue(tx, h))
      const periods = await db.equipmentPeriod.findMany({ where: { equipmentId: h.equipmentId }, orderBy: { periodStart: 'desc' }, take: 12 })
      return {
        id: h.id,
        equipmentId: h.equipmentId,
        name: h.equipment.name,
        status: h.status,
        percent: (Number(h.units) / Number(h.equipment.totalUnits)) * 100,
        units: n(h.units),
        costBasis: n(h.costBasis),
        capital: n(await balanceOf(db, holdingCapital(h))),
        reserve: n(await balanceOf(db, holdingReserve(h))),
        lossShare: n(value.lossShare),
        bookValue: n(value.bookValue),
        acquiredAt: h.acquiredAt,
        carriedLoss: n(h.equipment.carriedLoss),
        months: periods.map((p) => {
          const holders = ((p.details as any)?.holders ?? []) as { holdingId: string; profit: number; depreciation: number }[]
          const mine = holders.find((x) => x.holdingId === h.id)
          return {
            month: p.periodStart.toISOString().slice(0, 7),
            revenue: n(p.revenue),
            directCosts: n(p.directCosts),
            electricity: n(p.electricity),
            rent: n(p.rent),
            depreciation: n(p.depreciation),
            profit: n(p.profit),
            lossCarriedOut: n(p.lossCarriedOut),
            investorPool: n(p.investorPool),
            yourProfit: mine?.profit ?? 0,
            yourReserve: mine?.depreciation ?? 0,
          }
        }),
      }
    })
  )

  const exits = await db.investorExit.findMany({ where: { investorId }, orderBy: { requestedAt: 'desc' } })
  const fundings = await db.stockPurchaseFunding.findMany({
    where: { investorId },
    include: { purchase: { include: { lines: true } } },
    orderBy: { purchase: { createdAt: 'desc' } },
    take: 50,
  })
  const atMarket = fundings.filter((f) => ['open', 'waiting_payout'].includes(f.purchase.status)).reduce((s, f) => s + f.amount, 0n)
  const agreement = await currentAgreement()
  const acceptedVersion = await acceptedCurrentVersion(db, investorId)

  return {
    live,
    investor: {
      id: investor.id,
      investorNumber: investor.investorNumber,
      fullName: investor.fullName,
      status: investor.status,
      suspendedReason: investor.status === 'suspended' ? investor.suspendedReason : null,
      suspendedAt: investor.status === 'suspended' ? investor.suspendedAt : null,
      kycStatus: investor.kycStatus,
      verified: investor.isVerified,
    },
    balances: {
      free: n(free),
      profitAvailable: n(profit),
      profitPending: n(pending),
      exitDue: n(exitDue),
      inProducts: lotRows.filter((l) => l.status === 'active').reduce((s, l) => s + l.capital, 0),
      inMachines: machineRows.filter((m) => m.status === 'active').reduce((s, m) => s + m.capital, 0),
      reserves: machineRows.filter((m) => m.status === 'active').reduce((s, m) => s + m.reserve, 0),
      atMarket: n(atMarket),
    },
    purchases: fundings.map((f) => ({
      id: f.purchase.id,
      number: f.purchase.number,
      status: f.purchase.status,
      date: f.purchase.createdAt,
      receivedAt: f.purchase.receivedAt,
      yourAmount: n(f.amount),
      yourUsed: f.used !== null ? n(f.used) : null,
      yourReturned: f.returned !== null ? n(f.returned) : null,
      total: n(f.purchase.amount),
      spent: f.purchase.spent !== null ? n(f.purchase.spent) : null,
      transport: n(f.purchase.transport),
      receipts: f.purchase.receiptUrls,
      lines: f.purchase.lines.map((l) => ({ product: l.productName, quantity: l.quantity, lineTotal: n(l.lineTotal), transportShare: n(l.transportShare), unitCost: n(l.unitCost) })),
    })),
    lots: lotRows.filter((l) => l.status !== 'proposed'),
    proposals: lotRows.filter((l) => l.status === 'proposed'),
    machines: machineRows,
    exits: exits.map((e) => ({
      ...e,
      valuation: e.valuation !== null ? n(e.valuation) : null,
      price: e.price !== null ? n(e.price) : null,
      units: e.unitsMilli !== null ? Number(e.unitsMilli) / 1000 : null,
      unitsMilli: undefined,
      boughtBackUnits: e.boughtBackMilli !== null ? Number(e.boughtBackMilli) / 1000 : null,
      boughtBackMilli: undefined,
      productName: e.lotId ? lotRows.find((l) => l.id === e.lotId)?.productName ?? null : null,
      machineName: e.holdingId ? machineRows.find((m) => m.id === e.holdingId)?.name ?? null : null,
    })),
    agreement: { version: agreement.version, acceptedCurrent: acceptedVersion !== null },
  }
}

/** Every ledger movement on the investor's accounts, newest first. */
export async function investorStatement(investorId: string, take = 200) {
  const lots = await db.productLot.findMany({ where: { investorId }, select: { id: true } })
  const holdings = await db.equipmentHolding.findMany({ where: { investorId }, select: { id: true } })
  const purchases = await db.stockPurchaseFunding.findMany({ where: { investorId }, select: { purchaseId: true } })
  const keys = [
    ...purchases.map((p) => Accounts.investorPurchase(p.purchaseId, investorId).key),
    Accounts.investorFree(investorId).key,
    Accounts.investorProfit(investorId).key,
    Accounts.investorProfitPending(investorId).key,
    Accounts.investorExitDue(investorId).key,
    ...lots.map((l) => Accounts.investorLot(l.id).key),
    ...holdings.flatMap((h) => [Accounts.investorMachine(h.id).key, Accounts.machineReserve(h.id).key]),
  ]
  const accounts = await db.ledgerAccount.findMany({ where: { key: { in: keys } } })
  const entries = await db.ledgerEntry.findMany({
    where: { accountId: { in: accounts.map((a) => a.id) } },
    include: { transaction: true, account: true },
    orderBy: { createdAt: 'desc' },
    take,
  })
  return entries.map((e) => ({
    id: e.id,
    at: e.transaction.occurredAt,
    reference: e.transaction.reference,
    type: e.transaction.type,
    description: e.transaction.description,
    account: e.account.name,
    amount: n(displayBalance(e.account.kind, e.amount)),
    balanceAfter: n(displayBalance(e.account.kind, e.balanceAfter)),
  }))
}

export function statementCsv(rows: Awaited<ReturnType<typeof investorStatement>>) {
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const lines = [['Date', 'Account', 'Description', 'Amount (FCFA)', 'Balance after (FCFA)', 'Reference'].map(esc).join(',')]
  for (const r of rows) {
    lines.push([new Date(r.at).toISOString(), r.account, r.description, r.amount, r.balanceAfter, r.reference].map(esc).join(','))
  }
  return lines.join('\n')
}

export { MILLI }
