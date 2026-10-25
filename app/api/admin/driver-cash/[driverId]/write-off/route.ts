import { NextRequest, NextResponse } from 'next/server'
import { adminOrResponse } from '@/lib/http/admin'
import { DriverCashError, writeOffShortage } from '@/lib/finance/driver-cash'
import { MoneyInputError, parseXaf } from '@/lib/money'

// POST /api/admin/driver-cash/[driverId]/write-off - { amount, reason } (super admin)
export async function POST(request: NextRequest, { params }: { params: Promise<{ driverId: string }> }) {
  const { user, response } = await adminOrResponse({ superAdmin: true })
  if (response) return response
  const { driverId } = await params
  try {
    const body = await request.json()
    await writeOffShortage({ driverId, amount: parseXaf(body.amount), reason: String(body.reason ?? ''), admin: user })
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof DriverCashError || error instanceof MoneyInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    throw error
  }
}
