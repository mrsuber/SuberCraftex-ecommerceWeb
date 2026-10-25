import { CollectionPurpose, PaymentCollection, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import { Accounts, credit, debit, post, Posting, Tx } from '@/lib/ledger'
import { MIN_MOBILE_MONEY_AMOUNT, mobileProviderOf, MoneyInputError, normalizeCameroonPhone, Xaf } from '@/lib/money'
import { camsolForCollection, camsolRequired, CamsolRejectedError, CamsolUnavailableError, CollectionResult } from './camsol'

/**
 * Mobile Money payments coming in, whatever they are for.
 *
 * 1. start: a PaymentCollection row (pending) is saved, then PayWithCAMSOL sends the prompt
 *    to the payer's phone and gives back its refillId.
 * 2. refresh: the page polling, the webhook and the scheduler all ask PayWithCAMSOL for the
 *    status. Processing or Completed means paid.
 * 3. apply: once paid, in one transaction, the collection is marked paid, the money is
 *    posted to the ledger and the purpose handler does its work (mark an order paid, credit
 *    an investor). The row is locked first, so the three paths can never apply it twice.
 * 4. expire: a payment not approved in time expires and its handler releases what it held.
 *    Expired payments are checked again for a day, so a late approval is never lost.
 */

export interface CollectionHandler {
  /** Ledger lines crediting where the money goes (the PayWithCAMSOL debit is added) */
  credits(tx: Tx, collection: PaymentCollection): Promise<Posting[]>
  /** Do the business change. `late` = the payment arrived after it had expired. */
  onPaid(tx: Tx, collection: PaymentCollection, late: boolean): Promise<void>
  onFailed?(tx: Tx, collection: PaymentCollection): Promise<void>
  /** After the payment is saved: emails and other things that must not roll it back */
  afterPaid?(collection: PaymentCollection): Promise<void>
  onExpired?(tx: Tx, collection: PaymentCollection): Promise<void>
}

const handlers = new Map<CollectionPurpose, CollectionHandler>()

export function registerCollectionHandler(purpose: CollectionPurpose, handler: CollectionHandler) {
  handlers.set(purpose, handler)
}

function handlerFor(purpose: CollectionPurpose): CollectionHandler {
  const handler = handlers.get(purpose)
  if (!handler) throw new Error(`No payment handler for ${purpose}`)
  return handler
}

export class CollectionError extends Error {}

export interface StartCollectionInput {
  purpose: CollectionPurpose
  targetId: string
  userId?: string | null
  amount: Xaf
  phone: string
  description: string
  /** How long the payer has to approve before it expires */
  expiresInMinutes?: number
  metadata?: Record<string, unknown>
}

const DEFAULT_EXPIRY_MINUTES = 15
/** Expired payments are re-checked this long, in case the payer approved late */
const LATE_CHECK_HOURS = 24
/** The page may poll often; PayWithCAMSOL is asked at most this often per payment */
const MIN_CHECK_INTERVAL_MS = 4000

export async function startCollection(input: StartCollectionInput): Promise<PaymentCollection> {
  if (input.amount < MIN_MOBILE_MONEY_AMOUNT) {
    throw new MoneyInputError(`Mobile Money payments start at ${MIN_MOBILE_MONEY_AMOUNT} FCFA`)
  }
  const phone = normalizeCameroonPhone(input.phone)
  // One payment at a time for the same thing: an older prompt still waiting is replaced
  await db.paymentCollection.updateMany({
    where: { purpose: input.purpose, targetId: input.targetId, status: 'pending', providerReference: null },
    data: { status: 'failed', failureReason: 'Replaced by a new payment attempt' },
  })
  const collection = await db.paymentCollection.create({
    data: {
      reference: `SCX-${randomUUID()}`,
      purpose: input.purpose,
      targetId: input.targetId,
      userId: input.userId ?? null,
      amount: input.amount,
      phone,
      provider: mobileProviderOf(phone),
      expiresAt: new Date(Date.now() + (input.expiresInMinutes ?? DEFAULT_EXPIRY_MINUTES) * 60_000),
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
  })

  try {
    const gateway = await camsolForCollection()
    const result = await gateway.startCollection({
      reference: collection.reference,
      amount: input.amount,
      phone,
      description: input.description,
    })
    const updated = await db.paymentCollection.update({
      where: { id: collection.id },
      data: {
        providerReference: result.providerReference ?? null,
        providerStatus: result.providerStatus,
        metadata: { ...(input.metadata ?? {}), simulated: gateway.mode === 'fake' } as Prisma.InputJsonValue,
      },
    })
    if (result.state === 'FAILED') return applyResult(updated.id, result)
    return updated
  } catch (error) {
    if (error instanceof CamsolRejectedError) {
      // Nothing was sent: fail cleanly so the payer can try again or choose cash
      await db.paymentCollection.update({
        where: { id: collection.id },
        data: { status: 'failed', failureReason: error.message, completedAt: new Date() },
      })
      throw new CollectionError(error.message)
    }
    if (error instanceof CamsolUnavailableError) {
      // We cannot know whether the prompt went out. Keep it pending; an admin can match it
      // against the PayWithCAMSOL dashboard. It expires like any other.
      await db.paymentCollection.update({
        where: { id: collection.id },
        data: { metadata: { ...(input.metadata ?? {}), startUncertain: true } as Prisma.InputJsonValue },
      })
      throw new CollectionError('PayWithCAMSOL did not answer. If you received a payment prompt, approve it; otherwise try again in a minute.')
    }
    throw error
  }
}

/** Ask PayWithCAMSOL for the status and apply it. Safe to call from anywhere, any number of times. */
export async function refreshCollection(reference: string, options: { force?: boolean } = {}): Promise<PaymentCollection> {
  const collection = await db.paymentCollection.findUnique({ where: { reference } })
  if (!collection) throw new CollectionError('Payment not found')
  const lateWindow =
    collection.status === 'expired' && !!collection.expiresAt && collection.expiresAt.getTime() > Date.now() - LATE_CHECK_HOURS * 3600_000
  if (collection.status !== 'pending' && !lateWindow) return collection
  if (!collection.providerReference) return maybeExpire(collection)
  if (!options.force && collection.lastCheckedAt && Date.now() - collection.lastCheckedAt.getTime() < MIN_CHECK_INTERVAL_MS) {
    return collection
  }
  await db.paymentCollection.update({ where: { id: collection.id }, data: { lastCheckedAt: new Date() } })
  let result: CollectionResult | null
  try {
    result = await (await camsolRequired()).getCollection(collection.providerReference)
  } catch (error) {
    if (error instanceof CamsolUnavailableError) return collection
    throw error
  }
  if (!result) return maybeExpire(collection)
  if (result.state === 'PENDING') {
    if (result.providerStatus !== collection.providerStatus) {
      await db.paymentCollection.update({ where: { id: collection.id }, data: { providerStatus: result.providerStatus } })
    }
    return maybeExpire(collection)
  }
  return applyResult(collection.id, result)
}

async function maybeExpire(collection: PaymentCollection): Promise<PaymentCollection> {
  if (collection.status !== 'pending' || !collection.expiresAt || collection.expiresAt > new Date()) return collection
  return db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM payment_collections WHERE id = ${collection.id} FOR UPDATE`
    const fresh = await tx.paymentCollection.findUniqueOrThrow({ where: { id: collection.id } })
    if (fresh.status !== 'pending') return fresh
    const expired = await tx.paymentCollection.update({
      where: { id: fresh.id },
      data: { status: 'expired', failureReason: fresh.failureReason ?? 'Not approved in time' },
    })
    await handlerFor(fresh.purpose).onExpired?.(tx, expired)
    return expired
  })
}

/**
 * Apply a final answer from PayWithCAMSOL. The row lock makes this the only place a payment
 * is ever counted, and the ledger reference collection:<id> makes double counting impossible.
 */
export async function applyResult(collectionId: string, result: CollectionResult): Promise<PaymentCollection> {
  let newlyPaid = false
  const applied = await db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM payment_collections WHERE id = ${collectionId} FOR UPDATE`
    const collection = await tx.paymentCollection.findUniqueOrThrow({ where: { id: collectionId } })
    const late = collection.status === 'expired'
    if (collection.status !== 'pending' && !late) return collection
    const handler = handlerFor(collection.purpose)

    if (result.state === 'FAILED') {
      if (late) return collection
      const failed = await tx.paymentCollection.update({
        where: { id: collection.id },
        data: {
          status: 'failed',
          providerStatus: result.providerStatus,
          failureReason: result.failureReason ?? 'The payment was declined',
          completedAt: new Date(),
        },
      })
      await handler.onFailed?.(tx, failed)
      return failed
    }
    if (result.state !== 'SUCCEEDED') return collection

    const paid = await tx.paymentCollection.update({
      where: { id: collection.id },
      data: { status: 'succeeded', providerStatus: result.providerStatus, failureReason: null, completedAt: new Date() },
    })
    const credits = await handler.credits(tx, paid)
    await post(tx, {
      type: `collection:${paid.purpose}`,
      reference: `collection:${paid.id}`,
      description: `Mobile Money ${paid.purpose.replace('_', ' ')} from ${paid.phone}`,
      metadata: { collectionId: paid.id, reference: paid.reference, providerReference: paid.providerReference, late },
      postings: [debit(Accounts.camsol(), paid.amount), ...credits],
    })
    await handler.onPaid(tx, paid, late)
    newlyPaid = true
    return paid
  })
  if (newlyPaid) {
    try {
      await handlerFor(applied.purpose).afterPaid?.(applied)
    } catch (error) {
      console.warn(`[payments] after-payment step for ${applied.reference} failed: ${(error as Error).message}`)
    }
  }
  return applied
}

/** For the scheduler: re-check pending payments, expire old ones, look again at late ones. */
export async function sweepCollections(limit = 50) {
  const since = new Date(Date.now() - LATE_CHECK_HOURS * 3600_000)
  const due = await db.paymentCollection.findMany({
    where: {
      OR: [
        { status: 'pending' },
        { status: 'expired', expiresAt: { gte: since }, providerReference: { not: null } },
      ],
    },
    orderBy: { lastCheckedAt: { sort: 'asc', nulls: 'first' } },
    take: limit,
  })
  let checked = 0
  for (const collection of due) {
    try {
      await refreshCollection(collection.reference, { force: true })
      checked += 1
    } catch (error) {
      console.warn(`[payments] refresh of ${collection.reference} failed: ${(error as Error).message}`)
    }
  }
  return { checked }
}

/** A payment as the payer's page sees it. */
export function publicCollection(c: PaymentCollection) {
  return {
    reference: c.reference,
    purpose: c.purpose,
    status: c.status,
    amount: Number(c.amount),
    phone: c.phone,
    provider: c.provider,
    failureReason: c.failureReason,
    expiresAt: c.expiresAt,
    completedAt: c.completedAt,
  }
}

/** Standard credits for a sale: everything goes to one income account. */
export function incomeCredit(account: Parameters<typeof credit>[0], amount: Xaf): Posting[] {
  return [credit(account, amount)]
}
