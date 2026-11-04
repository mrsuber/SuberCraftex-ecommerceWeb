import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import { getCurrentUser } from '@/lib/session'
import { db } from '@/lib/db'
import { formatCurrency } from '@/lib/currency'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WORK_ROLES } from '@/lib/services/booking-workflow'
import { jobBoard, JobScope, unpaidInvoices } from '@/lib/services/job-lists'
import { JobList } from '@/components/dashboard/jobs/JobList'

export const metadata: Metadata = { title: 'Jobs | Dashboard' }
export const dynamic = 'force-dynamic'

/**
 * The day's work. Technicians and tailors see their own jobs; an admin can look at anyone's,
 * at jobs nobody has taken, or at everything.
 */
export default async function JobsPage({ searchParams }: { searchParams: Promise<{ who?: string }> }) {
  const user = await getCurrentUser()
  if (!user || !WORK_ROLES.includes(user.role)) redirect('/dashboard')
  const isAdmin = user.role === 'admin'
  const { who = isAdmin ? 'all' : 'me' } = await searchParams

  let scope: JobScope = { assignedToId: user.id }
  if (isAdmin) {
    if (who === 'all') scope = 'all'
    else if (who === 'unassigned') scope = { unassigned: true }
    else if (who !== 'me') scope = { assignedToId: who }
  }
  const people = isAdmin
    ? await db.user.findMany({ where: { role: { in: ['technician', 'tailor'] }, isSuspended: false }, select: { id: true, fullName: true, email: true }, orderBy: { fullName: 'asc' } })
    : []
  const [board, unpaid] = await Promise.all([jobBoard(scope), unpaidInvoices(scope)])
  const showWho = scope === 'all' || 'unassigned' in (scope as object)

  const tabs = isAdmin
    ? [
        { key: 'all', label: 'Everyone' },
        { key: 'unassigned', label: 'Not assigned' },
        { key: 'me', label: 'Mine' },
        ...people.map((p) => ({ key: p.id, label: p.fullName ?? p.email })),
      ]
    : []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{isAdmin ? 'Jobs' : 'My jobs'}</h1>
          <p className="mt-1 text-muted-foreground">Today&apos;s visits, what is coming, and work still to bill.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/bookings/new">
            <Plus className="mr-2 h-4 w-4" /> Record a job
          </Link>
        </Button>
      </div>

      {tabs.length > 0 && (
        <nav className="flex flex-wrap gap-2" aria-label="Whose jobs">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={`/dashboard/jobs?who=${t.key}`}
              className={`rounded-full border px-3 py-1 text-sm ${who === t.key ? 'border-blue-600 bg-blue-600 text-white' : 'hover:bg-muted'}`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today ({board.today.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <JobList jobs={board.today} empty="No jobs today." showDate={false} showWho={showWho} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next 7 days ({board.upcoming.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <JobList jobs={board.upcoming} empty="Nothing booked for the coming week." showWho={showWho} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open without a date, or overdue ({board.open.length})</CardTitle>
            <CardDescription>Workshop jobs, and visits whose day has passed but are not marked done.</CardDescription>
          </CardHeader>
          <CardContent>
            <JobList jobs={board.open} empty="Nothing waiting." showWho={showWho} />
          </CardContent>
        </Card>
        <Card className={board.toInvoice.length ? 'border-amber-300' : ''}>
          <CardHeader>
            <CardTitle>Done — invoice not issued ({board.toInvoice.length})</CardTitle>
            <CardDescription>Work finished but not billed yet. Open the job and issue the invoice.</CardDescription>
          </CardHeader>
          <CardContent>
            <JobList jobs={board.toInvoice} empty="Every finished job is invoiced." showWho={showWho} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices not fully paid ({unpaid.length})</CardTitle>
          <CardDescription>
            {unpaid.length ? `${formatCurrency(unpaid.reduce((s, u) => s + u.due, 0))} still to collect.` : 'Nothing owed.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {unpaid.length > 0 && (
            <ul className="divide-y rounded-lg border text-sm">
              {unpaid.map((u) => (
                <li key={u.id}>
                  <Link href={`/dashboard/bookings/${u.bookingId}#billing`} className="flex flex-wrap justify-between gap-2 px-3 py-2 hover:bg-muted/50">
                    <span>
                      <span className="font-mono">{u.number}</span> · {u.customer} · {u.service}
                      {u.daysLate > 0 && <span className="ml-2 text-red-600">{u.daysLate} days late</span>}
                    </span>
                    <span className="font-medium tabular-nums">{formatCurrency(u.due)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
