import { test, expect } from '@playwright/test'
import 'dotenv/config'

test('should change color name and hex', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  // Use stable test IDs that don't change when name changes
  await page.getByTestId('color-scale-0-input-name').fill('Brand')

  await page.getByTestId('color-scale-0-input-color').click()
  await page.getByTestId('color-scale-0-input-color').fill('#ee7e17')

  // Test the 11th color step (index 10) using stable test ID
  await expect(page.getByTestId('color-scale-0-step-10')).toMatchAriaSnapshot(
    '- \'button "Color 11: oklch(0.420 0.113 54.7), Click for details"\'',
  )
})

test('should accept OKLCH color format', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  // Get the first color input field using stable test ID
  const colorInput = page.getByTestId('color-scale-0-input-color')

  // Fill in OKLCH format
  await colorInput.click()
  await colorInput.fill('oklch(0.5 0.2 180)')

  // Wait for processing
  await page.waitForTimeout(300)

  // Verify that no error message appears
  await expect(page.getByTestId('color-scale-0-format-error')).not.toBeVisible()

  // Verify that the color scale updates
  await expect(page.getByTestId('color-scale-0-step-10')).toBeVisible()
})

test('should accept HEX color format', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  const colorInput = page.getByTestId('color-scale-0-input-color')

  // Fill in HEX format
  await colorInput.click()
  await colorInput.fill('#ff5733')

  // Wait for processing
  await page.waitForTimeout(300)

  // Verify that no error message appears
  await expect(page.getByTestId('color-scale-0-format-error')).not.toBeVisible()

  // Verify that the color scale updates
  await expect(page.getByTestId('color-scale-0-step-10')).toBeVisible()
})

test('should show error for invalid color format', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  const colorInput = page.getByTestId('color-scale-0-input-color')

  // Fill in invalid format
  await colorInput.click()
  await colorInput.fill('invalid-color')

  // Wait for validation
  await page.waitForTimeout(300)

  // Verify that error message appears
  await expect(page.getByTestId('color-scale-0-format-error')).toBeVisible()
  await expect(page.getByTestId('color-scale-0-format-error')).toHaveText(
    'Colour format is not valid',
  )

  // Verify that the input has error styling (red border)
  await expect(colorInput).toHaveClass(/border-danger-fill-emphasis-default/)
})

test('should reset to valid color on blur when invalid', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')

  const colorInput = page.getByTestId('color-scale-0-input-color')

  // Get the original valid value
  const originalValue = await colorInput.inputValue()

  // Fill in invalid format
  await colorInput.click()
  await colorInput.fill('invalid-color')

  // Wait for validation
  await page.waitForTimeout(300)

  // Verify error appears
  await expect(page.getByTestId('color-scale-0-format-error')).toBeVisible()

  // Blur the input by clicking outside (click on another element)
  await page.locator('body').click({ position: { x: 0, y: 0 } })

  // Wait a moment
  await page.waitForTimeout(300)

  // Verify that the input resets to the original value
  await expect(colorInput).toHaveValue(originalValue)

  // Verify that error message disappears
  await expect(page.getByTestId('color-scale-0-format-error')).not.toBeVisible()
})

const colorFormatTests = [
  { name: 'should accept short HEX format', value: '#f00' },
  {
    name: 'should accept OKLCH with percentage lightness',
    value: 'oklch(50% 0.2 180)',
  },
  { name: 'should accept RGB color format', value: 'rgb(255, 0, 0)' },
  { name: 'should accept HSL color format', value: 'hsl(0, 100%, 50%)' },
  { name: 'should accept named colors', value: 'red' },
]

for (const { name, value } of colorFormatTests) {
  test(name, async ({ page }) => {
    await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')
    const colorInput = page.getByTestId('color-scale-0-input-color')
    await colorInput.click()
    await colorInput.fill(value)
    await page.waitForTimeout(300)
    await expect(
      page.getByTestId('color-scale-0-format-error'),
    ).not.toBeVisible()
  })
}
