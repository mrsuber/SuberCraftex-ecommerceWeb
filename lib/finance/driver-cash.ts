import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { AccountRef, Accounts, balanceOf, credit, debit, lockAccount, post } from '@/lib/ledger'
import { Xaf } from '@/lib/money'

export class DriverCashError extends Error {}

/** Cash each driver holds from deliveries, according to the ledger. */
export async function driverCashBalances() {
  const drivers = await db.driver.findMany({ orderBy: { fullName: 'asc' } })
  return Promise.all(
    drivers.map(async (d) => ({
      driverId: d.id,
      name: d.fullName,
      phone: d.phone,
      held: await balanceOf(db, Accounts.driverCash(d.id, d.fullName)),
      lastHandover: await db.driverCashHandover.findFirst({ where: { driverId: d.id }, orderBy: { createdAt: 'desc' } }),
    }))
  )
}

const DESTINATIONS: Record<string, () => AccountRef> = {
  safe: Accounts.safe,
  bank: Accounts.bank,
}

/**
 * A driver hands in cash. What is handed in leaves the driver's account; anything still
 * missing stays on it, owed, until handed in or written off. Never taken from salary
 * automatically.
 */
export async function recordHandover(input: {
  driverId: string
  amount: Xaf
  into: string
  notes?: string | null
  admin: { id: string; email?: string | null }
}) {
  const driver = await db.driver.findUnique({ where: { id: input.driverId } })
  if (!driver) throw new DriverCashError('Driver not found')
  const destination = DESTINATIONS[input.into]
  if (!destination) throw new DriverCashError('Cash must go to the safe or the bank')
  const account = Accounts.driverCash(driver.id, driver.fullName)
  const handover = await db.$transaction(async (tx) => {
    const held = await lockAccount(tx, account)
    if (input.amount > held) throw new DriverCashError(`${driver.fullName} holds only ${held} FCFA`)
    const row = await tx.driverCashHandover.create({
      data: {
        driverId: driver.id,
        amount: input.amount,
        heldBefore: held,
        receivedById: input.admin.id,
        intoAccount: destination().key,
        notes: input.notes ?? null,
      },
    })
    await post(tx, {
      type: 'driver_handover',
      reference: `driver_handover:${row.id}`,
      description: `${driver.fullName} handed in cash`,
      createdById: input.admin.id,
      postings: [debit(destination(), input.amount), credit(account, input.amount)],
    })
    return row
  })
  await audit({
    actor: input.admin,
    action: 'driver_cash.handover',
    targetType: 'driver',
    targetId: driver.id,
    details: { amount: input.amount, heldBefore: handover.heldBefore, into: input.into },
  })
  return handover
}

/** A super admin accepts that cash is lost (with a reason). It becomes a cost, not a debt. */
export async function writeOffShortage(input: {
  driverId: string
  amount: Xaf
  reason: string
  admin: { id: string; email?: string | null }
}) {
  if (!input.reason.trim()) throw new DriverCashError('Give a reason for the write-off')
  const driver = await db.driver.findUnique({ where: { id: input.driverId } })
  if (!driver) throw new DriverCashError('Driver not found')
  const account = Accounts.driverCash(driver.id, driver.fullName)
  await db.$transaction(async (tx) => {
    const held = await lockAccount(tx, account)
    if (input.amount > held) throw new DriverCashError(`${driver.fullName} holds only ${held} FCFA`)
    await post(tx, {
      type: 'driver_cash_write_off',
      reference: `driver_write_off:${driver.id}:${Date.now()}`,
      description: `Cash written off for ${driver.fullName}: ${input.reason}`,
      createdById: input.admin.id,
      postings: [debit(Accounts.cashShort(), input.amount), credit(account, input.amount)],
    })
  })
  await audit({
    actor: input.admin,
    action: 'driver_cash.written_off',
    targetType: 'driver',
    targetId: driver.id,
    details: { amount: input.amount, reason: input.reason },
  })
}
