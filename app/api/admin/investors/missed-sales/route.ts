import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { findMissedSales, recordMissedSales } from '@/lib/investors/missed-sales'

// GET /api/admin/investors/missed-sales - Delivered sales of investor-funded products never shared (read-only)
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  return json(await findMissedSales())
}

// POST /api/admin/investors/missed-sales - Record them as they should have been (super admin, before the move)
export async function POST() {
  const { user, response } = await adminOrResponse({ superAdmin: true })
  if (response) return response
  try {
    return json(await recordMissedSales(user))
  } catch (error) {
    return businessError(error)
  }
}
