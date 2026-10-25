import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { OutOfStockError, parseLines, priceLines, reserveStock } from '@/lib/commerce/pricing'
import { createOrder } from '@/lib/commerce/orders'
import { setSetting } from '@/lib/settings'
import { makeProduct, makeUser, resetDb } from './helpers/db'

const address = { fullName: 'Ama Buyer', email: 'ama@test.local', phone: '677123456', addressLine1: 'Rue 1', city: 'Douala', state: 'Littoral', country: 'Cameroon' }

describe('pricing and stock', () => {
  beforeEach(resetDb)

  it('prices from the catalogue and ignores prices sent by the client', async () => {
    const product = await makeProduct({ price: 15000 })
    const lines = parseLines([{ productId: product.id, quantity: 2, price: 1 }])
    const priced = await db.$transaction((tx) => priceLines(tx, lines))
    expect(priced[0].unitPrice).toBe(15_000n)
    expect(priced[0].total).toBe(30_000n)
  })

  it('merges repeats and rejects silly quantities', () => {
    expect(parseLines([{ id: 'a', quantity: 1 }, { id: 'a', quantity: 2 }])).toEqual([
      { productId: 'a', variantId: null, quantity: 3 },
    ])
    expect(() => parseLines([{ id: 'a', quantity: 0 }])).toThrow()
    expect(() => parseLines([{ id: 'a', quantity: 1.5 }])).toThrow()
    expect(() => parseLines([])).toThrow()
  })

  it('never sells the last item twice, even when two orders arrive together', async () => {
    const product = await makeProduct({ inventoryCount: 1 })
    const attempt = () =>
      db.$transaction(async (tx) => {
        const priced = await priceLines(tx, [{ productId: product.id, quantity: 1 }])
        await reserveStock(tx, priced, { orderId: (await tx.order.create({ data: { orderNumber: `T-${Math.random()}`, subtotal: 0, totalAmount: 0 } })).id, userId: null, notes: 't' })
      })
    const results = await Promise.allSettled([attempt(), attempt()])
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1)
    const rejected = results.find((r) => r.status === 'rejected') as PromiseRejectedResult
    expect(rejected.reason).toBeInstanceOf(OutOfStockError)
    const after = await db.product.findUniqueOrThrow({ where: { id: product.id } })
    expect(after.inventoryCount).toBe(0)
  })

  it('creates orders unpaid, with server totals and the admin delivery rates', async () => {
    await setSetting('shipping.rates', { in_store: 0, standard: 0, express: 2000, overnight: 5000 })
    const user = await makeUser()
    const product = await makeProduct({ price: 12000, inventoryCount: 5 })
    const order = await createOrder({
      userId: user.id,
      userEmail: user.email,
      lines: [{ productId: product.id, quantity: 2 }],
      shippingMethod: 'express',
      paymentMethod: 'mobile_payment',
      shippingAddress: address,
    })
    expect(order.paymentStatus).toBe('pending')
    expect(Number(order.subtotal)).toBe(24000)
    expect(Number(order.shippingCost)).toBe(2000)
    expect(Number(order.totalAmount)).toBe(26000)
    expect(Number(order.taxAmount)).toBe(0)
    const after = await db.product.findUniqueOrThrow({ where: { id: product.id } })
    expect(after.inventoryCount).toBe(3)
  })

  it('refuses card payments and rolls back stock when an item is short', async () => {
    const a = await makeProduct({ inventoryCount: 5 })
    const b = await makeProduct({ inventoryCount: 1 })
    await expect(
      createOrder({ userId: null, userEmail: null, lines: [{ productId: a.id, quantity: 1 }], shippingMethod: 'in_store', paymentMethod: 'card', shippingAddress: address })
    ).rejects.toThrow(/Card payments/)
    await expect(
      createOrder({
        userId: null,
        userEmail: null,
        lines: [{ productId: a.id, quantity: 2 }, { productId: b.id, quantity: 3 }],
        shippingMethod: 'in_store',
        paymentMethod: 'cash',
        shippingAddress: address,
      })
    ).rejects.toBeInstanceOf(OutOfStockError)
    expect((await db.product.findUniqueOrThrow({ where: { id: a.id } })).inventoryCount).toBe(5)
    expect(await db.order.count()).toBe(0)
  })
})
