/**
 * The window's size: the limits of a drag, and the height it shrinks to when
 * Figma gives it less room than it asked for (src/ui/fit.ts, 2026-11-20).
 */
import { describe, expect, it } from 'vitest'
import {
  clampSize,
  FIT_MIN_HEIGHT,
  fitHeight,
  WINDOW,
} from '../src/shared/window'

describe('clampSize', () => {
  it('keeps a drag within the window limits', () => {
    expect(clampSize(100, 100)).toEqual({
      width: WINDOW.minWidth,
      height: WINDOW.minHeight,
    })
    expect(clampSize(5000, 5000)).toEqual({
      width: WINDOW.maxWidth,
      height: WINDOW.maxHeight,
    })
  })
})

describe('fitHeight', () => {
  it('takes the height in view, in whole pixels', () => {
    // A 720 px window in a 720 px dialog with a 40 px title bar
    expect(fitHeight(680.4)).toBe(680)
  })

  it('goes below the smallest drag size on a short canvas, not to nothing', () => {
    expect(fitHeight(400)).toBe(400)
    expect(400).toBeLessThan(WINDOW.minHeight)
    expect(fitHeight(10)).toBe(FIT_MIN_HEIGHT)
  })
})
