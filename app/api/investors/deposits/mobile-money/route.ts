import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { investorOrResponse } from '@/lib/investors/http'
import { requireReadyToInvest } from '@/lib/investors/agreement'
import { investorLedgerLive } from '@/lib/investors/live'
import { InvestorEngineError } from '@/lib/investors/lots'
import { CollectionError, publicCollection, startCollection } from '@/lib/payments'
import { MoneyInputError, parseXaf } from '@/lib/money'
import { rateLimit } from '@/lib/rate-limit'

// POST /api/investors/deposits/mobile-money - { amount, phone }: send a deposit prompt to my phone
export async function POST(request: NextRequest) {
  const { user, investor, response } = await investorOrResponse(request)
  if (response) return response
  try {
    if (!(await investorLedgerLive())) {
      throw new InvestorEngineError('Mobile Money deposits open once SuberCraftex has moved investor accounts to the new system.')
    }
    if (!rateLimit(`deposit:${investor.id}`, 10, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes.' }, { status: 429 })
    }
    await requireReadyToInvest(db, investor.id)
    const body = await request.json()
    const amount = parseXaf(body.amount)
    const collection = await startCollection({
      purpose: 'investor_deposit',
      targetId: investor.id,
      userId: user.id,
      amount,
      phone: body.phone,
      description: `SuberCraftex investor deposit ${investor.investorNumber}`,
    })
    return NextResponse.json(publicCollection(collection), { status: 201 })
  } catch (error) {
    if (error instanceof InvestorEngineError || error instanceof MoneyInputError || error instanceof CollectionError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    throw error
  }
}
