import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { parseXafOrZero } from '@/lib/money'
import { startPurchase } from '@/lib/finance/purchases'

// GET /api/admin/purchases - Restocking purchases, newest first, with who funded them
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  const purchases = await db.stockPurchase.findMany({ orderBy: { createdAt: 'desc' }, take: 100, include: { fundings: true, lines: true } })
  const investors = await db.investor.findMany({
    where: { id: { in: [...new Set(purchases.flatMap((p) => p.fundings.map((f) => f.investorId)))] } },
    select: { id: true, investorNumber: true, fullName: true },
  })
  return json(purchases.map((p) => ({ ...p, fundings: p.fundings.map((f) => ({ ...f, investor: investors.find((i) => i.id === f.investorId) ?? null })) })))
}

// POST /api/admin/purchases - { source, buyerName, buyerPhone?, fundings: [{ investorId, amount }], companyAmount, notes? }
export async function POST(request: NextRequest) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  try {
    const body = await request.json()
    const purchase = await startPurchase({
      source: String(body.source ?? ''),
      buyerName: String(body.buyerName ?? ''),
      buyerPhone: body.buyerPhone ? String(body.buyerPhone) : null,
      fundings: (Array.isArray(body.fundings) ? body.fundings : []).map((f: any) => ({ investorId: String(f.investorId), amount: parseXafOrZero(f.amount, 'investor amount') })),
      companyAmount: parseXafOrZero(body.companyAmount, 'SuberCraftex amount'),
      notes: body.notes ? String(body.notes) : null,
      admin: user,
    })
    return json(purchase, { status: 201 })
  } catch (error) {
    return businessError(error)
  }
}
