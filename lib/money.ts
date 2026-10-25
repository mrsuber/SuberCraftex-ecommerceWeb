import { Prisma } from '@prisma/client'

/**
 * All money in SuberCraftex is whole XAF (francs have no minor units). The ledger stores
 * amounts as BigInt; older tables keep Decimal(…, 2) columns that always hold whole francs.
 */
export type Xaf = bigint

export const MIN_MOBILE_MONEY_AMOUNT = 100n
/** Largest single amount accepted from input: 10 billion FCFA */
export const MAX_AMOUNT_XAF = 10_000_000_000n

export class MoneyInputError extends Error {}

/** Parse an amount from user input: whole, positive francs only. */
export function parseXaf(value: unknown, field = 'amount'): Xaf {
  let parsed: bigint | null = null
  if (typeof value === 'bigint') parsed = value
  else if (typeof value === 'number' && Number.isSafeInteger(value)) parsed = BigInt(value)
  else if (typeof value === 'string' && /^\d+$/.test(value.trim())) parsed = BigInt(value.trim())
  if (parsed === null) throw new MoneyInputError(`${field} must be a whole number of FCFA`)
  if (parsed <= 0n) throw new MoneyInputError(`${field} must be greater than zero`)
  if (parsed > MAX_AMOUNT_XAF) throw new MoneyInputError(`${field} is too large`)
  return parsed
}

/** Same as parseXaf but allows zero. */
export function parseXafOrZero(value: unknown, field = 'amount'): Xaf {
  if (value === 0 || value === '0' || value === 0n || value === undefined || value === null || value === '') return 0n
  return parseXaf(value, field)
}

/** A Decimal column to whole francs, rounding half up (old rows may carry .50). */
export function toXaf(value: Prisma.Decimal | number | string | bigint | null | undefined): Xaf {
  if (value === null || value === undefined) return 0n
  if (typeof value === 'bigint') return value
  return BigInt(new Prisma.Decimal(value).toDecimalPlaces(0, Prisma.Decimal.ROUND_HALF_UP).toFixed(0))
}

export function toDecimal(value: Xaf): Prisma.Decimal {
  return new Prisma.Decimal(value.toString())
}

export function minXaf(a: Xaf, b: Xaf): Xaf {
  return a < b ? a : b
}

export function maxXaf(a: Xaf, b: Xaf): Xaf {
  return a > b ? a : b
}

/** Integer percentage of an amount, rounded up (fees are never under-charged). */
export function percentCeil(amount: Xaf, percent: number): Xaf {
  const basisPoints = BigInt(Math.round(percent * 100))
  return (amount * basisPoints + 9_999n) / 10_000n
}

/** Integer percentage of an amount, rounded down. */
export function percentFloor(amount: Xaf, percent: number): Xaf {
  const basisPoints = BigInt(Math.round(percent * 100))
  return (amount * basisPoints) / 10_000n
}

/**
 * Split an amount in proportion to weights so the parts always add up to the total
 * exactly (largest remainder method). Works for negative totals too (losses).
 * Ties go to the earlier weight, so results are repeatable.
 */
export function splitByWeights(total: Xaf, weights: bigint[]): Xaf[] {
  const sum = weights.reduce((a, b) => a + b, 0n)
  if (weights.length === 0) return []
  if (sum <= 0n) throw new Error('splitByWeights needs a positive total weight')
  if (weights.some((w) => w < 0n)) throw new Error('splitByWeights needs non-negative weights')
  const negative = total < 0n
  const abs = negative ? -total : total
  const parts = weights.map((w) => (abs * w) / sum)
  const remainders = weights.map((w, i) => ({ i, r: (abs * w) % sum }))
  let left = abs - parts.reduce((a, b) => a + b, 0n)
  remainders.sort((a, b) => (b.r > a.r ? 1 : b.r < a.r ? -1 : a.i - b.i))
  for (const { i } of remainders) {
    if (left === 0n) break
    if (weights[i] === 0n) continue
    parts[i] += 1n
    left -= 1n
  }
  return negative ? parts.map((p) => -p) : parts
}

/** How amounts read in messages people see, e.g. "25 000 FCFA". */
export function formatXaf(value: Xaf | number): string {
  return `${Number(value).toLocaleString('fr-FR').replace(/ /g, ' ')} FCFA`
}

/**
 * Cameroon mobile numbers: 9 digits starting with 6, optionally prefixed by 237.
 * Returns the 237XXXXXXXXX form PayWithCAMSOL expects.
 */
export function normalizeCameroonPhone(phone: unknown): string {
  if (typeof phone !== 'string') throw new MoneyInputError('Phone number is required')
  const match = phone.replace(/[\s().-]/g, '').match(/^(?:\+?237)?(6\d{8})$/)
  if (!match) throw new MoneyInputError('Enter a Cameroon mobile number, e.g. 677 12 34 56')
  return `237${match[1]}`
}

/** PayWithCAMSOL's test numbers (2376000000xx), used with test keys */
export function isCamsolTestNumber(phone237: string): boolean {
  return /^2376000000\d{2}$/.test(phone237)
}

/** MTN or Orange from the number's prefix (Cameroon numbering plan). */
export function mobileProviderOf(phone237: string): 'MTN' | 'ORANGE' | null {
  if (isCamsolTestNumber(phone237)) return 'MTN'
  const local = phone237.slice(3)
  if (local.startsWith('67') || local.startsWith('68')) return 'MTN'
  if (local.startsWith('69')) return 'ORANGE'
  if (local.startsWith('65')) {
    // 650–654 MTN, 655–659 Orange
    return Number(local[2]) <= 4 ? 'MTN' : 'ORANGE'
  }
  return null
}

/** Serialise BigInt as a JSON number. XAF amounts stay far below 2^53. */
export function installBigIntJson(): void {
  const proto = BigInt.prototype as unknown as { toJSON?: () => number }
  if (!proto.toJSON) {
    proto.toJSON = function (this: bigint) {
      return Number(this)
    }
  }
}
