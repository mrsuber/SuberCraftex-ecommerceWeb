import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentCamsol } from '@/lib/payments/camsol'
import { refreshCollection } from '@/lib/payments'

export const dynamic = 'force-dynamic'

/**
 * POST /api/webhooks/camsol - PayWithCAMSOL tells us a payment or payout changed.
 *
 * The signature (HMAC-SHA256 of the raw body with the webhook secret) is checked first.
 * The body is only used to find which payment it is about: the status itself is always
 * asked from PayWithCAMSOL, so a forged body could never mark anything paid.
 * Refill payments do not always send webhooks; polling and the scheduler cover that.
 */
export async function POST(request: NextRequest) {
  const raw = Buffer.from(await request.arrayBuffer())
  const signature =
    request.headers.get('x-paywithcamsol-signature') ??
    request.headers.get('x-webhook-signature') ??
    request.headers.get('x-suberpay-signature') ??
    undefined
  const gateway = await currentCamsol()
  if (!gateway || !(await gateway.verifyWebhook(raw, signature))) {
    console.warn(`[camsol] webhook refused: ${signature ? 'signature does not match' : 'no signature'}`)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let body: { event?: string; event_type?: string; data?: Record<string, unknown> } = {}
  try {
    body = JSON.parse(raw.toString('utf8'))
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const event = body.event ?? body.event_type ?? ''
  const data = body.data ?? {}
  const str = (v: unknown) => (typeof v === 'string' && v.length < 200 ? v : undefined)
  console.log(`[camsol] webhook ${event} ${JSON.stringify({ refillId: data.refillId, reference: data.reference, status: data.status })}`)

  try {
    if (event.startsWith('payout.')) {
      const payoutId = str(data.client_reference)
      if (payoutId) {
        const { refreshPayout } = await import('@/lib/payments/payouts')
        if (await db.payout.findUnique({ where: { id: payoutId } })) await refreshPayout(payoutId)
      }
    } else {
      const refillId = str(data.refillId) ?? str(data.id)
      const reference = str(data.reference)
      const collection = await db.paymentCollection.findFirst({
        where: {
          OR: [
            ...(refillId ? [{ providerReference: refillId }] : []),
            ...(reference ? [{ reference }, { providerReference: reference }] : []),
          ],
        },
      })
      if (collection) await refreshCollection(collection.reference, { force: true })
    }
  } catch (error) {
    // Acknowledge anyway: the scheduler re-checks open payments and payouts
    console.warn(`[camsol] webhook ${event} handling deferred: ${(error as Error).message}`)
  }
  return NextResponse.json({ received: true })
}
