import { db } from '@/lib/db'
import { adminOrResponse } from '@/lib/http/admin'
import { json } from '@/lib/http/json'
import { feeStanding, refundable } from '@/lib/apprentices/fees'

// GET /api/admin/apprentice-fees - Every apprentice with fees: what is owed, late, or refundable
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  const apprentices = await db.apprentice.findMany({
    where: { feeSchedules: { some: {} } },
    select: { id: true, fullName: true, apprenticeNumber: true, serviceTrack: true, status: true, phone: true },
    orderBy: { fullName: 'asc' },
  })
  const rows = await Promise.all(apprentices.map(async (a) => ({ ...a, standing: await feeStanding(db, a.id), refundable: await refundable(db, a.id) })))
  return json(rows)
}
