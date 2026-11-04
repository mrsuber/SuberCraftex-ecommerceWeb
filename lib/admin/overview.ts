import { db } from '@/lib/db'
import { checkLedger } from '@/lib/ledger'
import { getSetting } from '@/lib/settings'
import { camsolStatus } from '@/lib/payments/camsol/settings'
import { SHOP_OFFSET_HOURS, shopToday } from '@/lib/services/booking-schedule'
import { describeWeek } from '@/lib/services/week-hours'
import { jobBoard, unpaidInvoices } from '@/lib/services/job-lists'

/**
 * What the admin overview shows. Every figure is read from where the money and work really
 * are: income and cash from the double-entry ledger, jobs from bookings, invoices from
 * invoices. Nothing is estimated or made up.
 */

const DAY = 86_400_000
const HOUR = 3_600_000

/** Income streams, from the ledger's income accounts */
export const STREAMS: { key: string; label: string; match: (accountKey: string) => boolean }[] = [
  { key: 'products', label: 'Product sales', match: (k) => k === 'INCOME:SALES:PRODUCTS' },
  { key: 'services', label: 'Services', match: (k) => k === 'INCOME:SERVICES' },
  { key: 'repairs', label: 'Device repairs', match: (k) => k === 'INCOME:REPAIRS' },
  { key: 'delivery', label: 'Delivery', match: (k) => k === 'INCOME:SALES:SHIPPING' },
  { key: 'training', label: 'Apprentice fees', match: (k) => k === 'INCOME:APPRENTICE_FEES' },
  { key: 'other', label: 'Other', match: () => true },
]
const streamOf = (accountKey: string) => STREAMS.find((s) => s.match(accountKey))!.key

/** Start of the shop's month containing `at`, as an instant */
export function shopMonthStart(at: Date, monthsBack = 0) {
  const shop = new Date(at.getTime() + SHOP_OFFSET_HOURS * HOUR)
  return new Date(Date.UTC(shop.getUTCFullYear(), shop.getUTCMonth() - monthsBack, 1) - SHOP_OFFSET_HOURS * HOUR)
}

async function incomeBetween(from: Date, to: Date) {
  const rows = await db.$queryRaw<{ key: string; amount: bigint }[]>`
    SELECT a.key, COALESCE(SUM(-e.amount), 0)::bigint AS amount
    FROM ledger_entries e
    JOIN ledger_accounts a ON a.id = e.account_id
    JOIN ledger_transactions t ON t.id = e.transaction_id
    WHERE a.kind = 'income' AND t.occurred_at >= ${from} AND t.occurred_at < ${to}
    GROUP BY a.key`
  const out: Record<string, number> = Object.fromEntries(STREAMS.map((s) => [s.key, 0]))
  for (const r of rows) out[streamOf(r.key)] += Number(r.amount)
  return { byStream: out, total: Object.values(out).reduce((a, b) => a + b, 0) }
}

/**
 * Income this month so far, compared with the same days of last month (1st to today's
 * date), so a month half-way through is never compared with a whole one.
 */
export async function incomeComparison(now = new Date()) {
  const thisStart = shopMonthStart(now)
  const lastStart = shopMonthStart(now, 1)
  const elapsed = now.getTime() - thisStart.getTime()
  const lastSamePoint = new Date(Math.min(lastStart.getTime() + elapsed, thisStart.getTime()))
  const [current, previous] = await Promise.all([incomeBetween(thisStart, now), incomeBetween(lastStart, lastSamePoint)])
  const change = previous.total > 0 ? Math.round(((current.total - previous.total) / previous.total) * 100) : null
  return { current, previous, change }
}

/** Income per shop day for the last `days` days, split by stream (for the chart) */
export async function dailyIncome(days = 14, now = new Date()) {
  const today = shopToday(now)
  const from = new Date(today.getTime() - (days - 1) * DAY - SHOP_OFFSET_HOURS * HOUR)
  const rows = await db.$queryRaw<{ day: Date; key: string; amount: bigint }[]>`
    SELECT date_trunc('day', t.occurred_at + interval '1 hour') AS day, a.key, COALESCE(SUM(-e.amount), 0)::bigint AS amount
    FROM ledger_entries e
    JOIN ledger_accounts a ON a.id = e.account_id
    JOIN ledger_transactions t ON t.id = e.transaction_id
    WHERE a.kind = 'income' AND t.occurred_at >= ${from}
    GROUP BY 1, 2`
  const series = Array.from({ length: days }, (_, i) => {
    const d = new Date(today.getTime() - (days - 1 - i) * DAY)
    return { date: d.toISOString().slice(0, 10), ...Object.fromEntries(STREAMS.map((s) => [s.key, 0])) } as Record<string, number | string>
  })
  const index = new Map(series.map((s, i) => [s.date as string, i]))
  for (const r of rows) {
    const i = index.get(new Date(r.day).toISOString().slice(0, 10))
    if (i === undefined) continue
    const k = streamOf(r.key)
    series[i][k] = (series[i][k] as number) + Number(r.amount)
  }
  return series
}

/** Where the money is right now: safe, bank, Mobile Money, drawers, drivers */
export async function cashPosition() {
  const accounts = await db.ledgerAccount.findMany({
    where: { kind: 'asset', OR: [{ key: { in: ['ASSET:SAFE', 'ASSET:BANK', 'ASSET:CAMSOL', 'ASSET:SHOP_MOMO'] } }, { key: { startsWith: 'ASSET:DRAWER:' } }, { key: { startsWith: 'ASSET:DRIVER_CASH:' } }] },
    select: { key: true, balance: true },
  })
  const sum = (pred: (k: string) => boolean) => accounts.filter((a) => pred(a.key)).reduce((s, a) => s + Number(a.balance), 0)
  const places = [
    { label: 'Shop safe', amount: sum((k) => k === 'ASSET:SAFE') },
    { label: 'Bank', amount: sum((k) => k === 'ASSET:BANK') },
    { label: 'PayWithCAMSOL', amount: sum((k) => k === 'ASSET:CAMSOL') },
    { label: 'Shop Mobile Money', amount: sum((k) => k === 'ASSET:SHOP_MOMO') },
    { label: 'Cash drawers', amount: sum((k) => k.startsWith('ASSET:DRAWER:')) },
    { label: 'Cash with drivers', amount: sum((k) => k.startsWith('ASSET:DRIVER_CASH:')) },
  ]
  return { places, total: places.reduce((s, p) => s + p.amount, 0) }
}

/** Service work at a glance */
export async function serviceSnapshot(now = new Date()) {
  const [board, unpaid, newOnline, quotesToPrepare, unassignedToday] = await Promise.all([
    jobBoard('all', now),
    unpaidInvoices('all', now, 200),
    db.serviceBooking.count({ where: { status: 'pending', source: 'online' } }),
    db.serviceBooking.count({ where: { status: 'quote_pending' } }),
    db.serviceBooking.count({ where: { scheduledDate: shopToday(now), assignedToId: null, status: { notIn: ['cancelled', 'completed', 'no_show'] } } }),
  ])
  return {
    today: board.today,
    toInvoice: board.toInvoice,
    overdueOpen: board.open.filter((j) => j.date !== null),
    unpaid,
    owed: unpaid.reduce((s, u) => s + u.due, 0),
    late: unpaid.filter((u) => u.daysLate > 0),
    newOnline,
    quotesToPrepare,
    unassignedToday,
  }
}

/** Things waiting on someone, each with where to deal with it */
export async function actionItems() {
  const [ordersToPrepare, ordersAwaitingPayment, lowStock, deposits, withdrawals, payouts] = await Promise.all([
    db.order.count({ where: { orderStatus: { in: ['paid', 'processing'] } } }),
    db.order.count({ where: { orderStatus: 'pending', paymentStatus: 'pending' } }),
    db.$queryRaw<{ n: bigint }[]>`
      SELECT COUNT(*)::bigint AS n FROM products
      WHERE is_active AND track_inventory AND inventory_count <= low_stock_threshold`,
    db.investorDeposit.count({ where: { confirmationStatus: 'pending_confirmation' } }),
    db.withdrawalRequest.count({ where: { status: 'pending' } }),
    db.payout.count({ where: { status: { in: ['awaiting_approval', 'review'] } } }),
  ])
  return [
    { label: 'Orders to prepare', count: ordersToPrepare, href: '/dashboard/orders' },
    { label: 'Orders awaiting payment', count: ordersAwaitingPayment, href: '/dashboard/orders' },
    { label: 'Products low on stock', count: Number(lowStock[0]?.n ?? 0), href: '/dashboard/products' },
    { label: 'Investor deposits to confirm', count: deposits, href: '/dashboard/pending-deposits' },
    { label: 'Withdrawal requests', count: withdrawals, href: '/dashboard/investors' },
    { label: 'Payouts to approve', count: payouts, href: '/dashboard/finance' },
  ]
}

export type HealthState = 'ok' | 'warn' | 'bad'
export interface HealthCheck {
  key: string
  label: string
  state: HealthState
  detail: string
  href?: string
}

/**
 * Is the system set up to run the business? For super admins: each check says what is
 * wrong and where to fix it.
 */
export async function systemHealth(): Promise<HealthCheck[]> {
  const checks: HealthCheck[] = []
  const company = await getSetting('company.profile')
  const missing = [!company.phone && 'phone', !company.address && 'address', !company.taxId && 'NIU', !company.registration && 'RCCM'].filter(Boolean)
  checks.push({
    key: 'company',
    label: 'Company details on invoices',
    state: missing.length === 0 ? 'ok' : missing.includes('NIU') || missing.includes('RCCM') ? 'bad' : 'warn',
    detail: missing.length === 0 ? `${company.name}, NIU ${company.taxId}` : `Missing: ${missing.join(', ')}`,
    href: '/dashboard/settings',
  })

  const emailOn = process.env.EMAIL_DISABLED !== '1' && !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_FROM_EMAIL
  checks.push({
    key: 'email',
    label: 'Email sending',
    state: emailOn ? 'ok' : 'bad',
    detail: emailOn ? `From ${process.env.SMTP_FROM_EMAIL}` : 'Not configured: confirmations, invoices and job emails are not sent (SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL)',
  })

  try {
    const pay = await camsolStatus()
    checks.push({
      key: 'payments',
      label: 'Mobile Money payments',
      state: pay.source === 'none' ? 'bad' : pay.source === 'simulated' || pay.environment === 'test' ? 'warn' : pay.canCollect ? 'ok' : 'bad',
      detail:
        pay.source === 'none'
          ? 'No PayWithCAMSOL keys: customers cannot pay by Mobile Money'
          : pay.source === 'simulated'
            ? 'Simulated payments (development only): no real money moves'
            : `${pay.environment === 'live' ? 'Live' : pay.environment} keys${pay.canPayOut ? ', payouts on' : ', payouts off'}`,
      href: '/dashboard/settings',
    })
    if (pay.source !== 'none' && pay.source !== 'simulated') {
      checks.push({
        key: 'webhooks',
        label: 'Payment confirmations (webhook)',
        state: pay.verifiesWebhooks ? 'ok' : 'warn',
        detail: pay.verifiesWebhooks ? 'Signed and verified' : 'No webhook secret: payments are confirmed by polling only',
        href: '/dashboard/settings',
      })
    }
  } catch (e) {
    checks.push({ key: 'payments', label: 'Mobile Money payments', state: 'bad', detail: `Could not read the payment settings: ${e instanceof Error ? e.message : e}` })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  checks.push({
    key: 'url',
    label: 'Site address for links',
    state: appUrl && /^https:\/\//.test(appUrl) ? 'ok' : appUrl ? 'warn' : 'bad',
    detail: appUrl ? appUrl : 'NEXT_PUBLIC_APP_URL is not set: invoice and job links in emails will not work',
  })

  checks.push({
    key: 'cron',
    label: 'Scheduled tasks',
    state: process.env.CRON_SECRET ? 'ok' : 'bad',
    detail: process.env.CRON_SECRET ? 'CRON_SECRET set (reminders, payment expiry, daily jobs)' : 'CRON_SECRET not set: reminders and daily jobs cannot run',
  })

  const ledger = await checkLedger(db)
  checks.push({
    key: 'ledger',
    label: 'Books balance',
    state: ledger.imbalance === 0n && ledger.drift.length === 0 ? 'ok' : 'bad',
    detail:
      ledger.imbalance === 0n && ledger.drift.length === 0
        ? 'Every transaction adds up'
        : `Out by ${ledger.imbalance} FCFA, ${ledger.drift.length} account(s) drifting — tell the developer`,
    href: '/dashboard/finance',
  })

  const [hours, holidays, ownHours] = await Promise.all([
    getSetting('services.defaultHours'),
    db.serviceBlockout.count({ where: { serviceId: null, isRecurring: true } }),
    db.serviceAvailability.groupBy({ by: ['serviceId'] }).then((r) => r.length),
  ])
  checks.push({
    key: 'hours',
    label: 'Booking hours',
    state: holidays > 0 ? 'ok' : 'warn',
    detail: `${describeWeek(hours)}${ownHours ? ` · ${ownHours} service(s) with own hours` : ''}${holidays ? '' : ' · public holidays not added'}`,
    href: '/dashboard/services/hours',
  })

  const superAdmins = await db.user.count({ where: { role: 'admin', isSuperAdmin: true, isSuspended: false } })
  checks.push({
    key: 'superadmins',
    label: 'Super admins',
    state: superAdmins >= 2 ? 'ok' : 'warn',
    detail: superAdmins >= 2 ? `${superAdmins} people can manage money settings` : 'Only one super admin: if that account is lost, nobody can change payment keys',
    href: '/dashboard/customers',
  })
  return checks
}
