import { NextResponse } from 'next/server'
import { adminOrResponse } from '@/lib/http/admin'
import { driverCashBalances } from '@/lib/finance/driver-cash'

// GET /api/admin/driver-cash - Cash each driver holds from deliveries
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  const rows = await driverCashBalances()
  return NextResponse.json(
    rows.map((r) => ({
      ...r,
      held: Number(r.held),
      lastHandover: r.lastHandover ? { ...r.lastHandover, amount: Number(r.lastHandover.amount), heldBefore: Number(r.lastHandover.heldBefore) } : null,
    }))
  )
}
