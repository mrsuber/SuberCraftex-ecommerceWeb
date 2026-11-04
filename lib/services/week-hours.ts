/**
 * Opening hours for one week: index 0 is Sunday … 6 is Saturday, each day a list of
 * opening windows on the shop's clock. Several windows make a split day, e.g. a lunch
 * break: [{08:00–12:00}, {14:00–17:30}]. An empty day is closed.
 *
 * This file has no imports so settings, the slot engine and the screens can all use it.
 */

export interface HoursWindow {
  start: string // "08:00"
  end: string // "12:00"
}
export type WeekHours = HoursWindow[][]

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const MAX_WINDOWS_PER_DAY = 4

/** Shop hours until an admin sets their own: Monday to Saturday, 08:00 to 17:00 */
export const STANDARD_WEEK: WeekHours = [[], ...Array.from({ length: 6 }, () => [{ start: '08:00', end: '17:00' }])]

export class HoursError extends Error {}

const TIME = /^([01]\d|2[0-3]):([0-5]\d)$/

export function minutesOf(hhmm: string): number {
  const m = TIME.exec(hhmm)
  if (!m) throw new HoursError(`"${hhmm}" is not a time like 08:30`)
  return Number(m[1]) * 60 + Number(m[2])
}

/** Check and tidy a week: valid times, start before end, windows sorted and not overlapping. */
export function validateWeek(input: unknown): WeekHours {
  if (!Array.isArray(input) || input.length !== 7) throw new HoursError('Give hours for all seven days')
  return input.map((day, d) => {
    if (!Array.isArray(day)) throw new HoursError(`${DAY_NAMES[d]}: hours are missing`)
    if (day.length > MAX_WINDOWS_PER_DAY) throw new HoursError(`${DAY_NAMES[d]}: at most ${MAX_WINDOWS_PER_DAY} opening periods`)
    const windows = day.map((w) => {
      const start = String((w as HoursWindow)?.start ?? '').trim()
      const end = String((w as HoursWindow)?.end ?? '').trim()
      let s: number, e: number
      try {
        s = minutesOf(start)
        e = minutesOf(end)
      } catch {
        throw new HoursError(`${DAY_NAMES[d]}: times must look like 08:30`)
      }
      if (e <= s) throw new HoursError(`${DAY_NAMES[d]}: ${start}–${end} must end after it starts`)
      if (e - s < 30) throw new HoursError(`${DAY_NAMES[d]}: an opening period must last at least 30 minutes`)
      return { start, end, s, e }
    })
    windows.sort((a, b) => a.s - b.s)
    for (let i = 1; i < windows.length; i++) {
      if (windows[i].s < windows[i - 1].e) {
        throw new HoursError(`${DAY_NAMES[d]}: ${windows[i - 1].start}–${windows[i - 1].end} and ${windows[i].start}–${windows[i].end} overlap`)
      }
    }
    return windows.map(({ start, end }) => ({ start, end }))
  })
}

export const isOpenSomeDay = (week: WeekHours) => week.some((day) => day.length > 0)

/** "Mon–Fri 08:00–17:00 · Sat 08:00–13:00" */
export function describeWeek(week: WeekHours): string {
  const label = (day: HoursWindow[]) => (day.length ? day.map((w) => `${w.start}–${w.end}`).join(', ') : '')
  const order = [1, 2, 3, 4, 5, 6, 0]
  const parts: string[] = []
  let i = 0
  while (i < order.length) {
    const text = label(week[order[i]])
    let j = i
    while (j + 1 < order.length && label(week[order[j + 1]]) === text) j++
    if (text) {
      const a = DAY_NAMES[order[i]].slice(0, 3)
      const b = DAY_NAMES[order[j]].slice(0, 3)
      parts.push(`${i === j ? a : `${a}–${b}`} ${text}`)
    }
    i = j + 1
  }
  return parts.length ? parts.join(' · ') : 'Closed every day'
}
