import {
  CamsolGateway,
  CollectionRequest,
  CollectionResult,
  PayoutRequest,
  PayoutResult,
} from './types'

type FakeCollection = CollectionResult & { request: CollectionRequest; startedAt: number }

/**
 * Stand-in for PayWithCAMSOL, used in development without keys and in tests. No money moves.
 * Collections stay PENDING until confirmCollection / failCollection; with autoConfirmMs
 * (development) they settle by themselves: 237600000001 is declined, any other succeeds.
 * Payouts settle on first check: 237600000001 fails, 237600000002 goes to review.
 */
export class FakeCamsolGateway implements CamsolGateway {
  readonly mode = 'fake' as const
  readonly collections = new Map<string, FakeCollection>()
  readonly payouts = new Map<string, PayoutResult & { request: PayoutRequest }>()
  private readonly payoutsByKey = new Map<string, string>()
  private counter = 0
  /** Set to make the next call throw, e.g. to simulate outages */
  nextError: Error | null = null

  constructor(public options: { autoConfirmMs?: number } = {}) {}

  private maybeThrow() {
    if (this.nextError) {
      const error = this.nextError
      this.nextError = null
      throw error
    }
  }

  async startCollection(request: CollectionRequest): Promise<CollectionResult> {
    this.maybeThrow()
    this.counter += 1
    const id = `FAKE_REFILL_${this.counter}_${request.reference}`
    this.collections.set(id, { state: 'PENDING', providerStatus: 'Pending', request, startedAt: Date.now() })
    return { state: 'PENDING', providerStatus: 'Pending', providerReference: id }
  }

  async getCollection(providerReference: string): Promise<CollectionResult | null> {
    this.maybeThrow()
    const found = this.collections.get(providerReference)
    const { autoConfirmMs } = this.options
    if (found?.state === 'PENDING' && autoConfirmMs !== undefined && Date.now() - found.startedAt >= autoConfirmMs) {
      if (found.request.phone === '237600000001') this.failCollection(providerReference)
      else this.confirmCollection(providerReference)
    }
    return found
      ? { state: found.state, providerStatus: found.providerStatus, failureReason: found.failureReason, providerReference }
      : null
  }

  /** The fake collection started for one of our references */
  findByReference(reference: string): string | undefined {
    for (const [id, c] of this.collections) if (c.request.reference === reference) return id
    return undefined
  }

  confirmCollection(providerReference: string, word = 'Processing') {
    const found = this.collections.get(providerReference)
    if (!found) throw new Error(`No fake collection ${providerReference}`)
    Object.assign(found, { state: 'SUCCEEDED', providerStatus: word })
  }

  failCollection(providerReference: string, reason = 'Customer declined') {
    const found = this.collections.get(providerReference)
    if (!found) throw new Error(`No fake collection ${providerReference}`)
    Object.assign(found, { state: 'FAILED', providerStatus: 'Failed', failureReason: reason })
  }

  async sendPayout(request: PayoutRequest): Promise<PayoutResult> {
    this.maybeThrow()
    const existing = this.payoutsByKey.get(request.idempotencyKey)
    if (existing) return this.view(existing)
    this.counter += 1
    const reference = `PO_FAKE_${this.counter}`
    this.payoutsByKey.set(request.idempotencyKey, reference)
    this.payouts.set(reference, { reference, state: 'PROCESSING', request })
    return this.view(reference)
  }

  async getPayout(reference: string): Promise<PayoutResult | null> {
    this.maybeThrow()
    const found = this.payouts.get(reference)
    if (!found) return null
    if (found.state === 'PROCESSING') {
      if (found.request.phone === '237600000001') Object.assign(found, { state: 'FAILED', failureReason: 'TEST: rejected' })
      else if (found.request.phone === '237600000002') Object.assign(found, { state: 'REVIEW' })
      else found.state = 'SUCCEEDED'
    }
    return this.view(reference)
  }

  private view(reference: string): PayoutResult {
    const found = this.payouts.get(reference) as PayoutResult
    return { reference: found.reference, state: found.state, failureReason: found.failureReason }
  }

  verifyWebhook(): boolean {
    return true
  }

  reset() {
    this.collections.clear()
    this.payouts.clear()
    this.payoutsByKey.clear()
    this.nextError = null
  }
}
