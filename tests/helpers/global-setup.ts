import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

/**
 * Each test run gets its own new database, created from TEST_DATABASE_URL's server and
 * named <base>_<run id>, built with `prisma migrate deploy` (the same command production
 * uses), and dropped when the run ends. No existing database is ever reset or touched.
 */
export default async function setup() {
  const base = process.env.TEST_DATABASE_URL
  if (!base) throw new Error('Set TEST_DATABASE_URL to a PostgreSQL URL whose database name ends in _test')
  const url = new URL(base)
  const baseName = url.pathname.replace(/^\//, '')
  if (!baseName.endsWith('_test')) throw new Error(`Test database names must end in _test (got "${baseName}")`)

  const runName = `${baseName}_${Date.now().toString(36)}`
  const runUrl = new URL(base)
  runUrl.pathname = `/${runName}`
  const adminUrl = new URL(base)
  adminUrl.pathname = '/postgres'

  const admin = new PrismaClient({ datasourceUrl: adminUrl.toString() })
  await admin.$executeRawUnsafe(`CREATE DATABASE "${runName}"`)
  execSync('npx prisma migrate deploy', { env: { ...process.env, DATABASE_URL: runUrl.toString() }, stdio: 'pipe' })
  process.env.TEST_DATABASE_URL = runUrl.toString()

  return async () => {
    await admin.$executeRawUnsafe(`DROP DATABASE IF EXISTS "${runName}" WITH (FORCE)`)
    await admin.$disconnect()
  }
}
