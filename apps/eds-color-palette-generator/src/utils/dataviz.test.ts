import { describe, expect, test } from 'vitest'
import Color from 'colorjs.io'
import {
  generateCategoricalPalette,
  generateSequentialScale,
  generateDivergingScale,
} from './dataviz'
import { minPairContrast, minPairDeltaE, auditCategorical } from './dataviz-a11y'
import {
  DEFAULT_CATEGORICAL,
  DEFAULT_SEQUENTIAL,
  DEFAULT_DIVERGING,
} from '@/config/dataviz-defaults'
import type { CategoricalConfig } from '@/config/dataviz-types'

const lightnessOf = (hex: string) => new Color(hex).to('oklch').l ?? 0

describe('generateCategoricalPalette', () => {
  test('returns exactly `count` colours', () => {
    for (const count of [3, 6, 8, 12, 15, 20]) {
      const cfg: CategoricalConfig = { ...DEFAULT_CATEGORICAL, count }
      expect(generateCategoricalPalette(cfg, 'light')).toHaveLength(count)
    }
  })

  test('every colour is a valid 6-digit hex', () => {
    const colors = generateCategoricalPalette(
      { ...DEFAULT_CATEGORICAL, count: 10 },
      'light',
    )
    for (const c of colors) {
      expect(c.hex).toMatch(/^#[0-9a-f]{6}$/)
    }
  })

  test('small counts keep pairs perceptually separated (ΔE)', () => {
    const colors = generateCategoricalPalette(
      { ...DEFAULT_CATEGORICAL, count: 6 },
      'light',
    )
    const hexes = colors.map((c) => c.hex)
    // Categorical distinctness is perceptual (ΔE), not luminance contrast —
    // iso-luminant hues legitimately have low WCAG contrast with each other.
    expect(minPairDeltaE(hexes)).toBeGreaterThanOrEqual(
      DEFAULT_CATEGORICAL.minDeltaE,
    )
    expect(minPairContrast(hexes)).toBeGreaterThan(1)
  })

  test('dark mode produces different (lighter) colours than light mode', () => {
    const cfg: CategoricalConfig = { ...DEFAULT_CATEGORICAL, count: 6 }
    const light = generateCategoricalPalette(cfg, 'light')
    const dark = generateCategoricalPalette(cfg, 'dark')
    expect(light.map((c) => c.hex)).not.toEqual(dark.map((c) => c.hex))
  })
})

describe('generateSequentialScale', () => {
  test('lightness is strictly monotonic', () => {
    const scale = generateSequentialScale(
      { ...DEFAULT_SEQUENTIAL, steps: 9 },
      'light',
    )
    const ls = scale.map((s) => lightnessOf(s.hex))
    for (let i = 1; i < ls.length; i++) {
      // light mode goes light → dark, so lightness strictly decreases
      expect(ls[i]).toBeLessThan(ls[i - 1])
    }
  })

  test('dark mode reverses direction (strictly increasing lightness)', () => {
    const scale = generateSequentialScale(
      { ...DEFAULT_SEQUENTIAL, steps: 9 },
      'dark',
    )
    const ls = scale.map((s) => lightnessOf(s.hex))
    for (let i = 1; i < ls.length; i++) {
      expect(ls[i]).toBeGreaterThan(ls[i - 1])
    }
  })

  test('honours the requested step count', () => {
    expect(generateSequentialScale({ ...DEFAULT_SEQUENTIAL, steps: 5 }, 'light'))
      .toHaveLength(5)
  })
})

describe('generateDivergingScale', () => {
  test('is symmetric about the neutral midpoint (mirrored lightness)', () => {
    const scale = generateDivergingScale(
      { ...DEFAULT_DIVERGING, steps: 9 },
      'light',
    )
    const ls = scale.map((s) => lightnessOf(s.hex))
    const n = ls.length
    for (let i = 0; i < Math.floor(n / 2); i++) {
      expect(ls[i]).toBeCloseTo(ls[n - 1 - i], 2)
    }
  })

  test('centre stop is the least saturated (near-neutral)', () => {
    const scale = generateDivergingScale(
      { ...DEFAULT_DIVERGING, steps: 9 },
      'light',
    )
    const chroma = scale.map((s) => new Color(s.hex).to('oklch').c ?? 0)
    const mid = Math.floor(scale.length / 2)
    for (let i = 0; i < scale.length; i++) {
      if (i !== mid) expect(chroma[mid]).toBeLessThanOrEqual(chroma[i] + 1e-6)
    }
  })
})

describe('auditCategorical', () => {
  test('reports pass gates for a well-separated small palette', () => {
    const cfg: CategoricalConfig = { ...DEFAULT_CATEGORICAL, count: 5 }
    const colors = generateCategoricalPalette(cfg, 'light')
    const audit = auditCategorical(colors, cfg)
    expect(audit.passesDeltaE).toBe(true)
    expect(audit.cvdSafe).toBe(true)
    expect(audit.cvd).toHaveLength(3)
  })

  test('collects failures when the distinctness floor is unreachable', () => {
    // An impossible ΔE floor forces a failure to be reported (not thrown).
    const cfg: CategoricalConfig = {
      ...DEFAULT_CATEGORICAL,
      count: 12,
      minDeltaE: 0.9,
    }
    const colors = generateCategoricalPalette(cfg, 'light')
    const audit = auditCategorical(colors, cfg)
    expect(audit.passesDeltaE).toBe(false)
    expect(audit.failures.length).toBeGreaterThan(0)
  })
})
