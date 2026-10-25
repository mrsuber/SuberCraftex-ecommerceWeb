import { NextRequest, NextResponse } from 'next/server'
import { audit } from '@/lib/audit'
import { isSuperAdmin } from '@/lib/auth/session'
import { adminOrResponse, requestIp } from '@/lib/http/admin'
import { getSetting, getSettings, setSetting, SettingKey } from '@/lib/settings'
import { EDITABLE_SETTINGS, SETTING_RULES, SettingValueError } from '@/lib/settings-rules'

// GET /api/admin/settings/business - Every business setting with its current value
export async function GET() {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const values = await getSettings(EDITABLE_SETTINGS)
  return NextResponse.json({
    canEditMoneySettings: isSuperAdmin(user),
    settings: EDITABLE_SETTINGS.map((key) => ({
      key,
      label: SETTING_RULES[key].label,
      superAdmin: SETTING_RULES[key].superAdmin,
      value: values[key],
    })),
  })
}

// PUT /api/admin/settings/business - Change settings: { values: { key: value, ... } }
export async function PUT(request: NextRequest) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const body = await request.json().catch(() => null)
  const values = body?.values
  if (!values || typeof values !== 'object') {
    return NextResponse.json({ error: 'Send the settings to change as { values: { ... } }' }, { status: 400 })
  }
  const keys = Object.keys(values) as SettingKey[]
  try {
    const validated: Partial<Record<SettingKey, unknown>> = {}
    for (const key of keys) {
      const rule = SETTING_RULES[key]
      if (!rule) return NextResponse.json({ error: `Unknown setting ${key}` }, { status: 400 })
      if (rule.superAdmin && !isSuperAdmin(user)) {
        return NextResponse.json({ error: `Only a super admin can change: ${rule.label}` }, { status: 403 })
      }
      validated[key] = rule.validate(values[key])
    }
    for (const key of keys) {
      const before = await getSetting(key)
      await setSetting(key, validated[key] as never)
      await audit({
        actor: user,
        action: 'settings.changed',
        targetType: 'setting',
        targetId: key,
        details: { before, after: validated[key] },
        ip: requestIp(request),
      })
    }
    return NextResponse.json({ saved: keys })
  } catch (error) {
    if (error instanceof SettingValueError) return NextResponse.json({ error: error.message }, { status: 400 })
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
