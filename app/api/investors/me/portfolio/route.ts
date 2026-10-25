import { NextRequest, NextResponse } from 'next/server'
import { investorOrResponse } from '@/lib/investors/http'
import { investorPortfolio } from '@/lib/investors/portfolio'

// GET /api/investors/me/portfolio - Balances, lots, machine shares and their statements
export async function GET(request: NextRequest) {
  const { investor, response } = await investorOrResponse(request)
  if (response) return response
  return NextResponse.json(await investorPortfolio(investor.id))
}
