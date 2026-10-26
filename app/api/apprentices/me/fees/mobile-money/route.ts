import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/auth/api-auth'
import { db } from '@/lib/db'
import { CollectionError, publicCollection, startCollection } from '@/lib/payments'
import { MoneyInputError, parseXaf } from '@/lib/money'
import { rateLimit } from '@/lib/rate-limit'
import { feeStanding } from '@/lib/apprentices/fees'

// POST /api/apprentices/me/fees/mobile-money - { amount, phone }: pay fees from my phone
export async function POST(request: NextRequest) {
  const user = await requireApiAuth()
  if (!user || user.role !== 'apprentice') return NextResponse.json({ error: 'Not an apprentice' }, { status: 403 })
  const apprentice = await db.apprentice.findUnique({ where: { userId: user.id } })
  if (!apprentice) return NextResponse.json({ error: 'Apprentice profile not found' }, { status: 404 })
  if (!rateLimit(`apprentice-fee:${apprentice.id}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes.' }, { status: 429 })
  }
  try {
    const body = await request.json()
    const amount = parseXaf(body.amount)
    const { outstanding } = await feeStanding(db, apprentice.id)
    if (amount > outstanding) return NextResponse.json({ error: `Only ${outstanding} FCFA is still to pay` }, { status: 400 })
    const collection = await startCollection({
      purpose: 'apprentice_fee',
      targetId: apprentice.id,
      userId: user.id,
      amount,
      phone: body.phone || apprentice.phone,
      description: `SuberCraftex training fees ${apprentice.apprenticeNumber}`,
    })
    return NextResponse.json(publicCollection(collection), { status: 201 })
  } catch (error) {
    if (error instanceof MoneyInputError || error instanceof CollectionError) return NextResponse.json({ error: error.message }, { status: 400 })
    throw error
  }
}
