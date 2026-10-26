import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { atShopTime, calendarFeed, calendarToken, toIcs, userFromCalendarToken } from '@/lib/calendar/feed'
import { createEvent, respondToEvent, updateEvent } from '@/lib/calendar/events'
import { makeUser, resetDb, uid } from './helpers/db'

const from = new Date('2026-11-01T00:00:00Z')
const to = new Date('2026-12-01T00:00:00Z')

describe('unified calendar', () => {
  beforeEach(async () => {
    await resetDb()
  })

  it('shows staff events to their attendees and roles only, and warns about clashes', async () => {
    const admin = await makeUser('admin')
    const driver = await makeUser('driver')
    const cashier = await makeUser('cashier')
    const customer = await makeUser('customer')

    await createEvent({ title: 'Drivers briefing', kind: 'meeting', startTime: '2026-11-03T08:00:00Z', endTime: '2026-11-03T09:00:00Z', roles: ['driver'] }, admin.id)
    const { event: shift } = await createEvent({ title: 'Till shift', kind: 'shift', startTime: '2026-11-04T08:00:00Z', endTime: '2026-11-04T16:00:00Z', attendeeIds: [cashier.id] }, admin.id)
    const { warnings } = await createEvent({ title: 'Stock count', kind: 'meeting', startTime: '2026-11-04T15:00:00Z', endTime: '2026-11-04T17:00:00Z', attendeeIds: [cashier.id] }, admin.id)
    expect(warnings.map((w) => w.event)).toEqual(['Till shift'])

    const titles = async (u: { id: string; role: string }) => (await calendarFeed(u, from, to)).map((i) => i.title)
    expect(await titles(driver)).toEqual(['Drivers briefing'])
    expect(await titles(cashier)).toEqual(expect.arrayContaining(['Till shift', 'Stock count']))
    expect(await titles(cashier)).not.toContain('Drivers briefing')
    expect(await titles(customer)).toEqual([])
    expect((await calendarFeed(admin, from, to)).filter((i) => i.source === 'event')).toHaveLength(3)

    await respondToEvent(shift.id, cashier.id, 'accepted')
    await expect(respondToEvent(shift.id, driver.id, 'accepted')).rejects.toThrow(/not invited/)
    await updateEvent(shift.id, { title: 'Till shift', kind: 'shift', startTime: '2026-11-05T08:00:00Z', endTime: '2026-11-05T16:00:00Z', attendeeIds: [cashier.id] })
    const moved = (await calendarFeed(cashier, from, to)).find((i) => i.title === 'Till shift')
    expect(moved?.response).toBe('invited')
  })

  it('reads bookings at shop time, and shows customers only their own', async () => {
    const admin = await makeUser('admin')
    const customer = await makeUser('customer')
    const other = await makeUser('customer')
    const category = await db.serviceCategory.create({ data: { name: 'Tailoring', slug: uid('c') } as any })
    const service = await db.service.create({ data: { name: 'Kaftan', slug: uid('s'), sku: uid('S'), price: 10000, categoryId: category.id } as any })
    await db.serviceBooking.create({
      data: { bookingNumber: uid('BK-'), serviceType: 'onsite', duration: 90, price: 10000, serviceId: service.id, userId: customer.id, customerName: 'Awa', customerEmail: customer.email, scheduledDate: new Date('2026-11-10T00:00:00Z'), scheduledTime: '14:00', endTime: '15:30', status: 'confirmed' } as any,
    })
    const mine = await calendarFeed(customer, from, to)
    expect(mine).toHaveLength(1)
    expect(mine[0]).toMatchObject({ source: 'booking', title: 'Kaftan', start: '2026-11-10T13:00:00.000Z', end: '2026-11-10T14:30:00.000Z' })
    expect(await calendarFeed(other, from, to)).toEqual([])
    expect((await calendarFeed(admin, from, to)).find((i) => i.source === 'booking')?.title).toBe('Kaftan: Awa')
    expect(atShopTime(new Date('2026-11-10T00:00:00Z'), null).timed).toBe(false)
  })

  it('shows pay day to staff on the payroll and to admins', async () => {
    const admin = await makeUser('admin')
    const cashier = await makeUser('cashier')
    expect((await calendarFeed(cashier, from, to)).some((i) => i.source === 'payday')).toBe(false)
    await db.staffPay.create({ data: { userId: cashier.id, jobTitle: 'Cashier', monthlySalary: 100_000n } })
    const days = (await calendarFeed(cashier, from, to)).filter((i) => i.source === 'payday')
    expect(days.map((d) => d.start)).toEqual(['2026-11-28T00:00:00.000Z'])
    expect((await calendarFeed(admin, from, to)).find((i) => i.source === 'payday')?.title).toMatch(/prepare/)
  })

  it('gives each person a private subscription link that cannot be forged', async () => {
    const user = await makeUser('driver')
    const token = calendarToken(user.id)
    expect(userFromCalendarToken(token)).toBe(user.id)
    expect(userFromCalendarToken(token.slice(0, -1) + (token.endsWith('A') ? 'B' : 'A'))).toBeNull()
    expect(userFromCalendarToken(`${Buffer.from('someone-else').toString('base64url')}.${token.split('.')[1]}`)).toBeNull()
    const ics = toIcs([{ id: 'event:1', source: 'event', title: 'Shift, morning; till 2', start: '2026-11-04T08:00:00.000Z', end: '2026-11-04T16:00:00.000Z', allDay: false }], 'https://x')
    expect(ics).toContain('DTSTART:20261104T080000Z')
    expect(ics).toContain('SUMMARY:Shift\\, morning\\; till 2')
  })
})
