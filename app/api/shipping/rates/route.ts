import { NextResponse } from 'next/server'
import { getSetting } from '@/lib/settings'

// GET /api/shipping/rates - Delivery prices in FCFA, the same ones orders are charged
export async function GET() {
  const rates = await getSetting('shipping.rates')
  return NextResponse.json({ currency: 'XAF', rates })
}
