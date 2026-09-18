import { test, expect, type Page } from '@playwright/test'

/**
 * Layout tests for the Tooltip (next) component (#5473).
 *
 * The tooltip is positioned with CSS anchor positioning. These tests assert geometry
 * instead of screenshots so they are platform independent and can run in every browser:
 * the tooltip must sit on the expected side of its trigger, one arrow-length away, centred
 * on it, inside the viewport, and the arrow (::before) must be extended towards the trigger.
 *
 * The corner expectations depend on the viewport size and on the label widths in the
 * `ViewportEdges` story, so the viewport is pinned here.
 */

type Side = 'top' | 'bottom' | 'left' | 'right'

type Box = { left: number; top: number; right: number; bottom: number }

type Measurement = {
  side: Side | 'overlap'
  /** Gap between trigger and tooltip body, in px */
  gap: number
  /** Distance between the tooltip centre and the trigger centre along the shared axis */
  centreOffset: number
  insideViewport: boolean
  /** Computed `--_arrow` of the tooltip (gap and arrow height) */
  arrow: number
  arrowBox: Box
  body: Box
}

test.use({ viewport: { width: 1280, height: 720 } })

async function openStory(page: Page, storyId: string) {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`)
  // Every assertion is text-derived geometry, so wait for web fonts rather than network idle
  await page.evaluate(() => document.fonts.ready)
}

async function hoverAndMeasure(page: Page, name: string): Promise<Measurement> {
  const trigger = page.getByRole('button', { name })
  await trigger.hover()
  const tooltip = page.getByRole('tooltip')
  await expect(tooltip).toBeVisible()

  const button = await trigger.elementHandle()
  if (!button) throw new Error(`No trigger named ${name}`)

  return tooltip.evaluate((el, button) => {
    const rect = (r: DOMRect) => ({
      left: r.left,
      top: r.top,
      right: r.right,
      bottom: r.bottom,
    })
    const a = rect(button.getBoundingClientRect())
    const t = rect(el.getBoundingClientRect())
    // `--_arrow` resolves to a spacing token, which is in rem
    const arrowValue = getComputedStyle(el).getPropertyValue('--_arrow').trim()
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    )
    const arrow = arrowValue.endsWith('rem')
      ? parseFloat(arrowValue) * rootFontSize
      : parseFloat(arrowValue)
    // The arrow is a fixed-position pseudo-element: its insets are resolved against the
    // viewport excluding any scrollbar, i.e. the documentElement client size.
    const cs = getComputedStyle(el, '::before')
    const viewportWidth = document.documentElement.clientWidth
    const viewportHeight = document.documentElement.clientHeight
    const arrowBox = {
      left: parseFloat(cs.left),
      top: parseFloat(cs.top),
      right: viewportWidth - parseFloat(cs.right),
      bottom: viewportHeight - parseFloat(cs.bottom),
    }
    const side =
      t.bottom <= a.top
        ? 'top'
        : t.top >= a.bottom
          ? 'bottom'
          : t.left >= a.right
            ? 'right'
            : t.right <= a.left
              ? 'left'
              : 'overlap'
    const gap =
      side === 'top'
        ? a.top - t.bottom
        : side === 'bottom'
          ? t.top - a.bottom
          : side === 'right'
            ? t.left - a.right
            : a.left - t.right
    const centreOffset =
      side === 'top' || side === 'bottom'
        ? (t.left + t.right) / 2 - (a.left + a.right) / 2
        : (t.top + t.bottom) / 2 - (a.top + a.bottom) / 2
    const insideViewport =
      t.left >= 0 &&
      t.top >= 0 &&
      t.right <= viewportWidth &&
      t.bottom <= viewportHeight
    return { side, gap, centreOffset, insideViewport, arrow, arrowBox, body: t }
  }, button)
}

/** The arrow box must equal the body box, extended by the arrow size on the side facing the trigger only. */
function expectArrowTowards(m: Measurement, side: Side) {
  const expected = { ...m.body }
  if (side === 'top') expected.bottom += m.arrow
  if (side === 'bottom') expected.top -= m.arrow
  if (side === 'right') expected.left -= m.arrow
  if (side === 'left') expected.right += m.arrow
  for (const edge of ['left', 'top', 'right', 'bottom'] as const) {
    expect(m.arrowBox[edge], `arrow ${edge} edge`).toBeCloseTo(
      expected[edge],
      0,
    )
  }
}

function expectPlacement(m: Measurement, side: Side) {
  expect(m.arrow).toBeGreaterThan(0)
  expect(m.side).toBe(side)
  expect(m.gap).toBeCloseTo(m.arrow, 0)
  expect(Math.abs(m.centreOffset)).toBeLessThanOrEqual(1)
  expect(m.insideViewport).toBe(true)
  expectArrowTowards(m, side)
}

test.describe('Tooltip (next) placement', () => {
  test.describe('preferred side when there is room', () => {
    for (const side of ['top', 'bottom', 'left', 'right'] as const) {
      test(`placement="${side}" renders on the ${side} side`, async ({
        page,
      }) => {
        await openStory(page, 'eds-2-0-beta-data-display-tooltip--placements')
        expectPlacement(await hoverAndMeasure(page, side), side)
      })
    }
  })

  test.describe('falls back to a free side instead of shifting (#5473)', () => {
    const corners: Array<[string, Side]> = [
      ['Top left', 'right'],
      ['Top right', 'left'],
      ['Bottom left', 'right'],
      ['Bottom right', 'left'],
    ]

    for (const [corner, side] of corners) {
      test(`trigger in the ${corner.toLowerCase()} corner gets the tooltip on the ${side}`, async ({
        page,
      }) => {
        await openStory(
          page,
          'eds-2-0-beta-data-display-tooltip--viewport-edges',
        )
        expectPlacement(await hoverAndMeasure(page, corner), side)
      })
    }
  })
})
