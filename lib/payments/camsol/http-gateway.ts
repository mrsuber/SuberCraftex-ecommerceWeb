import { createHash, createHmac, timingSafeEqual } from 'crypto'
import {
  CamsolGateway,
  CamsolRejectedError,
  CamsolUnavailableError,
  CollectionRequest,
  CollectionResult,
  CollectionState,
  PayoutRequest,
  PayoutResult,
  PayoutState,
} from './types'
import { parseKeepingNumberSource, pythonDumpsSorted } from './python-json'

export interface CamsolConfig {
  baseUrl: string // https://paywithcamsol.com
  secretKey: string // sk_test_ / sk_live_ (collections)
  payoutKeyId: string // pok_...
  payoutSecret: string // psk_...
  webhookSecret?: string
}

export type KeyCheck = 'ok' | 'refused' | 'unreachable' | 'missing'

const TIMEOUT_MS = 30_000

/**
 * PayWithCAMSOL's words for a payment, as its refill API reports them (any case).
 * Initialized and Pending wait for the payer to approve on their phone. Processing means
 * the money has left the payer's account and sits with PayWithCAMSOL, so it counts as paid:
 * PayWithCAMSOL keeps it "pending" on its side until it processes it.
 */
export function collectionState(status: unknown): CollectionState {
  const word = String(status ?? '').trim().toUpperCase()
  if (['PROCESSING', 'COMPLETED', 'SUCCESS', 'SUCCESSFUL', 'SUCCEEDED'].includes(word)) return 'SUCCEEDED'
  if (['FAILED', 'FAILURE', 'CANCELLED', 'CANCELED', 'REJECTED', 'EXPIRED'].includes(word)) return 'FAILED'
  return 'PENDING'
}

const PAYOUT_STATES: Record<string, PayoutState> = {
  PENDING: 'PROCESSING',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCEEDED',
  SUCCEEDED: 'SUCCEEDED',
  COMPLETED: 'SUCCEEDED',
  FAILED: 'FAILED',
  REVIEW: 'REVIEW',
}

export class HttpCamsolGateway implements CamsolGateway {
  readonly mode = 'live' as const
  private readonly baseUrl: string

  constructor(private readonly config: CamsolConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
  }

  // ---------------------------------------------------------------- collections

  /**
   * Send the Mobile Money prompt to the payer's phone, exactly as the working SuberFood and
   * ProFundra integrations do: POST /api/v1/balance/refill with X-API-Key and
   * { amount, accountNumber }. PayWithCAMSOL answers with its own id (refillId).
   */
  async startCollection(request: CollectionRequest): Promise<CollectionResult> {
    const response = await this.call('POST', '/api/v1/balance/refill', JSON.stringify({
      amount: Number(request.amount),
      accountNumber: request.phone,
    }), { 'X-API-Key': this.config.secretKey })
    const data = (response.data ?? response) as Record<string, any>
    if (response.success === false) {
      const reason = data.failureReason ?? response.message ?? 'PayWithCAMSOL refused the payment'
      console.warn(`[camsol] payment ${request.reference} refused: ${reason}`)
      throw new CamsolRejectedError(String(reason))
    }
    const refillId = data.refillId ?? data.id ?? data.reference
    if (!refillId) {
      console.error(`[camsol] payment ${request.reference}: no payment id in ${JSON.stringify(response).slice(0, 500)}`)
      throw new CamsolRejectedError('PayWithCAMSOL did not return a payment id')
    }
    const status = data.status ?? data.refillState ?? 'Pending'
    console.log(`[camsol] payment ${request.reference} sent as ${refillId} (${status})`)
    return {
      // A brand-new payment is never paid yet, whatever the first word says
      state: collectionState(status) === 'FAILED' ? 'FAILED' : 'PENDING',
      providerStatus: String(status),
      failureReason: data.failureReason ?? undefined,
      providerReference: String(refillId),
    }
  }

  async getCollection(providerReference: string): Promise<CollectionResult | null> {
    try {
      const response = await this.call(
        'GET',
        `/api/v1/balance/refill/${encodeURIComponent(providerReference)}/status`,
        undefined,
        { 'X-API-Key': this.config.secretKey }
      )
      const data = (response.data ?? response) as Record<string, any>
      const status = data.status ?? data.refillState ?? response.status
      return {
        state: collectionState(status),
        providerStatus: String(status),
        failureReason: data.failureReason ?? data.failure_reason ?? undefined,
        providerReference,
      }
    } catch (error) {
      if (error instanceof CamsolRejectedError && error.status === 404) return null
      throw error
    }
  }

  // -------------------------------------------------------------------- payouts

  async sendPayout(request: PayoutRequest): Promise<PayoutResult> {
    const body = JSON.stringify({
      amount: Number(request.amount),
      currency: 'XAF',
      provider: request.provider,
      recipient_phone: request.phone,
      recipient_name: request.recipientName,
      description: request.description.slice(0, 255),
      client_reference: request.clientReference,
    })
    const data = await this.signedCall('POST', '/api/v1/payouts', body, request.idempotencyKey)
    return this.toPayoutResult(data.data ?? data)
  }

  async getPayout(reference: string): Promise<PayoutResult | null> {
    try {
      const data = await this.signedCall('GET', `/api/v1/payouts/${encodeURIComponent(reference)}`)
      return this.toPayoutResult(data.data ?? data)
    } catch (error) {
      if (error instanceof CamsolRejectedError && error.status === 404) return null
      throw error
    }
  }

  private toPayoutResult(payout: Record<string, unknown>): PayoutResult {
    return {
      reference: String(payout.reference),
      state: PAYOUT_STATES[String(payout.status).toUpperCase()] ?? 'PROCESSING',
      failureReason: (payout.failure_reason as string) ?? undefined,
    }
  }

  // ------------------------------------------------------------------- webhooks

  /**
   * HMAC-SHA256 of the body with the webhook secret, as hex. The signature covers the raw
   * body or, as PayWithCAMSOL's Python server builds it, the body re-encoded with sorted keys
   * (json.dumps(sort_keys=True)). Either one matching is accepted.
   */
  verifyWebhook(rawBody: Buffer, signature: string | undefined): boolean {
    if (!this.config.webhookSecret || !signature) return false
    const given = Buffer.from(signature.trim().replace(/^sha256=/, ''))
    const matches = (payload: string | Buffer) => {
      const expected = Buffer.from(
        createHmac('sha256', this.config.webhookSecret as string).update(payload).digest('hex')
      )
      return expected.length === given.length && timingSafeEqual(expected, given)
    }
    if (matches(rawBody)) return true
    try {
      return matches(pythonDumpsSorted(parseKeepingNumberSource(rawBody.toString('utf8'))))
    } catch {
      return false
    }
  }

  // -------------------------------------------------------------------- balance

  /**
   * The organisation's balance at PayWithCAMSOL: the live balance with a live key, the demo
   * balance with a test key. Payouts are paid from it, so it must cover what is approved.
   */
  async getBalance(): Promise<{ balance: number; type: string; currency: string } | null> {
    try {
      const response = await this.call('GET', '/api/v1/balance', undefined, { 'X-API-Key': this.config.secretKey })
      const data = (response.data ?? response) as Record<string, any>
      const balance = Number(data.balance ?? data.live_balance ?? data.available_balance)
      if (!Number.isFinite(balance)) return null
      return { balance, type: String(data.balance_type ?? 'live'), currency: String(data.currency ?? 'XAF') }
    } catch {
      return null
    }
  }

  // ------------------------------------------------------------------ key check

  /**
   * Ask about a payment and a payout that do not exist: "not found" means the key was
   * accepted, 401/403 that it was refused. Nothing is created or moved.
   */
  async checkKeys(): Promise<{ collections: KeyCheck; payouts: KeyCheck }> {
    const probe = `subercraftex-key-check-${Date.now()}`
    const outcome = async (request: () => Promise<unknown>): Promise<KeyCheck> => {
      try {
        await request()
        return 'ok'
      } catch (error) {
        if (error instanceof CamsolRejectedError) {
          if (error.status === 401 || error.status === 403) return 'refused'
          return 'ok'
        }
        return 'unreachable'
      }
    }
    const collections = await outcome(() =>
      this.call('GET', `/api/v1/balance/refill/${probe}/status`, undefined, { 'X-API-Key': this.config.secretKey })
    )
    const payouts = this.hasPayoutKeys()
      ? await outcome(() => this.signedCall('GET', `/api/v1/payouts/${probe}`))
      : 'missing'
    return { collections, payouts }
  }

  hasPayoutKeys() {
    return !!this.config.payoutKeyId && !!this.config.payoutSecret
  }

  // ----------------------------------------------------------------------- http

  private async signedCall(method: 'GET' | 'POST', path: string, body?: string, idempotencyKey?: string) {
    if (!this.hasPayoutKeys()) {
      // Payouts wait (and are retried) until an admin adds the payout keys
      throw new CamsolUnavailableError('Payout keys are not set up yet (Admin → Settings → Payments)')
    }
    const raw = body ?? ''
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const bodyHash = createHash('sha256').update(raw).digest('hex')
    const signature =
      'v1=' +
      createHmac('sha256', this.config.payoutSecret).update([timestamp, method, path, bodyHash].join('\n')).digest('hex')
    const headers: Record<string, string> = {
      'X-Payout-Key-Id': this.config.payoutKeyId,
      'X-Payout-Timestamp': timestamp,
      'X-Payout-Signature': signature,
    }
    if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey
    // Send exactly the bytes that were signed
    return this.call(method, path, raw || undefined, headers)
  }

  private async call(
    method: 'GET' | 'POST',
    path: string,
    body: string | undefined,
    headers: Record<string, string>
  ): Promise<Record<string, any>> {
    let response: Response
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method,
        body,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: 'no-store',
      })
    } catch (error) {
      console.error(`[camsol] ${method} ${path} unreachable: ${(error as Error).message}`)
      throw new CamsolUnavailableError('PayWithCAMSOL could not be reached')
    }
    const text = await response.text()
    let data: Record<string, any> = {}
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      data = { message: text.slice(0, 300) }
    }
    if (response.ok) return data
    const status = response.status
    const detail = data.error ?? data.message ?? response.statusText
    if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
      console.warn(`[camsol] ${method} ${path} rejected (${status}): ${detail}`)
      throw new CamsolRejectedError(`PayWithCAMSOL rejected the request (${status}): ${detail}`, status)
    }
    console.error(`[camsol] ${method} ${path} unavailable (${status}): ${detail}`)
    throw new CamsolUnavailableError(`PayWithCAMSOL unavailable (${status})`)
  }
}
