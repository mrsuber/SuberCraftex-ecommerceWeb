import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { Accounts, checkLedger, credit, debit, post, Posting, Tx } from '@/lib/ledger'
import { splitByWeights, toXaf, Xaf } from '@/lib/money'
import { recordLegacyAcceptances } from './agreement'
import { investorLedgerLive, markInvestorLedgerLive } from './live'
import { MILLI } from './lots'
import { syncCompanyHolding } from './machines'
import { mirrorInvestor } from './mirror'

/**
 * Moving today's investor balances into the ledger, once.
 *
 * Preview first (changes nothing): every investor's balances, whether they agree with their
 * own transaction history, products funded beyond the stock that exists, machines funded
 * past 100%. Then run: in one transaction, each investor's free capital, profit, product
 * lots and machine shares become opening entries, so nobody's balance changes. Units
 * funded beyond real stock (or machine shares beyond 100%) are reduced in proportion and
 * their capital goes back to free capital: no franc is lost.
 */

export interface InvestorCheck {
  investorId: string
  investorNumber: string
  name: string
  free: number
  profit: number
  inProducts: number
  inMachines: number
  lastTransactionCash: number | null
  lastTransactionProfit: number | null
  historyMatches: boolean
  problems: string[]
}

export interface ProductCheck {
  productId: string
  variantId: string | null
  name: string
  inStock: number
  fundedUnits: number
  overFundedUnits: number
  investors: number
}

export interface MachineCheck {
  equipmentId: string
  name: string
  price: number
  investorPercent: number
  investorAmount: number
  overFunded: boolean
}

async function inCareUnits(client: Tx | typeof db, productId: string, variantId: string | null) {
  const stock = variantId
    ? (await client.productVariant.findUnique({ where: { id: variantId } }))?.inventoryCount ?? 0
    : (await client.product.findUnique({ where: { id: productId } }))?.inventoryCount ?? 0
  const reserved = await client.orderItem.aggregate({
    where: { productId, variantId, order: { orderStatus: { notIn: ['delivered', 'cancelled', 'refunded'] } } },
    _sum: { quantity: true },
  })
  return Math.max(0, stock) + (reserved._sum.quantity ?? 0)
}

export async function previewMigration(client: Tx | typeof db = db) {
  const investors = await client.investor.findMany({
    include: {
      productAllocations: { where: { quantityRemaining: { gt: 0 } } },
      equipmentAllocations: { where: { hasExited: false } },
      transactions: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { investorNumber: 'asc' },
  })
  const investorChecks: InvestorCheck[] = investors.map((i) => {
    const last = i.transactions[0]
    const problems: string[] = []
    const free = Number(i.cashBalance)
    const profit = Number(i.profitBalance)
    if (free < 0) problems.push('free capital is negative')
    if (profit < 0) problems.push('profit is negative')
    if (!Number.isInteger(free) || !Number.isInteger(profit)) problems.push('balances have fractions of a franc (they will be rounded)')
    const historyMatches = !last || (Number(last.balanceAfter) === free && Number(last.profitAfter) === profit)
    if (!historyMatches) problems.push('balances differ from the last transaction in the history')
    return {
      investorId: i.id,
      investorNumber: i.investorNumber,
      name: i.fullName,
      free,
      profit,
      inProducts: i.productAllocations.reduce((s, a) => s + a.quantityRemaining * Number(a.purchasePrice), 0),
      inMachines: i.equipmentAllocations.reduce((s, a) => s + Number(a.amountAllocated), 0),
      lastTransactionCash: last ? Number(last.balanceAfter) : null,
      lastTransactionProfit: last ? Number(last.profitAfter) : null,
      historyMatches,
      problems,
    }
  })

  const allocations = await client.investorProductAllocation.findMany({ where: { quantityRemaining: { gt: 0 } }, include: { product: true, variant: true } })
  const byProduct = new Map<string, typeof allocations>()
  for (const a of allocations) {
    const key = `${a.productId}:${a.variantId ?? ''}`
    byProduct.set(key, [...(byProduct.get(key) ?? []), a])
  }
  const productChecks: ProductCheck[] = []
  for (const list of byProduct.values()) {
    const first = list[0]
    const inStock = await inCareUnits(client, first.productId, first.variantId)
    const funded = list.reduce((s, a) => s + a.quantityRemaining, 0)
    productChecks.push({
      productId: first.productId,
      variantId: first.variantId,
      name: first.variant ? `${first.product.name} - ${first.variant.name}` : first.product.name,
      inStock,
      fundedUnits: funded,
      overFundedUnits: Math.max(0, funded - inStock),
      investors: new Set(list.map((a) => a.investorId)).size,
    })
  }

  const equipment = await client.equipment.findMany({ include: { investorAllocations: { where: { hasExited: false } } } })
  const machineChecks: MachineCheck[] = equipment
    .filter((e) => e.investorAllocations.length > 0)
    .map((e) => {
      const percent = e.investorAllocations.reduce((s, a) => s + Number(a.investmentPercentage), 0)
      return {
        equipmentId: e.id,
        name: e.name,
        price: Number(e.purchasePrice),
        investorPercent: Math.round(percent * 100) / 100,
        investorAmount: e.investorAllocations.reduce((s, a) => s + Number(a.amountAllocated), 0),
        overFunded: percent > 100.0001,
      }
    })

  const openWithdrawals = await client.withdrawalRequest.count({ where: { status: { in: ['pending', 'approved', 'awaiting_investor_confirmation', 'disputed'] } } })
  const openDeposits = await client.investorDeposit.count({ where: { confirmationStatus: { notIn: ['confirmed'] } } })

  return {
    live: await investorLedgerLive(client),
    investors: investorChecks,
    products: productChecks,
    machines: machineChecks,
    openWithdrawals,
    openDeposits,
    totals: {
      free: investorChecks.reduce((s, i) => s + i.free, 0),
      profit: investorChecks.reduce((s, i) => s + i.profit, 0),
      inProducts: investorChecks.reduce((s, i) => s + i.inProducts, 0),
      inMachines: investorChecks.reduce((s, i) => s + i.inMachines, 0),
    },
  }
}

export class MigrationError extends Error {}

export async function runMigration(admin: { id: string; email?: string | null }) {
  const result = await db.$transaction(
    async (tx) => {
      if (await investorLedgerLive(tx)) throw new MigrationError('Investor balances were already moved into the ledger')
      const preview = await previewMigration(tx)
      const opening = Accounts.openingBalances()
      const adjustments: string[] = []
      const moveToFree = new Map<string, Xaf>()

      // Free capital and profit
      for (const i of preview.investors) {
        const free = toXaf(i.free)
        const profit = toXaf(i.profit)
        const postings: Posting[] = []
        if (free > 0n) postings.push(debit(opening, free), credit(Accounts.investorFree(i.investorId), free))
        if (profit !== 0n) postings.push(debit(opening, profit), credit(Accounts.investorProfit(i.investorId), profit))
        if (postings.length) {
          await post(tx, {
            type: 'opening_investor',
            reference: `opening_investor:${i.investorId}`,
            description: 'Balances brought over from before the ledger',
            createdById: admin.id,
            postings,
          })
        }
      }

      // Product lots: capped at the stock that exists, in proportion
      const allocations = await tx.investorProductAllocation.findMany({ where: { quantityRemaining: { gt: 0 } }, include: { product: true } })
      const groups = new Map<string, typeof allocations>()
      for (const a of allocations) {
        const key = `${a.productId}:${a.variantId ?? ''}`
        groups.set(key, [...(groups.get(key) ?? []), a])
      }
      for (const list of groups.values()) {
        const inStock = BigInt(await inCareUnits(tx, list[0].productId, list[0].variantId)) * MILLI
        const funded = list.reduce((s, a) => s + BigInt(a.quantityRemaining) * MILLI, 0n)
        const kept = funded > inStock ? splitByWeights(inStock, list.map((a) => BigInt(a.quantityRemaining) * MILLI)) : list.map((a) => BigInt(a.quantityRemaining) * MILLI)
        for (const [i, a] of list.entries()) {
          const unitCost = toXaf(a.purchasePrice)
          const units = kept[i]
          const fullUnits = BigInt(a.quantityRemaining) * MILLI
          const capital = (unitCost * units + MILLI / 2n) / MILLI
          const excess = unitCost * BigInt(a.quantityRemaining) - capital
          const lot = await tx.productLot.create({
            data: {
              productId: a.productId,
              variantId: a.variantId,
              investorId: a.investorId,
              unitsMilli: units,
              originalUnitsMilli: BigInt(a.quantity) * MILLI,
              unitCost,
              source: 'migrated',
              status: units > 0n ? 'active' : 'closed',
              allocationId: a.id,
              agreementVersion: 1,
              createdById: admin.id,
            },
          })
          if (capital > 0n) {
            await post(tx, {
              type: 'opening_lot',
              reference: `opening_lot:${lot.id}`,
              description: `${a.product.name}: capital brought over from before the ledger`,
              createdById: admin.id,
              postings: [debit(opening, capital), credit(Accounts.investorLot(lot.id), capital)],
            })
          }
          if (units < fullUnits) {
            moveToFree.set(a.investorId, (moveToFree.get(a.investorId) ?? 0n) + excess)
            adjustments.push(`${a.product.name}: ${Number(fullUnits - units) / 1000} unit(s) funded beyond stock; ${excess} FCFA returned to free capital`)
            await tx.investorProductAllocation.update({ where: { id: a.id }, data: { quantityRemaining: Number(units / MILLI) } })
          }
        }
      }

      // Machine shares in units, capped at 100%
      const equipment = await tx.equipment.findMany({ include: { investorAllocations: { where: { hasExited: false } } } })
      for (const e of equipment) {
        if (e.investorAllocations.length === 0) {
          continue
        }
        const percents = e.investorAllocations.map((a) => Number(a.investmentPercentage))
        const total = percents.reduce((s, p) => s + p, 0)
        const scale = total > 100 ? 100 / total : 1
        for (const a of e.investorAllocations) {
          const amount = toXaf(a.amountAllocated)
          const units = BigInt(Math.floor(Number(a.investmentPercentage) * scale * Number(e.totalUnits) / 100))
          const kept = scale < 1 ? BigInt(Math.floor(Number(amount) * scale)) : amount
          const holding = await tx.equipmentHolding.create({
            data: {
              equipmentId: e.id,
              holderType: 'investor',
              investorId: a.investorId,
              units,
              costBasis: kept,
              legacyAllocationId: a.id,
              agreementVersion: 1,
              acquiredAt: a.allocatedAt,
            },
          })
          if (kept > 0n) {
            await post(tx, {
              type: 'opening_machine',
              reference: `opening_machine:${holding.id}`,
              description: `${e.name}: capital brought over from before the ledger`,
              createdById: admin.id,
              postings: [debit(opening, kept), credit(Accounts.investorMachine(holding.id), kept)],
            })
          }
          if (kept < amount) {
            moveToFree.set(a.investorId, (moveToFree.get(a.investorId) ?? 0n) + (amount - kept))
            adjustments.push(`${e.name}: funded past 100%; ${amount - kept} FCFA returned to free capital`)
            await tx.investorEquipmentAllocation.update({
              where: { id: a.id },
              data: { investmentPercentage: new Prisma.Decimal((Number(a.investmentPercentage) * scale).toFixed(2)), profitShare: new Prisma.Decimal((Number(a.profitShare) * scale).toFixed(2)) },
            })
          }
        }
        await syncCompanyHolding(tx, e)
      }

      for (const [investorId, amount] of moveToFree) {
        if (amount <= 0n) continue
        await post(tx, {
          type: 'opening_adjustment',
          reference: `opening_adjustment:${investorId}`,
          description: 'Capital for units that did not exist, returned to free capital',
          createdById: admin.id,
          postings: [debit(opening, amount), credit(Accounts.investorFree(investorId), amount)],
        })
      }

      await recordLegacyAcceptances(tx)
      for (const i of preview.investors) {
        const extra = moveToFree.get(i.investorId)
        await mirrorInvestor(
          tx,
          i.investorId,
          extra && extra > 0n
            ? { type: 'refund', amount: extra, description: 'Adjustment when moving to the new ledger: capital for units beyond real stock returned to free capital', createdBy: admin.id }
            : undefined
        )
      }
      await markInvestorLedgerLive(tx)
      const check = await checkLedger(tx)
      if (check.imbalance !== 0n || check.drift.length) throw new MigrationError('The ledger does not balance after the migration; nothing was changed')
      return { investors: preview.investors.length, adjustments }
    },
    { timeout: 120_000 }
  )
  await audit({ actor: admin, action: 'investors.ledger_migrated', details: result })
  return result
}
