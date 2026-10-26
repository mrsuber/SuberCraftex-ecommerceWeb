import { NextRequest } from 'next/server'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { cancelSchedule } from '@/lib/apprentices/fees'

// POST /api/admin/apprentice-fees/schedules/[id]/cancel - The apprentice left: drop instalments not yet due
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  try {
    const refundable = await cancelSchedule({ scheduleId: id, admin: user })
    await audit({ actor: user, action: 'apprentice_fees.schedule_cancelled', targetType: 'fee_schedule', targetId: id, details: { refundable: Number(refundable) } })
    return json({ refundable })
  } catch (error) {
    return businessError(error)
  }
}
