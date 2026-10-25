import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { json } from '@/lib/http/json'
import { getSetting } from '@/lib/settings'
import { staffOverview } from '@/lib/payroll'

// GET /api/staff/salary - The signed-in employee's salary wallet, payslips, advances and charges
export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Sign in' }, { status: 401 })
  const overview = await staffOverview(user.id)
  if (!overview) return NextResponse.json({ error: 'You are not on the payroll' }, { status: 404 })
  return json({ ...overview, feePaidByCompany: await getSetting('payouts.salaryFeePaidByCompany'), advanceMaxPercent: await getSetting('payroll.advanceMaxPercent') })
}
