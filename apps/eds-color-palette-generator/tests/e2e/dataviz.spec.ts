import { test, expect } from '@playwright/test'
import 'dotenv/config'

const BASE = process.env.PLAYWRIGHT_URL?.replace(/\/old$/, '') || 'http://localhost:3000'

test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE}/dataviz`)
})

test.describe('Data visualisation palettes', () => {
  test('renders the categorical family by default with 8 swatches', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { name: 'EDS Data Visualisation Palettes' }),
    ).toBeVisible()
    await expect(page.getByTestId('dataviz-swatch')).toHaveCount(8)
    await expect(
      page.getByRole('heading', { name: 'Accessibility audit' }),
    ).toBeVisible()
  })

  test('switches families and updates the swatch count', async ({ page }) => {
    await page.getByRole('button', { name: 'Sequential' }).click()
    await expect(page.getByTestId('dataviz-swatch')).toHaveCount(7)

    await page.getByRole('button', { name: 'Diverging' }).click()
    await expect(page.getByTestId('dataviz-swatch')).toHaveCount(9)
  })

  test('changes the categorical count via the slider', async ({ page }) => {
    const slider = page.locator('input[type="range"]').first()
    await slider.fill('12')
    await expect(page.getByTestId('dataviz-swatch')).toHaveCount(12)
  })

  test('applies a CVD simulation and shows the patterns toggle', async ({
    page,
  }) => {
    await page.getByLabel('Vision').selectOption({ label: 'Deuteranopia (no green)' })
    const patterns = page.getByRole('checkbox', { name: 'Show patterns' })
    await patterns.check()
    await expect(patterns).toBeChecked()
    // the pairwise distinguishability matrix is shown for categorical
    await expect(
      page.getByRole('heading', { name: 'Color-to-color contrast' }),
    ).toBeVisible()
  })

  test('offers export actions', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Copy hex array' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Copy CSS variables' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Download tokens' }),
    ).toBeVisible()
  })
})
