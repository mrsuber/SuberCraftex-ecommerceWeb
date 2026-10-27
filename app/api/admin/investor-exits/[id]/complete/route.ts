import { NextRequest, NextResponse } from 'next/server'
import { isSuperAdmin } from '@/lib/auth/session'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { completeExit, ExitOption } from '@/lib/investors/exits'
import { parseXaf } from '@/lib/money'

// POST /api/admin/investor-exits/[id]/complete - { option, buyerInvestorId?, price?, instalments?, proceeds?, into? }
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  try {
    const b = await request.json()
    let choice: ExitOption
    switch (b.option) {
      case 'buy_back':
      case 'collect':
        choice = { option: b.option, note: b.note ? String(b.note).slice(0, 1000) : null }
        break
      case 'co_owner':
        choice = { option: 'co_owner', buyerInvestorId: String(b.buyerInvestorId), price: parseXaf(b.price, 'price') }
        break
      case 'company':
        choice = { option: 'company', price: parseXaf(b.price, 'price'), instalments: Number(b.instalments ?? 1) }
        break
      case 'sell':
        choice = { option: 'sell', proceeds: parseXaf(b.proceeds, 'sale price'), into: b.into }
        break
      default:
        return NextResponse.json({ error: 'Unknown option' }, { status: 400 })
    }
    await completeExit(id, choice, { ...user, superAdmin: isSuperAdmin(user) })
    return NextResponse.json({ completed: true })
  } catch (error) {
    return businessError(error)
  }
}
