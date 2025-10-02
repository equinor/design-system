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

test('should accept OKLCH color format', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')
  await page.getByTestId('config-button').click()

  // Get the color input field
  const colorInput = page.getByTestId('color-hex-input-0')

  // Fill in OKLCH format
  await colorInput.click()
  await colorInput.fill('oklch(0.5 0.2 180)')

  // Wait a moment for the color to be processed
  await page.waitForTimeout(100)

  // Verify that no error message appears
  await expect(page.getByTestId('color-format-error-0')).not.toBeVisible()

  // Verify that the color scale updates
  await expect(page.getByTestId('color-1-10')).toBeVisible()
})

test('should accept HEX color format', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')
  await page.getByTestId('config-button').click()

  const colorInput = page.getByTestId('color-hex-input-0')

  // Fill in HEX format
  await colorInput.click()
  await colorInput.fill('#ff5733')

  // Wait a moment for the color to be processed
  await page.waitForTimeout(100)

  // Verify that no error message appears
  await expect(page.getByTestId('color-format-error-0')).not.toBeVisible()

  // Verify that the color scale updates
  await expect(page.getByTestId('color-1-10')).toBeVisible()
})

test('should show error for invalid color format', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')
  await page.getByTestId('config-button').click()

  const colorInput = page.getByTestId('color-hex-input-0')

  // Fill in invalid format
  await colorInput.click()
  await colorInput.fill('invalid-color')

  // Wait a moment for validation to trigger
  await page.waitForTimeout(100)

  // Verify that error message appears
  await expect(page.getByTestId('color-format-error-0')).toBeVisible()
  await expect(page.getByTestId('color-format-error-0')).toHaveText(
    'Colour format is not valid',
  )

  // Verify that the input has error styling (red border)
  await expect(colorInput).toHaveClass(/border-danger-fill-emphasis-default/)
})

test('should reset to valid color on blur when invalid', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')
  await page.getByTestId('config-button').click()

  const colorInput = page.getByTestId('color-hex-input-0')

  // Get the original valid value
  const originalValue = await colorInput.inputValue()

  // Fill in invalid format
  await colorInput.click()
  await colorInput.fill('invalid-color')

  // Wait for validation
  await page.waitForTimeout(100)

  // Verify error appears
  await expect(page.getByTestId('color-format-error-0')).toBeVisible()

  // Blur the input by clicking outside
  await page.getByTestId('color-name-input-0').click()

  // Wait a moment
  await page.waitForTimeout(100)

  // Verify that the input resets to the original value
  await expect(colorInput).toHaveValue(originalValue)

  // Verify that error message disappears
  await expect(page.getByTestId('color-format-error-0')).not.toBeVisible()
})

test('should accept short HEX format', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')
  await page.getByTestId('config-button').click()

  const colorInput = page.getByTestId('color-hex-input-0')

  // Fill in short HEX format
  await colorInput.click()
  await colorInput.fill('#f00')

  // Wait for processing
  await page.waitForTimeout(100)

  // Verify no error
  await expect(page.getByTestId('color-format-error-0')).not.toBeVisible()
})

test('should accept OKLCH with percentage lightness', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')
  await page.getByTestId('config-button').click()

  const colorInput = page.getByTestId('color-hex-input-0')

  // Fill in OKLCH with percentage
  await colorInput.click()
  await colorInput.fill('oklch(50% 0.2 180)')

  // Wait for processing
  await page.waitForTimeout(100)

  // Verify no error
  await expect(page.getByTestId('color-format-error-0')).not.toBeVisible()
})
