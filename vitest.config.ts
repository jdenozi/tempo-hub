import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['composables/__tests__/**/*.test.ts', 'utils/__tests__/**/*.test.ts'],
  },
})
