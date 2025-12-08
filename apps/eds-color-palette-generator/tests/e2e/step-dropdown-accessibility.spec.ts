import { test, expect } from '@playwright/test'
import 'dotenv/config'

// Clear localStorage before each test to ensure consistent state
test.beforeEach(async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test.describe('Step Dropdown Accessibility', () => {
  test('should have accessible labels for step dropdown options', async ({
    page,
  }) => {
    // Use color-scale-1 (Gray) which starts in single-color mode
    // Click "Add second color" button to enter anchor mode
    await page.getByTestId('color-scale-1-add-second-color').click()

    // Wait for anchor mode to be active
    await page.waitForTimeout(300)

    // Verify that we have two anchors
    const firstAnchorStep = page.getByTestId('color-scale-1-anchor-0-step')
    const secondAnchorStep = page.getByTestId('color-scale-1-anchor-1-step')

    await expect(firstAnchorStep).toBeVisible()
    await expect(secondAnchorStep).toBeVisible()

    // Check that the first anchor step has an aria-label
    await expect(firstAnchorStep).toHaveAttribute(
      'aria-label',
      'Step for anchor 1',
    )

    // Check that the second anchor step has an aria-label
    await expect(secondAnchorStep).toHaveAttribute(
      'aria-label',
      'Step for anchor 2',
    )
  })

  test('should have descriptive aria-labels for disabled step options', async ({
    page,
  }) => {
    // Use color-scale-1 (Gray) which starts in single-color mode
    // Click "Add second color" button to enter anchor mode
    await page.getByTestId('color-scale-1-add-second-color').click()

    // Wait for anchor mode to be active
    await page.waitForTimeout(300)

    // Get the first anchor's step dropdown
    const firstAnchorStep = page.getByTestId('color-scale-1-anchor-0-step')

    // Get all option elements inside the first select
    const options = await firstAnchorStep.locator('option').all()

    // Find options that are disabled (used by another anchor)
    let foundDisabledOption = false
    for (const option of options) {
      const isDisabled = await option.isDisabled()
      if (isDisabled) {
        foundDisabledOption = true
        // Check that disabled options have descriptive aria-label
        const ariaLabel = await option.getAttribute('aria-label')
        expect(ariaLabel).toBeTruthy()
        expect(ariaLabel).toContain('unavailable')
        expect(ariaLabel).toContain('already used')
      }
    }

    // With two anchors (steps 1 and 15 by default), we should have at least one disabled option
    // when looking at the first anchor's dropdown (step 15 should be disabled)
    expect(foundDisabledOption).toBe(true)
  })

  test('should maintain aria-labels when adding more anchors', async ({
    page,
  }) => {
    // Use color-scale-1 (Gray) which starts in single-color mode
    // Enter anchor mode
    await page.getByTestId('color-scale-1-add-second-color').click()
    await page.waitForTimeout(300)

    // Add a third anchor
    await page.getByTestId('color-scale-1-add-anchor').click()
    await page.waitForTimeout(300)

    // Verify that all three anchors have accessible step dropdowns
    const thirdAnchorStep = page.getByTestId('color-scale-1-anchor-2-step')
    await expect(thirdAnchorStep).toBeVisible()
    await expect(thirdAnchorStep).toHaveAttribute(
      'aria-label',
      'Step for anchor 3',
    )

    // Get options from the third anchor's dropdown
    const options = await thirdAnchorStep.locator('option').all()

    // Check that disabled options have proper aria-labels
    for (const option of options) {
      const isDisabled = await option.isDisabled()
      const ariaLabel = await option.getAttribute('aria-label')

      if (isDisabled) {
        // Disabled options should have descriptive labels
        expect(ariaLabel).toContain('unavailable')
        expect(ariaLabel).toContain('already used')
      } else {
        // Available options should have simple labels
        expect(ariaLabel).toMatch(/^Step \d+$/)
      }
    }
  })

  test('should show "(used)" text in option value for visual users', async ({
    page,
  }) => {
    // Use color-scale-1 (Gray) which starts in single-color mode
    // Enter anchor mode
    await page.getByTestId('color-scale-1-add-second-color').click()
    await page.waitForTimeout(300)

    // Get the first anchor's step dropdown
    const firstAnchorStep = page.getByTestId('color-scale-1-anchor-0-step')

    // Get all option elements
    const options = await firstAnchorStep.locator('option').all()

    // Find a disabled option and verify it shows "(used)" text
    let foundUsedText = false
    for (const option of options) {
      const isDisabled = await option.isDisabled()
      if (isDisabled) {
        const text = await option.textContent()
        expect(text).toContain('(used)')
        foundUsedText = true
        break
      }
    }

    expect(foundUsedText).toBe(true)
  })
})
