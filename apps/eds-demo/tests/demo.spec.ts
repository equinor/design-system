import { join } from 'node:path'
import { expect, test, type Page } from '@playwright/test'
import { people } from '../src/app/_components/people'

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
    expect(await tokenValue(page, '--eds-font-family-ui')).toMatch(/^Inter\b/)
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
    const total = people.length
    const summary = page.getByText(/of \d+ selected/)
    await expect(summary).toHaveText(`1 of ${total} selected`)

    await page.getByRole('checkbox', { name: 'Select Astrid Bergman' }).check()
    await expect(summary).toHaveText(`2 of ${total} selected`)

    await page.getByText('Kari Nordmann', { exact: true }).click()
    await expect(
      page.getByRole('checkbox', { name: 'Select Kari Nordmann' }),
    ).toBeChecked()
    await expect(summary).toHaveText(`3 of ${total} selected`)
  })

  // The table selects whole rows, so hover fills the whole row, not the
  // cell under the pointer.
  test('hovers the whole row', async ({ page }) => {
    await open(page, '/')
    const row = page.getByRole('row').filter({ hasText: 'Kari Nordmann' })
    await row.getByText('Oslo', { exact: true }).hover()
    await expect
      .poll(() =>
        row.evaluate((tr) =>
          [...tr.children].map((td) => getComputedStyle(td).backgroundColor),
        ),
      )
      .toEqual(
        expect.arrayContaining([
          expect.not.stringMatching(/rgba\(0, 0, 0, 0\)/),
        ]),
      )
    const fills = await row.evaluate((tr) =>
      [...tr.children].map((td) => getComputedStyle(td).backgroundColor),
    )
    expect(new Set(fills).size).toBe(1)
    expect(fills[0]).not.toBe('rgba(0, 0, 0, 0)')
  })

  test('opens the account menu', async ({ page }) => {
    await open(page, '/')
    await page.getByRole('button', { name: 'Account' }).click()
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
  })

  // The EDS Button colours its label, and the icon draws in the button's own
  // colour. An unlayered reset on button elements in the app would override
  // the button's colour and leave the icon a different colour from the label.
  for (const colorScheme of ['light', 'dark']) {
    test(`draws button icons in the label colour (${colorScheme})`, async ({
      page,
    }) => {
      await open(page, '/', { colorScheme })
      const pairs = await page.evaluate(() =>
        [...document.querySelectorAll('.eds-button')]
          .filter((button) => button.querySelector('.label'))
          .map((button) => ({
            name: button.textContent?.trim(),
            icon: getComputedStyle(button.querySelector('svg')!).color,
            label: getComputedStyle(button.querySelector('.label')!).color,
          })),
      )
      expect(pairs.length).toBeGreaterThan(0)
      for (const pair of pairs) expect(pair.icon, pair.name).toBe(pair.label)
    })
  }
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
