import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { Accounts, balanceOf, checkLedger } from '@/lib/ledger'
import { fakeCamsol } from '@/lib/payments/camsol'
import { refreshCollection, startCollection, sweepCollections } from '@/lib/payments'
import { createOrder } from '@/lib/commerce/orders'
import { completeOrder } from '@/lib/commerce/fulfilment'
import { markOrderPaid } from '@/lib/commerce/order-payments'
import { closeDrawer, openDrawer } from '@/lib/commerce/pos-cash'
import { recordHandover } from '@/lib/finance/driver-cash'
import { bookingBalance } from '@/lib/services/booking-payments'
import { approvePayout, quotePayout, refreshPayout, rejectPayout, requestPayout, sendableFrom } from '@/lib/payments/payouts'
import { setSetting } from '@/lib/settings'
import { makeProduct, makeUser, resetDb } from './helpers/db'

const address = { fullName: 'Ama Buyer', email: 'ama@test.local', phone: '677123456', addressLine1: 'Rue 1', city: 'Douala', state: 'Littoral', country: 'Cameroon' }
const fake = fakeCamsol()

async function mobileOrder(price = 12000, quantity = 1, stock = 5) {
  const user = await makeUser()
  const product = await makeProduct({ price, inventoryCount: stock })
  const order = await createOrder({
    userId: user.id,
    userEmail: user.email,
    lines: [{ productId: product.id, quantity }],
    shippingMethod: 'in_store',
    paymentMethod: 'mobile_payment',
    shippingAddress: address,
  })
  return { user, product, order }
}

async function startForOrder(orderId: string, amount: bigint) {
  const c = await startCollection({ purpose: 'order', targetId: orderId, amount, phone: '677123456', description: 'test' })
  return { collection: c, providerId: c.providerReference! }
}

async function expectBooksBalance() {
  const check = await checkLedger()
  expect(check.imbalance).toBe(0n)
  expect(check.drift).toEqual([])
}

describe('Mobile Money orders', () => {
  beforeEach(async () => {
    await resetDb()
    fake.reset()
  })

  it('marks the order paid once PayWithCAMSOL says Processing, and counts the money once', async () => {
    const { order } = await mobileOrder(12000, 2)
    const { collection, providerId } = await startForOrder(order.id, 24000n)
    expect(collection.status).toBe('pending')
    expect(await refreshCollection(collection.reference, { force: true })).toMatchObject({ status: 'pending' })

    fake.confirmCollection(providerId, 'Processing')
    const [a, b] = await Promise.all([
      refreshCollection(collection.reference, { force: true }),
      refreshCollection(collection.reference, { force: true }),
    ])
    expect([a.status, b.status]).toEqual(['succeeded', 'succeeded'])
    await refreshCollection(collection.reference, { force: true })

    const paid = await db.order.findUniqueOrThrow({ where: { id: order.id } })
    expect(paid.paymentStatus).toBe('paid')
    expect(paid.orderStatus).toBe('processing')
    expect(await balanceOf(db, Accounts.camsol())).toBe(24000n)
    expect(await balanceOf(db, Accounts.productSales())).toBe(24000n)
    expect(await db.ledgerTransaction.count({ where: { type: 'collection:order' } })).toBe(1)
    await expectBooksBalance()
  })

  it('lets the payer retry after a decline, and cancels and releases stock when time runs out', async () => {
    const { order, product } = await mobileOrder(10000, 3, 3)
    const first = await startForOrder(order.id, 30000n)
    fake.failCollection(first.providerId)
    expect((await refreshCollection(first.collection.reference, { force: true })).status).toBe('failed')
    expect((await db.order.findUniqueOrThrow({ where: { id: order.id } })).orderStatus).toBe('pending')

    const second = await startForOrder(order.id, 30000n)
    // Time passes beyond both the prompt and the order's own deadline
    await db.paymentCollection.update({ where: { id: second.collection.id }, data: { expiresAt: new Date(Date.now() - 1000) } })
    await db.order.update({ where: { id: order.id }, data: { paymentDueAt: new Date(Date.now() - 1000) } })
    await sweepCollections()
    expect((await db.paymentCollection.findUniqueOrThrow({ where: { id: second.collection.id } })).status).toBe('expired')
    const cancelled = await db.order.findUniqueOrThrow({ where: { id: order.id } })
    expect(cancelled.orderStatus).toBe('cancelled')
    expect((await db.product.findUniqueOrThrow({ where: { id: product.id } })).inventoryCount).toBe(3)
    expect(await balanceOf(db, Accounts.camsol())).toBe(0n)
  })

  it('never loses a late payment: revives the order when its stock is still free', async () => {
    const { order, product } = await mobileOrder(8000, 1, 1)
    const { collection, providerId } = await startForOrder(order.id, 8000n)
    await db.paymentCollection.update({ where: { id: collection.id }, data: { expiresAt: new Date(Date.now() - 1000) } })
    await db.order.update({ where: { id: order.id }, data: { paymentDueAt: new Date(Date.now() - 1000) } })
    await sweepCollections()
    expect((await db.order.findUniqueOrThrow({ where: { id: order.id } })).orderStatus).toBe('cancelled')

    fake.confirmCollection(providerId)
    await sweepCollections()
    const revived = await db.order.findUniqueOrThrow({ where: { id: order.id } })
    expect(revived.paymentStatus).toBe('paid')
    expect(revived.orderStatus).toBe('processing')
    expect((await db.product.findUniqueOrThrow({ where: { id: product.id } })).inventoryCount).toBe(0)
    await expectBooksBalance()
  })

  it('keeps a late payment as store credit when the stock was sold meanwhile', async () => {
    const { order, product, user } = await mobileOrder(8000, 1, 1)
    const { collection, providerId } = await startForOrder(order.id, 8000n)
    await db.paymentCollection.update({ where: { id: collection.id }, data: { expiresAt: new Date(Date.now() - 1000) } })
    await db.order.update({ where: { id: order.id }, data: { paymentDueAt: new Date(Date.now() - 1000) } })
    await sweepCollections()
    // Someone else buys the released item
    await db.product.update({ where: { id: product.id }, data: { inventoryCount: 0 } })

    fake.confirmCollection(providerId)
    await sweepCollections()
    expect((await db.order.findUniqueOrThrow({ where: { id: order.id } })).orderStatus).toBe('cancelled')
    expect(await balanceOf(db, Accounts.customerCredit(user.id))).toBe(8000n)
    expect(await balanceOf(db, Accounts.productSales())).toBe(0n)
    expect(await db.notification.count({ where: { priority: 'urgent' } })).toBe(1)
    await expectBooksBalance()
  })

  it('refuses amounts under the Mobile Money minimum and bad numbers', async () => {
    const { order } = await mobileOrder(50, 1)
    await expect(startCollection({ purpose: 'order', targetId: order.id, amount: 50n, phone: '677123456', description: 'x' })).rejects.toThrow(/100/)
    await expect(startCollection({ purpose: 'order', targetId: order.id, amount: 500n, phone: '12345', description: 'x' })).rejects.toThrow(/Cameroon/)
  })
})

describe('cash: tills and drivers', () => {
  beforeEach(async () => {
    await resetDb()
    fake.reset()
  })

  it('moves the float in, cash sales in, books the shortfall, and sends the cash to the safe', async () => {
    const cashierUser = await makeUser('cashier')
    const cashier = await db.cashier.create({ data: { userId: cashierUser.id, fullName: 'C', phone: '6', email: cashierUser.email } })
    const session = await db.pOSSession.create({ data: { sessionNumber: 'POS-T-1', cashierId: cashier.id, openingBalance: 10000, expectedCash: 10000 } })
    await db.$transaction((tx) => openDrawer(tx, session, 10000n, cashierUser.id))
    const drawer = Accounts.drawer(session.id, session.sessionNumber)
    expect(await balanceOf(db, drawer)).toBe(10000n)

    const product = await makeProduct({ price: 5000 })
    const order = await db.order.create({
      data: {
        orderNumber: 'POS-T-ORDER',
        isPosOrder: true,
        cashierId: cashier.id,
        posSessionId: session.id,
        paymentMethod: 'cash',
        shippingMethod: 'in_store',
        subtotal: 5000,
        totalAmount: 5000,
        orderItems: { create: [{ productId: product.id, productName: 'P', productSku: 'S', quantity: 1, price: 5000, total: 5000 }] },
      },
    })
    await db.$transaction((tx) => markOrderPaid(tx, order.id, { into: drawer, actorId: cashierUser.id }))
    expect(await balanceOf(db, drawer)).toBe(15000n)
    expect((await db.order.findUniqueOrThrow({ where: { id: order.id } })).orderStatus).toBe('delivered')

    const fresh = await db.pOSSession.findUniqueOrThrow({ where: { id: session.id } })
    const result = await db.$transaction((tx) => closeDrawer(tx, fresh, 14500n, cashierUser.id))
    expect(result).toEqual({ expected: 15000n, difference: -500n })
    expect(await balanceOf(db, drawer)).toBe(0n)
    expect(await balanceOf(db, Accounts.safe())).toBe(14500n)
    expect(await balanceOf(db, Accounts.cashShort())).toBe(500n)
    await expectBooksBalance()
  })

  it('keeps cash on delivery on the driver until it is handed in', async () => {
    const admin = await makeUser('admin')
    const driverUser = await makeUser('driver')
    const driver = await db.driver.create({
      data: { userId: driverUser.id, fullName: 'Dan', phone: '677', email: driverUser.email, vehicleType: 'moto', vehicleNumber: 'X', licenseNumber: 'L' },
    })
    const product = await makeProduct({ price: 7000 })
    const order = await createOrder({
      userId: null,
      userEmail: null,
      lines: [{ productId: product.id, quantity: 1 }],
      shippingMethod: 'express',
      paymentMethod: 'cash',
      shippingAddress: address,
    })
    await db.$transaction((tx) => completeOrder(tx, order.id, { actorId: driverUser.id, actorRole: 'driver', driverId: driver.id }))
    const account = Accounts.driverCash(driver.id, driver.fullName)
    expect(await balanceOf(db, account)).toBe(9000n) // 7000 + 2000 express delivery
    // Delivering twice changes nothing
    await db.$transaction((tx) => completeOrder(tx, order.id, { actorId: driverUser.id, actorRole: 'driver', driverId: driver.id }))
    expect(await balanceOf(db, account)).toBe(9000n)

    await expect(recordHandover({ driverId: driver.id, amount: 10000n, into: 'safe', admin })).rejects.toThrow(/holds only/)
    await recordHandover({ driverId: driver.id, amount: 8500n, into: 'safe', admin })
    expect(await balanceOf(db, account)).toBe(500n)
    expect(await balanceOf(db, Accounts.safe())).toBe(8500n)
    await expectBooksBalance()
  })
})

describe('bookings', () => {
  beforeEach(async () => {
    await resetDb()
    fake.reset()
  })

  it('asks for the quote down payment first, then the rest', async () => {
    const user = await makeUser()
    const category = await db.serviceCategory.create({ data: { name: 'Tailoring', slug: 'tailoring' } })
    const service = await db.service.create({ data: { name: 'Suit', slug: 'suit', sku: 'SVC-1', price: 0, categoryId: category.id } })
    const booking = await db.serviceBooking.create({
      data: {
        bookingNumber: 'BK-T-1',
        serviceId: service.id,
        userId: user.id,
        status: 'awaiting_payment',
        serviceType: 'custom_production',
        duration: 60,
        customerName: 'A',
        customerEmail: user.email,
        price: 0,
        finalPrice: 60000,
        quote: { create: { materialCost: 30000, laborCost: 30000, laborHours: 5, totalCost: 60000, downPaymentAmount: 20000, status: 'approved' } },
      },
    })
    const first = await bookingBalance(db, booking.id)
    expect(first.next).toEqual({ type: 'down_payment', amount: 20000n })

    const c = await startCollection({ purpose: 'booking', targetId: booking.id, amount: 20000n, phone: '699123456', description: 't', metadata: { paymentType: 'down_payment' } })
    fake.confirmCollection(c.providerReference!)
    await refreshCollection(c.reference, { force: true })
    expect((await db.serviceBooking.findUniqueOrThrow({ where: { id: booking.id } })).status).toBe('confirmed')
    const second = await bookingBalance(db, booking.id)
    expect(second.next).toEqual({ type: 'final_payment', amount: 40000n })
    expect(await balanceOf(db, Accounts.serviceIncome())).toBe(20000n)
    await expectBooksBalance()
  })
})

describe('payouts', () => {
  beforeEach(async () => {
    await resetDb()
    fake.reset()
    await setSetting('payouts.feePercent', 5)
  })

  async function fundWallet(investorId: string, amount: bigint) {
    const { post, credit, debit } = await import('@/lib/ledger')
    await db.$transaction((tx) =>
      post(tx, { type: 't', reference: `fund:${investorId}`, description: 'fund', postings: [debit(Accounts.camsol(), amount), credit(Accounts.investorFree(investorId), amount)] })
    )
  }

  it('adds the 5% fee on top and works out the most that can be sent', async () => {
    expect(await quotePayout(10000n)).toEqual({ amount: 10000n, fee: 500n, fromWallet: 10500n, feePaidByCompany: false })
    expect(await sendableFrom(10500n)).toBe(10000n)
    expect(await sendableFrom(10000n)).toBe(9523n)
    const max = await sendableFrom(10000n)
    const q = await quotePayout(max)
    expect(q.fromWallet).toBeLessThanOrEqual(10000n)
  })

  it('reserves the money at once, sends after approval, and settles from PayWithCAMSOL', async () => {
    const admin = await makeUser('admin')
    const investorUser = await makeUser('investor')
    await fundWallet('inv1', 20000n)
    const payout = await db.$transaction((tx) =>
      requestPayout(tx, { reason: 'investor_withdrawal', source: Accounts.investorFree('inv1'), userId: investorUser.id, amount: 10000n, phone: '677123456', description: 'w' })
    )
    expect(payout.status).toBe('awaiting_approval')
    expect(await balanceOf(db, Accounts.investorFree('inv1'))).toBe(9500n)
    // The same money cannot be asked for again
    await expect(
      db.$transaction((tx) =>
        requestPayout(tx, { reason: 'investor_withdrawal', source: Accounts.investorFree('inv1'), userId: investorUser.id, amount: 10000n, phone: '677123456', description: 'w' })
      )
    ).rejects.toThrow(/Not enough/)

    const sent = await approvePayout(payout.id, admin)
    expect(sent.status).toBe('processing')
    const done = await refreshPayout(payout.id)
    expect(done.status).toBe('succeeded')
    expect(await balanceOf(db, Accounts.payoutsInFlight())).toBe(0n)
    expect(await balanceOf(db, Accounts.camsol())).toBe(9500n)
    await expectBooksBalance()
  })

  it('gives everything back when rejected or when PayWithCAMSOL fails it', async () => {
    const admin = await makeUser('admin')
    const u = await makeUser('investor')
    await fundWallet('inv2', 21000n)
    const a = await db.$transaction((tx) =>
      requestPayout(tx, { reason: 'investor_withdrawal', source: Accounts.investorFree('inv2'), userId: u.id, amount: 10000n, phone: '677123456', description: 'w' })
    )
    await rejectPayout(a.id, admin, 'Balance not available yet')
    expect(await balanceOf(db, Accounts.investorFree('inv2'))).toBe(21000n)

    const b = await db.$transaction((tx) =>
      requestPayout(tx, { reason: 'investor_withdrawal', source: Accounts.investorFree('inv2'), userId: u.id, amount: 10000n, phone: '237600000001', description: 'w' })
    )
    // The fake gateway fails this test number on its first check
    await db.payout.update({ where: { id: b.id }, data: { provider: 'MTN' } })
    await approvePayout(b.id, admin)
    expect((await refreshPayout(b.id)).status).toBe('failed')
    expect(await balanceOf(db, Accounts.investorFree('inv2'))).toBe(21000n)
    await expectBooksBalance()
  })

  it('lets SuberCraftex pay the fee, for salaries', async () => {
    await db.$transaction(async (tx) => {
      const { post, credit, debit } = await import('@/lib/ledger')
      await post(tx, { type: 't', reference: 'sal', description: 's', postings: [debit(Accounts.salaries(), 50000n), credit(Accounts.salaryWallet('e1'), 50000n)] })
    })
    const u = await makeUser('driver')
    await db.$transaction((tx) =>
      requestPayout(tx, { reason: 'salary', source: Accounts.salaryWallet('e1'), userId: u.id, amount: 50000n, phone: '677123456', feePaidByCompany: true, description: 'salary' })
    )
    expect(await balanceOf(db, Accounts.salaryWallet('e1'))).toBe(0n)
    expect(await balanceOf(db, Accounts.payoutFees())).toBe(2500n)
    await expectBooksBalance()
  })
})
