import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for browser tests against Storybook stories:
 * screenshot regression tests for the Typography components (Chromium only)
 * and geometry tests for the Tooltip (next) component (Chromium + Firefox).
 *
 * Lives in tests/visual/ rather than the package root so release-please's
 * exclude-paths (which only match directories) keep edits to it out of stable
 * eds-core-react releases. Paths below are relative to this file, so outputs
 * and the Storybook server are pointed back at the package root.
 *
 * Set STORYBOOK_PORT to run against a Storybook on another port, e.g. when port 9000
 * is already taken by a Storybook from a different checkout.
 */
const port = process.env.STORYBOOK_PORT ?? '9000'

export default defineConfig({
  testDir: '.',
  outputDir: '../../test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: '../../playwright-report' }]],
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
    cwd: '../..',
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
