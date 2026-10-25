import { NextRequest } from 'next/server'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { decideDispute } from '@/lib/payroll'

// POST /api/admin/payroll/charges/[id] - { uphold }: a super admin settles a dispute, or withdraws a charge
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse({ superAdmin: true })
  if (response) return response
  const { id } = await params
  try {
    const { uphold } = await request.json()
    const charge = await decideDispute({ chargeId: id, uphold: uphold === true, admin: user })
    await audit({ actor: user, action: uphold ? 'payroll.charge_upheld' : 'payroll.charge_withdrawn', targetType: 'staff_charge', targetId: id })
    return json(charge)
  } catch (error) {
    return businessError(error)
  }
}
