import { test, expect } from '@playwright/test'
import 'dotenv/config'

// Clear localStorage before each test to ensure consistent state
test.beforeEach(async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test.describe('Anchor Color Mode', () => {
  test('should display first color (Moss Green) in anchor mode by default', async ({
    page,
  }) => {
    // First color (Moss Green) starts in anchor mode with 2 anchors
    const firstAnchorValue = page.getByTestId('color-scale-0-anchor-0-value')
    const secondAnchorValue = page.getByTestId('color-scale-0-anchor-1-value')

    await expect(firstAnchorValue).toBeVisible()
    await expect(secondAnchorValue).toBeVisible()

    // Step selectors should also be visible
    const firstAnchorStep = page.getByTestId('color-scale-0-anchor-0-step')
    const secondAnchorStep = page.getByTestId('color-scale-0-anchor-1-step')

    await expect(firstAnchorStep).toBeVisible()
    await expect(secondAnchorStep).toBeVisible()
  })

  test('should change anchor color value', async ({ page }) => {
    const firstAnchorValue = page.getByTestId('color-scale-0-anchor-0-value')

    // Change the color value
    await firstAnchorValue.click()
    await firstAnchorValue.fill('#ff0000')

    // Wait for debounce
    await page.waitForTimeout(300)

    // Verify no error is shown
    await expect(
      page.getByTestId('color-scale-0-anchor-0-format-error'),
    ).not.toBeVisible()

    // The input should contain the new value
    await expect(firstAnchorValue).toHaveValue('#ff0000')
  })

  test('should show error for invalid anchor color format', async ({
    page,
  }) => {
    const firstAnchorValue = page.getByTestId('color-scale-0-anchor-0-value')

    // Enter invalid color
    await firstAnchorValue.click()
    await firstAnchorValue.fill('not-a-color')

    // Wait for validation
    await page.waitForTimeout(300)

    // Error should appear
    await expect(
      page.getByTestId('color-scale-0-anchor-0-format-error'),
    ).toBeVisible()
    await expect(
      page.getByTestId('color-scale-0-anchor-0-format-error'),
    ).toHaveText('Color format is not valid')
  })

  test('should change anchor step position', async ({ page }) => {
    const firstAnchorStep = page.getByTestId('color-scale-0-anchor-0-step')

    // Get the initial step value
    const initialValue = await firstAnchorStep.inputValue()

    // Change to a different step (step 3)
    await firstAnchorStep.selectOption('3')

    // Verify the step changed
    await expect(firstAnchorStep).toHaveValue('3')

    // The value should be different from initial
    expect(initialValue).not.toBe('3')
  })

  test('should add a new anchor', async ({ page }) => {
    // Initially we should have 2 anchors
    await expect(page.getByTestId('color-scale-0-anchor-0-value')).toBeVisible()
    await expect(page.getByTestId('color-scale-0-anchor-1-value')).toBeVisible()
    await expect(
      page.getByTestId('color-scale-0-anchor-2-value'),
    ).not.toBeVisible()

    // Click add anchor button
    await page.getByTestId('color-scale-0-add-anchor').click()

    // Wait for UI update
    await page.waitForTimeout(300)

    // Now we should have 3 anchors
    await expect(page.getByTestId('color-scale-0-anchor-2-value')).toBeVisible()
    await expect(page.getByTestId('color-scale-0-anchor-2-step')).toBeVisible()
  })

  test('should remove an anchor', async ({ page }) => {
    // Add a third anchor first
    await page.getByTestId('color-scale-0-add-anchor').click()
    await page.waitForTimeout(300)

    // Verify third anchor exists
    await expect(page.getByTestId('color-scale-0-anchor-2-value')).toBeVisible()

    // Remove the third anchor
    await page.getByTestId('color-scale-0-anchor-2-remove').click()

    // Wait for UI update
    await page.waitForTimeout(300)

    // Third anchor should be gone
    await expect(
      page.getByTestId('color-scale-0-anchor-2-value'),
    ).not.toBeVisible()

    // First two anchors should still exist
    await expect(page.getByTestId('color-scale-0-anchor-0-value')).toBeVisible()
    await expect(page.getByTestId('color-scale-0-anchor-1-value')).toBeVisible()
  })

  test('should prevent selecting a step already used by another anchor', async ({
    page,
  }) => {
    const firstAnchorStep = page.getByTestId('color-scale-0-anchor-0-step')
    const secondAnchorStep = page.getByTestId('color-scale-0-anchor-1-step')

    // Get the step value of the second anchor
    const secondAnchorStepValue = await secondAnchorStep.inputValue()

    // Get options from first anchor's dropdown
    const options = await firstAnchorStep.locator('option').all()

    // Find the option that matches the second anchor's step
    for (const option of options) {
      const optionValue = await option.getAttribute('value')
      if (optionValue === secondAnchorStepValue) {
        // This option should be disabled
        const isDisabled = await option.isDisabled()
        expect(isDisabled).toBe(true)

        // It should show "(used)" text
        const text = await option.textContent()
        expect(text).toContain('(used)')
        break
      }
    }
  })

  test('should accept OKLCH color format in anchor mode', async ({ page }) => {
    const firstAnchorValue = page.getByTestId('color-scale-0-anchor-0-value')

    // Enter OKLCH format
    await firstAnchorValue.click()
    await firstAnchorValue.fill('oklch(0.6 0.15 200)')

    // Wait for validation
    await page.waitForTimeout(300)

    // No error should appear
    await expect(
      page.getByTestId('color-scale-0-anchor-0-format-error'),
    ).not.toBeVisible()
  })

  test('should reset invalid color on blur', async ({ page }) => {
    const firstAnchorValue = page.getByTestId('color-scale-0-anchor-0-value')

    // Get original value
    const originalValue = await firstAnchorValue.inputValue()

    // Enter invalid color
    await firstAnchorValue.click()
    await firstAnchorValue.fill('invalid-color')

    // Wait for validation
    await page.waitForTimeout(300)

    // Error should appear
    await expect(
      page.getByTestId('color-scale-0-anchor-0-format-error'),
    ).toBeVisible()

    // Blur by clicking elsewhere
    await page.locator('body').click({ position: { x: 0, y: 0 } })

    // Wait for blur handling
    await page.waitForTimeout(300)

    // Value should reset to original
    await expect(firstAnchorValue).toHaveValue(originalValue)

    // Error should disappear
    await expect(
      page.getByTestId('color-scale-0-anchor-0-format-error'),
    ).not.toBeVisible()
  })

  test('should update color scale when anchor color changes', async ({
    page,
  }) => {
    const firstAnchorValue = page.getByTestId('color-scale-0-anchor-0-value')

    // Get initial step-6 color (the anchor is on step 6 by default)
    const step6 = page.getByTestId('color-scale-0-step-5') // index 5 = step 6

    // Get initial aria-label to compare later
    const initialAriaLabel = await step6.getAttribute('aria-label')

    // Change to a very different color
    await firstAnchorValue.click()
    await firstAnchorValue.fill('#ff0000')

    // Wait for debounce and re-render
    await page.waitForTimeout(500)

    // The aria-label should have changed (contains the color value)
    const newAriaLabel = await step6.getAttribute('aria-label')
    expect(newAriaLabel).not.toBe(initialAriaLabel)
  })
})
