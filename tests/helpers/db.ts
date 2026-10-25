import { db } from '@/lib/db'
import { clearSettingsCache } from '@/lib/settings'

/** Empty every table except Prisma's migration record, between tests. */
export async function resetDb() {
  const tables = await db.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`
  if (tables.length > 0) {
    await db.$executeRawUnsafe(`TRUNCATE ${tables.map((t) => `"${t.tablename}"`).join(', ')} CASCADE`)
  }
  clearSettingsCache()
}

let counter = 0
export const uid = (prefix = 'x') => `${prefix}${Date.now().toString(36)}${(counter++).toString(36)}`

export async function makeUser(role: string = 'customer', extra: Record<string, unknown> = {}) {
  const id = uid('u')
  return db.user.create({
    data: { email: `${id}@test.local`, passwordHash: 'x', role: role as any, fullName: `User ${id}`, emailVerified: true, ...extra },
  })
}

export async function makeProduct(extra: Record<string, unknown> = {}) {
  const id = uid('p')
  return db.product.create({
    data: { name: `Product ${id}`, slug: id, sku: id.toUpperCase(), price: 10000, inventoryCount: 10, ...extra },
  })
}
