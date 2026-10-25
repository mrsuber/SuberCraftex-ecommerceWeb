import { NextRequest, NextResponse } from 'next/server'
import { investorOrResponse } from '@/lib/investors/http'
import { withdrawalQuote } from '@/lib/investors/funds'
import { parseXaf } from '@/lib/money'

// GET /api/investors/withdrawals/quote?from=cash|profit&amount= - Fee, total and the most I can send
export async function GET(request: NextRequest) {
  const { investor, response } = await investorOrResponse(request)
  if (response) return response
  const from = request.nextUrl.searchParams.get('from') === 'profit' ? 'profit' : 'cash'
  const raw = request.nextUrl.searchParams.get('amount')
  let amount: bigint | null = null
  try {
    amount = raw ? parseXaf(raw) : null
  } catch {
    amount = null
  }
  const q = await withdrawalQuote(investor.id, from, amount)
  return NextResponse.json({
    from,
    balance: Number(q.balance),
    max: Number(q.max),
    quote: q.quote ? { amount: Number(q.quote.amount), fee: Number(q.quote.fee), fromAccount: Number(q.quote.fromWallet), enough: q.quote.fromWallet <= q.balance } : null,
  })
}
