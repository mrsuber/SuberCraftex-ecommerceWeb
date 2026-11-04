import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/lib/db'
import { availableSlots, parseShopDate, shopToday } from '@/lib/services/booking-schedule'
import { checkTransition, WorkflowError } from '@/lib/services/booking-workflow'
import { bookingBalance } from '@/lib/services/booking-payments'
import { createStaffBooking, StaffBookingError } from '@/lib/services/staff-bookings'
import { InvoiceError, invoiceSummary, issueInvoice, lineAmount, saveDraft, suggestedLines, voidInvoice } from '@/lib/services/service-invoices'
import { makeUser, resetDb, uid } from './helpers/db'
import { fakeCamsol } from '@/lib/payments/camsol'
import { refreshCollection } from '@/lib/payments'
import { checkLedger } from '@/lib/ledger'

const session = vi.hoisted(() => ({ user: null as any }))
vi.mock('@/lib/auth/verify-auth', () => ({ verifyAuth: async () => ({ user: session.user, isAuthenticated: !!session.user }) }))
vi.mock('@/lib/session', () => ({ getCurrentUser: async () => session.user }))

const { POST: book } = await import('@/app/api/bookings/route')
const { PATCH: patchBooking } = await import('@/app/api/bookings/[id]/route')
const { GET: getInvoice, PUT: putInvoice } = await import('@/app/api/bookings/[id]/invoice/route')
const { POST: issueRoute } = await import('@/app/api/bookings/[id]/invoice/issue/route')
const { POST: cashRoute } = await import('@/app/api/bookings/[id]/payments/route')
const { POST: staffBook } = await import('@/app/api/admin/bookings/route')
const { POST: momoStart } = await import('@/app/api/payments/mobile-money/route')

const req = (method: string, body?: unknown) =>
  new Request('http://test', { method, body: body === undefined ? undefined : JSON.stringify(body), headers: { 'content-type': 'application/json' } }) as any
const ctx = (id: string) => ({ params: Promise.resolve({ id }) })

async function makeService(extra: Record<string, unknown> = {}) {
  const id = uid('s')
  const category = await db.serviceCategory.create({ data: { name: `Cat ${id}`, slug: `cat-${id}` } })
  return db.service.create({
    data: { name: 'Furniture lock repair', slug: id, sku: id.toUpperCase(), price: 15000, categoryId: category.id, duration: 'one_hour', ...extra },
  })
}

/** The next shop day that falls on `weekday` (0 = Sunday), at least `minDays` ahead */
function nextWeekday(weekday: number, minDays = 1) {
  const d = shopToday()
  d.setUTCDate(d.getUTCDate() + minDays)
  while (d.getUTCDay() !== weekday) d.setUTCDate(d.getUTCDate() + 1)
  return d
}
const ymd = (d: Date) => d.toISOString().slice(0, 10)

// ---------------------------------------------------------------- scheduling

describe('booking dates and slots', () => {
  beforeEach(resetDb)

  it('reads the day the customer picked, at shop time, whatever form the date comes in', () => {
    expect(ymd(parseShopDate('2026-11-05')!)).toBe('2026-11-05')
    // An older app sends local midnight in Douala (UTC+1): still the 5th, not the 4th
    expect(ymd(parseShopDate('2026-11-04T23:00:00.000Z')!)).toBe('2026-11-05')
    expect(parseShopDate('2026-02-30')).toBeNull()
    expect(parseShopDate('soon')).toBeNull()
  })

  it('opens services with no schedule Monday to Saturday, 08:00–17:00, and closes Sundays', async () => {
    const service = await makeService()
    const monday = await availableSlots(db, service, nextWeekday(1))
    expect(monday[0]).toBe('08:00')
    expect(monday.at(-1)).toBe('16:00') // a one-hour job must end by 17:00
    expect(await availableSlots(db, service, nextWeekday(0))).toEqual([])
  })

  it('keeps overlapping times out, with the buffer between jobs', async () => {
    const service = await makeService({ bufferTime: 30 })
    const day = nextWeekday(2)
    await db.serviceBooking.create({
      data: { bookingNumber: uid('BK'), serviceId: service.id, serviceType: 'onsite', duration: 60, customerName: 'A', price: 15000, scheduledDate: day, scheduledTime: '10:00', endTime: '11:00', status: 'confirmed' },
    })
    const slots = await availableSlots(db, service, day)
    expect(slots).not.toContain('09:00') // would end 10:00, inside the buffer
    expect(slots).not.toContain('10:30')
    expect(slots).not.toContain('11:00') // inside the buffer after
    expect(slots).toContain('08:00')
    expect(slots).toContain('11:30')
  })

  it('never offers a time already gone today', async () => {
    const service = await makeService()
    // 15:10 in Douala on a Wednesday
    const now = new Date('2026-11-04T14:10:00Z')
    const slots = await availableSlots(db, service, new Date('2026-11-04T00:00:00Z'), { now })
    // At least 30 minutes ahead (15:40), on the half hour, ending by 17:00
    expect(slots).toEqual(['16:00'])
  })
})

// ---------------------------------------------------------------- customers booking online

describe('booking online', () => {
  beforeEach(async () => {
    await resetDb()
    session.user = null
  })

  it('asks visitors to sign in, and books with the real customer, address and phone', async () => {
    const service = await makeService()
    const day = ymd(nextWeekday(3))
    expect((await book(req('POST', { serviceId: service.id, serviceType: 'onsite', scheduledDate: day, scheduledTime: '09:00' }))).status).toBe(401)

    const customer = await makeUser('customer', { fullName: 'Awa Ngo', phone: '677000111' })
    session.user = customer
    const noAddress = await book(req('POST', { serviceId: service.id, serviceType: 'onsite', scheduledDate: day, scheduledTime: '09:00' }))
    expect(noAddress.status).toBe(400)
    expect((await noAddress.json()).error).toMatch(/where the work is/)

    const ok = await book(req('POST', { serviceId: service.id, serviceType: 'onsite', scheduledDate: day, scheduledTime: '09:00', serviceAddress: 'Bonamoussadi, near Total' }))
    expect(ok.status).toBe(201)
    const body = await ok.json()
    expect(body).toMatchObject({ customer_name: 'Awa Ngo', customer_email: customer.email, customer_phone: '677000111', service_address: 'Bonamoussadi, near Total', scheduled_time: '09:00', end_time: '10:00' })
    expect(ymd(new Date(body.scheduled_date))).toBe(day)

    // The same hour, or one overlapping it, is gone
    const clash = await book(req('POST', { serviceId: service.id, serviceType: 'onsite', scheduledDate: day, scheduledTime: '09:30', serviceAddress: 'x' }))
    expect(clash.status).toBe(409)
  })

  it('lets customers cancel before work starts, never after, and never mark work done', () => {
    expect(() => checkTransition('customer', true, 'confirmed', 'cancelled')).not.toThrow()
    expect(() => checkTransition('customer', true, 'in_progress', 'cancelled')).toThrow(WorkflowError)
    expect(() => checkTransition('customer', true, 'confirmed', 'completed')).toThrow(WorkflowError)
    expect(() => checkTransition('technician', false, 'confirmed', 'completed')).not.toThrow()
    expect(() => checkTransition('technician', false, 'completed', 'in_progress')).toThrow(WorkflowError)
    expect(() => checkTransition('admin', false, 'completed', 'in_progress')).not.toThrow()
  })
})

// ---------------------------------------------------------------- the lock repair: recorded, invoiced, paid

describe('a job done for a phone customer, then invoiced and paid', () => {
  beforeEach(async () => {
    await resetDb()
    session.user = null
  })

  it('records the finished job, bills what was done, and takes the money in two cash payments', async () => {
    const admin = await makeUser('admin')
    const service = await makeService()
    session.user = admin

    // 1. The customer called; the work is already done. No email: a phone number is enough.
    const recorded = await staffBook(
      req('POST', { serviceId: service.id, customerName: 'Mr Tabi', customerPhone: '699112233', serviceAddress: 'Akwa', status: 'completed', price: '15000' }),
    )
    expect(recorded.status).toBe(201)
    const { id } = await recorded.json()
    const job = await db.serviceBooking.findUniqueOrThrow({ where: { id } })
    expect(job).toMatchObject({ status: 'completed', source: 'staff', customerEmail: null, createdById: admin.id })
    expect(job.completedAt).not.toBeNull()

    // 2. The invoice starts from the agreed price; staff bill what was really done
    expect((await suggestedLines(db, id))[0]).toMatchObject({ description: 'Furniture lock repair', unitPrice: 15000 })
    const draft = await putInvoice(
      req('PUT', {
        lines: [
          { kind: 'labour', description: 'Lock repair, labour', quantity: '1.5', unitPrice: '7000' },
          { kind: 'part', description: 'Wardrobe lock', quantity: 2, unitPrice: 4500 },
          { kind: 'travel', description: 'Travel to Akwa', quantity: 1, unitPrice: 2000 },
        ],
        discount: 500,
        notes: 'Guaranteed 3 months',
      }),
      ctx(id),
    )
    expect(draft.status).toBe(200)
    const d = (await draft.json()).invoice
    expect(d).toMatchObject({ status: 'draft', number: null, subtotal: 21500, discount: 500, total: 21000, customerPhone: '699112233', customerAddress: 'Akwa' })

    // 3. Issued: numbered, frozen, and now the price of the job
    const issued = await issueRoute(req('POST', { send: true }), ctx(id))
    expect(issued.status).toBe(201)
    const i = await issued.json()
    expect(i.invoice.number).toBe(`INV-${new Date(Date.now() + 3_600_000).getUTCFullYear()}-00001`)
    expect(i.emailed).toBe(false) // no address: staff share the link instead
    expect(Number((await db.serviceBooking.findUniqueOrThrow({ where: { id } })).finalPrice)).toBe(21000)
    expect((await putInvoice(req('PUT', { lines: [{ description: 'x', quantity: 1, unitPrice: 1 }] }), ctx(id))).status).toBe(400)

    // 4. Part paid in cash: the finished job stays finished
    expect((await cashRoute(req('POST', { amount: '10000' }), ctx(id))).status).toBe(201)
    let after = await db.serviceBooking.findUniqueOrThrow({ where: { id } })
    expect(after.status).toBe('completed')
    let inv = await db.serviceInvoice.findFirstOrThrow({ where: { bookingId: id } })
    expect(inv.paidAt).toBeNull()
    expect(await invoiceSummary(db, inv)).toMatchObject({ total: 21000n, paid: 10000n, balance: 11000n })

    // 5. The rest: the invoice is stamped paid; nothing more can be taken
    expect((await cashRoute(req('POST', {}), ctx(id))).status).toBe(201)
    inv = await db.serviceInvoice.findFirstOrThrow({ where: { bookingId: id } })
    expect(inv.paidAt).not.toBeNull()
    expect((await bookingBalance(db, id)).remaining).toBe(0n)
    expect((await cashRoute(req('POST', { amount: '1' }), ctx(id))).status).toBe(400)
    after = await db.serviceBooking.findUniqueOrThrow({ where: { id } })
    expect(after.status).toBe('completed')

    // Every franc is in the books
    const entries = await db.ledgerTransaction.count({ where: { type: 'booking_paid' } })
    expect(entries).toBe(2)
  })

  it('needs a way to reach the customer, and links the job to their account when the email matches', async () => {
    const admin = await makeUser('admin')
    const service = await makeService()
    await expect(createStaffBooking({ serviceId: service.id, customerName: 'X' }, admin)).rejects.toThrow(StaffBookingError)
    const customer = await makeUser('customer')
    const job = await createStaffBooking({ serviceId: service.id, customerName: 'Y', customerEmail: customer.email.toUpperCase() }, admin)
    expect(job.userId).toBe(customer.id)
    expect(job.status).toBe('confirmed')
  })

  it('numbers invoices without gaps, and a voided number is never reused', async () => {
    const admin = await makeUser('admin')
    const service = await makeService()
    const a = await createStaffBooking({ serviceId: service.id, customerName: 'A', customerPhone: '1', status: 'completed' }, admin)
    const b = await createStaffBooking({ serviceId: service.id, customerName: 'B', customerPhone: '2', status: 'completed' }, admin)
    const line = [{ description: 'Repair', quantity: 1, unitPrice: 5000 }]

    await saveDraft(a.id, { lines: line }, admin)
    const first = await issueInvoice(a.id, admin)
    await expect(saveDraft(a.id, { lines: line }, admin)).rejects.toThrow(/already issued/)
    await expect(voidInvoice(a.id, '', admin)).rejects.toThrow(InvoiceError)
    await voidInvoice(a.id, 'Wrong amount', admin)
    expect(Number((await db.serviceBooking.findUniqueOrThrow({ where: { id: a.id } })).finalPrice ?? 0)).toBe(0)

    await saveDraft(b.id, { lines: line }, admin)
    const second = await issueInvoice(b.id, admin)
    await saveDraft(a.id, { lines: [{ description: 'Repair', quantity: 1, unitPrice: 4000 }] }, admin)
    const corrected = await issueInvoice(a.id, admin)

    const n = (s: string | null) => Number(s!.slice(-5))
    expect([n(first.number), n(second.number), n(corrected.number)]).toEqual([1, 2, 3])
    expect(await db.serviceInvoice.count({ where: { bookingId: a.id } })).toBe(2)
  })

  it('counts a deposit towards the invoice, and refuses an invoice smaller than what was paid', async () => {
    const admin = await makeUser('admin')
    session.user = admin
    const service = await makeService()
    const job = await createStaffBooking({ serviceId: service.id, customerName: 'C', customerPhone: '3', price: 20000, status: 'in_progress' }, admin)
    expect((await cashRoute(req('POST', { amount: '8000' }), ctx(job.id))).status).toBe(201)

    await saveDraft(job.id, { lines: [{ description: 'Repair', quantity: 1, unitPrice: 5000 }] }, admin)
    await expect(issueInvoice(job.id, admin)).rejects.toThrow(/already paid 8000/)

    await saveDraft(job.id, { lines: [{ description: 'Repair', quantity: 1, unitPrice: 18000 }] }, admin)
    const inv = await issueInvoice(job.id, admin)
    expect(await invoiceSummary(db, inv)).toMatchObject({ total: 18000n, paid: 8000n, balance: 10000n })
  })

  it('stamps the invoice paid when the customer pays the balance by Mobile Money from the staff prompt', async () => {
    fakeCamsol().reset()
    const technician = await makeUser('technician')
    session.user = technician
    const service = await makeService()
    const job = await createStaffBooking({ serviceId: service.id, customerName: 'E', customerPhone: '699123456', status: 'completed' }, technician)
    await saveDraft(job.id, { lines: [{ description: 'Lock repair', quantity: 1, unitPrice: 12000 }] }, technician)
    await issueInvoice(job.id, technician)

    // The amount is worked out on the server from the invoice, never sent by the browser
    const started = await momoStart(req('POST', { purpose: 'booking', id: job.id, phone: '699123456', amount: 1 }))
    expect(started.status).toBe(201)
    const c = await started.json()
    expect(c.amount).toBe(12000)
    const row = await db.paymentCollection.findUniqueOrThrow({ where: { reference: c.reference } })
    fakeCamsol().confirmCollection(row.providerReference!)
    await refreshCollection(c.reference, { force: true })

    const inv = await db.serviceInvoice.findFirstOrThrow({ where: { bookingId: job.id } })
    expect(inv.paidAt).not.toBeNull()
    expect((await db.serviceBooking.findUniqueOrThrow({ where: { id: job.id } })).status).toBe('completed')
    const books = await checkLedger(db)
    expect(books.imbalance).toBe(0n)
    expect(books.drift).toEqual([])
  })

  it('rounds line amounts half up to whole francs', () => {
    expect(lineAmount('1.5', 7000)).toBe(10500n)
    expect(lineAmount('0.33', 1001)).toBe(330n) // 330.33
    expect(lineAmount('0.5', 1001)).toBe(501n) // 500.5 → 501
    expect(() => lineAmount('1.234', 10)).toThrow(InvoiceError)
    expect(() => lineAmount('0', 10)).toThrow(InvoiceError)
  })
})

// ---------------------------------------------------------------- who sees what

describe('invoice access', () => {
  beforeEach(async () => {
    await resetDb()
    session.user = null
  })

  it('keeps drafts from customers, and invoice editing for staff', async () => {
    const admin = await makeUser('admin')
    const customer = await makeUser('customer')
    const service = await makeService()
    const job = await createStaffBooking({ serviceId: service.id, customerName: 'D', customerEmail: customer.email, status: 'completed' }, admin)
    await saveDraft(job.id, { lines: [{ description: 'Repair', quantity: 1, unitPrice: 5000 }] }, admin)

    session.user = customer
    expect((await (await getInvoice(req('GET'), ctx(job.id))).json()).invoice).toBeNull()
    expect((await putInvoice(req('PUT', { lines: [{ description: 'free', quantity: 1, unitPrice: 0 }] }), ctx(job.id))).status).toBe(403)
    expect((await issueRoute(req('POST', {}), ctx(job.id))).status).toBe(403)
    expect((await patchBooking(req('PATCH', { status: 'in_progress' }), ctx(job.id))).status).toBe(400)

    await issueInvoice(job.id, admin)
    const seen = (await (await getInvoice(req('GET'), ctx(job.id))).json()).invoice
    expect(seen).toMatchObject({ status: 'issued', total: 5000, summary: { balance: 5000 } })
    expect(seen.link).toMatch(/\/invoices\/.+\?t=/)

    const stranger = await makeUser('customer')
    session.user = stranger
    expect((await getInvoice(req('GET'), ctx(job.id))).status).toBe(403)
  })
})
