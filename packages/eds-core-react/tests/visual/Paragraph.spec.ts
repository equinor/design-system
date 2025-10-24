import { test, expect } from '@playwright/test'

/**
 * Visual regression tests for Paragraph component
 * Tests all paragraph sizes and property combinations
 */
test.describe('Paragraph Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/iframe.html?id=typography-paragraph--playground&viewMode=story',
    )
    await page.waitForLoadState('networkidle')
  })

  test('default paragraph', async ({ page }) => {
    await expect(page).toHaveScreenshot('paragraph-default.png', {
      animations: 'disabled',
    })
  })

  test.describe('Text Sizes', () => {
    const sizes = [
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
      '6xl',
    ]

    for (const size of sizes) {
      test(`size ${size}`, async ({ page }) => {
        await page.goto(
          `/iframe.html?id=typography-paragraph--playground&args=size:${size}&viewMode=story`,
        )
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveScreenshot(`paragraph-size-${size}.png`, {
          animations: 'disabled',
        })
      })
    }
  })

  test.describe('Line Heights', () => {
    const lineHeights = ['default', 'squished']

    for (const lineHeight of lineHeights) {
      test(`line height ${lineHeight}`, async ({ page }) => {
        await page.goto(
          `/iframe.html?id=typography-paragraph--playground&args=lineHeight:${lineHeight}&viewMode=story`,
        )
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveScreenshot(
          `paragraph-lineheight-${lineHeight}.png`,
          {
            animations: 'disabled',
          },
        )
      })
    }
  })

  test.describe('Font Weights', () => {
    const weights = ['lighter', 'normal', 'bolder']

    for (const weight of weights) {
      test(`weight ${weight}`, async ({ page }) => {
        await page.goto(
          `/iframe.html?id=typography-paragraph--playground&args=weight:${weight}&viewMode=story`,
        )
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveScreenshot(`paragraph-weight-${weight}.png`, {
          animations: 'disabled',
        })
      })
    }
  })

  test.describe('Letter Spacing (Tracking)', () => {
    const trackings = ['tight', 'normal', 'wide']

    for (const tracking of trackings) {
      test(`tracking ${tracking}`, async ({ page }) => {
        await page.goto(
          `/iframe.html?id=typography-paragraph--playground&args=tracking:${tracking}&viewMode=story`,
        )
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveScreenshot(
          `paragraph-tracking-${tracking}.png`,
          {
            animations: 'disabled',
          },
        )
      })
    }
  })

  test.describe('Baseline Alignment with Grid', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl']

    for (const size of sizes) {
      test(`size ${size} with debug mode`, async ({ page }) => {
        await page.goto(
          `/iframe.html?id=typography-paragraph--playground&args=size:${size};debug:true&viewMode=story`,
        )
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveScreenshot(`paragraph-${size}-debug.png`, {
          animations: 'disabled',
        })
      })
    }
  })

  test.describe('Combined Properties', () => {
    test('large bold tight', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-paragraph--playground&args=size:lg;weight:bolder;tracking:tight;lineHeight:default&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('paragraph-lg-bold-tight.png', {
        animations: 'disabled',
      })
    })

    test('small lighter wide', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-paragraph--playground&args=size:sm;weight:lighter;tracking:wide;lineHeight:default&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('paragraph-sm-lighter-wide.png', {
        animations: 'disabled',
      })
    })

    test('medium squished', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-paragraph--playground&args=size:md;lineHeight:squished&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('paragraph-md-squished.png', {
        animations: 'disabled',
      })
    })

    test('extra large bold normal', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-paragraph--playground&args=size:xl;weight:bolder;tracking:normal;lineHeight:default&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('paragraph-xl-bold-normal.png', {
        animations: 'disabled',
      })
    })
  })

  test.describe('All Variants Story', () => {
    test('all paragraph variants', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-paragraph--all-variants&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('paragraph-all-variants.png', {
        fullPage: true,
        animations: 'disabled',
      })
    })
  })
})
