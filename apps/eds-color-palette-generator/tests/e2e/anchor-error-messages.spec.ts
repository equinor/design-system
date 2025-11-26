import { test, expect } from '@playwright/test'
import 'dotenv/config'

// Clear localStorage before each test to ensure consistent state
test.beforeEach(async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('should show inline error when trying to add anchor when all 15 steps are used', async ({
  page,
}) => {
  // Use color-scale-1 (Gray) which starts in single-color mode
  // First, add a second color to enter anchor mode
  await page.getByTestId('color-scale-1-add-second-color').click()

  // Wait for anchor mode to be active
  await page.waitForTimeout(300)

  // Add anchors until we have 15 (we start with 2, so add 13 more)
  for (let i = 0; i < 13; i++) {
    await page.getByTestId('color-scale-1-add-anchor').click()
    await page.waitForTimeout(100)
  }

  // Try to add one more anchor (16th) - should show error
  await page.getByTestId('color-scale-1-add-anchor').click()
  await page.waitForTimeout(300)

  // Verify inline error message appears instead of alert
  const errorMessage = page.getByTestId('color-scale-1-max-anchors-error')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toContainText(
    'All 15 steps are already in use. Remove an anchor before adding a new one.',
  )

  // Verify the error message has proper styling
  await expect(errorMessage).toHaveClass(/text-danger-subtle/)
  await expect(errorMessage).toHaveClass(/bg-danger-fill-muted/)
})

test('should clear max anchors error when removing an anchor', async ({
  page,
}) => {
  // Use color-scale-1 (Gray) which starts in single-color mode
  // First, add a second color to enter anchor mode
  await page.getByTestId('color-scale-1-add-second-color').click()

  // Wait for anchor mode to be active
  await page.waitForTimeout(300)

  // Add anchors until we have 15 (we start with 2, so add 13 more)
  for (let i = 0; i < 13; i++) {
    await page.getByTestId('color-scale-1-add-anchor').click()
    await page.waitForTimeout(100)
  }

  // Try to add one more anchor (16th) - should show error
  await page.getByTestId('color-scale-1-add-anchor').click()
  await page.waitForTimeout(300)

  // Verify inline error message appears
  const errorMessage = page.getByTestId('color-scale-1-max-anchors-error')
  await expect(errorMessage).toBeVisible()

  // Remove one anchor
  await page.getByTestId('color-scale-1-anchor-14-remove').click()
  await page.waitForTimeout(300)

  // Now add another anchor - should succeed and clear the error
  await page.getByTestId('color-scale-1-add-anchor').click()
  await page.waitForTimeout(300)

  // Verify error message is no longer visible
  await expect(errorMessage).not.toBeVisible()
})

// Note: Duplicate step error cannot be triggered via UI because the dropdown
// disables already-used step options. The validation in handleUpdateAnchor
// serves as a programmatic safeguard for edge cases.
