import { NextRequest, NextResponse } from 'next/server'
import { audit } from '@/lib/audit'
import { adminOrResponse, requestIp } from '@/lib/http/admin'
import {
  camsolStatus,
  CamsolSettingsError,
  clearCamsolKeys,
  KEY_LABELS,
  saveCamsolKeys,
} from '@/lib/payments/camsol/settings'

// GET /api/admin/settings/payments - Which PayWithCAMSOL keys are in use (never the keys)
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  return NextResponse.json(await camsolStatus())
}

// PUT /api/admin/settings/payments - Save PayWithCAMSOL keys (super admin)
export async function PUT(request: NextRequest) {
  const { user, response } = await adminOrResponse({ superAdmin: true })
  if (response) return response
  try {
    const body = await request.json()
    const changed = await saveCamsolKeys({
      secretKey: body.secretKey,
      payoutKeyId: body.payoutKeyId,
      payoutSecret: body.payoutSecret,
      webhookSecret: body.webhookSecret,
      baseUrl: body.baseUrl,
    })
    await audit({
      actor: user,
      action: 'payments.keys.saved',
      targetType: 'settings',
      targetId: 'camsol',
      details: { changed: changed.map((f) => KEY_LABELS[f]), baseUrl: body.baseUrl ?? null },
      ip: requestIp(request),
    })
    return NextResponse.json(await camsolStatus())
  } catch (error) {
    if (error instanceof CamsolSettingsError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error('Error saving payment keys:', error)
    return NextResponse.json({ error: 'Failed to save the keys' }, { status: 500 })
  }
}

// DELETE /api/admin/settings/payments - Remove saved keys (super admin)
export async function DELETE(request: NextRequest) {
  const { user, response } = await adminOrResponse({ superAdmin: true })
  if (response) return response
  await clearCamsolKeys()
  await audit({ actor: user, action: 'payments.keys.removed', targetType: 'settings', targetId: 'camsol', ip: requestIp(request) })
  return NextResponse.json(await camsolStatus())
}
