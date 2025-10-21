/* eslint-disable import/no-default-export */
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: ['tests/**/*', 'node_modules/**/*'],
    silent: false,
    reporters: ['verbose'],
    onConsoleLog(log, type) {
      // Suppress expected error logs from color.js during tests
      if (type === 'stderr' && log.includes('Error calculating contrast:')) {
        return false
      }
      return true
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
