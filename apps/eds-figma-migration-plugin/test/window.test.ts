/**
 * The window's size: the limits of a drag, and the height it shrinks to when
 * Figma gives it less room than it asked for (src/ui/fit.ts, 2026-11-20).
 */
import { describe, expect, it } from 'vitest'
import {
  clampSize,
  FIT_MIN_HEIGHT,
  fitHeight,
  RESIZE_PENDING_MS,
  resizeBase,
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

describe('resizeBase', () => {
  const current = { width: 480, height: 600 }
  const asked = { width: 520, height: 720, at: 1000 }

  it('adds quick arrow key presses up from the size asked for', () => {
    expect(resizeBase(asked, current, 1000 + RESIZE_PENDING_MS - 1)).toEqual({
      width: 520,
      height: 720,
    })
  })

  it('starts from the window once the size asked for is out of date', () => {
    // The window asked for 720 px and then shrank to the 600 px of room
    // Figma gave it; an arrow key a while later starts from 600 px.
    expect(resizeBase(asked, current, 1000 + RESIZE_PENDING_MS)).toEqual(
      current,
    )
    expect(resizeBase(null, current, 0)).toEqual(current)
  })
})
