import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { investorOrResponse } from '@/lib/investors/http'

/**
 * POST /api/investors/disputes - { reference, message }: I disagree with an entry.
 * Becomes a high-priority complaint in Admin > Feedback, linked to the exact ledger entry;
 * SuberCraftex answers within 14 days.
 */
export async function POST(request: NextRequest) {
  const { user, investor, response } = await investorOrResponse(request)
  if (response) return response
  const body = await request.json().catch(() => ({}))
  const reference = String(body.reference ?? '').slice(0, 200)
  const message = String(body.message ?? '').trim().slice(0, 4000)
  if (!reference || !message) return NextResponse.json({ error: 'Say which entry and what is wrong' }, { status: 400 })
  const entry = await db.ledgerTransaction.findUnique({ where: { reference } })
  if (!entry) return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
  const feedback = await db.feedback.create({
    data: {
      investorId: investor.id,
      userId: user.id,
      userEmail: user.email,
      userName: investor.fullName,
      type: 'complaint',
      priority: 'high',
      subject: `Dispute: ${entry.description}`.slice(0, 200),
      message: `${message}\n\nLedger entry: ${reference} (${entry.occurredAt.toISOString()})\nAnswer due by: ${new Date(Date.now() + 14 * 86_400_000).toISOString().slice(0, 10)}`,
    },
  })
  await db.notification.create({
    data: { type: 'new_feedback', priority: 'high', title: 'An investor disputed an entry', message: `${investor.fullName}: ${entry.description}`, referenceId: feedback.id, referenceType: 'feedback', actionUrl: '/dashboard/feedback' },
  })
  return NextResponse.json({ id: feedback.id, answerDueBy: new Date(Date.now() + 14 * 86_400_000) }, { status: 201 })
}
