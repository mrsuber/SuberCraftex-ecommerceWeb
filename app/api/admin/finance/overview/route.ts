import { NextResponse } from 'next/server'
import { adminOrResponse } from '@/lib/http/admin'
import { financeOverview } from '@/lib/finance/overview'

// GET /api/admin/finance/overview - Where money sits and who it belongs to
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  return NextResponse.json(await financeOverview())
}
