import { join } from 'node:path'
import { expect, test, type Frame, type Page } from '@playwright/test'
import { people } from '../src/app/_components/people'
import { readTokenNames } from '../src/lib/sources'

type Settings = {
  mode?: 'exercise' | 'solution'
  file?: 'page' | 'top-bar' | 'navigation' | 'table'
  tokens?: 'open' | 'closed'
  view?: 'row' | 'column' | 'fullscreen'
  colorScheme?: 'light' | 'dark'
  density?: 'compact' | 'comfortable' | 'relaxed'
}

/** Opens the app with settings saved the way the app saves them, and waits
 * until the frame has applied the CSS. Every test gets a fresh browser
 * context, so nothing from one test is left in storage for the next. The
 * settings are seeded once, so a reload keeps what the test changed. */
async function open(page: Page, settings: Settings = {}) {
  await page.addInitScript((saved) => {
    if (sessionStorage.getItem('eds-demo-test-seeded')) return
    sessionStorage.setItem('eds-demo-test-seeded', 'yes')
    for (const [key, value] of Object.entries(saved)) {
      const name = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
      localStorage.setItem(`eds-demo:${name}`, value as string)
    }
  }, settings)
  await page.goto('./')
  return preview(page)
}

/** The dashboard inside the frame, once the CSS from the editor is applied. */
async function preview(page: Page): Promise<Frame> {
  const iframe = page.locator('iframe[title="Dashboard preview"]')
  await expect(iframe).toBeVisible()
  const frame = (await (await iframe.elementHandle())?.contentFrame()) ?? null
  if (!frame) throw new Error('The preview frame did not load')
  await frame.waitForSelector('html[data-ready]', { state: 'attached' })
  await frame.evaluate(() => document.fonts.ready)
  return frame
}

const editor = (page: Page) => page.locator('.cm-content')
const tab = (page: Page, file: string) =>
  page.getByRole('tab', { name: `${file}.css` })
const activeLine = (page: Page) => page.locator('.cm-activeLine')

const computed = (frame: Frame, selector: string, property: string) =>
  frame.evaluate(
    ([sel, prop]) =>
      getComputedStyle(document.querySelector(sel)!).getPropertyValue(prop),
    [selector, property] as const,
  )

const tokenValue = (frame: Frame, name: string) =>
  frame.evaluate(
    (token) =>
      getComputedStyle(document.documentElement).getPropertyValue(token).trim(),
    name,
  )

/** Adds text at the end of the CSS in the editor. */
async function append(page: Page, text: string) {
  await editor(page).click()
  await page.keyboard.press('ControlOrMeta+End')
  await page.keyboard.type(text)
}

/** Puts the cursor on the first match of text, with the editor's search. */
async function goTo(page: Page, text: string) {
  await editor(page).click()
  await page.keyboard.press('ControlOrMeta+f')
  await page.keyboard.type(text)
  await page.keyboard.press('Enter')
  await page.keyboard.press('Escape')
}

test.describe('Editor', () => {
  test('starts on the exercise and shows its CSS', async ({ page }) => {
    await open(page)
    await expect(page.getByRole('radio', { name: 'Exercise' })).toBeChecked()
    await expect(editor(page)).toContainText('Exercise: replace the hard-coded')
  })

  test('applies the CSS to the frame as you type', async ({ page }) => {
    const frame = await open(page, { mode: 'solution' })
    await append(page, '\n.title { color: rgb(255, 0, 0); }')
    await expect
      .poll(() => computed(frame, '.title', 'color'))
      .toBe('rgb(255, 0, 0)')
  })

  test('switches the CSS between the exercise and the solution', async ({
    page,
  }) => {
    const frame = await open(page)
    const exerciseCanvas = await computed(frame, '.app', 'background-color')
    await page.getByRole('radio', { name: 'Solution' }).check()
    await expect(editor(page)).toContainText('Every design decision')
    await expect
      .poll(() => computed(frame, '.app', 'background-color'))
      .not.toBe(exerciseCanvas)
    expect(page.url()).toMatch(/#solution$/)
  })

  test('keeps edits after a reload, for each mode on its own', async ({
    page,
  }) => {
    await open(page)
    await append(page, '\n/* my exercise note */')
    await page.waitForTimeout(500)
    await page.reload()
    await preview(page)
    // The editor only renders the lines in view, so go to the end first.
    await editor(page).click()
    await page.keyboard.press('ControlOrMeta+End')
    await expect(editor(page)).toContainText('my exercise note')
    const saved = await page.evaluate(() => ({
      exercise: localStorage.getItem('eds-demo:css:exercise:page') ?? '',
      solution: localStorage.getItem('eds-demo:css:solution:page'),
    }))
    expect(saved.exercise).toContain('my exercise note')
    expect(saved.solution).toBeNull()
  })

  test('restarts only the CSS you are viewing, after confirming', async ({
    page,
  }) => {
    await open(page)
    await append(page, '\n/* exercise edit */')
    await page.getByRole('radio', { name: 'Solution' }).check()
    await append(page, '\n/* solution edit */')

    const dialog = page.getByRole('dialog', { name: 'Restart the solution' })
    await page.getByRole('button', { name: 'Restart' }).click()
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText(
      'Do you want to restart? Progress will be lost.',
    )
    await dialog.getByRole('button', { name: 'Cancel' }).click()
    await expect(dialog).toBeHidden()
    await expect(editor(page)).toContainText('solution edit')

    await page.getByRole('button', { name: 'Restart' }).click()
    await dialog.getByRole('button', { name: 'Restart' }).click()
    await expect(dialog).toBeHidden()
    await expect(editor(page)).not.toContainText('solution edit')

    await page.getByRole('radio', { name: 'Exercise' }).check()
    // The editor only renders the lines in view, so go to the end first.
    await editor(page).click()
    await page.keyboard.press('ControlOrMeta+End')
    await expect(editor(page)).toContainText('exercise edit')
  })

  test('the shortcut switches mode and keeps your place in the CSS', async ({
    page,
  }) => {
    await open(page, { file: 'table' })
    // A rule far down the file, so the place has to be found by rule, not
    // kept by line number.
    await goTo(page, '.cell-checkbox-icon {')
    await expect(activeLine(page)).toContainText('.cell-checkbox-icon {')
    await page.keyboard.press('ControlOrMeta+Shift+S')
    await expect(page.getByRole('radio', { name: 'Solution' })).toBeChecked()
    await expect(activeLine(page)).toContainText('.cell-checkbox-icon {')
    await page.keyboard.press('ControlOrMeta+Shift+S')
    await expect(page.getByRole('radio', { name: 'Exercise' })).toBeChecked()
    await expect(activeLine(page)).toContainText('.cell-checkbox-icon {')
  })

  test('shows one file per tab, each where it was left', async ({ page }) => {
    await open(page)
    await expect(tab(page, 'page')).toHaveAttribute('aria-selected', 'true')
    await expect(editor(page)).toContainText('Exercise: replace the hard-coded')

    await tab(page, 'table').click()
    await expect(tab(page, 'table')).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel')).toHaveAccessibleName('table.css')
    await expect(editor(page)).toContainText('The table: its header')
    await goTo(page, '.cell-checkbox-icon {')
    const scrolled = await page
      .locator('.cm-scroller')
      .evaluate((element) => element.scrollTop)
    expect(scrolled).toBeGreaterThan(0)

    await tab(page, 'page').click()
    await expect(editor(page)).toContainText('Exercise: replace the hard-coded')
    await tab(page, 'table').click()
    await expect(activeLine(page)).toContainText('.cell-checkbox-icon {')
    await expect
      .poll(() =>
        page.locator('.cm-scroller').evaluate((element) => element.scrollTop),
      )
      .toBe(scrolled)

    // The open file is kept after a reload.
    await page.waitForTimeout(300)
    await page.reload()
    await preview(page)
    await expect(tab(page, 'table')).toHaveAttribute('aria-selected', 'true')
  })

  test('moves between the tabs with the arrow keys, Home and End', async ({
    page,
  }) => {
    await open(page)
    await tab(page, 'page').focus()
    await page.keyboard.press('ArrowRight')
    await expect(tab(page, 'top-bar')).toBeFocused()
    await expect(tab(page, 'top-bar')).toHaveAttribute('aria-selected', 'true')
    await expect(editor(page)).toContainText('The top bar: the app name')
    await page.keyboard.press('End')
    await expect(tab(page, 'table')).toBeFocused()
    await page.keyboard.press('ArrowRight')
    await expect(tab(page, 'page')).toBeFocused()
    await page.keyboard.press('ArrowLeft')
    await expect(tab(page, 'table')).toBeFocused()
    await page.keyboard.press('Home')
    await expect(tab(page, 'page')).toHaveAttribute('aria-selected', 'true')
    // Only the selected tab is in the tab order.
    await expect(page.locator('[role="tab"][tabindex="0"]')).toHaveCount(1)
  })

  test('gives the frame the CSS of every file', async ({ page }) => {
    const frame = await open(page, { mode: 'solution', file: 'table' })
    await append(page, '\n.title { color: rgb(255, 0, 0); }')
    await expect
      .poll(() => computed(frame, '.title', 'color'))
      .toBe('rgb(255, 0, 0)')
    // The rules of the other files still apply: the page background from
    // page.css, and the top bar's from top-bar.css.
    expect(await computed(frame, '.app', 'background-color')).not.toBe(
      'rgba(0, 0, 0, 0)',
    )
    expect(await computed(frame, '.top-bar', 'background-color')).not.toBe(
      'rgba(0, 0, 0, 0)',
    )
  })

  test('autocompletes the published token names only', async ({ page }) => {
    await open(page)
    await append(page, '\n.x { color: var(--eds-background-ca')
    const options = page.locator('.cm-tooltip-autocomplete li')
    await expect(options.first()).toContainText('--eds-background-canvas')

    await append(page, ' --eds-')
    await expect(options.first()).toBeVisible()
    const labels = await options.allTextContents()
    expect(labels.length).toBeGreaterThan(0)
    expect(labels.some((label) => /primitives|density/.test(label))).toBe(false)
  })
})

test.describe('Token reference', () => {
  const reference = (page: Page) => page.locator('#token-reference')
  const filter = (page: Page, text: string) =>
    reference(page).getByRole('searchbox', { name: 'Filter tokens' }).fill(text)
  const token = (page: Page, name: string) =>
    reference(page).getByRole('button', { name: new RegExp(`^${name}(,|$)`) })

  test('opens from the rail and stays open after a reload', async ({
    page,
  }) => {
    await open(page)
    const rail = page.getByRole('button', { name: 'Tokens' })
    await expect(rail).toHaveAttribute('aria-expanded', 'false')
    await expect(reference(page)).toBeHidden()
    await rail.click()
    await expect(rail).toHaveAttribute('aria-expanded', 'true')
    await expect(reference(page)).toBeVisible()
    await page.waitForTimeout(300)
    await page.reload()
    await preview(page)
    await expect(reference(page)).toBeVisible()
  })

  test('lists every published token in a group', async ({ page }) => {
    await open(page, { tokens: 'open' })
    const counts = await reference(page)
      .locator('.token-group-count')
      .allTextContents()
    const total = counts.reduce((sum, count) => sum + Number(count), 0)
    expect(total).toBe(readTokenNames().length)
    // A name that fits none of the patterns ends up in Other. Sort it into
    // a group in src/lib/tokens.ts.
    await expect(
      reference(page).locator('.token-group-summary', { hasText: 'Other' }),
    ).toHaveCount(0)
  })

  test('puts a token in the CSS at the cursor', async ({ page }) => {
    const frame = await open(page, { tokens: 'open' })
    await goTo(page, '.main {')
    await page.keyboard.press('End')
    await page.keyboard.press('Enter')
    // A property the rule does not set yet, so nothing later overrides it.
    await page.keyboard.type('border-radius: ')
    await filter(page, 'radius-pill')
    await token(page, '--eds-corner-radius-pill').click()
    await expect(editor(page)).toBeFocused()
    await page.keyboard.type(';')
    await expect(activeLine(page)).toContainText(
      'border-radius: var(--eds-corner-radius-pill);',
    )
    await expect
      .poll(() => computed(frame, '.main', 'border-top-left-radius'))
      .toBe('9999px')

    // A name being typed inside var( is completed.
    await page.keyboard.press('Enter')
    await page.keyboard.type('column-gap: var(--eds-sp')
    await filter(page, 'spacing-xs')
    await token(page, '--eds-spacing-xs').click()
    await expect(activeLine(page)).toContainText(
      'column-gap: var(--eds-spacing-xs)',
    )
    await expect(activeLine(page)).not.toContainText('--eds-sp--')
  })

  test('previews in the colour scheme and density of the frame', async ({
    page,
  }) => {
    await open(page, { tokens: 'open' })
    await filter(page, 'spacing-md')
    const value = reference(page).locator('.token-value')
    await expect(value).toHaveText('16px')
    await page.getByRole('radio', { name: 'Compact' }).check()
    await expect(value).toHaveText('12px')

    await filter(page, 'background-surface')
    const swatch = reference(page).locator('.token-sample')
    const light = await swatch.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    )
    await page.getByRole('radio', { name: 'Dark' }).check()
    await expect
      .poll(() =>
        swatch.evaluate((element) => getComputedStyle(element).backgroundColor),
      )
      .not.toBe(light)
  })

  test('filters the tokens by name', async ({ page }) => {
    await open(page, { tokens: 'open' })
    await filter(page, 'focus')
    await expect(reference(page).locator('.token')).toHaveCount(1)
    await expect(token(page, '--eds-border-interactive-focus')).toBeVisible()
    await filter(page, 'no-such-token')
    await expect(reference(page)).toContainText('No token matches')
  })
})

test.describe('Inspect', () => {
  test('shows the class names in the frame and goes to the rule on click', async ({
    page,
  }) => {
    const frame = await open(page)
    const dashboard = page.frameLocator('iframe[title="Dashboard preview"]')
    const label = dashboard.locator('eds-demo-inspector .label')
    const selectedRows = () =>
      frame.evaluate(
        () => document.querySelectorAll('.row[data-selected]').length,
      )
    const before = await selectedRows()

    await page.getByRole('checkbox', { name: 'Inspect' }).check()
    await dashboard.locator('.title').hover()
    await expect(label).toHaveText('.title')
    await dashboard.locator('.title').click()
    await expect(tab(page, 'page')).toHaveAttribute('aria-selected', 'true')
    await expect(activeLine(page)).toHaveText('.title {')
    await expect(editor(page)).toBeFocused()

    // A class in another file switches the tab. The click does not reach
    // the dashboard, so the row is not selected.
    await dashboard.locator('.badge').first().click()
    await expect(tab(page, 'table')).toHaveAttribute('aria-selected', 'true')
    await expect(activeLine(page)).toHaveText('.badge {')
    expect(await selectedRows()).toBe(before)

    await page.getByRole('checkbox', { name: 'Inspect' }).uncheck()
    await expect(dashboard.locator('eds-demo-inspector')).toHaveCount(0)
    await dashboard.locator('.row').first().click()
    await expect.poll(selectedRows).toBe(before + 1)
  })
})

test.describe('Strip', () => {
  test('switches the view', async ({ page }) => {
    await open(page)
    const workbench = page.locator('.workbench')
    await expect(workbench).toHaveAttribute('data-view', 'row')
    await page.getByRole('radio', { name: 'Column' }).check()
    await expect(workbench).toHaveAttribute('data-view', 'column')
    await page.getByRole('radio', { name: 'Fullscreen' }).check()
    await expect(workbench).toHaveAttribute('data-view', 'fullscreen')
    await expect(page.locator('.cm-editor')).toBeHidden()
  })

  test('resizes the frame and the editor with the splitter', async ({
    page,
  }) => {
    await open(page)
    const splitter = page.getByRole('separator', {
      name: 'Resize the frame and the editor',
    })
    const frameWidth = () =>
      page
        .locator('.workbench-frame-area')
        .evaluate((element) => element.getBoundingClientRect().width)
    const before = await frameWidth()

    // Drag it to the right: the frame gets wider.
    const box = (await splitter.boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + 300, box.y + box.height / 2, { steps: 10 })
    await page.mouse.up()
    await expect.poll(frameWidth).toBeGreaterThan(before + 200)
    const dragged = Number(await splitter.getAttribute('aria-valuenow'))
    expect(dragged).toBeGreaterThan(50)

    // The arrow keys move it in steps, and it is kept after a reload.
    await splitter.focus()
    await page.keyboard.press('ArrowLeft')
    await expect(splitter).toHaveAttribute('aria-valuenow', String(dragged - 5))
    await page.waitForTimeout(300)
    await page.reload()
    await preview(page)
    await expect(splitter).toHaveAttribute('aria-valuenow', String(dragged - 5))

    // A double-click shares the space evenly again.
    await splitter.dblclick()
    await expect(splitter).toHaveAttribute('aria-valuenow', '50')
  })

  test('changes the colour scheme of the app and the frame, not the editor', async ({
    page,
  }) => {
    const frame = await open(page, { mode: 'solution' })
    const background = (selector: string) =>
      page
        .locator(selector)
        .evaluate((element) => getComputedStyle(element).backgroundColor)
    const editorBefore = await background('.cm-editor')
    const stripBefore = await background('.strip')
    const canvas = await tokenValue(frame, '--eds-background-canvas')

    await page.getByRole('radio', { name: 'Dark' }).check()
    await expect
      .poll(() =>
        frame.evaluate(() => document.documentElement.dataset.colorScheme),
      )
      .toBe('dark')
    expect(await tokenValue(frame, '--eds-background-canvas')).not.toBe(canvas)
    await expect(page.locator('html')).toHaveAttribute(
      'data-color-scheme',
      'dark',
    )
    expect(await background('.strip')).not.toBe(stripBefore)
    expect(await background('.cm-editor')).toBe(editorBefore)

    // The saved scheme is applied before the first paint after a reload.
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute(
      'data-color-scheme',
      'dark',
    )
  })

  test('changes the density of the frame only', async ({ page }) => {
    const frame = await open(page, { mode: 'solution' })
    await page.getByRole('radio', { name: 'Compact' }).check()
    await expect.poll(() => tokenValue(frame, '--eds-spacing-md')).toBe('12px')
    await expect(page.locator('html')).toHaveAttribute(
      'data-density',
      'comfortable',
    )
  })
})

test.describe('Dashboard', () => {
  test('loads Inter under the family name the token uses', async ({ page }) => {
    const frame = await open(page, { mode: 'solution' })
    expect(await tokenValue(frame, '--eds-font-family-ui')).toMatch(/^Inter\b/)
    expect(await frame.evaluate(() => document.fonts.check('14px Inter'))).toBe(
      true,
    )
  })

  test('selects rows from the checkbox and from the row', async ({ page }) => {
    const frame = await open(page, { mode: 'solution', view: 'fullscreen' })
    const total = people.length
    const summary = frame.getByText(/of \d+ selected/)
    await expect(summary).toHaveText(`1 of ${total} selected`)
    await frame.getByRole('checkbox', { name: 'Select Astrid Bergman' }).check()
    await expect(summary).toHaveText(`2 of ${total} selected`)
    await frame.getByText('Kari Nordmann', { exact: true }).click()
    await expect(
      frame.getByRole('checkbox', { name: 'Select Kari Nordmann' }),
    ).toBeChecked()
    await expect(summary).toHaveText(`3 of ${total} selected`)
  })

  // The table selects whole rows, so hover fills the whole row.
  test('hovers the whole row', async ({ page }) => {
    const frame = await open(page, { mode: 'solution', view: 'fullscreen' })
    const row = frame.getByRole('row').filter({ hasText: 'Kari Nordmann' })
    await row.getByText('Oslo', { exact: true }).hover()
    await expect
      .poll(async () => {
        const fills = await row.evaluate((tr) =>
          [...tr.children].map((td) => getComputedStyle(td).backgroundColor),
        )
        return new Set(fills).size === 1 && fills[0] !== 'rgba(0, 0, 0, 0)'
      })
      .toBe(true)
  })

  test('opens the account menu', async ({ page }) => {
    const frame = await open(page, { mode: 'solution', view: 'fullscreen' })
    await frame.getByRole('button', { name: 'Account' }).click()
    await expect(frame.getByRole('button', { name: 'Sign out' })).toBeVisible()
  })

  // The EDS Button colours its label, and the icon draws in the button's
  // own colour. An unlayered reset on button elements in the CSS would
  // override the button's colour and leave the icon a different colour.
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`draws button icons in the label colour (${colorScheme})`, async ({
      page,
    }) => {
      const frame = await open(page, { mode: 'solution', colorScheme })
      const pairs = await frame.evaluate(() =>
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
  const cases: Array<[string, Settings]> = [
    ['exercise-row', { mode: 'exercise', view: 'row' }],
    ['exercise-column', { mode: 'exercise', view: 'column' }],
    [
      'exercise-column-tokens',
      { mode: 'exercise', view: 'column', tokens: 'open' },
    ],
    ['solution-fullscreen-light', { mode: 'solution', view: 'fullscreen' }],
    [
      'solution-fullscreen-dark',
      { mode: 'solution', view: 'fullscreen', colorScheme: 'dark' },
    ],
    [
      'solution-fullscreen-compact',
      { mode: 'solution', view: 'fullscreen', density: 'compact' },
    ],
    [
      'solution-fullscreen-relaxed',
      { mode: 'solution', view: 'fullscreen', density: 'relaxed' },
    ],
  ]

  for (const [name, settings] of cases) {
    test(name, async ({ page }) => {
      await open(page, settings)
      await expect(page).toHaveScreenshot(`${name}.png`, {
        stylePath: join(__dirname, 'screenshot.css'),
      })
    })
  }
})
