import { describe, expect, test } from 'vitest'
import { simulateCVD } from './cvd'
import { minPairContrast, minPairDeltaE, scoreCVDSafety } from './dataviz-a11y'

describe('simulateCVD', () => {
  test('returns the input unchanged for "none"', () => {
    expect(simulateCVD('#3d7bff', 'none')).toBe('#3d7bff')
  })

  test('returns a valid hex for each dichromacy', () => {
    for (const type of ['protanopia', 'deuteranopia', 'tritanopia'] as const) {
      expect(simulateCVD('#cc0000', type)).toMatch(/^#[0-9a-f]{6}$/)
    }
  })

  test('collapses a red/green pair under deuteranopia', () => {
    const before = minPairDeltaE(['#cc0000', '#00aa00'])
    const after = minPairDeltaE([
      simulateCVD('#cc0000', 'deuteranopia'),
      simulateCVD('#00aa00', 'deuteranopia'),
    ])
    expect(after).toBeLessThan(before)
  })
})

describe('minPair helpers', () => {
  test('minPairContrast of black + white is 21', () => {
    expect(minPairContrast(['#000000', '#ffffff'])).toBeCloseTo(21, 0)
  })

  test('single-colour input yields Infinity (no pairs)', () => {
    expect(minPairContrast(['#123456'])).toBe(Infinity)
    expect(minPairDeltaE(['#123456'])).toBe(Infinity)
  })
})

describe('scoreCVDSafety', () => {
  test('scores all three dichromacies with a worst-pair index', () => {
    const scores = scoreCVDSafety(['#cc0000', '#00aa00', '#0000cc'])
    expect(scores.map((s) => s.type)).toEqual([
      'protanopia',
      'deuteranopia',
      'tritanopia',
    ])
    for (const s of scores) {
      expect(s.worstPair).toHaveLength(2)
      expect(s.minDeltaE).toBeGreaterThanOrEqual(0)
    }
  })
})
