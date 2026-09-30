import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { deltaE, generateColorScale } from '@/utils/color'
import {
  STEP_COUNT,
  TONES,
  TS_GAUSSIAN,
  TS_HUES,
  TS_SCALE,
  TS_SEMANTIC,
  TS_TONE_HUE,
  rolesForStep,
} from './tokensStudio'
import { paletteConfig } from './palette-config'

// Resolved scale values from the Tokens Studio CSS export, committed by the
// release workflow next to the raw sets this app reads.
const TS_COLOURS_CSS = resolve(
  __dirname,
  '../../../../packages/eds-tokens/src/tokens/css/colors/default.css',
)

function readTokensStudioScale(): Map<string, string> {
  const css = readFileSync(TS_COLOURS_CSS, 'utf-8')
  const values = new Map<string, string>()
  for (const match of css.matchAll(
    /--eds-(light|dark)-([a-z-]+)-(\d+):\s*(oklch\([^)]*\))/g,
  )) {
    values.set(`${match[1]}.${match[2]}.${match[3]}`, match[4])
  }
  return values
}

describe('Tokens Studio inputs', () => {
  it('reads 15 lightness values per scheme', () => {
    expect(TS_SCALE.light).toHaveLength(STEP_COUNT)
    expect(TS_SCALE.dark).toHaveLength(STEP_COUNT)
  })

  it('reads the seven hue anchors', () => {
    expect(TS_HUES.map((hue) => hue.key).sort()).toEqual([
      'blue',
      'gray',
      'green',
      'moss-green',
      'north-sea',
      'orange',
      'red',
    ])
  })

  it('maps every tone to a known hue in both schemes', () => {
    const keys = new Set(TS_HUES.map((hue) => hue.key))
    for (const scheme of ['light', 'dark'] as const) {
      for (const tone of TONES) {
        expect(keys.has(TS_TONE_HUE[scheme][tone])).toBe(true)
      }
    }
  })

  it('resolves every semantic colour token', () => {
    expect(TS_SEMANTIC.length).toBeGreaterThan(0)
    for (const token of TS_SEMANTIC) {
      if (token.ref.kind === 'step') {
        expect(token.ref.step).toBeGreaterThanOrEqual(1)
        expect(token.ref.step).toBeLessThanOrEqual(STEP_COUNT)
      }
    }
  })

  it('puts background.surface on neutral step 15 and canvas on step 1', () => {
    expect(rolesForStep(15)).toContain('background.surface')
    expect(rolesForStep(1)).toContain('background.canvas')
  })
})

describe('Generator parity with Tokens Studio', () => {
  const tokensStudio = readTokensStudioScale()

  it('has a resolved value for every hue, scheme and step', () => {
    expect(tokensStudio.size).toBe(TS_HUES.length * 2 * STEP_COUNT)
  })

  it('uses the Tokens Studio anchors as the default palettes', () => {
    expect(paletteConfig.colors).toEqual(
      TS_HUES.map((hue) => ({ name: hue.name, value: hue.anchor })),
    )
  })

  // The generator must reproduce what Tokens Studio exports (today the largest
  // difference is ΔE 0.0005, rounding in the OKLCH output). If this fails,
  // either the generation formula or its inputs have drifted from Tokens
  // Studio, which is canonical (ADR 0016).
  for (const scheme of ['light', 'dark'] as const) {
    for (const hue of TS_HUES) {
      it(`reproduces ${scheme} ${hue.key}`, () => {
        const generated = generateColorScale(
          hue.anchor,
          TS_SCALE[scheme],
          TS_GAUSSIAN[scheme].mean,
          TS_GAUSSIAN[scheme].stdDev,
          'OKLCH',
        )
        generated.forEach((colour, i) => {
          const expected = tokensStudio.get(`${scheme}.${hue.key}.${i + 1}`)
          expect(expected).toBeDefined()
          expect(
            deltaE(colour, expected as string, 'OK'),
            `${scheme}.${hue.key}.${i + 1}: generated ${colour}, Tokens Studio ${expected}`,
          ).toBeLessThan(0.002)
        })
      })
    }
  }
})
