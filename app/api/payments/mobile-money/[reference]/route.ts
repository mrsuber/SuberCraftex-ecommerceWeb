import { NextRequest, NextResponse } from 'next/server'
import { CollectionError, publicCollection, refreshCollection } from '@/lib/payments'

/**
 * GET /api/payments/mobile-money/[reference] - The payment's status. The payer's page polls
 * this while it waits; each call asks PayWithCAMSOL (at most every few seconds).
 * The reference is a random id only the payer's page knows.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params
  if (!/^SCX-[0-9a-f-]{36}$/.test(reference)) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  try {
    const collection = await refreshCollection(reference)
    return NextResponse.json(publicCollection(collection))
  } catch (error) {
    if (error instanceof CollectionError) return NextResponse.json({ error: error.message }, { status: 404 })
    console.error('Error checking payment:', error)
    return NextResponse.json({ error: 'Could not check the payment' }, { status: 500 })
  }
}
