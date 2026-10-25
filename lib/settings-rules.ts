import { SETTING_DEFAULTS, SettingKey, SettingTypes } from '@/lib/settings'

/**
 * Which settings admins may change from the dashboard, who may change them, and what values
 * are acceptable. Settings that move money (fees, profit split, approval limits) need a
 * super admin.
 */

export class SettingValueError extends Error {}

type Rule<K extends SettingKey> = {
  superAdmin: boolean
  label: string
  validate: (value: unknown) => SettingTypes[K]
}

const int = (label: string, min: number, max: number) => (value: unknown) => {
  const n = typeof value === 'string' ? Number(value) : value
  if (typeof n !== 'number' || !Number.isInteger(n) || n < min || n > max) {
    throw new SettingValueError(`${label} must be a whole number between ${min} and ${max}`)
  }
  return n
}

const percent = (label: string, max = 100) => (value: unknown) => {
  const n = typeof value === 'string' ? Number(value) : value
  if (typeof n !== 'number' || !Number.isFinite(n) || n < 0 || n > max) {
    throw new SettingValueError(`${label} must be between 0 and ${max}`)
  }
  return Math.round(n * 100) / 100
}

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

export const SETTING_RULES: { [K in SettingKey]: Rule<K> } = {
  'shipping.rates': {
    superAdmin: false,
    label: 'Delivery prices',
    validate: (value) => {
      const v = (value ?? {}) as Record<string, unknown>
      const fee = (k: string) => int(`${k} delivery price`, 0, 1_000_000)(v[k] ?? 0)
      return { in_store: fee('in_store'), standard: fee('standard'), express: fee('express'), overnight: fee('overnight') }
    },
  },
  'checkout.paymentHoldMinutes': { superAdmin: false, label: 'Payment wait (minutes)', validate: int('Payment wait', 5, 120) },
  'tax.vatPercent': { superAdmin: true, label: 'VAT included in prices (%)', validate: percent('VAT', 50) },
  'payouts.feePercent': { superAdmin: true, label: 'PayWithCAMSOL payout fee (%)', validate: percent('Payout fee', 20) },
  'payouts.autoApproveLimit': { superAdmin: true, label: 'Send payouts without approval up to (FCFA)', validate: int('Automatic limit', 0, 10_000_000) },
  'payouts.salaryFeePaidByCompany': {
    superAdmin: true,
    label: 'SuberCraftex pays the fee on salary withdrawals',
    validate: (value) => {
      if (typeof value !== 'boolean') throw new SettingValueError('Choose yes or no')
      return value
    },
  },
  'investors.investorProfitPercent': { superAdmin: true, label: 'Investors’ share of profit (%)', validate: int('Investors’ share', 0, 100) },
  'investors.profitHoldDays': { superAdmin: true, label: 'Days before product profit can be withdrawn', validate: int('Holding period', 0, 60) },
  'investors.exitNoticeDays': { superAdmin: true, label: 'Notice before an investor leaves (days)', validate: int('Notice period', 0, 180) },
  'investors.machineLockMonths': { superAdmin: true, label: 'Minimum months in a machine', validate: int('Minimum months', 0, 60) },
  'investors.buyoutOfferDays': { superAdmin: true, label: 'Days to buy a leaving investor’s share', validate: int('Offer period', 1, 90) },
  'investors.buyoutMaxInstalments': { superAdmin: true, label: 'Monthly instalments for a buyout', validate: int('Instalments', 1, 12) },
  'payroll.standardMonthlyHours': { superAdmin: false, label: 'Standard working hours per month', validate: int('Hours', 40, 300) },
  'payroll.payDay': { superAdmin: false, label: 'Day salaries are prepared', validate: int('Pay day', 1, 28) },
  'payroll.deductions': {
    superAdmin: true,
    label: 'Payroll contributions',
    validate: (value) => {
      if (!Array.isArray(value) || value.length > 20) throw new SettingValueError('Contributions must be a list')
      const codes = new Set<string>()
      return value.map((raw) => {
        const v = (raw ?? {}) as Record<string, unknown>
        const code = text(v.code, 30).toUpperCase().replace(/[^A-Z0-9_]/g, '')
        if (!code || codes.has(code)) throw new SettingValueError('Each contribution needs its own code')
        codes.add(code)
        return {
          code,
          label: text(v.label, 80) || code,
          employeePercent: percent(`${code} employee share`, 50)(v.employeePercent ?? 0),
          employerPercent: percent(`${code} employer share`, 50)(v.employerPercent ?? 0),
          monthlyCeiling: int(`${code} ceiling`, 0, 100_000_000)(v.monthlyCeiling ?? 0),
          enabled: v.enabled === true,
        }
      })
    },
  },
  'payroll.incomeTax': {
    superAdmin: true,
    label: 'Income tax on salaries',
    validate: (value) => {
      const v = (value ?? {}) as Record<string, unknown>
      const brackets = Array.isArray(v.annualBrackets) ? v.annualBrackets : []
      if (brackets.length < 1 || brackets.length > 10) throw new SettingValueError('Give between 1 and 10 tax bands')
      const bands = brackets.map((b: any, i: number) => ({
        upTo: int(`Band ${i + 1} limit`, 0, 10_000_000_000)(b?.upTo ?? 0),
        percent: percent(`Band ${i + 1} rate`, 60)(b?.percent ?? 0),
      }))
      bands.forEach((b, i) => {
        const last = i === bands.length - 1
        if (last ? b.upTo !== 0 : b.upTo <= (bands[i - 1]?.upTo ?? 0)) throw new SettingValueError('Bands must rise, and the last one has no limit (0)')
      })
      return {
        enabled: v.enabled === true,
        professionalCostPercent: percent('Professional costs', 50)(v.professionalCostPercent ?? 0),
        annualAbatement: int('Abatement', 0, 100_000_000)(v.annualAbatement ?? 0),
        exemptBelowMonthly: int('Exempt below', 0, 100_000_000)(v.exemptBelowMonthly ?? 0),
        annualBrackets: bands,
        surchargePercent: percent('Surcharge', 50)(v.surchargePercent ?? 0),
      }
    },
  },
  'payroll.advanceMaxPercent': { superAdmin: true, label: 'Largest salary advance (% of a month)', validate: percent('Advance limit') },
  'payroll.maxRecoveryPercent': { superAdmin: true, label: 'Most of a salary taken back each month (%)', validate: percent('Recovery limit') },
  'apprentices.reminderDays': { superAdmin: false, label: 'Days overdue before a fee reminder', validate: int('Reminder days', 0, 60) },
  'apprentices.pauseAfterDays': { superAdmin: false, label: 'Days overdue before new work pauses', validate: int('Pause days', 1, 180) },
  'company.accountant': {
    superAdmin: false,
    label: 'Accountant',
    validate: (value) => {
      const v = (value ?? {}) as Record<string, unknown>
      const email = text(v.email, 200)
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new SettingValueError('Accountant email is not valid')
      return { name: text(v.name, 200), firm: text(v.firm, 200), email, phone: text(v.phone, 50), notes: text(v.notes, 2000) }
    },
  },
}

export const EDITABLE_SETTINGS = Object.keys(SETTING_DEFAULTS) as SettingKey[]
