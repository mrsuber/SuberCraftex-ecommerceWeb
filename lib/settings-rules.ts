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
