import { db } from '@/lib/db'
import { checkLedger, displayBalance } from '@/lib/ledger'

/** Ledger totals grouped by kind of account, for the admin finance page. */
const GROUPS: { prefix: string; label: string }[] = [
  { prefix: 'ASSET:CAMSOL', label: 'PayWithCAMSOL account' },
  { prefix: 'ASSET:SAFE', label: 'Shop safe' },
  { prefix: 'ASSET:BANK', label: 'Bank account' },
  { prefix: 'ASSET:SHOP_MOMO', label: 'Shop Mobile Money number' },
  { prefix: 'ASSET:DRAWER:', label: 'Cash in till drawers' },
  { prefix: 'ASSET:DRIVER_CASH:', label: 'Cash held by drivers' },
  { prefix: 'ASSET:ADVANCE:', label: 'Salary advances to recover' },
  { prefix: 'ASSET:APPRENTICE_FEES_DUE:', label: 'Apprentice fees due' },
  { prefix: 'LIAB:INVESTOR_FREE:', label: 'Investors: free capital' },
  { prefix: 'LIAB:INVESTOR_LOT:', label: 'Investors: capital in products' },
  { prefix: 'LIAB:INVESTOR_MACHINE:', label: 'Investors: capital in machines' },
  { prefix: 'LIAB:MACHINE_RESERVE:', label: 'Investors: machine reserves' },
  { prefix: 'LIAB:INVESTOR_PROFIT_PENDING:', label: 'Investors: profit pending' },
  { prefix: 'LIAB:INVESTOR_PROFIT:', label: 'Investors: profit available' },
  { prefix: 'LIAB:INVESTOR_EXIT_DUE:', label: 'Investors: exit payments owed' },
  { prefix: 'LIAB:CUSTOMER_CREDIT:', label: 'Customers: store credit' },
  { prefix: 'LIAB:REFUND_DUE:', label: 'Customers: refunds owed' },
  { prefix: 'LIAB:SALARY:', label: 'Staff: salary wallets' },
  { prefix: 'LIAB:APPRENTICE_FEES_ADVANCE:', label: 'Apprentices: fees paid in advance' },
  { prefix: 'LIAB:PAYOUTS_IN_FLIGHT', label: 'Payouts on their way' },
  { prefix: 'LIAB:PAYROLL:', label: 'Payroll deductions owed' },
  { prefix: 'LIAB:VAT', label: 'VAT owed' },
]

export async function financeOverview() {
  const accounts = await db.ledgerAccount.findMany({ select: { key: true, kind: true, balance: true } })
  const groups = GROUPS.map((g) => {
    // INVESTOR_PROFIT: must not swallow INVESTOR_PROFIT_PENDING:
    const matching = accounts.filter(
      (a) => a.key.startsWith(g.prefix) && !(g.prefix === 'LIAB:INVESTOR_PROFIT:' && a.key.startsWith('LIAB:INVESTOR_PROFIT_PENDING:'))
    )
    const total = matching.reduce((sum, a) => sum + displayBalance(a.kind, a.balance), 0n)
    return { label: g.label, kind: g.prefix.startsWith('ASSET') ? 'holds' : 'owes', total: Number(total), accounts: matching.length }
  })
  const check = await checkLedger()
  return { groups, healthy: check.imbalance === 0n && check.drift.length === 0, imbalance: Number(check.imbalance), drift: check.drift.length }
}
