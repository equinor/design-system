import { test, expect } from '@playwright/test'

/**
 * Visual regression tests for Heading component
 * Tests all heading levels and property combinations
 */
test.describe('Heading Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/iframe.html?id=typography-heading--playground&viewMode=story',
    )
    await page.waitForLoadState('networkidle')
  })

  test('default heading', async ({ page }) => {
    await expect(page).toHaveScreenshot('heading-default.png', {
      animations: 'disabled',
    })
  })

  test.describe('Heading Levels', () => {
    const levels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

    for (const level of levels) {
      test(`${level} heading`, async ({ page }) => {
        await page.goto(
          `/iframe.html?id=typography-heading--playground&args=as:${level}&viewMode=story`,
        )
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveScreenshot(`heading-${level}.png`, {
          animations: 'disabled',
        })
      })
    }
  })

  test.describe('Font Weights', () => {
    const weights = ['lighter', 'normal', 'bolder']

    for (const weight of weights) {
      test(`h2 with weight ${weight}`, async ({ page }) => {
        await page.goto(
          `/iframe.html?id=typography-heading--playground&args=as:h2;weight:${weight}&viewMode=story`,
        )
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveScreenshot(`heading-h2-weight-${weight}.png`, {
          animations: 'disabled',
        })
      })
    }
  })

  test.describe('Letter Spacing (Tracking)', () => {
    const trackings = ['tight', 'normal', 'wide']

    for (const tracking of trackings) {
      test(`h2 with tracking ${tracking}`, async ({ page }) => {
        await page.goto(
          `/iframe.html?id=typography-heading--playground&args=as:h2;tracking:${tracking}&viewMode=story`,
        )
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveScreenshot(
          `heading-h2-tracking-${tracking}.png`,
          {
            animations: 'disabled',
          },
        )
      })
    }
  })

  test.describe('Line Heights', () => {
    const lineHeights = ['default', 'squished']

    for (const lineHeight of lineHeights) {
      test(`h2 with line height ${lineHeight}`, async ({ page }) => {
        await page.goto(
          `/iframe.html?id=typography-heading--playground&args=as:h2;lineHeight:${lineHeight}&viewMode=story`,
        )
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveScreenshot(
          `heading-h2-lineheight-${lineHeight}.png`,
          {
            animations: 'disabled',
          },
        )
      })
    }
  })

  test.describe('Baseline Alignment with Grid', () => {
    const levels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

    for (const level of levels) {
      test(`${level} with debug mode`, async ({ page }) => {
        await page.goto(
          `/iframe.html?id=typography-heading--playground&args=as:${level};debug:true&viewMode=story`,
        )
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveScreenshot(`heading-${level}-debug.png`, {
          animations: 'disabled',
        })
      })
    }
  })

  test.describe('Combined Properties', () => {
    test('h1 bold tight', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-heading--playground&args=as:h1;weight:bolder;tracking:tight&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('heading-h1-bold-tight.png', {
        animations: 'disabled',
      })
    })

    test('h3 lighter wide', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-heading--playground&args=as:h3;weight:lighter;tracking:wide&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('heading-h3-lighter-wide.png', {
        animations: 'disabled',
      })
    })

    test('h2 normal squished', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-heading--playground&args=as:h2;weight:normal;lineHeight:squished&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('heading-h2-normal-squished.png', {
        animations: 'disabled',
      })
    })
  })

  test.describe('All Variants Story', () => {
    test('all heading variants', async ({ page }) => {
      await page.goto(
        '/iframe.html?id=typography-heading--all-variants&viewMode=story',
      )
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot('heading-all-variants.png', {
        fullPage: true,
        animations: 'disabled',
      })
    })
  })
})
