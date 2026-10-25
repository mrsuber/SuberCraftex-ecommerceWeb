import { NextRequest, NextResponse } from 'next/server'
import { CollectionStatus } from '@prisma/client'
import { db } from '@/lib/db'
import { adminOrResponse } from '@/lib/http/admin'

// GET /api/admin/finance/collections?status= - Recent Mobile Money payments
export async function GET(request: NextRequest) {
  const { response } = await adminOrResponse()
  if (response) return response
  const status = request.nextUrl.searchParams.get('status') as CollectionStatus | null
  const rows = await db.paymentCollection.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  return NextResponse.json(
    rows.map((c) => ({
      id: c.id,
      reference: c.reference,
      purpose: c.purpose,
      targetId: c.targetId,
      amount: Number(c.amount),
      phone: c.phone,
      provider: c.provider,
      status: c.status,
      providerReference: c.providerReference,
      providerStatus: c.providerStatus,
      failureReason: c.failureReason,
      uncertain: (c.metadata as { startUncertain?: boolean })?.startUncertain === true,
      simulated: (c.metadata as { simulated?: boolean })?.simulated === true,
      createdAt: c.createdAt,
      completedAt: c.completedAt,
    }))
  )
}
