import { test, expect, type Page } from '@playwright/test'

/**
 * Layout tests for the Tooltip (next) component (#5473).
 *
 * The tooltip is positioned with CSS anchor positioning. These tests assert geometry
 * instead of screenshots so they are platform independent and can run in every browser:
 * the tooltip must sit on the expected side of its trigger, 4px away, centred on it,
 * inside the viewport, and the arrow (::before) must be extended towards the trigger.
 */

type Side = 'top' | 'bottom' | 'left' | 'right'

type Box = { left: number; top: number; right: number; bottom: number }

type Measurement = {
  side: Side | 'overlap'
  gap: number
  centreOffset: number
  insideViewport: boolean
  arrow: Box
  body: Box
}

const ARROW = 4

async function hoverAndMeasure(page: Page, name: string): Promise<Measurement> {
  const trigger = page.getByRole('button', { name })
  await trigger.hover()
  const tooltip = page.getByRole('tooltip')
  await expect(tooltip).toBeVisible()

  return tooltip.evaluate((el, triggerName) => {
    const button = [...document.querySelectorAll('button')].find(
      (b) => b.textContent === triggerName,
    )
    if (!button) throw new Error(`No button named ${triggerName}`)
    const rect = (r: DOMRect) => ({
      left: r.left,
      top: r.top,
      right: r.right,
      bottom: r.bottom,
    })
    const a = rect(button.getBoundingClientRect())
    const t = rect(el.getBoundingClientRect())
    // The arrow is a fixed-position pseudo-element: its insets are viewport relative
    const cs = getComputedStyle(el, '::before')
    const arrow = {
      left: parseFloat(cs.left),
      top: parseFloat(cs.top),
      right: innerWidth - parseFloat(cs.right),
      bottom: innerHeight - parseFloat(cs.bottom),
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
      t.right <= innerWidth &&
      t.bottom <= innerHeight
    return { side, gap, centreOffset, insideViewport, arrow, body: t }
  }, name)
}

/** The arrow box must equal the body box, extended by ARROW on the side facing the trigger only. */
function expectArrowTowards(m: Measurement, side: Side) {
  const expected = { ...m.body }
  if (side === 'top') expected.bottom += ARROW
  if (side === 'bottom') expected.top -= ARROW
  if (side === 'right') expected.left -= ARROW
  if (side === 'left') expected.right += ARROW
  for (const edge of ['left', 'top', 'right', 'bottom'] as const) {
    expect(m.arrow[edge], `arrow ${edge} edge`).toBeCloseTo(expected[edge], 0)
  }
}

function expectPlacement(m: Measurement, side: Side) {
  expect(m.side).toBe(side)
  expect(m.gap).toBeCloseTo(ARROW, 0)
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
        await page.goto(
          '/iframe.html?id=eds-2-0-beta-data-display-tooltip--placements&viewMode=story',
        )
        await page.waitForLoadState('networkidle')
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
        await page.goto(
          '/iframe.html?id=eds-2-0-beta-data-display-tooltip--viewport-edges&viewMode=story',
        )
        await page.waitForLoadState('networkidle')
        expectPlacement(await hoverAndMeasure(page, corner), side)
      })
    }
  })
})
