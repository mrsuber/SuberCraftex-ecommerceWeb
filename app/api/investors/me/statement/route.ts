import { NextRequest, NextResponse } from 'next/server'
import { investorOrResponse } from '@/lib/investors/http'
import { investorStatement, statementCsv } from '@/lib/investors/portfolio'

// GET /api/investors/me/statement?format=csv - Every movement on my accounts
export async function GET(request: NextRequest) {
  const { investor, response } = await investorOrResponse(request)
  if (response) return response
  const rows = await investorStatement(investor.id, 5000)
  if (request.nextUrl.searchParams.get('format') === 'csv') {
    return new NextResponse(statementCsv(rows), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="statement-${investor.investorNumber}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  }
  return NextResponse.json(rows.slice(0, 200))
}
