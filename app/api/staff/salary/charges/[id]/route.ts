import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { respondToCharge } from '@/lib/payroll'

// POST /api/staff/salary/charges/[id] - { accept, note? }: accept a charge, or dispute it
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Sign in' }, { status: 401 })
  const { id } = await params
  try {
    const body = await request.json()
    const charge = await respondToCharge({ chargeId: id, userId: user.id, accept: body.accept === true, note: body.note })
    if (charge.status === 'disputed') {
      await db.notification.create({
        data: { type: 'system', title: 'Charge disputed', message: `${user.fullName ?? user.email} disputes ${charge.amount} FCFA: ${charge.employeeNote}`, priority: 'high', referenceId: charge.id, referenceType: 'staff_charge', actionUrl: '/dashboard/payroll' },
      })
    }
    return json(charge)
  } catch (error) {
    return businessError(error)
  }
}
