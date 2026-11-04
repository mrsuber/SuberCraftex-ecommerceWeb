import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/lib/db'
import { availableSlots, closureCovers } from '@/lib/services/booking-schedule'
import { addClosure, addPublicHolidays, HoursError, saveServiceHours, saveShopHours } from '@/lib/services/service-hours'
import { describeWeek, STANDARD_WEEK, validateWeek, WeekHours } from '@/lib/services/week-hours'
import { makeUser, resetDb, uid } from './helpers/db'
import { clearSettingsCache, getSetting, setSetting } from '@/lib/settings'

const session = vi.hoisted(() => ({ user: null as any }))
vi.mock('@/lib/auth/verify-auth', () => ({ verifyAuth: async () => ({ user: session.user, isAuthenticated: !!session.user }) }))
const { PUT: putShopHours } = await import('@/app/api/admin/service-hours/route')

const req = (method: string, body?: unknown) =>
  new Request('http://test', { method, body: body === undefined ? undefined : JSON.stringify(body), headers: { 'content-type': 'application/json' } }) as any

async function makeService(extra: Record<string, unknown> = {}) {
  const id = uid('s')
  const category = await db.serviceCategory.create({ data: { name: `Cat ${id}`, slug: `cat-${id}` } })
  return db.service.create({ data: { name: 'Lock repair', slug: id, sku: id.toUpperCase(), price: 15000, categoryId: category.id, duration: 'one_hour', ...extra } })
}

// Wednesday 4 Nov 2026, 07:00 in Douala; the next Monday is the 9th
const NOW = new Date('2026-11-04T06:00:00Z')
const day = (ymd: string) => new Date(`${ymd}T00:00:00Z`)
const slots = (service: any, ymd: string, now = NOW) => availableSlots(db, service, day(ymd), { now })

const week = (weekday: WeekHours[number], saturday: WeekHours[number] = [], sunday: WeekHours[number] = []): WeekHours => [
  sunday,
  weekday,
  weekday,
  weekday,
  weekday,
  weekday,
  saturday,
]

describe('weekly hours', () => {
  it('accepts split days and refuses overlaps, backwards and too-short periods', () => {
    const ok = validateWeek(week([{ start: '14:00', end: '17:30' }, { start: '08:00', end: '12:00' }]))
    expect(ok[1]).toEqual([{ start: '08:00', end: '12:00' }, { start: '14:00', end: '17:30' }]) // sorted
    expect(() => validateWeek(week([{ start: '08:00', end: '12:00' }, { start: '11:00', end: '15:00' }]))).toThrow(/overlap/)
    expect(() => validateWeek(week([{ start: '12:00', end: '08:00' }]))).toThrow(/end after/)
    expect(() => validateWeek(week([{ start: '08:00', end: '08:15' }]))).toThrow(/30 minutes/)
    expect(() => validateWeek(week([{ start: '8h', end: '12:00' }]))).toThrow(HoursError)
    expect(() => validateWeek([[]])).toThrow(/seven days/)
  })

  it('describes a week the way people say it', () => {
    expect(describeWeek(STANDARD_WEEK)).toBe('Mon–Sat 08:00–17:00')
    expect(describeWeek(week([{ start: '08:00', end: '12:00' }, { start: '14:00', end: '17:30' }], [{ start: '08:00', end: '13:00' }]))).toBe(
      'Mon–Fri 08:00–12:00, 14:00–17:30 · Sat 08:00–13:00',
    )
  })
})

describe('slots from hours, rules and closures', () => {
  let admin: Awaited<ReturnType<typeof makeUser>>
  beforeEach(async () => {
    await resetDb()
    admin = await makeUser('admin')
    session.user = null
  })

  it('leaves the lunch break free, and follows the shop hours until a service has its own', async () => {
    const service = await makeService()
    expect((await slots(service, '2026-11-09')).at(-1)).toBe('16:00') // standard week

    await saveShopHours(week([{ start: '08:00', end: '12:00' }, { start: '14:00', end: '17:00' }], [], [{ start: '10:00', end: '13:00' }]), admin)
    const monday = await slots(service, '2026-11-09')
    expect(monday).toContain('11:00')
    expect(monday).not.toContain('11:30') // would run into lunch
    expect(monday).not.toContain('12:30')
    expect(monday).toContain('14:00')
    expect(await slots(service, '2026-11-08')).toEqual(['10:00', '10:30', '11:00', '11:30', '12:00']) // Sunday now open
    expect(await slots(service, '2026-11-14')).toEqual([]) // Saturday now closed

    // Its own hours win, and only mornings for on-site visits
    await saveServiceHours(service.id, { mode: 'custom', week: week([{ start: '08:00', end: '11:00' }]) }, admin)
    expect(await slots(service, '2026-11-09')).toEqual(['08:00', '08:30', '09:00', '09:30', '10:00'])
    // Back to the shop's hours
    await saveServiceHours(service.id, { mode: 'shop' }, admin)
    expect(await slots(service, '2026-11-09')).toContain('14:00')
  })

  it('refuses hours that would make a service impossible to book', async () => {
    const service = await makeService()
    await expect(saveServiceHours(service.id, { mode: 'custom', week: week([]) }, admin)).rejects.toThrow(/at least one day/)
    await expect(saveShopHours(week([]), admin)).rejects.toThrow(/at least one day/)
  })

  it('applies notice and how far ahead customers may book', async () => {
    const service = await makeService()
    // 07:00 now: with 30 minutes' notice, today starts at 08:00 (the first slot)
    expect((await slots(service, '2026-11-04'))[0]).toBe('08:00')
    await saveServiceHours(service.id, { mode: 'shop', rules: { minNoticeMinutes: 1440, maxAdvanceDays: 10, bufferTime: 0 } }, admin)
    const fresh = await db.service.findUniqueOrThrow({ where: { id: service.id } })
    expect(await slots(fresh, '2026-11-04')).toEqual([])
    expect((await slots(fresh, '2026-11-05'))[0]).toBe('08:00') // 24 h from 07:00 is 07:00 tomorrow
    expect(await slots(fresh, '2026-11-14')).not.toEqual([]) // 10 days ahead
    expect(await slots(fresh, '2026-11-16')).toEqual([]) // 12 days ahead
    await expect(saveServiceHours(service.id, { mode: 'shop', rules: { bufferTime: -5 } }, admin)).rejects.toThrow(HoursError)
  })

  it('closes days for one service, for the whole shop, and every year on public holidays', async () => {
    const a = await makeService()
    const b = await makeService()
    await addClosure({ serviceId: a.id, from: '2026-11-09', to: '2026-11-10', reason: 'Technician away' }, admin)
    expect(await slots(a, '2026-11-09')).toEqual([])
    expect(await slots(a, '2026-11-10')).toEqual([])
    expect(await slots(a, '2026-11-11')).not.toEqual([])
    expect(await slots(b, '2026-11-09')).not.toEqual([])

    await addClosure({ from: '2026-11-12', reason: 'Stock-taking' }, admin)
    expect(await slots(b, '2026-11-12')).toEqual([])

    expect(await addPublicHolidays(admin)).toBe(6)
    expect(await addPublicHolidays(admin)).toBe(0) // not twice
    const now = new Date('2026-12-20T06:00:00Z')
    expect(await slots(a, '2026-12-25', now)).toEqual([]) // Christmas, a Friday
    expect(await slots(a, '2026-12-24', now)).not.toEqual([])

    // A yearly closure across New Year
    expect(closureCovers({ startDate: day('2000-12-24'), endDate: day('2000-01-02'), isRecurring: true }, day('2027-01-01'))).toBe(true)
    expect(closureCovers({ startDate: day('2000-12-24'), endDate: day('2000-01-02'), isRecurring: true }, day('2027-01-03'))).toBe(false)
    await expect(addClosure({ from: '2026-11-10', to: '2026-11-09' }, admin)).rejects.toThrow(/before/)
  })

  it('reads saved lists back as lists once the cache has expired (hours, payroll deductions)', async () => {
    const split = week([{ start: '08:00', end: '12:00' }, { start: '14:00', end: '17:00' }])
    await saveShopHours(split, admin)
    clearSettingsCache()
    const back = await getSetting('services.defaultHours')
    expect(Array.isArray(back)).toBe(true)
    expect(back).toEqual(split)
    const deductions = [{ code: 'CNPS_PENSION', label: 'CNPS pension', employeePercent: 4.2, employerPercent: 4.2, monthlyCeiling: 750000, enabled: true }]
    await setSetting('payroll.deductions', deductions)
    clearSettingsCache()
    expect(await getSetting('payroll.deductions')).toEqual(deductions)
  })

  it('lets only admins change the hours', async () => {
    session.user = await makeUser('technician')
    expect((await putShopHours(req('PUT', { week: STANDARD_WEEK }))).status).toBe(403)
    session.user = admin
    expect((await putShopHours(req('PUT', { week: week([{ start: '09:00', end: '12:00' }, { start: '10:00', end: '13:00' }]) }))).status).toBe(400)
    expect((await putShopHours(req('PUT', { week: STANDARD_WEEK }))).status).toBe(200)
  })
})
