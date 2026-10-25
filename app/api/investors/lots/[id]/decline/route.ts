import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { investorOrResponse } from '@/lib/investors/http'

// POST /api/investors/lots/[id]/decline - { reason }: I do not accept the value proposed
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { investor, response } = await investorOrResponse(request)
  if (response) return response
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const declined = await db.productLot.updateMany({
    where: { id, investorId: investor.id, status: 'proposed' },
    data: { status: 'declined', proposedValueNote: `Declined by the investor: ${String(body.reason ?? '').slice(0, 500)}` },
  })
  if (declined.count !== 1) return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
  await db.notification.create({
    data: { type: 'system', title: 'An investor declined a valuation', message: `${investor.fullName}: ${String(body.reason ?? '')}`.slice(0, 500), referenceId: id, referenceType: 'lot', actionUrl: `/dashboard/investors/${investor.id}` },
  })
  return NextResponse.json({ declined: true })
}
