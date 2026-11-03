import { defineConfig, devices } from '@playwright/test'

// The tests run against the static export in out/ (build it first; the
// test:e2e script does), served on its own port so they never reuse another
// app on 3000. To run them against a server that is already up, such as
// `pnpm demo:dev`, set EDS_DEMO_URL=http://localhost:3001/.
const existingServer = process.env.EDS_DEMO_URL
const PORT = 3100
const baseURL = existingServer ?? `http://localhost:${PORT}/`

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
        viewport: { width: 1512, height: 952 },
      },
    },
  ],
  webServer: existingServer
    ? undefined
    : {
        command: `node tests/serve.mjs out ${PORT}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 30 * 1000,
      },
})
