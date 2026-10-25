import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { payExitInstalment } from '@/lib/investors/machines'
import { parseXaf } from '@/lib/money'

// POST /api/admin/investors/[id]/exit-instalment - { amount }: pay part of an exit owed, into free capital
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  try {
    const amount = parseXaf((await request.json()).amount)
    await db.$transaction((tx) => payExitInstalment(tx, id, amount, user.id, randomUUID()))
    await audit({ actor: user, action: 'investor.exit_instalment', targetType: 'investor', targetId: id, details: { amount } })
    return NextResponse.json({ paid: Number(amount) })
  } catch (error) {
    return businessError(error)
  }
}
