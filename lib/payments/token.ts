import { createHmac, timingSafeEqual } from 'crypto'

/**
 * A guest has no login, so the order page proves it may pay for (and see the payment of)
 * an order with this token, returned when the order is created.
 */
function sign(kind: string, id: string): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set')
  return createHmac('sha256', `payment-token:${secret}`).update(`${kind}:${id}`).digest('hex').slice(0, 40)
}

export function paymentToken(kind: 'order', id: string): string {
  return sign(kind, id)
}

export function checkPaymentToken(kind: 'order', id: string, token: unknown): boolean {
  if (typeof token !== 'string' || token.length !== 40) return false
  const a = Buffer.from(token)
  const b = Buffer.from(sign(kind, id))
  return a.length === b.length && timingSafeEqual(a, b)
}
