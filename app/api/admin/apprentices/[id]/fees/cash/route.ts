import { NextRequest } from 'next/server'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { businessError } from '@/lib/http/errors'
import { json } from '@/lib/http/json'
import { parseXaf } from '@/lib/money'
import { recordCashFeePayment } from '@/lib/apprentices/fees'

// POST /api/admin/apprentices/[id]/fees/cash - { amount, into: safe | bank | shop_momo, note? }
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await adminOrResponse()
  if (response) return response
  const { id } = await params
  try {
    const body = await request.json()
    const payment = await recordCashFeePayment({ apprenticeId: id, amount: parseXaf(body.amount), into: String(body.into ?? 'safe'), admin: user, note: body.note })
    await audit({ actor: user, action: 'apprentice_fees.cash_received', targetType: 'apprentice', targetId: id, details: { amount: Number(payment.amount), receipt: payment.receiptNumber } })
    return json(payment, { status: 201 })
  } catch (error) {
    return businessError(error)
  }
}
