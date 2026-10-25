import { NextRequest, NextResponse } from 'next/server'
import { audit } from '@/lib/audit'
import { adminOrResponse, requestIp } from '@/lib/http/admin'
import { liveCamsol } from '@/lib/payments/camsol'

// POST /api/admin/settings/payments/test - Ask PayWithCAMSOL whether the keys are accepted.
// It asks about a payment and a payout that do not exist: nothing is charged or sent.
export async function POST(request: NextRequest) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const gateway = await liveCamsol()
  if (!gateway) {
    return NextResponse.json({ collections: 'missing', payouts: 'missing' })
  }
  const result = await gateway.checkKeys()
  await audit({ actor: user, action: 'payments.keys.tested', targetType: 'settings', targetId: 'camsol', details: result, ip: requestIp(request) })
  return NextResponse.json(result)
}
