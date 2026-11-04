import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { recordBookingPayment } from '@/lib/services/booking-payments'
import { Accounts } from '@/lib/ledger'
import { createStaffBooking } from '@/lib/services/staff-bookings'
import { AssignmentError, assignJob, clashesFor } from '@/lib/services/job-assignment'
import { jobBoard, unpaidInvoices } from '@/lib/services/job-lists'
import { issueInvoice, saveDraft } from '@/lib/services/service-invoices'
import { cashPosition, dailyIncome, incomeComparison, shopMonthStart, systemHealth } from '@/lib/admin/overview'
import { calendarFeed } from '@/lib/calendar/feed'
import { setSetting } from '@/lib/settings'
import { makeUser, resetDb, uid } from './helpers/db'

async function makeService() {
  const id = uid('s')
  const category = await db.serviceCategory.create({ data: { name: `Cat ${id}`, slug: `cat-${id}` } })
  return db.service.create({ data: { name: 'Lock repair', slug: id, sku: id.toUpperCase(), price: 15000, categoryId: category.id } })
}
const todayYmd = () => new Date(Date.now() + 3_600_000).toISOString().slice(0, 10)

describe('who does the job', () => {
  beforeEach(resetDb)

  it('lets an admin give a job to a technician, and warns of a clash that day', async () => {
    const admin = await makeUser('admin')
    const tech = await makeUser('technician', { fullName: 'Paul' })
    const customer = await makeUser('customer')
    const service = await makeService()
    const a = await createStaffBooking({ serviceId: service.id, customerName: 'A', customerPhone: '1', scheduledDate: todayYmd(), scheduledTime: '10:00' }, admin)
    const b = await createStaffBooking({ serviceId: service.id, customerName: 'B', customerPhone: '2', scheduledDate: todayYmd(), scheduledTime: '10:30' }, admin)

    await assignJob(a.id, tech.id, admin)
    const second = await assignJob(b.id, tech.id, admin)
    expect(second.clashes.map((c) => c.bookingNumber)).toEqual([a.bookingNumber])
    expect(await clashesFor(a.id, tech.id)).toHaveLength(1)

    await expect(assignJob(a.id, customer.id, admin)).rejects.toThrow(AssignmentError)
    const job = await db.serviceBooking.findUniqueOrThrow({ where: { id: a.id } })
    expect(job.assignedToId).toBe(tech.id)
    expect(job.assignedAt).not.toBeNull()
  })

  it('lets a technician take a free job or hand theirs back, but never take someone else’s', async () => {
    const admin = await makeUser('admin')
    const paul = await makeUser('technician')
    const eric = await makeUser('technician')
    const service = await makeService()
    const job = await createStaffBooking({ serviceId: service.id, customerName: 'C', customerPhone: '3' }, admin)

    await assignJob(job.id, paul.id, paul)
    await expect(assignJob(job.id, eric.id, eric)).rejects.toThrow(/Only an admin/)
    await expect(assignJob(job.id, eric.id, paul)).rejects.toThrow(/Only an admin/)
    await assignJob(job.id, null, paul)
    expect((await db.serviceBooking.findUniqueOrThrow({ where: { id: job.id } })).assignedToId).toBeNull()

    // A technician recording a job gets it themselves, whatever they ask for
    const own = await createStaffBooking({ serviceId: service.id, customerName: 'D', customerPhone: '4', assignedToId: eric.id }, paul)
    expect(own.assignedToId).toBe(paul.id)
  })

  it('shows a technician their assigned jobs on the calendar, not everyone’s', async () => {
    const admin = await makeUser('admin')
    const tech = await makeUser('technician')
    const service = await makeService()
    const mine = await createStaffBooking({ serviceId: service.id, customerName: 'Mine', customerPhone: '5', scheduledDate: todayYmd(), scheduledTime: '09:00' }, admin)
    await createStaffBooking({ serviceId: service.id, customerName: 'Other', customerPhone: '6', scheduledDate: todayYmd(), scheduledTime: '11:00' }, admin)
    await assignJob(mine.id, tech.id, admin)
    const from = new Date(Date.now() - 2 * 86_400_000)
    const to = new Date(Date.now() + 2 * 86_400_000)
    const items = (await calendarFeed(tech, from, to)).filter((i) => i.source === 'booking')
    expect(items.map((i) => i.title)).toEqual(['Lock repair: Mine'])
  })
})

describe('job lists', () => {
  beforeEach(resetDb)

  it('sorts work into today, coming, open, and done-but-not-invoiced; then lists what is owed', async () => {
    const admin = await makeUser('admin')
    const tech = await makeUser('technician')
    const service = await makeService()
    const today = await createStaffBooking({ serviceId: service.id, customerName: 'T', customerPhone: '1', scheduledDate: todayYmd(), scheduledTime: '15:00', assignedToId: tech.id }, admin)
    const done = await createStaffBooking({ serviceId: service.id, customerName: 'D', customerPhone: '2', status: 'completed', assignedToId: tech.id }, admin)
    await createStaffBooking({ serviceId: service.id, customerName: 'Nobody', customerPhone: '3', status: 'in_progress' }, admin)

    const mine = await jobBoard({ assignedToId: tech.id })
    expect(mine.today.map((j) => j.id)).toEqual([today.id])
    expect(mine.toInvoice.map((j) => j.id)).toEqual([done.id])
    expect((await jobBoard({ unassigned: true })).today.map((j) => j.customer)).toEqual(['Nobody'])

    await saveDraft(done.id, { lines: [{ description: 'Repair', quantity: 1, unitPrice: 20000 }], dueDate: '2026-01-01' }, admin)
    await issueInvoice(done.id, admin)
    expect((await jobBoard({ assignedToId: tech.id })).toInvoice).toEqual([])
    const owed = await unpaidInvoices('all')
    expect(owed).toHaveLength(1)
    expect(owed[0]).toMatchObject({ customer: 'D', due: 20000 })
    expect(owed[0].daysLate).toBeGreaterThan(0)
  })
})

describe('admin overview figures come from the books', () => {
  beforeEach(resetDb)

  it('counts service income this month and where the cash went', async () => {
    const admin = await makeUser('admin')
    const service = await makeService()
    const job = await createStaffBooking({ serviceId: service.id, customerName: 'P', customerPhone: '1', status: 'completed', price: 12000 }, admin)
    await db.$transaction((tx) => recordBookingPayment(tx, { bookingId: job.id, type: 'final_payment', amount: 12000n, method: 'cash', into: Accounts.safe(), confirmedById: admin.id }))

    const income = await incomeComparison()
    expect(income.current.byStream.services).toBe(12000)
    expect(income.current.total).toBe(12000)
    const days = await dailyIncome(14)
    expect(days).toHaveLength(14)
    expect(days.at(-1)).toMatchObject({ date: todayYmd(), services: 12000 })
    const cash = await cashPosition()
    expect(cash.places.find((p) => p.label === 'Shop safe')?.amount).toBe(12000)
    expect(cash.total).toBe(12000)
  })

  it('starts months at midnight in Douala', () => {
    // 23:30 UTC on 31 Oct is already 1 Nov at the shop
    expect(shopMonthStart(new Date('2026-10-31T23:30:00Z')).toISOString()).toBe('2026-10-31T23:00:00.000Z')
    expect(shopMonthStart(new Date('2026-11-15T12:00:00Z'), 1).toISOString()).toBe('2026-09-30T23:00:00.000Z')
  })

  it('tells super admins what is not set up', async () => {
    const checks = await systemHealth()
    const by = Object.fromEntries(checks.map((c) => [c.key, c]))
    expect(by.company.state).toBe('bad') // no NIU / RCCM yet
    expect(by.ledger.state).toBe('ok')
    expect(by.email.state).toBe('bad') // tests run with email disabled
    expect(by.hours.state).toBe('warn') // public holidays not added

    await setSetting('company.profile', { name: 'SuberCraftex SARL', address: 'Akwa, Douala', phone: '699', email: '', taxId: 'M0123', registration: 'RC/DLA/2024', invoiceFooter: '' })
    expect((await systemHealth()).find((c) => c.key === 'company')?.state).toBe('ok')
  })
})
