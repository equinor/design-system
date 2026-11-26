import { describe, expect, test } from 'vitest'
import { simulateCVD } from './cvd'
import {
  checkDatavizCategory,
  minPairContrast,
  minPairDeltaE,
  scoreCVDSafety,
  scoreDatavizSeries,
} from './dataviz-a11y'

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

describe('checkDatavizCategory', () => {
  const backgrounds = { canvas: '#f5f5f5', surface: '#ffffff' }
  const texts = [
    { token: 'text.primary', hex: '#000000' },
    { token: 'text.inverted', hex: '#ffffff' },
  ]

  test('picks the text colour that reads on both steps 1 and 2', () => {
    const light = checkDatavizCategory(
      ['#eeeeee', '#dddddd', '#777777', '#444444', '#222222'],
      backgrounds,
      texts,
    )
    expect(light.text.token).toBe('text.primary')
    expect(light.textOnStep1.ratio).toBeGreaterThan(15)

    const dark = checkDatavizCategory(
      ['#111111', '#222222', '#777777', '#bbbbbb', '#dddddd'],
      backgrounds,
      texts,
    )
    expect(dark.text.token).toBe('text.inverted')
  })

  test('measures step 4 against canvas and surface and the chart steps against surface', () => {
    const check = checkDatavizCategory(
      ['#eeeeee', '#dddddd', '#777777', '#000000', '#000000'],
      backgrounds,
      texts,
    )
    expect(check.step4OnSurface).toBeCloseTo(21, 0)
    expect(check.step4OnCanvas).toBeLessThan(check.step4OnSurface)
    expect(check.step4Chart.ratio).toBeCloseTo(21, 0)
    expect(check.step4Chart.lc).toBeGreaterThan(100)
    expect(check.step3Chart.ratio).toBeGreaterThan(4)
    expect(check.step3Chart.ratio).toBeLessThan(5)
  })
})

describe('scoreDatavizSeries', () => {
  test('scores the first five series at the given step', () => {
    const ramps = Array.from({ length: 7 }, (_, i) =>
      Array.from({ length: 5 }, (_, s) =>
        s === 2
          ? [
              '#cc0000',
              '#00aa00',
              '#0000cc',
              '#cccc00',
              '#cc00cc',
              '#000000',
              '#ffffff',
            ][i]
          : '#808080',
      ),
    )
    const step3 = scoreDatavizSeries(ramps, 3)
    expect(step3.map((s) => s.type)).toEqual([
      'protanopia',
      'deuteranopia',
      'tritanopia',
    ])
    // Black and white (series 6 and 7) are left out, so no pair reaches
    // their index
    for (const s of step3) {
      expect(Math.max(...s.worstPair)).toBeLessThan(5)
      expect(s.minDeltaE).toBeGreaterThan(0)
    }
    // Every series is the same grey at step 1
    for (const s of scoreDatavizSeries(ramps, 1)) {
      expect(s.minDeltaE).toBe(0)
    }
  })
})
