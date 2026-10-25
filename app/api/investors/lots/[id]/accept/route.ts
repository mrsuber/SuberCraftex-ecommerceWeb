import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { investorOrResponse } from '@/lib/investors/http'
import { requireReadyToInvest } from '@/lib/investors/agreement'
import { acceptInKindLot, InvestorEngineError } from '@/lib/investors/lots'

// POST /api/investors/lots/[id]/accept - I accept the value proposed for goods I brought
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, investor, response } = await investorOrResponse(request)
  if (response) return response
  const { id } = await params
  try {
    const version = await requireReadyToInvest(db, investor.id)
    const lot = await db.$transaction((tx) => acceptInKindLot(tx, id, user.id, version))
    return NextResponse.json({ id: lot.id, status: lot.status })
  } catch (error) {
    if (error instanceof InvestorEngineError) return NextResponse.json({ error: error.message }, { status: 400 })
    throw error
  }
}
