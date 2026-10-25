import { NextRequest, NextResponse } from 'next/server'
import { adminOrResponse } from '@/lib/http/admin'
import { cancelExit } from '@/lib/investors/exits'

// POST /api/admin/investor-exits/[id]/cancel - The investor changed their mind
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  await cancelExit(id, user)
  return NextResponse.json({ cancelled: true })
}
