import { describe, expect, test } from 'vitest'
import Color from 'colorjs.io'
import {
  generateCategoricalPalette,
  generateSequentialScale,
  generateDivergingScale,
  datavizFormulaStep,
  datavizRampValues,
  datavizStepSide,
  generateDatavizRamps,
} from './dataviz'
import {
  DATAVIZ_FORMULA_STEPS,
  SCHEMES,
  TS_DATAVIZ,
  TS_DATAVIZ_FORMULA,
  TS_DATAVIZ_FORMULA_TEXT,
} from '@/config/tokensStudio'
import {
  minPairContrast,
  minPairDeltaE,
  auditCategorical,
} from './dataviz-a11y'
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
    expect(
      generateSequentialScale({ ...DEFAULT_SEQUENTIAL, steps: 5 }, 'light'),
    ).toHaveLength(5)
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
    // The blue end (Tokens Studio info hue) is slightly outside sRGB at this
    // chroma, and CSS gamut mapping may move lightness by up to ~0.007.
    for (let i = 0; i < Math.floor(n / 2); i++) {
      expect(Math.abs(ls[i] - ls[n - 1 - i])).toBeLessThan(0.01)
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

describe('datavizFormulaStep', () => {
  const oklchOf = (hex: string) => {
    const [l, c, h] = new Color(hex).to('oklch').coords
    return { l: l ?? 0, c: c ?? 0, h: h ?? 0 }
  }

  // oklch(0.6 0.08 260), weight 0.5, chroma reduction 0.5:
  // towards white L' = 0.6 + 0.5 × (1 − 0.6) = 0.8, towards black
  // L' = 0.6 × (1 − 0.5) = 0.3, and C' = 0.08 × (1 − 0.5 × 0.5) = 0.06.
  // oklch(0.8 0.06 260) is #a8bfe5 and oklch(0.3 0.06 260) is #1b2e4c; both
  // are inside sRGB, so no gamut mapping is involved.
  test('moves lightness towards white or black and reduces chroma by the weight', () => {
    const base = 'oklch(0.6 0.08 260)'
    expect(datavizFormulaStep(base, 0.5, 0.5, 'white')).toBe('#a8bfe5')
    expect(datavizFormulaStep(base, 0.5, 0.5, 'black')).toBe('#1b2e4c')
    const lighter = oklchOf('#a8bfe5')
    expect(lighter.l).toBeCloseTo(0.8, 2)
    expect(lighter.c).toBeCloseTo(0.06, 2)
  })

  test('keeps the base at weight 0 and reaches white or black at weight 1', () => {
    expect(datavizFormulaStep('#03484c', 0, 0.5, 'white')).toBe('#03484c')
    expect(datavizFormulaStep('#03484c', 1, 1, 'white')).toBe('#ffffff')
    expect(datavizFormulaStep('#03484c', 1, 1, 'black')).toBe('#000000')
  })

  test('maps a colour outside sRGB in by reducing chroma at the same lightness and hue', () => {
    // A light, saturated yellow is outside sRGB before mapping
    const hex = datavizFormulaStep('#f4cb00', 0.86, 0, 'white')
    const base = oklchOf('#f4cb00')
    const target = base.l + 0.86 * (1 - base.l)
    const mapped = oklchOf(hex)
    expect(new Color('oklch', [target, base.c, base.h]).inGamut('srgb')).toBe(
      false,
    )
    expect(mapped.l).toBeCloseTo(target, 2)
    expect(mapped.c).toBeLessThan(base.c)
  })

  test('returns a grey for a base it cannot read', () => {
    expect(datavizFormulaStep('not a colour', 0.5, 0.5, 'white')).toBe(
      '#808080',
    )
  })
})

describe('datavizStepSide', () => {
  test('moves steps 1 and 2 towards white in light and towards black in dark', () => {
    expect(datavizStepSide('light', 1)).toEqual({
      towards: 'white',
      side: 'background',
    })
    expect(datavizStepSide('light', 5)).toEqual({
      towards: 'black',
      side: 'contrast',
    })
    expect(datavizStepSide('dark', 2)).toEqual({
      towards: 'black',
      side: 'background',
    })
    expect(datavizStepSide('dark', 4)).toEqual({
      towards: 'white',
      side: 'contrast',
    })
  })

  // If Tokens Studio changes the shape of the formula, this fails before the
  // values start to differ.
  test('describes the formula Tokens Studio uses for every computed step', () => {
    const keys = Object.keys(TS_DATAVIZ_FORMULA_TEXT)
    expect(keys).toHaveLength(
      SCHEMES.length *
        TS_DATAVIZ_FORMULA.bases.length *
        DATAVIZ_FORMULA_STEPS.length,
    )
    for (const key of keys) {
      const [scheme, path] = key.split(' ') as ['light' | 'dark', string]
      const [category, step] = path.split('.')
      const { towards, side } = datavizStepSide(
        scheme,
        Number(step) as (typeof DATAVIZ_FORMULA_STEPS)[number],
      )
      const l = `{foundation.dataviz.cat.${category}.l}`
      const c = `{foundation.dataviz.cat.${category}.c}`
      const w = `{input.dataviz.weight.${scheme}.${step}}`
      const rho = `{input.dataviz.chroma-reduction.${scheme}.${side}}`
      const lightness =
        towards === 'white' ? `${l} + ${w} * (1 - ${l})` : `${l} * (1 - ${w})`
      expect(TS_DATAVIZ_FORMULA_TEXT[key], key).toBe(
        `set_chroma(set_lightness({${scheme}.dataviz.cat.${category}.3}, ${lightness}), ${c} * (1 - ${rho} * ${w}))`,
      )
    }
  })
})

describe('generateDatavizRamps', () => {
  // The TypeScript export stores the formula's result as sRGB hex, so the
  // comparison is exact: no rounding tolerance is needed.
  test('reproduces every categorical value in the Tokens Studio export', () => {
    const ramps = generateDatavizRamps(TS_DATAVIZ_FORMULA)
    let compared = 0
    for (const scheme of SCHEMES) {
      const exported = Object.fromEntries(
        Object.entries(TS_DATAVIZ[scheme]).filter(([path]) =>
          path.startsWith('dataviz.cat.'),
        ),
      )
      expect(datavizRampValues(ramps[scheme])).toEqual(exported)
      compared += Object.keys(exported).length
    }
    expect(compared).toBe(100)
  })

  test('returns five steps per category with the base as step 3', () => {
    const ramps = generateDatavizRamps(TS_DATAVIZ_FORMULA)
    for (const scheme of SCHEMES) {
      expect(ramps[scheme]).toHaveLength(TS_DATAVIZ_FORMULA.bases.length)
      ramps[scheme].forEach((steps, i) => {
        expect(steps).toHaveLength(5)
        expect(steps[2]).toBe(TS_DATAVIZ_FORMULA.bases[i])
      })
    }
  })

  test('follows a changed weight', () => {
    const changed = generateDatavizRamps({
      ...TS_DATAVIZ_FORMULA,
      weight: {
        ...TS_DATAVIZ_FORMULA.weight,
        light: { ...TS_DATAVIZ_FORMULA.weight.light, 1: 0.5 },
      },
    })
    const original = generateDatavizRamps(TS_DATAVIZ_FORMULA)
    expect(changed.light[0][0]).not.toBe(original.light[0][0])
    expect(changed.light[0][1]).toBe(original.light[0][1])
    expect(changed.dark).toEqual(original.dark)
  })

  test('gives a grey ramp for a base it cannot read', () => {
    const ramps = generateDatavizRamps({
      ...TS_DATAVIZ_FORMULA,
      bases: ['not a colour'],
    })
    expect(ramps.light[0]).toEqual(Array(5).fill('#808080'))
  })
})
