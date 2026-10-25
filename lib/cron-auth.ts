import { timingSafeEqual } from 'crypto'

/**
 * Scheduled jobs call their endpoints with `Authorization: Bearer <CRON_SECRET>`.
 * Without CRON_SECRET set on the server, every call is refused: there is no default.
 */
export function isCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret || secret.length < 16) return false
  const given = request.headers.get('authorization') ?? ''
  const expected = `Bearer ${secret}`
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}
