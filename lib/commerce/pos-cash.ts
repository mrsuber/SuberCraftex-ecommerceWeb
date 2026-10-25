import { POSSession } from '@prisma/client'
import { accountId, Accounts, balanceOf, credit, debit, post, Tx } from '@/lib/ledger'
import { minXaf, Xaf } from '@/lib/money'

/**
 * A cashier's drawer in the ledger.
 * Opening: the float moves from the safe into the drawer. The ledger starts empty when it
 * goes live, so any part of the float the safe does not hold yet is booked as cash that was
 * already in the shop (opening balances).
 * Sales: cash sales go into the drawer (see markOrderPaid).
 * Closing: the counted cash is compared with what the drawer should hold; the difference is
 * booked as over or short, and the counted cash goes back to the safe.
 */

export async function openDrawer(tx: Tx, session: POSSession, float: Xaf, actorId: string) {
  const drawer = Accounts.drawer(session.id, session.sessionNumber)
  // The drawer account is created at opening even without a float: it marks the session as
  // one the ledger follows from the start
  await accountId(tx, drawer)
  if (float <= 0n) return
  const inSafe = await balanceOf(tx, Accounts.safe())
  const fromSafe = minXaf(float, inSafe > 0n ? inSafe : 0n)
  await post(tx, {
    type: 'pos_open',
    reference: `pos_open:${session.id}`,
    description: `Float for till session ${session.sessionNumber}`,
    createdById: actorId,
    postings: [
      debit(drawer, float),
      credit(Accounts.safe(), fromSafe),
      credit(Accounts.openingBalances(), float - fromSafe),
    ],
  })
}

/** What the drawer should hold now, from the ledger. Null for sessions opened before the ledger. */
export async function expectedInDrawer(tx: Tx, session: POSSession): Promise<Xaf | null> {
  const drawer = Accounts.drawer(session.id, session.sessionNumber)
  const account = await tx.ledgerAccount.findUnique({ where: { key: drawer.key } })
  const followedFromOpening = !!account && account.createdAt.getTime() - session.openedAt.getTime() < 60_000
  if (!followedFromOpening) return null
  return balanceOf(tx, drawer)
}

export async function closeDrawer(tx: Tx, session: POSSession, counted: Xaf, actorId: string) {
  const drawer = Accounts.drawer(session.id, session.sessionNumber)
  const expected = await expectedInDrawer(tx, session)
  const inLedger = await balanceOf(tx, drawer)
  if (expected !== null) {
    const difference = counted - expected
    if (difference > 0n) {
      await post(tx, {
        type: 'pos_over',
        reference: `pos_over:${session.id}`,
        description: `Till ${session.sessionNumber} counted ${difference} FCFA over`,
        createdById: actorId,
        postings: [debit(drawer, difference), credit(Accounts.cashOver(), difference)],
      })
    } else if (difference < 0n) {
      await post(tx, {
        type: 'pos_short',
        reference: `pos_short:${session.id}`,
        description: `Till ${session.sessionNumber} counted ${-difference} FCFA short`,
        createdById: actorId,
        postings: [debit(Accounts.cashShort(), -difference), credit(drawer, -difference)],
      })
    }
  }
  // Everything left in the drawer goes to the safe
  const left = expected !== null ? counted : inLedger
  if (left > 0n) {
    await post(tx, {
      type: 'pos_close',
      reference: `pos_close:${session.id}`,
      description: `Till ${session.sessionNumber} cash to the safe`,
      createdById: actorId,
      postings: [debit(Accounts.safe(), left), credit(drawer, left)],
    })
  }
  return { expected, difference: expected !== null ? counted - expected : null }
}
