// Every test talks to the test database, never to the one in .env
if (!process.env.TEST_DATABASE_URL) {
  throw new Error('Set TEST_DATABASE_URL to a disposable PostgreSQL database whose name ends in _test')
}
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL
process.env.SETTINGS_ENCRYPTION_KEY ??= 'test-settings-key-0123456789abcdef'
process.env.CRON_SECRET ??= 'test-cron-secret-0123456789'
process.env.CAMSOL_MODE ??= 'fake'
