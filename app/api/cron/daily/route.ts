import { NextRequest, NextResponse } from 'next/server'
import { isCronRequest } from '@/lib/cron-auth'
import { db } from '@/lib/db'
import { releaseHeldProfit } from '@/lib/investors/lots'
import { getSetting } from '@/lib/settings'
import { invoiceDueInstalments, sendFeeReminders } from '@/lib/apprentices/fees'

export const dynamic = 'force-dynamic'

/**
 * POST /api/cron/daily - Run once a day (just after midnight) by the server's crontab.
 * Product profit whose holding period ended becomes withdrawable. Apprentice instalments that
 * fell due become income (or owed), and late ones get one reminder. On pay day, admins are
 * reminded to prepare the month's salaries if they have not.
 */
export async function POST(request: NextRequest) {
  if (!isCronRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const released = await db.$transaction((tx) => releaseHeldProfit(tx), { timeout: 120_000 })

  const feesInvoiced = await invoiceDueInstalments()
  const feeReminders = await sendFeeReminders()

  let payrollReminder = false
  const today = new Date()
  if (today.getUTCDate() === (await getSetting('payroll.payDay'))) {
    const month = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1))
    const run = await db.payrollRun.findUnique({ where: { periodStart: month } })
    if (!run || run.status === 'draft') {
      await db.notification.create({
        data: {
          type: 'system',
          title: 'Salaries to prepare',
          message: `Pay day: prepare and approve the salaries for ${month.toISOString().slice(0, 7)}.`,
          priority: 'high',
          referenceType: 'payroll_run',
          actionUrl: '/dashboard/payroll',
        },
      })
      payrollReminder = true
    }
  }
  return NextResponse.json({ releasedProfits: released, feesInvoiced, feeReminders, payrollReminder })
}
