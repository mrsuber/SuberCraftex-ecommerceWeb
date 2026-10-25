import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'

type Client = Prisma.TransactionClient | typeof db

export interface AuditEntry {
  actor?: { id: string; email?: string | null } | null
  action: string
  targetType?: string
  targetId?: string
  details?: Record<string, unknown>
  ip?: string | null
}

/**
 * Record an admin action on money or settings. Pass the transaction client when the action
 * itself runs in a transaction, so the record and the change are saved together.
 * Never put secrets in `details`.
 */
export async function audit(entry: AuditEntry, client: Client = db) {
  await client.auditLog.create({
    data: {
      actorId: entry.actor?.id ?? null,
      actorEmail: entry.actor?.email ?? null,
      action: entry.action,
      targetType: entry.targetType ?? null,
      targetId: entry.targetId ?? null,
      details: JSON.parse(JSON.stringify(entry.details ?? {}, (_k, v) => (typeof v === 'bigint' ? Number(v) : v))),
      ip: entry.ip ?? null,
    },
  })
}
