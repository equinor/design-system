import { test, expect } from '@playwright/test'

test.describe('Platform Components Home Page', () => {
  test('should display the main heading', async ({ page }) => {
    await page.goto('http://localhost:3000')

    const heading = page.locator('h1')
    await expect(heading).toHaveText('EDS Platform Components')
  })

  test('should display platform selection cards', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page.locator('text=Power Platform')).toBeVisible()
    await expect(page.locator('text=Power BI')).toBeVisible()
    await expect(page.locator('text=Low-Code Platforms')).toBeVisible()
  })

  test('should allow selecting a platform', async ({ page }) => {
    await page.goto('http://localhost:3000')

    const powerPlatformCard = page.locator('button', {
      hasText: 'Power Platform',
    })
    await powerPlatformCard.click()

    await expect(powerPlatformCard).toHaveClass(/active/)
    await expect(page.locator('text=Available Components')).toBeVisible()
  })
})
