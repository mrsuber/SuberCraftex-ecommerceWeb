import { NextRequest } from 'next/server'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { waiveInstalment } from '@/lib/apprentices/fees'

// POST /api/admin/apprentice-fees/instalments/[id]/waive - { reason }: forgive what is unpaid (super admin)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse({ superAdmin: true })
  if (response) return response
  const { id } = await params
  try {
    const { reason } = await request.json()
    const inst = await waiveInstalment({ instalmentId: id, reason: String(reason ?? ''), admin: user })
    await audit({ actor: user, action: 'apprentice_fees.waived', targetType: 'fee_instalment', targetId: id, details: { reason } })
    return json(inst)
  } catch (error) {
    return businessError(error)
  }
}
