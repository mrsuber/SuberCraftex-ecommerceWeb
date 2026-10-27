import { NextRequest } from 'next/server'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { parseXafOrZero } from '@/lib/money'
import { proposeSplit } from '@/lib/finance/purchases'

// GET /api/admin/purchases/split?amount= - Share an amount over investors by their free capital
export async function GET(request: NextRequest) {
  const { response } = await adminOrResponse()
  if (response) return response
  try {
    return json(await proposeSplit(parseXafOrZero(request.nextUrl.searchParams.get('amount') ?? '0', 'amount')))
  } catch (error) {
    return businessError(error)
  }
}
