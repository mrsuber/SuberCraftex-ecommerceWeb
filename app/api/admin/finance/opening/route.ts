import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { adminOrResponse, requestIp } from '@/lib/http/admin'
import { AccountRef, Accounts, balanceOf, credit, debit, post } from '@/lib/ledger'
import { MoneyInputError, parseXafOrZero } from '@/lib/money'

const PLACES: Record<string, () => AccountRef> = {
  camsol: Accounts.camsol,
  safe: Accounts.safe,
  bank: Accounts.bank,
  shop_momo: Accounts.shopMobileMoney,
}

/**
 * POST /api/admin/finance/opening - { place: camsol | safe | bank | shop_momo, amount }
 * Records what a place held on the day the ledger started (super admin, once per place).
 * After that, the ledger follows every movement.
 */
export async function POST(request: NextRequest) {
  const { user, response } = await adminOrResponse({ superAdmin: true })
  if (response) return response
  try {
    const body = await request.json()
    const place = PLACES[body.place]
    if (!place) return NextResponse.json({ error: 'Choose camsol, safe, bank or shop_momo' }, { status: 400 })
    const amount = parseXafOrZero(body.amount)
    const reference = `opening:${body.place}`
    if (await db.ledgerTransaction.findUnique({ where: { reference } })) {
      return NextResponse.json({ error: 'The opening balance for this place was already recorded' }, { status: 400 })
    }
    if (amount > 0n) {
      await db.$transaction((tx) =>
        post(tx, {
          type: 'opening_balance',
          reference,
          description: `Opening balance: ${place().name}`,
          createdById: user.id,
          postings: [debit(place(), amount), credit(Accounts.openingBalances(), amount)],
        })
      )
    }
    await audit({ actor: user, action: 'finance.opening_balance', targetType: 'account', targetId: place().key, details: { amount }, ip: requestIp(request) })
    return NextResponse.json({ place: body.place, balance: Number(await balanceOf(db, place())) })
  } catch (error) {
    if (error instanceof MoneyInputError) return NextResponse.json({ error: error.message }, { status: 400 })
    throw error
  }
}
