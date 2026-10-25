import { LedgerAccountKind, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import { formatXaf, Xaf } from '@/lib/money'
import { AccountRef } from './accounts'

export * from './accounts'

export type Tx = Prisma.TransactionClient

/** One line of a ledger transaction: + debits the account, - credits it. */
export interface Posting {
  account: AccountRef
  amount: Xaf
}

export const debit = (account: AccountRef, amount: Xaf): Posting => ({ account, amount })
export const credit = (account: AccountRef, amount: Xaf): Posting => ({ account, amount: -amount })

export interface PostRequest {
  type: string
  reference: string
  description: string
  metadata?: Record<string, unknown>
  createdById?: string | null
  occurredAt?: Date
  postings: Posting[]
}

export class LedgerError extends Error {}

export class InsufficientFundsError extends LedgerError {
  constructor(public readonly accountKey: string, public readonly accountName: string) {
    super(`Not enough money in ${accountName}`)
  }
}

/** Assets and expenses grow with debits; liabilities, equity and income with credits. */
export function isDebitNormal(kind: LedgerAccountKind) {
  return kind === 'asset' || kind === 'expense'
}

/** An account's balance the way people read it: positive when it holds money. */
export function displayBalance(kind: LedgerAccountKind, raw: bigint): Xaf {
  return isDebitNormal(kind) ? raw : -raw
}

const lockKey = (key: string) => key

/**
 * Post one balanced transaction. Must run inside the Prisma interactive transaction that
 * also makes the business change it records, so both happen or neither does.
 *
 * - Postings must add up to zero, and none may be zero.
 * - Posting the same reference twice does nothing the second time ({ duplicate: true }).
 * - An account may not go below zero unless it allows it; the check and the update are one
 *   statement, so two concurrent payments can never overdraw a wallet.
 */
export async function post(tx: Tx, request: PostRequest): Promise<{ id: string; duplicate: boolean }> {
  const postings = request.postings.filter((p) => p.amount !== 0n)
  if (postings.length < 2) throw new LedgerError('A ledger transaction needs at least two non-zero postings')
  const total = postings.reduce((sum, p) => sum + p.amount, 0n)
  if (total !== 0n) throw new LedgerError(`Ledger postings must balance (off by ${total})`)

  const id = randomUUID()
  const inserted = await tx.$executeRaw`
    INSERT INTO ledger_transactions (id, reference, type, description, metadata, created_by_id, occurred_at, created_at)
    VALUES (${id}, ${request.reference}, ${request.type}, ${request.description},
            ${JSON.stringify(request.metadata ?? {}, (_k, v) => (typeof v === 'bigint' ? Number(v) : v))}::jsonb, ${request.createdById ?? null},
            ${request.occurredAt ?? new Date()}, now())
    ON CONFLICT (reference) DO NOTHING`
  if (inserted === 0) {
    const existing = await tx.ledgerTransaction.findUniqueOrThrow({ where: { reference: request.reference } })
    return { id: existing.id, duplicate: true }
  }

  // Resolve accounts, then update them in a stable order so concurrent posts cannot deadlock
  const resolved = await Promise.all(
    postings.map(async (p) => ({ ...p, accountId: await accountId(tx, p.account) }))
  )
  resolved.sort((a, b) => (lockKey(a.accountId) < lockKey(b.accountId) ? -1 : 1))
  for (const posting of resolved) {
    const rows = await tx.$queryRaw<{ balance: bigint }[]>`
      UPDATE ledger_accounts
         SET balance = balance + ${posting.amount}
       WHERE id = ${posting.accountId}
         AND (allow_negative
              OR (kind IN ('asset', 'expense') AND balance + ${posting.amount} >= 0)
              OR (kind NOT IN ('asset', 'expense') AND balance + ${posting.amount} <= 0))
      RETURNING balance`
    if (rows.length === 0) throw new InsufficientFundsError(posting.account.key, posting.account.name)
    await tx.ledgerEntry.create({
      data: { transactionId: id, accountId: posting.accountId, amount: posting.amount, balanceAfter: rows[0].balance },
    })
  }
  return { id, duplicate: false }
}

/** Cancel a posted transaction with its mirror image. Ledger entries are never edited. */
export async function reverse(tx: Tx, reference: string, description: string, createdById?: string | null) {
  const original = await tx.ledgerTransaction.findUnique({
    where: { reference },
    include: { entries: { include: { account: true } } },
  })
  if (!original) throw new LedgerError(`No ledger transaction ${reference}`)
  return post(tx, {
    type: `reversal:${original.type}`,
    reference: `reversal:${reference}`,
    description,
    createdById,
    metadata: { reverses: original.id },
    postings: original.entries.map((e) => ({
      account: {
        key: e.account.key,
        kind: e.account.kind,
        name: e.account.name,
        ownerType: e.account.ownerType ?? undefined,
        ownerId: e.account.ownerId ?? undefined,
        allowNegative: true,
      },
      amount: -e.amount,
    })),
  }).then(async (result) => {
    if (!result.duplicate) {
      await tx.ledgerTransaction.update({ where: { id: result.id }, data: { reversesId: original.id } })
    }
    return result
  })
}

/** Create the account on first use. */
export async function accountId(tx: Tx, account: AccountRef): Promise<string> {
  await tx.$executeRaw`
    INSERT INTO ledger_accounts (id, key, kind, name, owner_type, owner_id, balance, allow_negative, created_at)
    VALUES (${randomUUID()}, ${account.key}, ${account.kind}::"LedgerAccountKind", ${account.name},
            ${account.ownerType ?? null}, ${account.ownerId ?? null}, 0, ${account.allowNegative ?? false}, now())
    ON CONFLICT (key) DO NOTHING`
  const row = await tx.ledgerAccount.findUniqueOrThrow({ where: { key: account.key }, select: { id: true } })
  return row.id
}

/** The balance as people read it (positive = holds money). Zero for an unused account. */
export async function balanceOf(client: Tx | typeof db, account: AccountRef): Promise<Xaf> {
  const row = await client.ledgerAccount.findUnique({ where: { key: account.key } })
  return row ? displayBalance(row.kind, row.balance) : 0n
}

/** Lock an account row for the rest of the transaction (creating it if needed). */
export async function lockAccount(tx: Tx, account: AccountRef): Promise<Xaf> {
  const id = await accountId(tx, account)
  const rows = await tx.$queryRaw<{ balance: bigint; kind: LedgerAccountKind }[]>`
    SELECT balance, kind FROM ledger_accounts WHERE id = ${id} FOR UPDATE`
  return displayBalance(rows[0].kind, rows[0].balance)
}

/** Entries of one account, newest first, for statements. */
export async function statementOf(client: Tx | typeof db, account: AccountRef, take = 100) {
  const row = await client.ledgerAccount.findUnique({ where: { key: account.key } })
  if (!row) return []
  const entries = await client.ledgerEntry.findMany({
    where: { accountId: row.id },
    include: { transaction: true },
    orderBy: { createdAt: 'desc' },
    take,
  })
  return entries.map((e) => ({
    id: e.id,
    at: e.transaction.occurredAt,
    type: e.transaction.type,
    description: e.transaction.description,
    reference: e.transaction.reference,
    amount: displayBalance(row.kind, e.amount),
    balanceAfter: displayBalance(row.kind, e.balanceAfter),
  }))
}

/**
 * The books balance when debits equal credits overall. Returns the difference (0 when
 * healthy) and any account whose stored balance disagrees with its entries.
 */
export async function checkLedger(client: Tx | typeof db = db) {
  const [{ total }] = await client.$queryRaw<{ total: bigint | null }[]>`SELECT sum(balance)::bigint AS total FROM ledger_accounts`
  const drift = await client.$queryRaw<{ key: string; balance: bigint; entries: bigint }[]>`
    SELECT a.key, a.balance, coalesce(sum(e.amount), 0)::bigint AS entries
      FROM ledger_accounts a LEFT JOIN ledger_entries e ON e.account_id = a.id
     GROUP BY a.id HAVING a.balance <> coalesce(sum(e.amount), 0)`
  return { imbalance: total ?? 0n, drift }
}

export function describeAmount(amount: Xaf) {
  return formatXaf(amount)
}
