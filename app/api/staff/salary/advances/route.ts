import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { parseXaf } from '@/lib/money'
import { requestAdvance } from '@/lib/payroll'

// POST /api/staff/salary/advances - { amount, reason, months? }: ask for part of the salary early
export async function POST(request: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Sign in' }, { status: 401 })
  try {
    const body = await request.json()
    const advance = await requestAdvance({ userId: user.id, amount: parseXaf(body.amount), reason: String(body.reason ?? ''), months: Number(body.months ?? 1) })
    await db.notification.create({
      data: { type: 'system', title: 'Salary advance requested', message: `${user.fullName ?? user.email} asks for ${advance.amount} FCFA: ${advance.reason}`, referenceId: advance.id, referenceType: 'salary_advance', actionUrl: '/dashboard/payroll' },
    })
    return json(advance, { status: 201 })
  } catch (error) {
    return businessError(error)
  }
}
