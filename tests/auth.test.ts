import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/lib/db'
import { makeProduct, makeUser, resetDb } from './helpers/db'

const session = vi.hoisted(() => ({ user: null as any }))
vi.mock('@/lib/auth/session', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/lib/auth/session')>()
  return { ...real, getSession: async () => session.user }
})

const { findSessionUser, isSuperAdmin } = await import('@/lib/auth/session')
const { PATCH: setStatus } = await import('@/app/api/orders/[id]/status/route')
const { PATCH: setRole } = await import('@/app/api/admin/customers/[id]/role/route')

const patch = (body: unknown) =>
  new Request('http://test', { method: 'PATCH', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } }) as any

describe('suspension', () => {
  beforeEach(resetDb)

  it('ends the sessions of a suspended user', async () => {
    const user = await makeUser()
    expect(await findSessionUser(user.id)).not.toBeNull()
    await db.user.update({ where: { id: user.id }, data: { isSuspended: true } })
    expect(await findSessionUser(user.id)).toBeNull()
  })
})

describe('super admins', () => {
  beforeEach(resetDb)

  it('only super admins can make someone an admin', async () => {
    const target = await makeUser('customer')
    session.user = { id: 'a1', role: 'admin', isSuperAdmin: false }
    const refused = await setRole(patch({ role: 'admin' }), { params: Promise.resolve({ id: target.id }) })
    expect(refused.status).toBe(403)
    // requireApiAdmin reads the mocked session too
    session.user = { id: 'a2', role: 'admin', isSuperAdmin: true }
    expect(isSuperAdmin(session.user)).toBe(true)
    const ok = await setRole(patch({ role: 'admin' }), { params: Promise.resolve({ id: target.id }) })
    expect(ok.status).toBe(200)
  })
})

describe('drivers and order status', () => {
  beforeEach(resetDb)

  async function setup() {
    const driverUser = await makeUser('driver')
    const driver = await db.driver.create({
      data: { userId: driverUser.id, fullName: 'D', phone: '677000000', email: driverUser.email, vehicleType: 'moto', vehicleNumber: 'X', licenseNumber: 'L' },
    })
    const product = await makeProduct()
    const order = await db.order.create({
      data: {
        orderNumber: 'ORD-T-1',
        subtotal: 10000,
        totalAmount: 10000,
        orderStatus: 'processing',
        orderItems: { create: [{ productId: product.id, productName: 'P', productSku: 'S', quantity: 1, price: 10000, total: 10000 }] },
      },
    })
    return { driverUser, driver, order }
  }

  it('refuses orders not assigned to the driver', async () => {
    const { driverUser, order } = await setup()
    session.user = { id: driverUser.id, role: 'driver' }
    const res = await setStatus(patch({ orderStatus: 'delivered' }), { params: Promise.resolve({ id: order.id }) })
    expect(res.status).toBe(403)
  })

  it('lets drivers move their own delivery forward, but not refund or cancel it', async () => {
    const { driverUser, driver, order } = await setup()
    await db.shippingTracking.create({ data: { orderId: order.id, driverId: driver.id } })
    session.user = { id: driverUser.id, role: 'driver' }
    const refund = await setStatus(patch({ orderStatus: 'refunded' }), { params: Promise.resolve({ id: order.id }) })
    expect(refund.status).toBe(403)
    const shipped = await setStatus(patch({ orderStatus: 'shipped' }), { params: Promise.resolve({ id: order.id }) })
    expect(shipped.status).toBe(200)
  })
})
