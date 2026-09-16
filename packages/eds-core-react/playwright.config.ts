import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for browser tests against Storybook stories:
 * screenshot regression tests for the Typography components (Chromium only)
 * and geometry tests for the Tooltip (next) component (Chromium + Firefox).
 *
 * Set STORYBOOK_PORT to run against a Storybook on another port, e.g. when port 9000
 * is already taken by a Storybook from a different checkout.
 */
const port = process.env.STORYBOOK_PORT ?? '9000'

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      // Screenshot snapshots are Chromium-only; Firefox runs the geometry tests
      testMatch: /Tooltip\.next\.spec\.ts/,
    },
  ],

  webServer: {
    command: `pnpm exec storybook dev -p ${port} --ci`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
