import { PayrollDeduction, PayrollIncomeTax } from '@/lib/settings'
import { Xaf } from '@/lib/money'

/**
 * Pure salary arithmetic, kept apart from the database so every rule can be checked by hand.
 * All amounts are whole FCFA. Percent amounts round to the nearest franc.
 */

export interface Item {
  code: string
  label: string
  amount: number
}

const pct = (base: Xaf, percent: number): Xaf => {
  if (percent <= 0 || base <= 0n) return 0n
  const basis = BigInt(Math.round(percent * 100))
  return (base * basis + 5_000n) / 10_000n
}

/** Calendar days in the month, and how many of them the person was employed and paid. */
export function paidDays(month: Date, startedAt: Date, endedAt: Date | null, unpaidDays: number) {
  const y = month.getUTCFullYear()
  const m = month.getUTCMonth()
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate()
  const first = Date.UTC(y, m, 1)
  const day = 86_400_000
  const from = Math.max(first, Date.UTC(startedAt.getUTCFullYear(), startedAt.getUTCMonth(), startedAt.getUTCDate()))
  const lastDay = first + (days - 1) * day
  const to = endedAt ? Math.min(lastDay, Date.UTC(endedAt.getUTCFullYear(), endedAt.getUTCMonth(), endedAt.getUTCDate())) : lastDay
  const employed = to < from ? 0 : Math.round((to - from) / day) + 1
  return { days, paid: Math.max(0, employed - Math.max(0, unpaidDays)) }
}

/** Monthly income tax on a gross salary, from yearly bands. */
export function incomeTax(monthlyGross: Xaf, employeeContributions: Xaf, rules: PayrollIncomeTax): { tax: Xaf; surcharge: Xaf } {
  if (!rules.enabled || monthlyGross < BigInt(rules.exemptBelowMonthly)) return { tax: 0n, surcharge: 0n }
  const yearly = monthlyGross * 12n
  const afterCosts = yearly - pct(yearly, rules.professionalCostPercent)
  let taxable = afterCosts - employeeContributions * 12n - BigInt(rules.annualAbatement)
  if (taxable <= 0n) return { tax: 0n, surcharge: 0n }
  let yearlyTax = 0n
  let floor = 0n
  for (const band of rules.annualBrackets) {
    const top = band.upTo > 0 ? BigInt(band.upTo) : null
    const slice = top === null ? taxable : (taxable < top - floor ? taxable : top - floor)
    if (slice <= 0n) break
    yearlyTax += pct(slice, band.percent)
    taxable -= slice
    if (top === null) break
    floor = top
  }
  const tax = (yearlyTax + 6n) / 12n
  return { tax, surcharge: pct(tax, rules.surchargePercent) }
}

export interface LineInput {
  baseSalary: Xaf
  paidDays: number
  daysInMonth: number
  bonus: Xaf
  /** Codes that apply to this person; empty = every enabled contribution */
  deductionCodes: string[]
  incomeTax: boolean
  /** Advances still owed, oldest first: what each may take this month */
  advances: { id: string; take: Xaf }[]
  /** Accepted charges still owed, oldest first */
  charges: { id: string; take: Xaf }[]
}

export interface LineResult {
  gross: Xaf
  deductions: Item[]
  employerCharges: Item[]
  employeeTotal: Xaf
  employerTotal: Xaf
  advanceTakes: { id: string; amount: Xaf }[]
  chargeTakes: { id: string; amount: Xaf }[]
  advanceRecovered: Xaf
  chargesRecovered: Xaf
  net: Xaf
}

export function computeLine(input: LineInput, rules: { deductions: PayrollDeduction[]; tax: PayrollIncomeTax; maxRecoveryPercent: number }): LineResult {
  const salary = input.daysInMonth > 0 ? (input.baseSalary * BigInt(input.paidDays) + BigInt(input.daysInMonth) / 2n) / BigInt(input.daysInMonth) : 0n
  const gross = salary + input.bonus
  const applies = (d: PayrollDeduction) => d.enabled && (input.deductionCodes.length === 0 || input.deductionCodes.includes(d.code))

  const deductions: Item[] = []
  const employerCharges: Item[] = []
  let employeeTotal = 0n
  let employerTotal = 0n
  let contributions = 0n
  for (const d of rules.deductions.filter(applies)) {
    const base = d.monthlyCeiling > 0 && gross > BigInt(d.monthlyCeiling) ? BigInt(d.monthlyCeiling) : gross
    const mine = pct(base, d.employeePercent)
    const theirs = pct(base, d.employerPercent)
    if (mine > 0n) {
      deductions.push({ code: d.code, label: d.label, amount: Number(mine) })
      employeeTotal += mine
      contributions += mine
    }
    if (theirs > 0n) {
      employerCharges.push({ code: d.code, label: d.label, amount: Number(theirs) })
      employerTotal += theirs
    }
  }
  if (input.incomeTax) {
    // Only pension-type contributions reduce taxable income; here every employee contribution does
    const { tax, surcharge } = incomeTax(gross, contributions, rules.tax)
    if (tax > 0n) {
      deductions.push({ code: 'INCOME_TAX', label: 'Income tax', amount: Number(tax) })
      employeeTotal += tax
    }
    if (surcharge > 0n) {
      deductions.push({ code: 'INCOME_TAX_SURCHARGE', label: 'Council surcharge on income tax', amount: Number(surcharge) })
      employeeTotal += surcharge
    }
  }

  const afterDeductions = gross - employeeTotal > 0n ? gross - employeeTotal : 0n
  let room = pct(afterDeductions, rules.maxRecoveryPercent)
  const take = (items: { id: string; take: Xaf }[]) => {
    const out: { id: string; amount: Xaf }[] = []
    for (const item of items) {
      if (room <= 0n) break
      const amount = item.take < room ? item.take : room
      if (amount <= 0n) continue
      out.push({ id: item.id, amount })
      room -= amount
    }
    return out
  }
  const advanceTakes = take(input.advances)
  const chargeTakes = take(input.charges)
  const advanceRecovered = advanceTakes.reduce((s, a) => s + a.amount, 0n)
  const chargesRecovered = chargeTakes.reduce((s, a) => s + a.amount, 0n)

  return {
    gross,
    deductions,
    employerCharges,
    employeeTotal,
    employerTotal,
    advanceTakes,
    chargeTakes,
    advanceRecovered,
    chargesRecovered,
    net: afterDeductions - advanceRecovered - chargesRecovered,
  }
}
