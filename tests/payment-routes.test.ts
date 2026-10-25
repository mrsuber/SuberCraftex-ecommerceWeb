import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createHmac } from 'crypto'
import { db } from '@/lib/db'
import { createOrder } from '@/lib/commerce/orders'
import { paymentToken } from '@/lib/payments/token'
import { fakeCamsol } from '@/lib/payments/camsol'
import { clearCamsolKeys, saveCamsolKeys } from '@/lib/payments/camsol/settings'
import { makeProduct, resetDb } from './helpers/db'

const session = vi.hoisted(() => ({ user: null as any }))
vi.mock('@/lib/auth/verify-auth', () => ({ verifyAuth: async () => ({ user: session.user, isAuthenticated: !!session.user }) }))

const { POST: start } = await import('@/app/api/payments/mobile-money/route')
const { POST: webhook } = await import('@/app/api/webhooks/camsol/route')

const json = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('http://test', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json', ...headers } }) as any

const address = { fullName: 'Guest', email: 'g@test.local', phone: '677123456', addressLine1: 'Rue 1', city: 'Douala', state: 'Littoral', country: 'Cameroon' }

describe('starting a Mobile Money payment', () => {
  beforeEach(async () => {
    await resetDb()
    fakeCamsol().reset()
    session.user = null
  })

  it('lets a guest pay their own order with its token, never someone else, and never a chosen amount', async () => {
    const product = await makeProduct({ price: 9000 })
    const order = await createOrder({ userId: null, userEmail: null, lines: [{ productId: product.id, quantity: 1 }], shippingMethod: 'in_store', paymentMethod: 'mobile_payment', shippingAddress: address })

    const noToken = await start(json({ purpose: 'order', id: order.id, phone: '677123456' }))
    expect(noToken.status).toBe(403)

    const ok = await start(json({ purpose: 'order', id: order.id, phone: '677123456', token: paymentToken('order', order.id), amount: 1 }))
    expect(ok.status).toBe(201)
    const body = await ok.json()
    expect(body.amount).toBe(9000)
    expect(body.status).toBe('pending')
  })

  it('refuses orders already paid or past their deadline', async () => {
    const product = await makeProduct({ price: 9000 })
    const order = await createOrder({ userId: null, userEmail: null, lines: [{ productId: product.id, quantity: 1 }], shippingMethod: 'in_store', paymentMethod: 'mobile_payment', shippingAddress: address })
    await db.order.update({ where: { id: order.id }, data: { paymentDueAt: new Date(Date.now() - 1000) } })
    const late = await start(json({ purpose: 'order', id: order.id, phone: '677123456', token: paymentToken('order', order.id) }))
    expect(late.status).toBe(400)
    expect((await late.json()).error).toMatch(/passed/)
  })
})

describe('PayWithCAMSOL webhook', () => {
  beforeEach(async () => {
    await resetDb()
    await clearCamsolKeys()
  })

  it('refuses a body without a valid signature, and accepts a signed one', async () => {
    await saveCamsolKeys({ secretKey: 'sk_test_webhook_test_1', webhookSecret: 'whsec_route' })
    const raw = JSON.stringify({ event_type: 'payment.success', data: { reference: 'SCX-unknown' } })
    const forged = await webhook(new Request('http://test', { method: 'POST', body: raw, headers: { 'x-webhook-signature': 'abc' } }) as any)
    expect(forged.status).toBe(401)
    const sig = createHmac('sha256', 'whsec_route').update(raw).digest('hex')
    const signed = await webhook(new Request('http://test', { method: 'POST', body: raw, headers: { 'x-paywithcamsol-signature': sig } }) as any)
    expect(signed.status).toBe(200)
    await clearCamsolKeys()
  })
})
