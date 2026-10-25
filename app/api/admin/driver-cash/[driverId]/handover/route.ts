import { NextRequest, NextResponse } from 'next/server'
import { adminOrResponse } from '@/lib/http/admin'
import { DriverCashError, recordHandover } from '@/lib/finance/driver-cash'
import { MoneyInputError, parseXaf } from '@/lib/money'

// POST /api/admin/driver-cash/[driverId]/handover - { amount, into: safe | bank, notes? }
export async function POST(request: NextRequest, { params }: { params: Promise<{ driverId: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { driverId } = await params
  try {
    const body = await request.json()
    const handover = await recordHandover({ driverId, amount: parseXaf(body.amount), into: body.into ?? 'safe', notes: body.notes, admin: user })
    return NextResponse.json({ ...handover, amount: Number(handover.amount), heldBefore: Number(handover.heldBefore) }, { status: 201 })
  } catch (error) {
    if (error instanceof DriverCashError || error instanceof MoneyInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    throw error
  }
}
