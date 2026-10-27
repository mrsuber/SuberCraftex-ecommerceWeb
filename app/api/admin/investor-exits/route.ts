import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminOrResponse } from '@/lib/http/admin'

// GET /api/admin/investor-exits - Investors asking to leave a product lot or machine share
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  const exits = await db.investorExit.findMany({ orderBy: { requestedAt: 'desc' }, take: 100 })
  const investors = await db.investor.findMany({ where: { id: { in: exits.map((e) => e.investorId) } }, select: { id: true, fullName: true, investorNumber: true } })
  return NextResponse.json(
    exits.map((e) => ({
      ...e,
      valuation: e.valuation !== null ? Number(e.valuation) : null,
      price: e.price !== null ? Number(e.price) : null,
      unitsMilli: e.unitsMilli !== null ? Number(e.unitsMilli) : null,
      boughtBackMilli: e.boughtBackMilli !== null ? Number(e.boughtBackMilli) : null,
      investor: investors.find((i) => i.id === e.investorId) ?? null,
    }))
  )
}
