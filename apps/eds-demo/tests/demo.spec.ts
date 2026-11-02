import { join } from 'node:path'
import { expect, test, type Page } from '@playwright/test'

type Preferences = { colorScheme?: string; density?: string }

/** Opens a page with the colour scheme and density set through the same
 * cookies the toolbar writes, so the server renders them on <html>. */
async function open(page: Page, path: string, preferences: Preferences = {}) {
  const url = test.info().project.use.baseURL ?? ''
  const cookies = []
  if (preferences.colorScheme) {
    cookies.push({
      name: 'eds-demo-color-scheme',
      value: preferences.colorScheme,
      url,
    })
  }
  if (preferences.density) {
    cookies.push({ name: 'eds-demo-density', value: preferences.density, url })
  }
  await page.context().addCookies(cookies)
  await page.goto(path)
  await page.evaluate(() => document.fonts.ready)
}

const html = (page: Page) => page.locator('html')

const tokenValue = (page: Page, name: string) =>
  page.evaluate(
    (token) =>
      getComputedStyle(document.documentElement).getPropertyValue(token).trim(),
    name,
  )

test.describe('Tokens', () => {
  test('renders light and comfortable by default', async ({ page }) => {
    await open(page, '/')
    await expect(html(page)).toHaveAttribute('data-color-scheme', 'light')
    await expect(html(page)).toHaveAttribute('data-density', 'comfortable')
  })

  test('resolves the colour tokens on the page', async ({ page }) => {
    await open(page, '/')
    const canvas = await tokenValue(page, '--eds-background-canvas')
    expect(canvas).not.toBe('')
    const background = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    )
    expect(background).not.toBe('rgba(0, 0, 0, 0)')
  })

  test('loads Inter under the family name the token uses', async ({ page }) => {
    await open(page, '/')
    expect(await tokenValue(page, '--eds-font-family-ui')).toBe('Inter')
    expect(await page.evaluate(() => document.fonts.check('14px Inter'))).toBe(
      true,
    )
  })
})

test.describe('Toolbar', () => {
  test('switches the colour scheme and keeps it after a reload', async ({
    page,
  }) => {
    await open(page, '/')
    const before = await tokenValue(page, '--eds-background-canvas')

    await page.getByRole('radio', { name: 'Dark' }).check()
    await expect(html(page)).toHaveAttribute('data-color-scheme', 'dark')
    expect(await tokenValue(page, '--eds-background-canvas')).not.toBe(before)

    // The cookie is set by a server action; wait for it before reloading.
    await expect
      .poll(
        async () =>
          (await page.context().cookies()).find(
            (cookie) => cookie.name === 'eds-demo-color-scheme',
          )?.value,
      )
      .toBe('dark')
    await page.reload()
    await expect(html(page)).toHaveAttribute('data-color-scheme', 'dark')
  })

  test('switches the density', async ({ page }) => {
    await open(page, '/')
    expect(await tokenValue(page, '--eds-spacing-md')).toBe('16px')

    await page.getByRole('radio', { name: 'Compact' }).check()
    await expect(html(page)).toHaveAttribute('data-density', 'compact')
    expect(await tokenValue(page, '--eds-spacing-md')).toBe('12px')
  })

  test('links to the exercise', async ({ page }) => {
    await open(page, '/')
    await page
      .getByRole('navigation', { name: 'Demo pages' })
      .getByRole('link', { name: 'Exercise' })
      .click()
    await expect(page).toHaveURL(/\/exercise$/)
    await expect(page.getByRole('heading', { name: 'People' })).toBeVisible()
  })
})

test.describe('Dashboard', () => {
  test('selects a row from its checkbox and from the row', async ({ page }) => {
    await open(page, '/')
    const summary = page.getByText(/of 6 selected/)
    await expect(summary).toHaveText('1 of 6 selected')

    await page.getByRole('checkbox', { name: 'Select Astrid Bergman' }).check()
    await expect(summary).toHaveText('2 of 6 selected')

    await page.getByText('Kari Nordmann', { exact: true }).click()
    await expect(
      page.getByRole('checkbox', { name: 'Select Kari Nordmann' }),
    ).toBeChecked()
    await expect(summary).toHaveText('3 of 6 selected')
  })

  test('opens the account menu', async ({ page }) => {
    await open(page, '/')
    await page.getByRole('button', { name: 'Account' }).click()
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
  })
})

test.describe('Visual', () => {
  const cases: Array<[string, string, Preferences]> = [
    ['dashboard-light', '/', { colorScheme: 'light' }],
    ['dashboard-dark', '/', { colorScheme: 'dark' }],
    ['dashboard-compact', '/', { density: 'compact' }],
    ['dashboard-relaxed', '/', { density: 'relaxed' }],
    ['exercise-light', '/exercise', { colorScheme: 'light' }],
  ]

  for (const [name, path, preferences] of cases) {
    test(name, async ({ page }) => {
      await open(page, path, preferences)
      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: true,
        stylePath: join(__dirname, 'screenshot.css'),
      })
    })
  }
})
