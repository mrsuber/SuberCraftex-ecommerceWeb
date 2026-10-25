import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'
import { db } from '@/lib/db'
import { CamsolConfig } from './http-gateway'

/*
 * PayWithCAMSOL keys pasted by a super admin in Admin → Settings → Payments. They are kept in
 * app_settings, encrypted (AES-256-GCM) with a key derived from SETTINGS_ENCRYPTION_KEY (or
 * JWT_SECRET), and never sent back to the browser: admins only see the last 4 characters.
 * Saved keys take effect at once, without a restart, and win over CAMSOL_* variables.
 */

const KEY = 'secret:camsol'
const CACHE_MS = 15_000
export const DEFAULT_BASE_URL = 'https://paywithcamsol.com'

export class CamsolSettingsError extends Error {}

export type SecretField = 'secretKey' | 'payoutKeyId' | 'payoutSecret' | 'webhookSecret'
export const SECRET_FIELDS: SecretField[] = ['secretKey', 'payoutKeyId', 'payoutSecret', 'webhookSecret']

export type CamsolKeysInput = Partial<Record<SecretField, string>> & { baseUrl?: string }

interface StoredKeys {
  baseUrl?: string
  keys: Partial<Record<SecretField, string>>
}

// Payout keys may or may not carry the test/live mode in their name, so only the prefix is checked
const PREFIXES: Record<Exclude<SecretField, 'webhookSecret'>, { pattern: RegExp; prefix: string }> = {
  secretKey: { pattern: /^sk_(test|live)_[A-Za-z0-9_-]+$/, prefix: 'sk_test_ or sk_live_' },
  payoutKeyId: { pattern: /^pok_[A-Za-z0-9_-]+$/, prefix: 'pok_' },
  payoutSecret: { pattern: /^psk_[A-Za-z0-9_-]+$/, prefix: 'psk_' },
}

export const KEY_LABELS: Record<SecretField, string> = {
  secretKey: 'Secret key',
  payoutKeyId: 'Payout key ID',
  payoutSecret: 'Payout secret',
  webhookSecret: 'Webhook secret',
}

/** Pasted keys often carry spaces, line breaks, quotes or invisible characters; drop them. */
export function cleanKey(value?: string): string {
  return (value ?? '')
    .replace(/[​-‍﻿ ]/g, '')
    .trim()
    .replace(/^["'`]+|["'`]+$/g, '')
    .replace(/[\r\n]+/g, '')
    .trim()
}

export type CamsolSource = 'settings' | 'environment' | 'simulated' | 'none'

export interface CamsolStatus {
  source: CamsolSource
  environment: 'test' | 'live' | null
  canCollect: boolean
  canPayOut: boolean
  verifiesWebhooks: boolean
  baseUrl: string
  webhookUrl: string
  saved: Record<SecretField, string | null>
  updatedAt: Date | null
}

const environmentOf = (key?: string) => (key?.match(/_(test|live)_/)?.[1] as 'test' | 'live') ?? null
// Short secrets are not hinted at all, so the hint never gives most of one away
const hint = (value?: string) => (value ? (value.length >= 12 ? `…${value.slice(-4)}` : 'saved') : null)

let cache: { value: CamsolConfig | null; at: number } | null = null

export function clearCamsolCache() {
  cache = null
}

function envBaseUrl() {
  return process.env.CAMSOL_BASE_URL || DEFAULT_BASE_URL
}

/** The public address PayWithCAMSOL posts webhooks to. Must be HTTPS and public, never localhost. */
export function webhookUrl() {
  const base = (process.env.NEXT_PUBLIC_APP_URL || 'https://subercraftex.com').replace(/\/$/, '')
  return `${base}/api/webhooks/camsol`
}

function cipherKey(): Buffer {
  const secret = process.env.SETTINGS_ENCRYPTION_KEY || process.env.JWT_SECRET
  if (!secret) throw new CamsolSettingsError('The server has no SETTINGS_ENCRYPTION_KEY to protect payment keys with')
  return createHash('sha256').update(`subercraftex-settings:${secret}`).digest()
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', cipherKey(), iv)
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  return ['v1', iv, cipher.getAuthTag(), data].map((p) => (typeof p === 'string' ? p : p.toString('base64'))).join('.')
}

export function decryptSecret(sealed: string): string | undefined {
  try {
    const [, iv, tag, data] = sealed.split('.').map((part) => Buffer.from(part, 'base64'))
    const decipher = createDecipheriv('aes-256-gcm', cipherKey(), iv)
    decipher.setAuthTag(tag)
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
  } catch {
    // The encryption secret changed: the key must be pasted again
    return undefined
  }
}

async function read(): Promise<{ stored: StoredKeys | null; updatedAt: Date | null }> {
  const row = await db.appSetting.findUnique({ where: { key: KEY } })
  if (!row) return { stored: null, updatedAt: null }
  try {
    const value = JSON.parse(row.value) as StoredKeys
    return { stored: value && typeof value === 'object' && value.keys ? value : null, updatedAt: row.updatedAt }
  } catch {
    return { stored: null, updatedAt: row.updatedAt }
  }
}

function decryptAll(stored: StoredKeys | null): Partial<Record<SecretField, string>> {
  const keys: Partial<Record<SecretField, string>> = {}
  if (!stored) return keys
  for (const field of SECRET_FIELDS) {
    const sealed = stored.keys[field]
    if (sealed) {
      const plain = decryptSecret(sealed)
      if (plain) keys[field] = plain
    }
  }
  return keys
}

/** Keys saved in the admin dashboard, or null when none are saved. */
export async function savedCamsolConfig(): Promise<CamsolConfig | null> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.value
  const { stored } = await read()
  const keys = decryptAll(stored)
  const value = keys.secretKey
    ? {
        baseUrl: stored?.baseUrl || envBaseUrl(),
        secretKey: keys.secretKey,
        payoutKeyId: keys.payoutKeyId ?? '',
        payoutSecret: keys.payoutSecret ?? '',
        webhookSecret: keys.webhookSecret,
      }
    : null
  cache = { value, at: Date.now() }
  return value
}

/** Keys from CAMSOL_* environment variables, used only when CAMSOL_MODE=live. */
export function environmentCamsolConfig(): CamsolConfig | null {
  const secretKey = process.env.CAMSOL_SECRET_KEY
  if (process.env.CAMSOL_MODE !== 'live' || !secretKey) return null
  return {
    baseUrl: envBaseUrl(),
    secretKey,
    payoutKeyId: process.env.CAMSOL_PAYOUT_KEY_ID ?? '',
    payoutSecret: process.env.CAMSOL_PAYOUT_SECRET ?? '',
    webhookSecret: process.env.CAMSOL_WEBHOOK_SECRET,
  }
}

/** Development without keys uses simulated payments; production never does. */
export function simulatedPaymentsAllowed(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.CAMSOL_MODE !== 'live'
}

export async function camsolStatus(): Promise<CamsolStatus> {
  const { stored, updatedAt } = await read()
  const keys = decryptAll(stored)
  const saved = await savedCamsolConfig()
  const active = saved ?? environmentCamsolConfig()
  const source: CamsolSource = saved ? 'settings' : active ? 'environment' : simulatedPaymentsAllowed() ? 'simulated' : 'none'
  return {
    source,
    environment: environmentOf(active?.secretKey),
    canCollect: !!active?.secretKey || source === 'simulated',
    canPayOut: (!!active?.payoutKeyId && !!active?.payoutSecret) || source === 'simulated',
    verifiesWebhooks: !!active?.webhookSecret,
    baseUrl: active?.baseUrl ?? stored?.baseUrl ?? envBaseUrl(),
    webhookUrl: webhookUrl(),
    saved: {
      secretKey: hint(keys.secretKey),
      payoutKeyId: hint(keys.payoutKeyId),
      payoutSecret: hint(keys.payoutSecret),
      webhookSecret: hint(keys.webhookSecret),
    },
    updatedAt,
  }
}

/**
 * Save the keys that were filled in. A field left empty keeps what is saved, so one key can
 * be replaced without pasting the others again. Returns the fields that changed.
 */
export async function saveCamsolKeys(input: CamsolKeysInput): Promise<SecretField[]> {
  const { stored } = await read()
  const base: StoredKeys = stored ?? { keys: {} }
  const current = decryptAll(stored)
  const changed: SecretField[] = []
  for (const field of SECRET_FIELDS) {
    const value = cleanKey(input[field])
    if (!value) continue
    if (value.length > 300) throw new CamsolSettingsError(`${KEY_LABELS[field]} is too long`)
    if (field !== 'webhookSecret' && !PREFIXES[field].pattern.test(value)) {
      const { prefix } = PREFIXES[field]
      throw new CamsolSettingsError(
        /\s/.test(value)
          ? `${KEY_LABELS[field]}: it contains spaces. Copy the key again, on its own`
          : `${KEY_LABELS[field]}: it should start with ${prefix}, but this one starts with "${value.slice(0, 4)}…". Check it is pasted in the right box`
      )
    }
    if (value !== current[field]) changed.push(field)
    current[field] = value
  }
  if (!current.secretKey) throw new CamsolSettingsError('The secret key is required: payments cannot start without it')
  if (!!current.payoutKeyId !== !!current.payoutSecret) {
    throw new CamsolSettingsError('Payouts need both the payout key ID and the payout secret')
  }
  const environments = new Set(
    (['secretKey', 'payoutKeyId', 'payoutSecret'] as const).map((f) => environmentOf(current[f])).filter(Boolean)
  )
  if (environments.size > 1) throw new CamsolSettingsError('Mixing test and live keys: use keys from the same mode')

  let baseUrl = base.baseUrl
  if (input.baseUrl !== undefined) {
    const url = input.baseUrl.trim().replace(/\/$/, '')
    if (url && !/^https:\/\/[^\s/]+$/.test(url) && !/^http:\/\/localhost(:\d+)?$/.test(url)) {
      throw new CamsolSettingsError('The API address must look like https://paywithcamsol.com')
    }
    baseUrl = url || undefined
  }

  const value: StoredKeys = {
    baseUrl,
    keys: Object.fromEntries(
      SECRET_FIELDS.filter((f) => current[f]).map((f) => [f, encryptSecret(current[f] as string)])
    ),
  }
  await db.appSetting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(value), category: 'payment' },
    create: { key: KEY, value: JSON.stringify(value), category: 'payment' },
  })
  clearCamsolCache()
  return changed
}

/** Forget the saved keys; payments fall back to CAMSOL_* variables, if any. */
export async function clearCamsolKeys(): Promise<void> {
  await db.appSetting.deleteMany({ where: { key: KEY } })
  clearCamsolCache()
}
