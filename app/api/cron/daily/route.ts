import { NextRequest, NextResponse } from 'next/server'
import { isCronRequest } from '@/lib/cron-auth'
import { db } from '@/lib/db'
import { releaseHeldProfit } from '@/lib/investors/lots'

export const dynamic = 'force-dynamic'

/**
 * POST /api/cron/daily - Run once a day (just after midnight) by the server's crontab.
 * Product profit whose holding period ended becomes withdrawable.
 */
export async function POST(request: NextRequest) {
  if (!isCronRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const released = await db.$transaction((tx) => releaseHeldProfit(tx), { timeout: 120_000 })
  return NextResponse.json({ releasedProfits: released })
}
