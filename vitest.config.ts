import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname) } },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globalSetup: ['tests/helpers/global-setup.ts'],
    setupFiles: ['tests/helpers/env.ts'],
    // Money tests share one database: run files one at a time
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 120_000,
  },
})
