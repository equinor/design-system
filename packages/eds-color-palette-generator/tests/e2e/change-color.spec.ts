import { test, expect } from '@playwright/test'
import 'dotenv/config'

test('should change color name and hex', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')
  await page.getByTestId('config-button').click()
  await page.getByTestId('color-name-input-0').click()
  await page.getByTestId('color-name-input-0').fill('brand')

  await page.getByTestId('color-hex-input-0').click()
  await page.getByTestId('color-hex-input-0').fill('#ee7e17')

  await expect(page.getByTestId('brand-10')).toMatchAriaSnapshot(
    '- \'button "Color 11: oklch(0.420 0.113 54.7), Click for details"\'',
  )
})
