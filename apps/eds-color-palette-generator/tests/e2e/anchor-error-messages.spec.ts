import { test, expect } from '@playwright/test'
import 'dotenv/config'

test('should show inline error when trying to add anchor when all 15 steps are used', async ({
  page,
}) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  // First, add a second color to enter anchor mode
  await page.getByTestId('color-scale-0-add-second-color').click()

  // Wait for anchor mode to be active
  await page.waitForTimeout(300)

  // Add anchors until we have 15 (we start with 2, so add 13 more)
  for (let i = 0; i < 13; i++) {
    await page.getByTestId('color-scale-0-add-anchor').click()
    await page.waitForTimeout(100)
  }

  // Try to add one more anchor (16th) - should show error
  await page.getByTestId('color-scale-0-add-anchor').click()
  await page.waitForTimeout(300)

  // Verify inline error message appears instead of alert
  const errorMessage = page.getByTestId('color-scale-0-max-anchors-error')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toContainText(
    'All 15 steps are already in use. Remove an anchor before adding a new one.',
  )

  // Verify the error message has proper styling
  await expect(errorMessage).toHaveClass(/text-danger-subtle/)
  await expect(errorMessage).toHaveClass(/bg-danger-fill-muted/)
})

test('should show inline error when selecting a duplicate step', async ({
  page,
}) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  // First, add a second color to enter anchor mode
  await page.getByTestId('color-scale-0-add-second-color').click()

  // Wait for anchor mode to be active
  await page.waitForTimeout(300)

  // Add one more anchor so we have 3 anchors
  await page.getByTestId('color-scale-0-add-anchor').click()
  await page.waitForTimeout(300)

  // Get the first anchor's step value
  const firstAnchorStep = page.getByTestId('color-scale-0-anchor-0-step')
  const firstStepValue = await firstAnchorStep.inputValue()

  // Try to change the second anchor to the same step as the first
  const secondAnchorStep = page.getByTestId('color-scale-0-anchor-1-step')
  await secondAnchorStep.selectOption(firstStepValue)

  // Wait for validation
  await page.waitForTimeout(300)

  // Verify inline error message appears
  const errorMessage = page.getByTestId('color-scale-0-duplicate-step-error')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toContainText(
    'Step value already used by another anchor. Please choose a unique step.',
  )

  // Verify the error message has proper styling
  await expect(errorMessage).toHaveClass(/text-danger-subtle/)
  await expect(errorMessage).toHaveClass(/bg-danger-fill-muted/)
})

test('should clear duplicate step error when selecting a valid step', async ({
  page,
}) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  // Add a second color to enter anchor mode
  await page.getByTestId('color-scale-0-add-second-color').click()
  await page.waitForTimeout(300)

  // Add one more anchor
  await page.getByTestId('color-scale-0-add-anchor').click()
  await page.waitForTimeout(300)

  // Get the first anchor's step value
  const firstAnchorStep = page.getByTestId('color-scale-0-anchor-0-step')
  const firstStepValue = await firstAnchorStep.inputValue()

  // Try to change the second anchor to the same step (trigger error)
  const secondAnchorStep = page.getByTestId('color-scale-0-anchor-1-step')
  await secondAnchorStep.selectOption(firstStepValue)
  await page.waitForTimeout(300)

  // Verify error appears
  const errorMessage = page.getByTestId('color-scale-0-duplicate-step-error')
  await expect(errorMessage).toBeVisible()

  // Now select a different valid step
  // Find an available step by checking all options that are not disabled
  const availableSteps = await page
    .locator('select[data-testid="color-scale-0-anchor-1-step"] option:not([disabled])')
    .all()
  const availableStepValue = await availableSteps[0].getAttribute('value')
  if (availableStepValue && availableStepValue !== firstStepValue) {
    await secondAnchorStep.selectOption(availableStepValue)
  }
  await page.waitForTimeout(300)

  // Verify error disappears
  await expect(errorMessage).not.toBeVisible()
})
