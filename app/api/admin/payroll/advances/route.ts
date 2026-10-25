import { db } from '@/lib/db'
import { adminOrResponse } from '@/lib/http/admin'
import { json } from '@/lib/http/json'

// GET /api/admin/payroll/advances - Salary advances, open ones first
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  const rows = await db.salaryAdvance.findMany({
    orderBy: [{ requestedAt: 'desc' }],
    take: 200,
    include: { user: { select: { fullName: true, email: true, phone: true } } },
  })
  const order = { requested: 0, approved: 1, repaid: 2, rejected: 3 } as const
  return json(rows.sort((a, b) => order[a.status] - order[b.status]))
}
