import { Equipment, EquipmentHolding, Prisma } from '@prisma/client'
import { suspendedMessage } from './suspended-message'
import { AccountRef, Accounts, balanceOf, credit, debit, post, Posting, Tx } from '@/lib/ledger'
import { splitByWeights, toDecimal, toXaf, Xaf } from '@/lib/money'
import { getSetting } from '@/lib/settings'
import { InvestorEngineError } from './lots'
import { mirrorInvestor } from './mirror'

/**
 * Machines owned together, in units (a machine has totalUnits, 1 000 000).
 *
 * Every month a machine's statement is closed:
 *   profit = job income - job costs - its electricity - its floor rent - depreciation
 * A loss is carried forward and recovered from later profits before anything is shared.
 * What is left is split: SuberCraftex 50%, the investor pool 50%, the pool by units (the
 * part of the pool for SuberCraftex's own units is SuberCraftex's).
 * Depreciation does not leave the owners: each owner's capital in the machine becomes
 * capital in its replacement reserve, so machine + reserve stay what they paid.
 */

/** Balancing account for the machine itself, which the ledger does not hold as an asset */
export const machineCapital = (equipmentId: string): AccountRef => Accounts.companyMachineCapital(equipmentId)

export function holdingCapital(h: Pick<EquipmentHolding, 'id' | 'holderType' | 'equipmentId'>): AccountRef {
  return h.holderType === 'company' ? Accounts.companyMachineCapital(h.equipmentId) : Accounts.investorMachine(h.id)
}

export function holdingReserve(h: Pick<EquipmentHolding, 'id' | 'holderType' | 'equipmentId'>): AccountRef {
  return h.holderType === 'company' ? Accounts.companyMachineReserve(h.equipmentId) : Accounts.machineReserve(h.id)
}

export async function activeHoldings(tx: Tx, equipmentId: string) {
  return tx.equipmentHolding.findMany({ where: { equipmentId, status: 'active', units: { gt: 0 } }, orderBy: { acquiredAt: 'asc' } })
}

/** SuberCraftex's holding: whatever units investors do not own. Created or resized as needed. */
export async function syncCompanyHolding(tx: Tx, equipment: Equipment) {
  const holdings = await tx.equipmentHolding.findMany({ where: { equipmentId: equipment.id, status: 'active' } })
  const investorUnits = holdings.filter((h) => h.holderType === 'investor').reduce((s, h) => s + h.units, 0n)
  const companyUnits = equipment.totalUnits > investorUnits ? equipment.totalUnits - investorUnits : 0n
  const price = toXaf(equipment.purchasePrice)
  const costBasis = (price * companyUnits) / equipment.totalUnits
  const company = holdings.find((h) => h.holderType === 'company')
  if (company) {
    return tx.equipmentHolding.update({ where: { id: company.id }, data: { units: companyUnits, costBasis } })
  }
  return tx.equipmentHolding.create({ data: { equipmentId: equipment.id, holderType: 'company', units: companyUnits, costBasis } })
}

/** The team puts an investor's free capital into a machine share at its price. */
export async function buyIntoMachine(tx: Tx, input: { investorId: string; equipmentId: string; amount: Xaf; actorId: string; agreementVersion?: number | null }) {
  const investor = await tx.investor.findUnique({ where: { id: input.investorId } })
  if (!investor || investor.status !== 'active') throw new InvestorEngineError(suspendedMessage(investor!) ?? 'This investor account is not active')
  const equipment = await tx.equipment.findUnique({ where: { id: input.equipmentId } })
  if (!equipment) throw new InvestorEngineError('Machine not found')
  const price = toXaf(equipment.purchasePrice)
  if (input.amount <= 0n) throw new InvestorEngineError('Amount must be more than zero')
  const units = (input.amount * equipment.totalUnits) / price
  const owned = (await tx.equipmentHolding.aggregate({ where: { equipmentId: equipment.id, status: 'active', holderType: 'investor' }, _sum: { units: true } }))._sum.units ?? 0n
  if (owned + units > equipment.totalUnits) {
    const left = ((equipment.totalUnits - owned) * price) / equipment.totalUnits
    throw new InvestorEngineError(`At most ${left} FCFA of this machine can still be funded by investors`)
  }
  const percent = (Number(units) / Number(equipment.totalUnits)) * 100
  const allocation = await tx.investorEquipmentAllocation.create({
    data: {
      investorId: investor.id,
      equipmentId: equipment.id,
      amountAllocated: toDecimal(input.amount),
      investmentPercentage: new Prisma.Decimal(percent.toFixed(2)),
      profitShare: new Prisma.Decimal(percent.toFixed(2)),
      notes: 'Funded from free capital',
    },
  })
  const holding = await tx.equipmentHolding.create({
    data: {
      equipmentId: equipment.id,
      holderType: 'investor',
      investorId: investor.id,
      units,
      costBasis: input.amount,
      legacyAllocationId: allocation.id,
      agreementVersion: input.agreementVersion ?? null,
    },
  })
  await syncCompanyHolding(tx, equipment)
  await post(tx, {
    type: 'machine_share_bought',
    reference: `machine_share:${holding.id}`,
    description: `${percent.toFixed(2)}% of ${equipment.name} for ${input.amount} FCFA`,
    createdById: input.actorId,
    postings: [debit(Accounts.investorFree(investor.id), input.amount), credit(Accounts.investorMachine(holding.id), input.amount)],
  })
  await mirrorInvestor(tx, investor.id, {
    type: 'allocation_equipment',
    amount: input.amount,
    equipmentId: equipment.id,
    description: `Invested in ${equipment.name}: ${percent.toFixed(2)}% of the machine`,
    createdBy: input.actorId,
  })
  return holding
}

// ------------------------------------------------------------------ monthly close

export function monthStart(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
}

export function nextMonth(start: Date): Date {
  return new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1))
}

/** Straight-line depreciation for one month, never taking the machine below its residual value. */
export async function depreciationFor(tx: Tx, equipment: Equipment, periodStart: Date): Promise<Xaf> {
  if (!equipment.usefulLifeMonths || equipment.usefulLifeMonths <= 0) return 0n
  const start = monthStart(equipment.depreciationStart ?? equipment.purchaseDate)
  if (periodStart < start) return 0n
  const price = toXaf(equipment.purchasePrice)
  const residual = toXaf(equipment.residualValue ?? 0)
  const depreciable = price > residual ? price - residual : 0n
  const monthly = depreciable / BigInt(equipment.usefulLifeMonths)
  const done = (await tx.equipmentPeriod.aggregate({ where: { equipmentId: equipment.id }, _sum: { depreciation: true } }))._sum.depreciation ?? 0n
  const left = depreciable - done
  if (left <= 0n) return 0n
  const monthsSoFar = (periodStart.getUTCFullYear() - start.getUTCFullYear()) * 12 + periodStart.getUTCMonth() - start.getUTCMonth()
  // The last month takes whatever rounding left over
  if (monthsSoFar >= equipment.usefulLifeMonths - 1) return left
  return monthly < left ? monthly : left
}

const hours = (v: Prisma.Decimal | null) => Number(v ?? 0)

async function sharedCostsFor(tx: Tx, equipment: Equipment, periodStart: Date, periodEnd: Date) {
  const [bill, rent] = await Promise.all([
    tx.sharedCost.findUnique({ where: { kind_periodStart: { kind: 'electricity', periodStart } } }),
    tx.sharedCost.findUnique({ where: { kind_periodStart: { kind: 'rent', periodStart } } }),
  ])
  let electricity = 0n
  const note: string[] = []
  if (bill && bill.totalKwh && Number(bill.totalKwh) > 0 && equipment.powerKw) {
    // Estimated use of every machine this month: power x hours
    const machines = await tx.equipment.findMany({ where: { powerKw: { not: null } } })
    const jobs = await tx.equipmentJobUsage.findMany({ where: { jobDate: { gte: periodStart, lt: periodEnd } } })
    const kwhOf = (m: Equipment) => Number(m.powerKw) * jobs.filter((j) => j.equipmentId === m.id).reduce((s, j) => s + hours(j.hoursUsed), 0)
    const mine = kwhOf(equipment)
    const all = machines.reduce((s, m) => s + kwhOf(m), 0)
    // Shared by the bill's real units; if the estimates add up to more, they are scaled down
    const base = Math.max(Number(bill.totalKwh), all)
    electricity = BigInt(Math.round((Number(bill.amount) * mine) / base))
    note.push(`electricity: ${mine.toFixed(1)} kWh of ${Number(bill.totalKwh)} kWh on the bill`)
  }
  let floorRent = 0n
  if (rent && rent.totalAreaM2 && Number(rent.totalAreaM2) > 0 && equipment.floorAreaM2) {
    floorRent = BigInt(Math.round((Number(rent.amount) * Number(equipment.floorAreaM2)) / Number(rent.totalAreaM2)))
    note.push(`rent: ${Number(equipment.floorAreaM2)} m² of ${Number(rent.totalAreaM2)} m²`)
  }
  return { electricity, rent: floorRent, note }
}

export interface MonthStatement {
  equipmentId: string
  periodStart: Date
  periodEnd: Date
  jobs: number
  revenue: Xaf
  directCosts: Xaf
  electricity: Xaf
  rent: Xaf
  depreciation: Xaf
  profit: Xaf
  lossBroughtIn: Xaf
  lossRecovered: Xaf
  lossCarriedOut: Xaf
  distributable: Xaf
  companyShare: Xaf
  investorPool: Xaf
  holders: { holdingId: string; holderType: string; investorId: string | null; units: Xaf; profit: Xaf; depreciation: Xaf }[]
  notes: string[]
}

/** Work out a month's statement without saving anything (the admin preview). */
export async function previewMonth(tx: Tx, equipmentId: string, periodStart: Date): Promise<MonthStatement> {
  const equipment = await tx.equipment.findUniqueOrThrow({ where: { id: equipmentId } })
  const start = monthStart(periodStart)
  const end = nextMonth(start)
  const jobs = await tx.equipmentJobUsage.findMany({ where: { equipmentId, jobDate: { gte: start, lt: end }, periodId: null } })
  const revenue = jobs.reduce((s, j) => s + toXaf(j.revenue), 0n)
  const directCosts = jobs.reduce((s, j) => s + toXaf(j.totalExpenses), 0n)
  const shared = await sharedCostsFor(tx, equipment, start, end)
  const depreciation = await depreciationFor(tx, equipment, start)
  const profit = revenue - directCosts - shared.electricity - shared.rent - depreciation
  const lossBroughtIn = equipment.carriedLoss
  let lossRecovered = 0n
  let distributable = 0n
  let lossCarriedOut = lossBroughtIn
  if (profit <= 0n) {
    lossCarriedOut = lossBroughtIn - profit
  } else {
    lossRecovered = profit < lossBroughtIn ? profit : lossBroughtIn
    distributable = profit - lossRecovered
    lossCarriedOut = lossBroughtIn - lossRecovered
  }
  const percent = BigInt(await getSetting('investors.investorProfitPercent'))
  const investorPool = (distributable * percent) / 100n
  const companyShare = distributable - investorPool

  await syncCompanyHolding(tx, equipment)
  const holdings = await activeHoldings(tx, equipmentId)
  const weights = holdings.map((h) => h.units)
  const poolShares = holdings.length ? splitByWeights(investorPool, weights) : []
  const depShares = holdings.length ? splitByWeights(depreciation, weights) : []
  return {
    equipmentId,
    periodStart: start,
    periodEnd: end,
    jobs: jobs.length,
    revenue,
    directCosts,
    electricity: shared.electricity,
    rent: shared.rent,
    depreciation,
    profit,
    lossBroughtIn,
    lossRecovered,
    lossCarriedOut,
    distributable,
    companyShare,
    investorPool,
    holders: holdings.map((h, i) => ({
      holdingId: h.id,
      holderType: h.holderType,
      investorId: h.investorId,
      units: h.units,
      profit: poolShares[i],
      depreciation: depShares[i],
    })),
    notes: shared.note,
  }
}

/** Close a machine's month: save the statement and share it. Each month closes once, in order. */
export async function closeMonth(tx: Tx, equipmentId: string, periodStart: Date, actorId: string) {
  await tx.$queryRaw`SELECT id FROM equipment WHERE id = ${equipmentId} FOR UPDATE`
  const start = monthStart(periodStart)
  if (nextMonth(start) > new Date()) {
    throw new InvestorEngineError('A month can only be closed after it has ended')
  }
  const later = await tx.equipmentPeriod.findFirst({ where: { equipmentId, periodStart: { gte: start } } })
  if (later) throw new InvestorEngineError('This month (or a later one) is already closed')
  const s = await previewMonth(tx, equipmentId, start)
  const equipment = await tx.equipment.findUniqueOrThrow({ where: { id: equipmentId } })

  const period = await tx.equipmentPeriod.create({
    data: {
      equipmentId,
      periodStart: s.periodStart,
      periodEnd: s.periodEnd,
      revenue: s.revenue,
      directCosts: s.directCosts,
      electricity: s.electricity,
      rent: s.rent,
      depreciation: s.depreciation,
      profit: s.profit,
      lossBroughtIn: s.lossBroughtIn,
      lossRecovered: s.lossRecovered,
      lossCarriedOut: s.lossCarriedOut,
      distributable: s.distributable,
      companyShare: s.companyShare,
      investorPool: s.investorPool,
      details: JSON.parse(JSON.stringify({ holders: s.holders, notes: s.notes }, (_k, v) => (typeof v === 'bigint' ? Number(v) : v))),
      closedById: actorId,
    },
  })
  const label = `${equipment.name} ${s.periodStart.toISOString().slice(0, 7)}`

  // Depreciation: each owner's machine capital becomes replacement reserve
  const depPostings: Posting[] = []
  for (const h of s.holders) {
    if (h.depreciation <= 0n) continue
    const ref = { id: h.holdingId, holderType: h.holderType, equipmentId }
    depPostings.push(debit(holdingCapital(ref), h.depreciation), credit(holdingReserve(ref), h.depreciation))
  }
  if (depPostings.length) {
    await post(tx, {
      type: 'machine_depreciation',
      reference: `machine_depreciation:${period.id}`,
      description: `Depreciation ${label}: set aside in the replacement reserve`,
      createdById: actorId,
      postings: depPostings,
    })
  }

  // Profit: the investor pool, by units; SuberCraftex keeps its own units' part
  const profitPostings: Posting[] = []
  for (const h of s.holders) {
    if (h.holderType !== 'investor' || !h.investorId || h.profit <= 0n) continue
    profitPostings.push(debit(Accounts.investorProfitShare(), h.profit), credit(Accounts.investorProfit(h.investorId), h.profit))
  }
  if (profitPostings.length) {
    await post(tx, {
      type: 'machine_profit',
      reference: `machine_profit:${period.id}`,
      description: `Profit ${label}`,
      createdById: actorId,
      postings: profitPostings,
    })
  }

  await tx.equipmentJobUsage.updateMany({
    where: { equipmentId, jobDate: { gte: s.periodStart, lt: s.periodEnd }, periodId: null },
    data: { periodId: period.id, profitDistributed: true },
  })
  const accumulated = (await tx.equipmentPeriod.aggregate({ where: { equipmentId }, _sum: { depreciation: true } }))._sum.depreciation ?? 0n
  await tx.equipment.update({
    where: { id: equipmentId },
    data: {
      carriedLoss: s.lossCarriedOut,
      totalRevenue: { increment: toDecimal(s.revenue) },
      totalProfit: { increment: toDecimal(s.investorPool) },
      currentValue: toDecimal(toXaf(equipment.purchasePrice) - accumulated),
    },
  })

  for (const h of s.holders) {
    if (h.holderType !== 'investor' || !h.investorId) continue
    const holding = await tx.equipmentHolding.findUniqueOrThrow({ where: { id: h.holdingId } })
    if (holding.legacyAllocationId && h.profit > 0n) {
      await tx.investorEquipmentAllocation.update({
        where: { id: holding.legacyAllocationId },
        data: { totalProfitReceived: { increment: toDecimal(h.profit) } },
      })
    }
    await mirrorInvestor(tx, h.investorId, {
      type: 'profit_credit',
      amount: h.profit,
      equipmentId,
      description:
        h.profit > 0n
          ? `${label}: your share of the profit (${h.profit} FCFA); ${h.depreciation} FCFA moved to the replacement reserve`
          : `${label}: no profit this month${s.lossCarriedOut > 0n ? `; ${s.lossCarriedOut} FCFA loss carried forward` : ''}`,
      createdBy: actorId,
      totals: { profit: h.profit > 0n ? h.profit : 0n },
    })
  }
  return { period, statement: s }
}

// ------------------------------------------------------------------ leaving a machine

/** What a holding is worth when leaving: machine capital + reserve - its part of losses not yet recovered. */
export async function holdingValue(tx: Tx, holding: EquipmentHolding) {
  const equipment = await tx.equipment.findUniqueOrThrow({ where: { id: holding.equipmentId } })
  const capital = await balanceOf(tx, holdingCapital(holding))
  const reserve = await balanceOf(tx, holdingReserve(holding))
  const percent = BigInt(await getSetting('investors.investorProfitPercent'))
  // Losses are shared like profit: the owners carry their percent of what is still unrecovered
  const lossShare = (((equipment.carriedLoss * percent) / 100n) * holding.units) / equipment.totalUnits
  return { capital, reserve, lossShare, bookValue: capital + reserve - lossShare }
}

/** Move a holding's capital and reserve to another holding, removing a loss share if any. */
async function moveClaims(tx: Tx, from: EquipmentHolding, toCapital: AccountRef, toReserve: AccountRef): Promise<Posting[]> {
  const capital = await balanceOf(tx, holdingCapital(from))
  const reserve = await balanceOf(tx, holdingReserve(from))
  return [
    debit(holdingCapital(from), capital),
    credit(toCapital, capital),
    debit(holdingReserve(from), reserve),
    credit(toReserve, reserve),
  ]
}

/** A co-owner buys a leaving investor's whole holding at the agreed price, paid from their free capital. */
export async function transferHoldingToInvestor(tx: Tx, input: { holdingId: string; buyerInvestorId: string; price: Xaf; actorId: string }) {
  const seller = await tx.equipmentHolding.findUniqueOrThrow({ where: { id: input.holdingId } })
  if (seller.status !== 'active' || seller.holderType !== 'investor' || !seller.investorId) throw new InvestorEngineError('This holding cannot be transferred')
  if (seller.investorId === input.buyerInvestorId) throw new InvestorEngineError('The buyer already owns this holding')
  const buyer = await tx.equipmentHolding.create({
    data: { equipmentId: seller.equipmentId, holderType: 'investor', investorId: input.buyerInvestorId, units: seller.units, costBasis: input.price },
  })
  await post(tx, {
    type: 'machine_share_transfer',
    reference: `machine_transfer:${seller.id}`,
    description: 'Machine share sold to a co-owner',
    createdById: input.actorId,
    postings: [
      ...(await moveClaims(tx, seller, Accounts.investorMachine(buyer.id), Accounts.machineReserve(buyer.id))),
      debit(Accounts.investorFree(input.buyerInvestorId), input.price),
      credit(Accounts.investorFree(seller.investorId), input.price),
    ],
  })
  await tx.equipmentHolding.update({ where: { id: seller.id }, data: { status: 'exited', exitedAt: new Date() } })
  if (seller.legacyAllocationId) {
    await tx.investorEquipmentAllocation.update({ where: { id: seller.legacyAllocationId }, data: { hasExited: true, exitAmount: toDecimal(input.price), exitedAt: new Date() } })
  }
  await mirrorInvestor(tx, seller.investorId, { type: 'withdrawal_equipment', amount: input.price, equipmentId: seller.equipmentId, description: `Your machine share was bought by a co-owner for ${input.price} FCFA`, createdBy: input.actorId })
  await mirrorInvestor(tx, input.buyerInvestorId, { type: 'allocation_equipment', amount: input.price, equipmentId: seller.equipmentId, description: `You bought a co-owner's machine share for ${input.price} FCFA`, createdBy: input.actorId })
  return buyer
}

/** SuberCraftex buys a leaving investor's holding, at once or in monthly instalments. */
export async function companyBuysHolding(tx: Tx, input: { holdingId: string; price: Xaf; instalments: number; actorId: string }) {
  const seller = await tx.equipmentHolding.findUniqueOrThrow({ where: { id: input.holdingId } })
  if (seller.status !== 'active' || seller.holderType !== 'investor' || !seller.investorId) throw new InvestorEngineError('This holding cannot be bought')
  const max = await getSetting('investors.buyoutMaxInstalments')
  if (input.instalments < 1 || input.instalments > max) throw new InvestorEngineError(`Instalments must be between 1 and ${max}`)
  const { capital, reserve } = await holdingValue(tx, seller)
  const owedTo = input.instalments > 1 ? Accounts.investorExitDue(seller.investorId) : Accounts.investorFree(seller.investorId)
  const claims = capital + reserve
  await post(tx, {
    type: 'machine_share_buyout',
    reference: `machine_buyout:${seller.id}`,
    description: `SuberCraftex bought a machine share for ${input.price} FCFA${input.instalments > 1 ? ` in ${input.instalments} instalments` : ''}`,
    createdById: input.actorId,
    postings: [
      debit(holdingCapital(seller), capital),
      debit(holdingReserve(seller), reserve),
      credit(owedTo, input.price),
      // The difference between what was owed and the price stays with SuberCraftex's machine capital
      credit(machineCapital(seller.equipmentId), claims - input.price),
    ],
  })
  await tx.equipmentHolding.update({ where: { id: seller.id }, data: { status: 'exited', exitedAt: new Date() } })
  if (seller.legacyAllocationId) {
    await tx.investorEquipmentAllocation.update({ where: { id: seller.legacyAllocationId }, data: { hasExited: true, exitAmount: toDecimal(input.price), exitedAt: new Date() } })
  }
  await syncCompanyHolding(tx, await tx.equipment.findUniqueOrThrow({ where: { id: seller.equipmentId } }))
  await mirrorInvestor(tx, seller.investorId, {
    type: 'withdrawal_equipment',
    amount: input.price,
    equipmentId: seller.equipmentId,
    description:
      input.instalments > 1
        ? `SuberCraftex is buying your machine share for ${input.price} FCFA in ${input.instalments} monthly instalments`
        : `SuberCraftex bought your machine share for ${input.price} FCFA (in free capital)`,
    createdBy: input.actorId,
  })
}

/** One instalment of an exit payment moves to the investor's free capital. */
export async function payExitInstalment(tx: Tx, investorId: string, amount: Xaf, actorId: string, reference: string) {
  await post(tx, {
    type: 'exit_instalment',
    reference: `exit_instalment:${reference}`,
    description: 'Exit payment instalment',
    createdById: actorId,
    postings: [debit(Accounts.investorExitDue(investorId), amount), credit(Accounts.investorFree(investorId), amount)],
  })
  await mirrorInvestor(tx, investorId, { type: 'refund', amount, description: `Exit instalment of ${amount} FCFA paid to free capital`, createdBy: actorId })
}

/**
 * The machine is sold. The money (already received into `into`) goes to every owner by
 * units; first, any loss still carried is shared like profit, so each owner's share is
 * reduced by their percent of it.
 */
export async function sellMachine(tx: Tx, input: { equipmentId: string; proceeds: Xaf; into: AccountRef; actorId: string }) {
  const equipment = await tx.equipment.findUniqueOrThrow({ where: { id: input.equipmentId } })
  await syncCompanyHolding(tx, equipment)
  const holdings = await activeHoldings(tx, equipment.id)
  const parts = splitByWeights(input.proceeds, holdings.map((h) => h.units))
  const percent = BigInt(await getSetting('investors.investorProfitPercent'))
  const lossParts = splitByWeights((equipment.carriedLoss * percent) / 100n, holdings.map((h) => h.units))
  const postings: Posting[] = [debit(input.into, input.proceeds)]
  let toCompany = 0n
  for (const [i, h] of holdings.entries()) {
    if (h.holderType === 'company' || !h.investorId) {
      toCompany += parts[i]
      continue
    }
    const capital = await balanceOf(tx, holdingCapital(h))
    const reserve = await balanceOf(tx, holdingReserve(h))
    const paid = parts[i] - lossParts[i] > 0n ? parts[i] - lossParts[i] : 0n
    postings.push(debit(holdingCapital(h), capital), debit(holdingReserve(h), reserve), credit(Accounts.investorFree(h.investorId), paid))
    // What owners were owed beyond what they receive (or the reverse) settles with SuberCraftex's machine capital
    toCompany += capital + reserve - paid
  }
  postings.push(credit(machineCapital(equipment.id), toCompany))
  await post(tx, {
    type: 'machine_sold',
    reference: `machine_sold:${equipment.id}`,
    description: `${equipment.name} sold for ${input.proceeds} FCFA`,
    createdById: input.actorId,
    postings,
  })
  await tx.equipmentHolding.updateMany({ where: { equipmentId: equipment.id, status: 'active' }, data: { status: 'exited', exitedAt: new Date() } })
  await tx.investorEquipmentAllocation.updateMany({ where: { equipmentId: equipment.id, hasExited: false }, data: { hasExited: true, exitedAt: new Date() } })
  await tx.equipment.update({ where: { id: equipment.id }, data: { status: 'retired', retiredAt: new Date(), carriedLoss: 0n } })
  for (const h of holdings) {
    if (h.investorId) {
      await mirrorInvestor(tx, h.investorId, { type: 'withdrawal_equipment', amount: 0n, equipmentId: equipment.id, description: `${equipment.name} was sold: your share is in free capital`, createdBy: input.actorId })
    }
  }
}
