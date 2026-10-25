/** The provider definitively refused; nothing was or will be moved. */
export class CamsolRejectedError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
  }
}

/** Outcome unknown (network, timeout, 5xx). Retry or re-check; never assume failure. */
export class CamsolUnavailableError extends Error {}

export type CollectionState = 'PENDING' | 'SUCCEEDED' | 'FAILED'
export type PayoutState = 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'REVIEW'
export type MobileProvider = 'MTN' | 'ORANGE'

export interface CollectionRequest {
  reference: string
  amount: bigint
  /** 237XXXXXXXXX */
  phone: string
  description: string
}

export interface CollectionResult {
  state: CollectionState
  providerStatus: string
  failureReason?: string
  /** PayWithCAMSOL's own id for the payment (its refillId); status checks use it */
  providerReference?: string
}

export interface PayoutRequest {
  /** Sent as Idempotency-Key: repeating a payout with it returns the original one */
  idempotencyKey: string
  clientReference: string
  amount: bigint
  phone: string
  provider: MobileProvider
  recipientName?: string
  description: string
}

export interface PayoutResult {
  reference: string
  state: PayoutState
  failureReason?: string
}

/**
 * PayWithCAMSOL. Collections take Mobile Money in through /api/v1/balance/refill (the call
 * that sends the prompt to the payer's phone); payouts send it out through the signed
 * /api/v1/payouts API.
 */
export interface CamsolGateway {
  readonly mode: 'fake' | 'live'
  startCollection(request: CollectionRequest): Promise<CollectionResult>
  /** By PayWithCAMSOL's id from startCollection; null when it has no such payment */
  getCollection(providerReference: string): Promise<CollectionResult | null>
  sendPayout(request: PayoutRequest): Promise<PayoutResult>
  getPayout(reference: string): Promise<PayoutResult | null>
  /** True when the webhook body carries a valid PayWithCAMSOL signature */
  verifyWebhook(rawBody: Buffer, signature: string | undefined): boolean | Promise<boolean>
}
