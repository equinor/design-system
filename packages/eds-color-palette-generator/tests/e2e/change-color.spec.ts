import { test, expect } from '@playwright/test'
import 'dotenv/config'

test('should change color name and hex', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  // Get the first color's input field
  const colorInput = page.getByTestId('color-input-moss-green')

  // Fill in new HEX value
  await colorInput.click()
  await colorInput.fill('#ee7e17')

  // Wait for processing
  await page.waitForTimeout(300)

  // Verify that the color scale updates
  await expect(page.getByTestId('moss-green-10')).toBeVisible()
})

test('should accept OKLCH color format', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  // Get the first color input field
  const colorInput = page.getByTestId('color-input-moss-green')

  // Fill in OKLCH format
  await colorInput.click()
  await colorInput.fill('oklch(0.5 0.2 180)')

  // Wait for processing
  await page.waitForTimeout(300)

  // Verify that no error message appears
  await expect(
    page.getByTestId('color-format-error-moss-green'),
  ).not.toBeVisible()

  // Verify that the color scale updates
  await expect(page.getByTestId('moss-green-10')).toBeVisible()
})

test('should accept HEX color format', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  const colorInput = page.getByTestId('color-input-moss-green')

  // Fill in HEX format
  await colorInput.click()
  await colorInput.fill('#ff5733')

  // Wait for processing
  await page.waitForTimeout(300)

  // Verify that no error message appears
  await expect(
    page.getByTestId('color-format-error-moss-green'),
  ).not.toBeVisible()

  // Verify that the color scale updates
  await expect(page.getByTestId('moss-green-10')).toBeVisible()
})

test('should show error for invalid color format', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  const colorInput = page.getByTestId('color-input-moss-green')

  // Fill in invalid format
  await colorInput.click()
  await colorInput.fill('invalid-color')

  // Wait for validation
  await page.waitForTimeout(300)

  // Verify that error message appears
  await expect(page.getByTestId('color-format-error-moss-green')).toBeVisible()
  await expect(page.getByTestId('color-format-error-moss-green')).toHaveText(
    'Colour format is not valid',
  )

  // Verify that the input has error styling (red border)
  await expect(colorInput).toHaveClass(/border-danger-fill-emphasis-default/)
})

test('should reset to valid color on blur when invalid', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  const colorInput = page.getByTestId('color-input-moss-green')

  // Get the original valid value
  const originalValue = await colorInput.inputValue()

  // Fill in invalid format
  await colorInput.click()
  await colorInput.fill('invalid-color')

  // Wait for validation
  await page.waitForTimeout(300)

  // Verify error appears
  await expect(page.getByTestId('color-format-error-moss-green')).toBeVisible()

  // Blur the input by clicking outside (click on another element)
  await page.locator('body').click({ position: { x: 0, y: 0 } })

  // Wait a moment
  await page.waitForTimeout(300)

  // Verify that the input resets to the original value
  await expect(colorInput).toHaveValue(originalValue)

  // Verify that error message disappears
  await expect(
    page.getByTestId('color-format-error-moss-green'),
  ).not.toBeVisible()
})

test('should accept short HEX format', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  const colorInput = page.getByTestId('color-input-moss-green')

  // Fill in short HEX format
  await colorInput.click()
  await colorInput.fill('#f00')

  // Wait for processing
  await page.waitForTimeout(300)

  // Verify no error
  await expect(
    page.getByTestId('color-format-error-moss-green'),
  ).not.toBeVisible()
})

test('should accept OKLCH with percentage lightness', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  const colorInput = page.getByTestId('color-input-moss-green')

  // Fill in OKLCH with percentage
  await colorInput.click()
  await colorInput.fill('oklch(50% 0.2 180)')

  // Wait for processing
  await page.waitForTimeout(300)

  // Verify no error
  await expect(
    page.getByTestId('color-format-error-moss-green'),
  ).not.toBeVisible()
})
