import { db } from '@/lib/db'

/**
 * Typed business settings stored as JSON in app_settings. Every setting has a default,
 * so a fresh database works; admins change them from the dashboard. Reads are cached for
 * 15 seconds, so a change takes effect without a restart.
 */

export interface ShippingRates {
  in_store: number
  standard: number
  express: number
  overnight: number
}

export interface SettingTypes {
  'shipping.rates': ShippingRates
  /** Minutes an unpaid Mobile Money order holds its stock before it expires */
  'checkout.paymentHoldMinutes': number
  /** VAT included in catalogue prices, in percent. 0 means prices carry no VAT. */
  'tax.vatPercent': number
  /** PayWithCAMSOL's charge on every payout, in percent, added on top of the amount */
  'payouts.feePercent': number
  /** Payouts at or below this amount are sent without an admin approving them. 0 = always approve. */
  'payouts.autoApproveLimit': number
  /** Who pays the payout fee on salary withdrawals */
  'payouts.salaryFeePaidByCompany': boolean
  /** Investor and company shares of profit, in percent (they add up to 100) */
  'investors.investorProfitPercent': number
  /** Days after delivery before product profit can be withdrawn */
  'investors.profitHoldDays': number
  /** Days of notice an investor gives before leaving */
  'investors.exitNoticeDays': number
  /** Months a machine investment must be held before leaving */
  'investors.machineLockMonths': number
  /** Days co-owners, then SuberCraftex, have to buy a leaving investor's share */
  'investors.buyoutOfferDays': number
  /** Monthly instalments allowed when buying out a leaving investor */
  'investors.buyoutMaxInstalments': number
  /** Standard working hours in a month, to turn a salary into an hourly labour cost */
  'payroll.standardMonthlyHours': number
  /** Day of the month salaries are prepared */
  'payroll.payDay': number
  /** Days after an apprentice instalment is due before a reminder, and before new work pauses */
  'apprentices.reminderDays': number
  'apprentices.pauseAfterDays': number
  /** The company's accountant, filled in by an admin */
  'company.accountant': { name: string; firm: string; email: string; phone: string; notes: string }
}

export const SETTING_DEFAULTS: SettingTypes = {
  'shipping.rates': { in_store: 0, standard: 0, express: 2000, overnight: 5000 },
  'checkout.paymentHoldMinutes': 15,
  'tax.vatPercent': 0,
  'payouts.feePercent': 5,
  'payouts.autoApproveLimit': 0,
  'payouts.salaryFeePaidByCompany': true,
  'investors.investorProfitPercent': 50,
  'investors.profitHoldDays': 7,
  'investors.exitNoticeDays': 30,
  'investors.machineLockMonths': 6,
  'investors.buyoutOfferDays': 14,
  'investors.buyoutMaxInstalments': 3,
  'payroll.standardMonthlyHours': 173,
  'payroll.payDay': 28,
  'apprentices.reminderDays': 7,
  'apprentices.pauseAfterDays': 30,
  'company.accountant': { name: '', firm: '', email: '', phone: '', notes: '' },
}

export type SettingKey = keyof SettingTypes

const CACHE_MS = 15_000
const cache = new Map<string, { value: unknown; at: number }>()

function parse<K extends SettingKey>(key: K, raw: string | undefined): SettingTypes[K] {
  const fallback = SETTING_DEFAULTS[key]
  if (raw === undefined) return fallback
  try {
    const value = JSON.parse(raw)
    if (typeof fallback === 'object' && fallback !== null) {
      return { ...(fallback as object), ...(value as object) } as SettingTypes[K]
    }
    return typeof value === typeof fallback ? value : fallback
  } catch {
    return fallback
  }
}

export async function getSetting<K extends SettingKey>(key: K): Promise<SettingTypes[K]> {
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.value as SettingTypes[K]
  const row = await db.appSetting.findUnique({ where: { key: `setting:${key}` } })
  const value = parse(key, row?.value)
  cache.set(key, { value, at: Date.now() })
  return value
}

export async function getSettings<K extends SettingKey>(keys: K[]): Promise<{ [P in K]: SettingTypes[P] }> {
  const entries = await Promise.all(keys.map(async (k) => [k, await getSetting(k)] as const))
  return Object.fromEntries(entries) as { [P in K]: SettingTypes[P] }
}

export async function setSetting<K extends SettingKey>(key: K, value: SettingTypes[K]): Promise<void> {
  const category = key.split('.')[0]
  await db.appSetting.upsert({
    where: { key: `setting:${key}` },
    update: { value: JSON.stringify(value), category },
    create: { key: `setting:${key}`, value: JSON.stringify(value), category },
  })
  cache.delete(key)
}

export function clearSettingsCache() {
  cache.clear()
}
