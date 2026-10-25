import { NextRequest, NextResponse } from 'next/server'
import { adminOrResponse } from '@/lib/http/admin'
import { investorPortfolio, investorStatement } from '@/lib/investors/portfolio'

// GET /api/admin/investors/[id]/portfolio - The investor's view of their money, plus their statement
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  const [portfolio, statement] = await Promise.all([investorPortfolio(id), investorStatement(id, 100)])
  return NextResponse.json({ ...portfolio, statement })
}
