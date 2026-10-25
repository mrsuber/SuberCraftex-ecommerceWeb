import { NextResponse } from 'next/server'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { previewMigration, runMigration } from '@/lib/investors/migration'

// GET /api/admin/investors/migration - What moving investor balances into the ledger would do (changes nothing)
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  return NextResponse.json(await previewMigration())
}

// POST /api/admin/investors/migration - Move them, once (super admin)
export async function POST() {
  const { user, response } = await adminOrResponse({ superAdmin: true })
  if (response) return response
  try {
    return NextResponse.json(await runMigration(user))
  } catch (error) {
    return businessError(error)
  }
}
