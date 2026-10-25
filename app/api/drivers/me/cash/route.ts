import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { db } from '@/lib/db'
import { Accounts, balanceOf, statementOf } from '@/lib/ledger'

// GET /api/drivers/me/cash - Cash I hold from deliveries, and its history
export async function GET(request: NextRequest) {
  const { user } = await verifyAuth(request)
  if (!user || user.role !== 'driver') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const driver = await db.driver.findUnique({ where: { userId: user.id } })
  if (!driver) return NextResponse.json({ error: 'Driver profile not found' }, { status: 404 })
  const account = Accounts.driverCash(driver.id, driver.fullName)
  const history = await statementOf(db, account, 50)
  return NextResponse.json({
    held: Number(await balanceOf(db, account)),
    history: history.map((h) => ({ ...h, amount: Number(h.amount), balanceAfter: Number(h.balanceAfter) })),
  })
}
