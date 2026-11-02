import { defineConfig, devices } from '@playwright/test'

// By default the tests start their own dev server on 3100, so they never run
// against another app on 3000. Next.js runs one dev server per app folder,
// so when the demo is already running, point the tests at it instead:
// EDS_DEMO_URL=http://localhost:3001 pnpm demo:test:e2e
const existingServer = process.env.EDS_DEMO_URL
const PORT = 3100
const baseURL = existingServer ?? `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],
  webServer: existingServer
    ? undefined
    : {
        command: `pnpm exec next dev --port ${PORT}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      },
})
