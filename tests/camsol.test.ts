import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createServer, IncomingMessage, Server } from 'http'
import { AddressInfo } from 'net'
import { createHash, createHmac } from 'crypto'
import { collectionState, HttpCamsolGateway } from '@/lib/payments/camsol/http-gateway'
import { CamsolRejectedError, CamsolUnavailableError } from '@/lib/payments/camsol/types'
import {
  camsolStatus,
  CamsolSettingsError,
  cleanKey,
  decryptSecret,
  encryptSecret,
  saveCamsolKeys,
  savedCamsolConfig,
} from '@/lib/payments/camsol/settings'
import { db } from '@/lib/db'
import { resetDb } from './helpers/db'

interface Seen {
  method: string
  url: string
  headers: IncomingMessage['headers']
  body: string
}

let server: Server
let base = ''
const seen: Seen[] = []
let reply: (req: Seen) => { status: number; body: unknown } = () => ({ status: 200, body: {} })

beforeAll(async () => {
  server = createServer((req, res) => {
    let body = ''
    req.on('data', (c) => (body += c))
    req.on('end', () => {
      const s = { method: req.method!, url: req.url!, headers: req.headers, body }
      seen.push(s)
      const r = reply(s)
      res.writeHead(r.status, { 'content-type': 'application/json' })
      res.end(JSON.stringify(r.body))
    })
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
})
afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())))
beforeEach(() => {
  seen.length = 0
})

const gateway = () =>
  new HttpCamsolGateway({
    baseUrl: base,
    secretKey: 'sk_test_abc',
    payoutKeyId: 'pok_test_1',
    payoutSecret: 'psk_test_secret',
    webhookSecret: 'whsec_test',
  })

describe('PayWithCAMSOL HTTP gateway', () => {
  it('starts a payment with the refill call SuberFood uses', async () => {
    reply = () => ({ status: 201, body: { success: true, data: { refillId: 'R-42', status: 'Pending' } } })
    const result = await gateway().startCollection({ reference: 'SCX-1', amount: 5000n, phone: '237677123456', description: 'Order' })
    expect(result).toMatchObject({ state: 'PENDING', providerReference: 'R-42' })
    expect(seen[0].method).toBe('POST')
    expect(seen[0].url).toBe('/api/v1/balance/refill')
    expect(seen[0].headers['x-api-key']).toBe('sk_test_abc')
    expect(JSON.parse(seen[0].body)).toEqual({ amount: 5000, accountNumber: '237677123456' })
  })

  it('treats Processing and Completed as paid', async () => {
    expect(collectionState('Processing')).toBe('SUCCEEDED')
    expect(collectionState('completed')).toBe('SUCCEEDED')
    expect(collectionState('Pending')).toBe('PENDING')
    expect(collectionState('Initialized')).toBe('PENDING')
    expect(collectionState('Failed')).toBe('FAILED')
    reply = () => ({ status: 200, body: { success: true, data: { refillId: 'R-42', status: 'Processing' } } })
    const status = await gateway().getCollection('R-42')
    expect(seen[0].url).toBe('/api/v1/balance/refill/R-42/status')
    expect(status?.state).toBe('SUCCEEDED')
  })

  it('separates refusals from outages', async () => {
    reply = () => ({ status: 400, body: { message: 'Insufficient balance' } })
    await expect(gateway().startCollection({ reference: 'r', amount: 100n, phone: '237677123456', description: 'x' })).rejects.toBeInstanceOf(CamsolRejectedError)
    reply = () => ({ status: 502, body: {} })
    await expect(gateway().getCollection('R-1')).rejects.toBeInstanceOf(CamsolUnavailableError)
    reply = () => ({ status: 404, body: { message: 'Refill not found' } })
    expect(await gateway().getCollection('R-missing')).toBeNull()
  })

  it('signs payouts over exactly the bytes it sends', async () => {
    reply = () => ({ status: 201, body: { data: { reference: 'PO-1', status: 'PENDING' } } })
    const result = await gateway().sendPayout({
      idempotencyKey: 'payout-1',
      clientReference: 'payout-1',
      amount: 10_000n,
      phone: '237677123456',
      provider: 'MTN',
      description: 'Withdrawal',
    })
    expect(result).toEqual({ reference: 'PO-1', state: 'PROCESSING', failureReason: undefined })
    const req = seen[0]
    expect(req.headers['idempotency-key']).toBe('payout-1')
    const hash = createHash('sha256').update(req.body).digest('hex')
    const expected =
      'v1=' + createHmac('sha256', 'psk_test_secret').update([req.headers['x-payout-timestamp'], 'POST', '/api/v1/payouts', hash].join('\n')).digest('hex')
    expect(req.headers['x-payout-signature']).toBe(expected)
    expect(JSON.parse(req.body)).toMatchObject({ amount: 10000, currency: 'XAF', provider: 'MTN', recipient_phone: '237677123456' })
  })

  it('checks webhook signatures over the raw body or Python-sorted JSON', () => {
    const raw = '{"event_type":"payment.success","data":{"reference":"SCX-1","amount":5000.0,"name":"Élise"}}'
    const sign = (s: string) => createHmac('sha256', 'whsec_test').update(s).digest('hex')
    expect(gateway().verifyWebhook(Buffer.from(raw), sign(raw))).toBe(true)
    const pythonStyle = '{"data": {"amount": 5000.0, "name": "\\u00c9lise", "reference": "SCX-1"}, "event_type": "payment.success"}'
    expect(gateway().verifyWebhook(Buffer.from(raw), sign(pythonStyle))).toBe(true)
    expect(gateway().verifyWebhook(Buffer.from(raw), 'deadbeef')).toBe(false)
    expect(gateway().verifyWebhook(Buffer.from(raw), undefined)).toBe(false)
  })

  it('tests keys without moving money', async () => {
    reply = (req) => ({ status: req.headers['x-api-key'] || req.headers['x-payout-key-id'] ? 404 : 401, body: {} })
    expect(await gateway().checkKeys()).toEqual({ collections: 'ok', payouts: 'ok' })
    reply = () => ({ status: 401, body: {} })
    expect(await gateway().checkKeys()).toEqual({ collections: 'refused', payouts: 'refused' })
  })
})

describe('saved PayWithCAMSOL keys', () => {
  beforeEach(resetDb)

  it('encrypts keys and only ever shows their last characters', async () => {
    await saveCamsolKeys({ secretKey: 'sk_live_1234567890abcdef', payoutKeyId: 'pok_live_99887766', payoutSecret: 'psk_live_secretsecret' })
    const row = await db.appSetting.findUniqueOrThrow({ where: { key: 'secret:camsol' } })
    expect(row.value).not.toContain('sk_live_1234567890abcdef')
    const status = await camsolStatus()
    expect(status.source).toBe('settings')
    expect(status.environment).toBe('live')
    expect(status.saved.secretKey).toBe('…cdef')
    expect(JSON.stringify(status)).not.toContain('1234567890')
    expect((await savedCamsolConfig())?.secretKey).toBe('sk_live_1234567890abcdef')
  })

  it('cleans pasted keys and refuses keys in the wrong box', async () => {
    expect(cleanKey('  "sk_test_abc"​\n')).toBe('sk_test_abc')
    await expect(saveCamsolKeys({ secretKey: 'pok_test_1' })).rejects.toBeInstanceOf(CamsolSettingsError)
    await expect(saveCamsolKeys({ secretKey: 'sk_test_a', payoutKeyId: 'pok_live_b', payoutSecret: 'psk_live_c' })).rejects.toThrow(/Mixing/)
    await expect(saveCamsolKeys({ secretKey: 'sk_test_a', payoutKeyId: 'pok_x' })).rejects.toThrow(/both/)
  })

  it('keeps a saved key when its box is left empty', async () => {
    await saveCamsolKeys({ secretKey: 'sk_test_first_key_000', webhookSecret: 'whsec_one' })
    const changed = await saveCamsolKeys({ webhookSecret: 'whsec_two' })
    expect(changed).toEqual(['webhookSecret'])
    expect((await savedCamsolConfig())?.secretKey).toBe('sk_test_first_key_000')
  })

  it('round-trips encryption', () => {
    expect(decryptSecret(encryptSecret('psk_live_x'))).toBe('psk_live_x')
    expect(decryptSecret('v1.bad.bad.bad')).toBeUndefined()
  })
})
