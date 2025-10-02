import { test, expect } from '@playwright/test'
import 'dotenv/config'

test('should change color name and hex', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  // Use stable test IDs that don't change when name changes
  await page.getByTestId('color-scale-0-input-name').fill('Brand')

  await page.getByTestId('color-scale-0-input-hex').click()
  await page.getByTestId('color-scale-0-input-hex').fill('#ee7e17')

  // Test the 11th color step (index 10) using stable test ID
  await expect(page.getByTestId('color-scale-0-step-10')).toMatchAriaSnapshot(
    '- \'button "Color 11: oklch(0.420 0.113 54.7), Click for details"\'',
  )
})
