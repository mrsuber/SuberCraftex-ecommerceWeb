import { db } from '@/lib/db'
import { Tx } from '@/lib/ledger'

const KEY = 'investors.ledgerLiveAt'

/**
 * The investor engine switches on once existing balances have been moved into the ledger
 * (the investor migration, run by a super admin). Until then the old logic keeps running,
 * so nothing changes for investors before their balances are checked and moved.
 */
export async function investorLedgerLive(client: Tx | typeof db = db): Promise<boolean> {
  const row = await client.appSetting.findUnique({ where: { key: KEY } })
  return !!row
}

export async function markInvestorLedgerLive(tx: Tx, at = new Date()) {
  await tx.appSetting.upsert({
    where: { key: KEY },
    update: { value: at.toISOString(), category: 'investor' },
    create: { key: KEY, value: at.toISOString(), category: 'investor' },
  })
}
