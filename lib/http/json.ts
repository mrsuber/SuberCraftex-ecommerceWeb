import { NextResponse } from 'next/server'

/** A JSON response where BigInt amounts (whole FCFA) are sent as plain numbers. */
export function json(data: unknown, init?: ResponseInit) {
  const body = JSON.stringify(data, (_k, v) => (typeof v === 'bigint' ? Number(v) : v))
  return new NextResponse(body, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } })
}
