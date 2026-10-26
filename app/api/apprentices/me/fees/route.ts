import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/auth/api-auth'
import { db } from '@/lib/db'
import { json } from '@/lib/http/json'
import { apprenticeFees } from '@/lib/apprentices/fees'

// GET /api/apprentices/me/fees - My fees: what is due, paid, and my receipts
export async function GET() {
  const user = await requireApiAuth()
  if (!user || user.role !== 'apprentice') return NextResponse.json({ error: 'Not an apprentice' }, { status: 403 })
  const apprentice = await db.apprentice.findUnique({ where: { userId: user.id } })
  if (!apprentice) return NextResponse.json({ error: 'Apprentice profile not found' }, { status: 404 })
  return json({ apprenticeId: apprentice.id, phone: apprentice.phone, ...(await apprenticeFees(apprentice.id)) })
}
