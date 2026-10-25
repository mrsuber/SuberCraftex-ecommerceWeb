/**
 * Small fixed-window rate limiter kept in memory. The app runs as one PM2 process, so a
 * per-process counter is enough to stop scripted abuse of public endpoints.
 */
const buckets = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    if (buckets.size > 10_000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
    }
    return true
  }
  bucket.count += 1
  return bucket.count <= limit
}

/** The caller's address as Nginx forwards it. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'
}
