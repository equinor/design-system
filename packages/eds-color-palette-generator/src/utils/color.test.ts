import { describe, expect, test } from 'vitest'
import { contrast } from './color'

describe('getContrastScore', () => {
  test('should return APCA contrast score of 41 for specific OKLCH colors', () => {
    const foreground = 'oklch(0.84 0.2 99.44)'
    const background = 'oklch(0.59 0.03 248.34)'

    const result = contrast({ foreground, background, algorithm: 'APCA' })

    // APCA can return negative values, we expect the absolute value to be around 41
    expect(Math.abs(Number(result))).toBeCloseTo(41, 0)
  })

  test('should return WCAG21 contrast score for black text on white background', () => {
    const foreground = '#000000'
    const background = '#ffffff'

    const result = contrast({
      foreground,
      background,
      algorithm: 'WCAG21',
    })

    expect(Number(result)).toBe(21)
  })

  test('should handle OKLCH colors with WCAG21 algorithm', () => {
    const foreground = 'oklch(0 0 0)' // black
    const background = 'oklch(1 0 0)' // white

    const result = contrast({
      foreground,
      background,
      algorithm: 'WCAG21',
    })

    expect(Number(result)).toBeCloseTo(21, 0)
  })

  test('should return 0 for invalid color inputs', () => {
    const result = contrast({
      foreground: 'invalid-color',
      background: '#ffffff',
      algorithm: 'WCAG21',
    })

    expect(result).toBe('0')
  })
})
