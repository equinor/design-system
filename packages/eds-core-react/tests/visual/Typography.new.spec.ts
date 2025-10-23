import { test, expect } from '@playwright/test'

/**
 * Visual regression tests for TypographyNext component
 * Tests the Playground story with various prop combinations
 */
test.describe('TypographyNext Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/iframe.html?id=typography-typographynext--playground&viewMode=story',
    )
    await page.waitForLoadState('networkidle')
  })

  test('default props', async ({ page }) => {
    await expect(page).toHaveScreenshot('typography-next-default.png', {
      animations: 'disabled',
    })
  })

  test.describe('Font Family', () => {
    test('ui font family', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-typographynext--playground&args=family:ui&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('typography-next-family-ui.png', {
        animations: 'disabled',
      })
    })

    test('header font family', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-typographynext--playground&args=family:header&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('typography-next-family-header.png', {
        animations: 'disabled',
      })
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
          `/iframe.html?id=typography-typographynext--playground&args=family:ui;size:${size}&viewMode=story`,
        )
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveScreenshot(
          `typography-next-size-${size}.png`,
          {
            animations: 'disabled',
          },
        )
      })
    }
  })

  test.describe('Line Heights', () => {
    test('default line height', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-typographynext--playground&args=family:ui;size:md;lineHeight:default&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot(
        'typography-next-lineheight-default.png',
        {
          animations: 'disabled',
        },
      )
    })

    test('squished line height', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-typographynext--playground&args=family:ui;size:md;lineHeight:squished&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot(
        'typography-next-lineheight-squished.png',
        {
          animations: 'disabled',
        },
      )
    })
  })

  test.describe('Font Weights', () => {
    const weights = ['lighter', 'normal', 'bolder']

    for (const weight of weights) {
      test(`weight ${weight}`, async ({ page }) => {
        await page.goto(
          `/iframe.html?id=typography-typographynext--playground&args=family:ui;size:md;weight:${weight}&viewMode=story`,
        )
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveScreenshot(
          `typography-next-weight-${weight}.png`,
          {
            animations: 'disabled',
          },
        )
      })
    }
  })

  test.describe('Letter Spacing (Tracking)', () => {
    const trackings = ['tight', 'normal', 'wide']

    for (const tracking of trackings) {
      test(`tracking ${tracking}`, async ({ page }) => {
        await page.goto(
          `/iframe.html?id=typography-typographynext--playground&args=family:ui;size:md;tracking:${tracking}&viewMode=story`,
        )
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveScreenshot(
          `typography-next-tracking-${tracking}.png`,
          {
            animations: 'disabled',
          },
        )
      })
    }
  })

  test.describe('Baseline Alignment', () => {
    test('grid baseline', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-typographynext--playground&args=family:ui;size:md;baseline:grid;debug:true&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('typography-next-baseline-grid.png', {
        animations: 'disabled',
      })
    })

    test('center baseline', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-typographynext--playground&args=family:ui;size:md;baseline:center;debug:true&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot(
        'typography-next-baseline-center.png',
        {
          animations: 'disabled',
        },
      )
    })
  })

  test.describe('Combined Properties', () => {
    test('ui large bold tight', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-typographynext--playground&args=family:ui;size:lg;weight:bolder;tracking:tight;lineHeight:default&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot(
        'typography-next-combined-ui-lg-bold-tight.png',
        {
          animations: 'disabled',
        },
      )
    })

    test('header extra large squished', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-typographynext--playground&args=family:header;size:6xl;weight:bolder;tracking:tight;lineHeight:squished&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot(
        'typography-next-combined-header-6xl-squished.png',
        {
          animations: 'disabled',
        },
      )
    })

    test('ui small lighter wide', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-typographynext--playground&args=family:ui;size:sm;weight:lighter;tracking:wide;lineHeight:default&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot(
        'typography-next-combined-ui-sm-lighter-wide.png',
        {
          animations: 'disabled',
        },
      )
    })
  })
})
