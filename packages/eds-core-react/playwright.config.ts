import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for visual regression testing of Typography components
 * Tests run against Storybook stories to ensure visual consistency
 */
export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:9000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm storybook',
    url: 'http://localhost:9000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
