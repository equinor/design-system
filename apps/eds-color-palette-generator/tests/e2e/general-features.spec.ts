import { test, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import 'dotenv/config'

// Clear localStorage before each test to ensure consistent state
test.beforeEach(async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:3000/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test.describe('Reset Feature', () => {
  test('should show reset button when configuration differs from defaults', async ({
    page,
  }) => {
    // Initially, reset button should not be visible (using defaults)
    const resetButton = page.getByRole('button', {
      name: 'Reset configuration changes',
    })
    await expect(resetButton).not.toBeVisible()

    // Make a change to trigger the reset button
    const colorNameInput = page.getByTestId('color-scale-1-input-name')
    await colorNameInput.fill('Modified Color')

    // Wait for state change
    await page.waitForTimeout(300)

    // Reset button should now be visible
    await expect(resetButton).toBeVisible()
  })

  test('should reset configuration to defaults when reset button is clicked', async ({
    page,
  }) => {
    // Make changes to color name
    const colorNameInput = page.getByTestId('color-scale-1-input-name')
    const originalName = await colorNameInput.inputValue()
    await colorNameInput.fill('Modified Color')
    await page.waitForTimeout(300)

    // Verify the change was made
    await expect(colorNameInput).toHaveValue('Modified Color')

    // Click reset button
    const resetButton = page.getByRole('button', {
      name: 'Reset configuration changes',
    })
    await resetButton.click()

    // Wait for reset
    await page.waitForTimeout(300)

    // Color name should be reset to original
    await expect(colorNameInput).toHaveValue(originalName)

    // Reset button should no longer be visible
    await expect(resetButton).not.toBeVisible()
  })

  test('should reset localStorage data to defaults when resetting', async ({
    page,
  }) => {
    // Make a change to color name
    const colorNameInput = page.getByTestId('color-scale-1-input-name')
    await colorNameInput.fill('Custom Name')
    await page.waitForTimeout(300)

    // Verify localStorage has the modified color name
    const modifiedColors = await page.evaluate(() => {
      const colorsJson = localStorage.getItem('colorPalette_colors')
      return colorsJson ? JSON.parse(colorsJson) : null
    })
    expect(modifiedColors).not.toBeNull()
    expect(modifiedColors[1].name).toBe('Custom Name')

    // Click reset
    const resetButton = page.getByRole('button', {
      name: 'Reset configuration changes',
    })
    await resetButton.click()
    await page.waitForTimeout(300)

    // After reset, localStorage colors should be back to defaults
    // Note: useEffect hooks re-save defaults after reset, so localStorage is not empty
    const resetColors = await page.evaluate(() => {
      const colorsJson = localStorage.getItem('colorPalette_colors')
      return colorsJson ? JSON.parse(colorsJson) : null
    })
    expect(resetColors).not.toBeNull()
    // The second color should be 'Gray' again (default name)
    expect(resetColors[1].name).toBe('Gray')
  })
})

test.describe('Delete Color Feature', () => {
  test('should delete a single color', async ({ page }) => {
    // Verify we have the Gray color (index 1)
    await expect(page.getByTestId('color-scale-1-input-name')).toBeVisible()

    // Click remove button for the Gray color
    await page.getByTestId('color-scale-1-remove-button').click()

    // Wait for removal
    await page.waitForTimeout(300)

    // The Gray color should be removed - what was at index 2 is now at index 1
    // Check that the original color-scale-1 (Gray) is gone by checking the name changed
    const newColorAtIndex1 = page.getByTestId('color-scale-1-input-name')
    const nameValue = await newColorAtIndex1.inputValue()

    // The name should not be 'Gray' anymore (it should be 'North sea' which was at index 2)
    expect(nameValue).not.toBe('Gray')
  })

  test('should delete all colors one by one', async ({ page }) => {
    // Count initial number of color scales
    const initialColorScales = await page
      .locator('[data-testid^="color-scale-"][data-testid$="-input-name"]')
      .count()

    expect(initialColorScales).toBeGreaterThan(0)

    // Delete all colors by repeatedly clicking the first remove button
    for (let i = 0; i < initialColorScales; i++) {
      const removeButton = page.getByTestId('color-scale-0-remove-button')
      if (await removeButton.isVisible()) {
        await removeButton.click()
        await page.waitForTimeout(200)
      }
    }

    // After deleting all, there should be no color scales left
    const remainingColorScales = await page
      .locator('[data-testid^="color-scale-"][data-testid$="-input-name"]')
      .count()

    expect(remainingColorScales).toBe(0)
  })
})

test.describe('Light/Dark Color Scheme Toggle', () => {
  test('should toggle between light and dark color schemes', async ({
    page,
  }) => {
    // Find the theme toggle buttons
    const lightThemeButton = page.getByRole('radio', { name: 'Light theme' })
    const darkThemeButton = page.getByRole('radio', { name: 'Dark theme' })

    await expect(lightThemeButton).toBeVisible()
    await expect(darkThemeButton).toBeVisible()

    // Click dark theme
    await darkThemeButton.click()
    await page.waitForTimeout(300)

    // Verify dark theme is active
    await expect(darkThemeButton).toBeChecked()

    // The html element should have the dark color scheme attribute
    const colorScheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-color-scheme')
    })
    expect(colorScheme).toBe('dark')

    // Switch back to light theme
    await lightThemeButton.click()
    await page.waitForTimeout(300)

    // Verify light theme is active
    await expect(lightThemeButton).toBeChecked()

    const lightColorScheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-color-scheme')
    })
    expect(lightColorScheme).toBe('light')
  })

  test('should persist color scheme preference in localStorage', async ({
    page,
  }) => {
    const darkThemeButton = page.getByRole('radio', { name: 'Dark theme' })

    // Switch to dark theme
    await darkThemeButton.click()
    await page.waitForTimeout(300)

    // Check localStorage
    const storedScheme = await page.evaluate(() => {
      return localStorage.getItem('colorPalette_colorScheme')
    })
    expect(storedScheme).toBe('"dark"')

    // Reload the page
    await page.reload()

    // Dark theme should still be active
    await expect(darkThemeButton).toBeChecked()
  })
})

test.describe('Download Palette Config', () => {
  test('should download palette config in correct JSON format', async ({
    page,
  }) => {
    // Open the import/export popover
    const exportButton = page.getByRole('button', {
      name: 'Import and export options',
    })
    await exportButton.click()
    await page.waitForTimeout(300)

    // Set up download listener
    const downloadPromise = page.waitForEvent('download')

    // Click the palette config export button
    const paletteConfigButton = page.getByRole('button', {
      name: 'Palette config',
    })
    await paletteConfigButton.click()

    // Wait for download
    const download = await downloadPromise

    // Verify filename
    expect(download.suggestedFilename()).toBe('color-palette-config.json')

    // Save and read the downloaded file
    const downloadPath = path.join('/tmp', download.suggestedFilename())
    await download.saveAs(downloadPath)

    const fileContent = fs.readFileSync(downloadPath, 'utf-8')
    const config = JSON.parse(fileContent)

    // Verify the config has the expected structure
    expect(config).toHaveProperty('lightModeValues')
    expect(config).toHaveProperty('darkModeValues')
    expect(config).toHaveProperty('meanLight')
    expect(config).toHaveProperty('stdDevLight')
    expect(config).toHaveProperty('meanDark')
    expect(config).toHaveProperty('stdDevDark')
    expect(config).toHaveProperty('colors')

    // Verify lightModeValues and darkModeValues are arrays of numbers
    expect(Array.isArray(config.lightModeValues)).toBe(true)
    expect(Array.isArray(config.darkModeValues)).toBe(true)
    expect(config.lightModeValues.length).toBe(15)
    expect(config.darkModeValues.length).toBe(15)

    // Verify colors is an array with correct structure
    expect(Array.isArray(config.colors)).toBe(true)
    expect(config.colors.length).toBeGreaterThan(0)

    // First color should have name and either value or anchors
    const firstColor = config.colors[0]
    expect(firstColor).toHaveProperty('name')
    expect(
      firstColor.hasOwnProperty('value') || firstColor.hasOwnProperty('anchors'),
    ).toBe(true)

    // Clean up
    fs.unlinkSync(downloadPath)
  })

  test('should download CSS variables file', async ({ page }) => {
    // Open the import/export popover
    const exportButton = page.getByRole('button', {
      name: 'Import and export options',
    })
    await exportButton.click()
    await page.waitForTimeout(300)

    // Set up download listener
    const downloadPromise = page.waitForEvent('download')

    // Click the CSS variables export button
    const cssButton = page.getByRole('button', { name: 'CSS variables' })
    await cssButton.click()

    // Wait for download
    const download = await downloadPromise

    // Verify filename
    expect(download.suggestedFilename()).toBe('colors.css')

    // Save and read the downloaded file
    const downloadPath = path.join('/tmp', download.suggestedFilename())
    await download.saveAs(downloadPath)

    const fileContent = fs.readFileSync(downloadPath, 'utf-8')

    // Verify it contains CSS custom properties
    expect(fileContent).toContain(':root')
    expect(fileContent).toContain('--')

    // Clean up
    fs.unlinkSync(downloadPath)
  })
})

test.describe('Upload Palette Config', () => {
  test('should upload and apply a valid palette config', async ({ page }) => {
    // Create a test config file
    const testConfig = {
      lightModeValues: [
        0.99, 0.97, 0.94, 0.91, 0.87, 0.76, 0.62, 0.49, 0.39, 0.32, 0.24, 0.21,
        0.18, 0.14, 0.09,
      ],
      darkModeValues: [
        0.15, 0.18, 0.22, 0.26, 0.31, 0.41, 0.52, 0.63, 0.72, 0.79, 0.85, 0.88,
        0.91, 0.94, 0.97,
      ],
      meanLight: 0.6,
      stdDevLight: 2,
      meanDark: 0.7,
      stdDevDark: 2,
      colors: [
        { name: 'Test Red', value: '#ff0000' },
        { name: 'Test Blue', value: '#0000ff' },
      ],
    }

    const configPath = path.join('/tmp', 'test-palette-config.json')
    fs.writeFileSync(configPath, JSON.stringify(testConfig))

    // Open the import/export popover
    const exportButton = page.getByRole('button', {
      name: 'Import and export options',
    })
    await exportButton.click()
    await page.waitForTimeout(300)

    // Find the file input and upload the config
    const fileInput = page.locator('input[type="file"]')

    // Set the file to upload
    await fileInput.setInputFiles(configPath)

    // Wait for the config to be applied
    await page.waitForTimeout(500)

    // Verify the colors were loaded
    const firstColorName = page.getByTestId('color-scale-0-input-name')
    await expect(firstColorName).toHaveValue('Test Red')

    const secondColorName = page.getByTestId('color-scale-1-input-name')
    await expect(secondColorName).toHaveValue('Test Blue')

    // Verify there are only 2 colors now
    const colorCount = await page
      .locator('[data-testid^="color-scale-"][data-testid$="-input-name"]')
      .count()
    expect(colorCount).toBe(2)

    // Clean up
    fs.unlinkSync(configPath)
  })

  test('should show error for invalid config format', async ({ page }) => {
    // Create an invalid config file (missing required fields)
    const invalidConfig = {
      colors: [{ name: 'Test Color' }],
      // Missing required fields like lightModeValues, darkModeValues, etc.
    }

    const configPath = path.join('/tmp', 'invalid-palette-config.json')
    fs.writeFileSync(configPath, JSON.stringify(invalidConfig))

    // Open the import/export popover
    const exportButton = page.getByRole('button', {
      name: 'Import and export options',
    })
    await exportButton.click()
    await page.waitForTimeout(300)

    // Set up dialog listener for the alert
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Invalid configuration file format')
      await dialog.accept()
    })

    // Find the file input and upload the invalid config
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(configPath)

    // Wait for the dialog to appear
    await page.waitForTimeout(500)

    // Clean up
    fs.unlinkSync(configPath)
  })

  test('should show error for malformed JSON', async ({ page }) => {
    // Create a malformed JSON file
    const configPath = path.join('/tmp', 'malformed-config.json')
    fs.writeFileSync(configPath, '{ this is not valid json }')

    // Open the import/export popover
    const exportButton = page.getByRole('button', {
      name: 'Import and export options',
    })
    await exportButton.click()
    await page.waitForTimeout(300)

    // Set up dialog listener for the alert
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Could not parse configuration file')
      await dialog.accept()
    })

    // Find the file input and upload the malformed file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(configPath)

    // Wait for the dialog to appear
    await page.waitForTimeout(500)

    // Clean up
    fs.unlinkSync(configPath)
  })

  test('should handle config with anchors', async ({ page }) => {
    // Create a config with anchor-based colors
    const testConfig = {
      lightModeValues: [
        0.99, 0.97, 0.94, 0.91, 0.87, 0.76, 0.62, 0.49, 0.39, 0.32, 0.24, 0.21,
        0.18, 0.14, 0.09,
      ],
      darkModeValues: [
        0.15, 0.18, 0.22, 0.26, 0.31, 0.41, 0.52, 0.63, 0.72, 0.79, 0.85, 0.88,
        0.91, 0.94, 0.97,
      ],
      meanLight: 0.6,
      stdDevLight: 2,
      meanDark: 0.7,
      stdDevDark: 2,
      colors: [
        {
          name: 'Gradient Color',
          anchors: [
            { value: '#ff0000', step: 1 },
            { value: '#0000ff', step: 15 },
          ],
        },
      ],
    }

    const configPath = path.join('/tmp', 'anchor-palette-config.json')
    fs.writeFileSync(configPath, JSON.stringify(testConfig))

    // Open the import/export popover
    const exportButton = page.getByRole('button', {
      name: 'Import and export options',
    })
    await exportButton.click()
    await page.waitForTimeout(300)

    // Find the file input and upload the config
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(configPath)

    // Wait for the config to be applied
    await page.waitForTimeout(500)

    // Verify the color was loaded with anchors
    const colorName = page.getByTestId('color-scale-0-input-name')
    await expect(colorName).toHaveValue('Gradient Color')

    // Verify anchor inputs are visible (indicating anchor mode)
    const firstAnchorValue = page.getByTestId('color-scale-0-anchor-0-value')
    const secondAnchorValue = page.getByTestId('color-scale-0-anchor-1-value')

    await expect(firstAnchorValue).toBeVisible()
    await expect(secondAnchorValue).toBeVisible()

    // Clean up
    fs.unlinkSync(configPath)
  })
})
