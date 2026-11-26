import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import Color from 'colorjs.io'
import { deltaE, generateColorScale } from '@/utils/color'
import {
  SCHEMES,
  STEP_COUNT,
  TONES,
  TS_DATAVIZ,
  TS_DATAVIZ_BASES,
  TS_DATAVIZ_FORMULA,
  DATAVIZ_FORMULA_STEPS,
  TS_GAUSSIAN,
  TS_HUES,
  TS_SCALE,
  TS_SEMANTIC,
  TS_TONE_HUE,
  collapseTone,
  getSemanticToken,
  hueDisplayName,
  hueKey,
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

// The semantic layer as Tokens Studio exports it, from the same release pull.
const TS_SEMANTIC_CSS = resolve(
  __dirname,
  '../../../../packages/eds-tokens/src/tokens/css/semantic/default.css',
)

function readTokensStudioSemanticVars(): Map<string, string> {
  const css = readFileSync(TS_SEMANTIC_CSS, 'utf-8')
  const values = new Map<string, string>()
  for (const match of css.matchAll(/(--eds-[a-z0-9-]+):\s*([^;]+);/g)) {
    values.set(match[1], match[2].trim())
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

describe('hueKey and hueDisplayName', () => {
  it('turns a Tokens Studio key into a display name', () => {
    expect(hueDisplayName('moss-green')).toBe('Moss Green')
    expect(hueDisplayName('north-sea')).toBe('North Sea')
    expect(hueDisplayName('gray')).toBe('Gray')
  })

  it('turns a display name, spaced name or key into the key', () => {
    expect(hueKey('Moss Green')).toBe('moss-green')
    expect(hueKey('moss green')).toBe('moss-green')
    expect(hueKey('moss-green')).toBe('moss-green')
  })

  it('ignores surrounding whitespace and repeated spaces', () => {
    expect(hueKey('  North   Sea ')).toBe('north-sea')
  })

  it('round-trips every Tokens Studio hue', () => {
    for (const hue of TS_HUES) {
      expect(hue.name).toBe(hueDisplayName(hue.key))
      expect(hueKey(hue.name)).toBe(hue.key)
    }
  })
})

describe('TS_HUES', () => {
  it('has unique keys', () => {
    const keys = TS_HUES.map((hue) => hue.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('puts the accent hue first and a neutral hue second', () => {
    expect(TS_HUES[0].key).toBe(TS_TONE_HUE.light.accent)
    expect(TS_HUES[0].tones.light).toContain('accent')
    const neutralHues = SCHEMES.map((scheme) => TS_TONE_HUE[scheme].neutral)
    expect(neutralHues).toContain(TS_HUES[1].key)
  })

  it('orders hues by the first tone that uses them', () => {
    const firstTone = (hue: (typeof TS_HUES)[number]) => {
      const indices = SCHEMES.flatMap((scheme) =>
        hue.tones[scheme].map((tone) => TONES.indexOf(tone)),
      )
      return indices.length > 0 ? Math.min(...indices) : TONES.length
    }
    const order = TS_HUES.map(firstTone)
    expect(order).toEqual([...order].sort((a, b) => a - b))
  })

  it('lists, per scheme, the tones that map to each hue', () => {
    for (const scheme of SCHEMES) {
      for (const hue of TS_HUES) {
        expect(hue.tones[scheme]).toEqual(
          TONES.filter((tone) => TS_TONE_HUE[scheme][tone] === hue.key),
        )
      }
    }
  })

  it('gives each tone exactly one hue per scheme', () => {
    for (const scheme of SCHEMES) {
      const tones = TS_HUES.flatMap((hue) => hue.tones[scheme])
      expect([...tones].sort()).toEqual([...TONES].sort())
    }
  })

  it('writes anchors in CSS OKLCH syntax, without commas', () => {
    for (const hue of TS_HUES) {
      expect(hue.anchor).toMatch(/^oklch\([^,]+\)$/)
    }
  })
})

describe('TS_TONE_HUE', () => {
  it('maps neutral to gray in light and north-sea in dark', () => {
    expect(TS_TONE_HUE.light.neutral).toBe('gray')
    expect(TS_TONE_HUE.dark.neutral).toBe('north-sea')
  })

  it('has an entry for every tone in both schemes', () => {
    for (const scheme of SCHEMES) {
      expect(Object.keys(TS_TONE_HUE[scheme]).sort()).toEqual([...TONES].sort())
    }
  })

  it('keeps the same hue for every tone except neutral across schemes', () => {
    for (const tone of TONES) {
      if (tone === 'neutral') continue
      expect(TS_TONE_HUE.dark[tone]).toBe(TS_TONE_HUE.light[tone])
    }
  })
})

describe('TS_SCALE and TS_GAUSSIAN', () => {
  it('holds 15 lightness values between 0 and 1 for each scheme', () => {
    for (const scheme of SCHEMES) {
      expect(TS_SCALE[scheme]).toHaveLength(STEP_COUNT)
      for (const lightness of TS_SCALE[scheme]) {
        expect(Number.isFinite(lightness)).toBe(true)
        expect(lightness).toBeGreaterThanOrEqual(0)
        expect(lightness).toBeLessThanOrEqual(1)
      }
    }
  })

  // ADR 0016 Confirmation check 2: no two steps share a value.
  it('has no duplicate lightness values within a scheme', () => {
    for (const scheme of SCHEMES) {
      expect(new Set(TS_SCALE[scheme]).size).toBe(STEP_COUNT)
    }
  })

  // ADR 0016 D3: step 15 is inverse polarity, so the surface (step 15) is
  // lighter than the canvas (step 1) in light and darker in dark.
  it('makes the surface lighter than the canvas in light and darker in dark', () => {
    expect(TS_SCALE.light[14]).toBeGreaterThan(TS_SCALE.light[0])
    expect(TS_SCALE.dark[14]).toBeLessThan(TS_SCALE.dark[0])
  })

  it('puts text.primary on the opposite side of background.surface in each scheme', () => {
    // Step 13 is text.primary and step 15 is background.surface (ADR 0016 D5)
    expect(TS_SCALE.light[14]).toBeGreaterThan(TS_SCALE.light[12])
    expect(TS_SCALE.dark[14]).toBeLessThan(TS_SCALE.dark[12])
  })

  it('reads a finite mean and a positive standard deviation per scheme', () => {
    for (const scheme of SCHEMES) {
      const { mean, stdDev } = TS_GAUSSIAN[scheme]
      expect(Number.isFinite(mean)).toBe(true)
      expect(mean).toBeGreaterThanOrEqual(0)
      expect(mean).toBeLessThanOrEqual(1)
      expect(Number.isFinite(stdDev)).toBe(true)
      expect(stdDev).toBeGreaterThan(0)
    }
  })
})

describe('TS_SEMANTIC', () => {
  it('has unique paths and CSS variable names', () => {
    const paths = TS_SEMANTIC.map((token) => token.path)
    const cssVars = TS_SEMANTIC.map((token) => token.cssVar)
    expect(new Set(paths).size).toBe(paths.length)
    expect(new Set(cssVars).size).toBe(cssVars.length)
  })

  it('names each CSS variable after its path with an --eds- prefix', () => {
    for (const token of TS_SEMANTIC) {
      expect(token.cssVar).toBe(`--eds-${token.path.split('.').join('-')}`)
      expect(token.cssVar).not.toContain('.')
    }
  })

  it('points step references at a known tone', () => {
    for (const token of TS_SEMANTIC) {
      if (token.ref.kind === 'step') {
        expect(TONES).toContain(token.ref.tone)
        expect(Number.isInteger(token.ref.step)).toBe(true)
      }
    }
  })

  it('points every data visualisation reference at a value in both schemes', () => {
    const dataviz = TS_SEMANTIC.filter((token) => token.ref.kind === 'dataviz')
    expect(dataviz.length).toBeGreaterThan(0)
    for (const token of dataviz) {
      if (token.ref.kind !== 'dataviz') continue
      for (const scheme of SCHEMES) {
        expect(TS_DATAVIZ[scheme][token.ref.path]).toBeDefined()
      }
    }
  })

  it('matches the variables and references in the Tokens Studio CSS export', () => {
    const exported = readTokensStudioSemanticVars()
    for (const token of TS_SEMANTIC) {
      const expected =
        token.ref.kind === 'step'
          ? `var(--eds-${token.ref.tone}-${token.ref.step})`
          : token.ref.kind === 'dataviz'
            ? `var(--eds-${token.ref.path.split('.').join('-')})`
            : token.ref.value
      expect(exported.get(token.cssVar), token.path).toBe(expected)
    }
  })
})

// The data visualisation values in the CSS export, keyed by scheme and path
// (`light` → `dataviz.cat.1.1`). Hand-picked values are hex; values that
// Tokens Studio computes are oklch(), possibly outside sRGB.
function readTokensStudioDataviz(): Map<string, string> {
  const css = readFileSync(TS_COLOURS_CSS, 'utf-8')
  const values = new Map<string, string>()
  for (const match of css.matchAll(
    /--eds-(light|dark)-(dataviz-[a-z0-9-]+):\s*([^;]+);/g,
  )) {
    values.set(`${match[1]} ${match[2].split('-').join('.')}`, match[3].trim())
  }
  return values
}

describe('TS_DATAVIZ', () => {
  it('has the same tokens in both schemes', () => {
    expect(Object.keys(TS_DATAVIZ.light).length).toBeGreaterThan(0)
    expect(Object.keys(TS_DATAVIZ.dark).sort()).toEqual(
      Object.keys(TS_DATAVIZ.light).sort(),
    )
  })

  it('holds every value as sRGB hex', () => {
    for (const scheme of SCHEMES) {
      for (const [path, colour] of Object.entries(TS_DATAVIZ[scheme])) {
        expect(colour, `${scheme} ${path}`).toMatch(/^#[0-9a-f]{6}$/i)
      }
    }
  })

  it('matches every data visualisation value in the Tokens Studio CSS export', () => {
    const exported = readTokensStudioDataviz()
    const keys = SCHEMES.flatMap((scheme) =>
      Object.keys(TS_DATAVIZ[scheme]).map((path) => `${scheme} ${path}`),
    )
    expect([...exported.keys()].sort()).toEqual([...keys].sort())
    for (const scheme of SCHEMES) {
      for (const [path, colour] of Object.entries(TS_DATAVIZ[scheme])) {
        const expected = exported.get(`${scheme} ${path}`) as string
        if (expected.startsWith('#')) {
          expect(colour, `${scheme} ${path}`).toBe(expected)
          continue
        }
        // The TypeScript export maps an oklch() value outside sRGB into it by
        // reducing chroma at the same lightness and hue. Mapping the CSS value
        // the same way (with `jnd: 0`, so colorjs.io does not stop early at a
        // clipped colour) gives its hex; the small limit covers the CSS export
        // rounding OKLCH to four decimals. Other tools map such values
        // differently (Figma clamps each channel), so this pins the export's
        // method, not the only possible answer.
        const mapped = new Color(expected)
          .toGamut({ space: 'srgb', method: 'oklch.c', jnd: 0 })
          .to('srgb')
          .toString({ format: 'hex' })
        expect(
          deltaE(colour, mapped, 'OK'),
          `${scheme} ${path}: read ${colour}, CSS export ${expected} → ${mapped}`,
        ).toBeLessThan(0.005)
      }
    }
  })
})

describe('TS_DATAVIZ_FORMULA', () => {
  it('reads one base colour per categorical colour in the export', () => {
    const categories = new Set(
      Object.keys(TS_DATAVIZ.light)
        .filter((path) => path.startsWith('dataviz.cat.'))
        .map((path) => path.split('.')[2]),
    )
    expect(TS_DATAVIZ_FORMULA.bases).toHaveLength(categories.size)
    expect(TS_DATAVIZ_FORMULA.bases.length).toBeGreaterThan(0)
  })

  // The formula reads lightness and chroma from the light base for both
  // schemes (foundation/dataviz), so one list of bases has to serve both.
  it('has the same base colours in both schemes', () => {
    expect(TS_DATAVIZ_BASES.dark).toEqual(TS_DATAVIZ_BASES.light)
  })

  it('reads each base as the step 3 hex of the export', () => {
    TS_DATAVIZ_FORMULA.bases.forEach((base, i) => {
      expect(base).toMatch(/^#[0-9a-f]{6}$/)
      for (const scheme of SCHEMES) {
        expect(TS_DATAVIZ[scheme][`dataviz.cat.${i + 1}.3`]).toBe(base)
      }
    })
  })

  it('reads a weight between 0 and 1 for every computed step and scheme', () => {
    for (const scheme of SCHEMES) {
      for (const step of DATAVIZ_FORMULA_STEPS) {
        const weight = TS_DATAVIZ_FORMULA.weight[scheme][step]
        expect(weight).toBeGreaterThanOrEqual(0)
        expect(weight).toBeLessThanOrEqual(1)
      }
    }
  })

  it('reads both chroma reductions between 0 and 1 per scheme', () => {
    for (const scheme of SCHEMES) {
      for (const side of ['background', 'contrast'] as const) {
        const reduction = TS_DATAVIZ_FORMULA.chromaReduction[scheme][side]
        expect(reduction).toBeGreaterThanOrEqual(0)
        expect(reduction).toBeLessThanOrEqual(1)
      }
    }
  })
})

describe('getSemanticToken', () => {
  it('finds a token by its Tokens Studio path', () => {
    const token = getSemanticToken('text.primary')
    expect(token?.path).toBe('text.primary')
    expect(token?.cssVar).toBe('--eds-text-primary')
    expect(token?.ref.kind).toBe('step')
  })

  it('returns the same object as TS_SEMANTIC for every token', () => {
    for (const token of TS_SEMANTIC) {
      expect(getSemanticToken(token.path)).toBe(token)
    }
  })

  it('returns undefined for an unknown path', () => {
    expect(getSemanticToken('no.such.token')).toBeUndefined()
    expect(getSemanticToken('')).toBeUndefined()
  })
})

describe('collapseTone', () => {
  it('replaces a tone segment with <tone>', () => {
    expect(collapseTone('text.on-emphasis.danger')).toBe(
      'text.on-emphasis.<tone>',
    )
    expect(collapseTone('background.interactive.accent.emphasis.default')).toBe(
      'background.interactive.<tone>.emphasis.default',
    )
  })

  it('replaces every tone, one segment at a time', () => {
    for (const tone of TONES) {
      expect(collapseTone(`border.${tone}.muted`)).toBe('border.<tone>.muted')
    }
  })

  it('leaves paths without a tone as they are', () => {
    expect(collapseTone('text.primary')).toBe('text.primary')
    expect(collapseTone('border.interactive.focus')).toBe(
      'border.interactive.focus',
    )
  })

  it('only matches whole segments', () => {
    expect(collapseTone('text.accented.neutrality')).toBe(
      'text.accented.neutrality',
    )
  })
})

describe('rolesForStep', () => {
  // Steps 6 and 14 have no semantic consumer (ADR 0016 D5).
  it('gives steps 6 and 14 no roles', () => {
    expect(rolesForStep(6)).toEqual([])
    expect(rolesForStep(14)).toEqual([])
  })

  it('gives every other step at least one role', () => {
    for (let step = 1; step <= STEP_COUNT; step++) {
      if (step === 6 || step === 14) continue
      expect(rolesForStep(step).length, `step ${step}`).toBeGreaterThan(0)
    }
  })

  it('returns nothing for steps outside the scale', () => {
    expect(rolesForStep(0)).toEqual([])
    expect(rolesForStep(STEP_COUNT + 1)).toEqual([])
  })

  it('lists every step token under its full path or its <tone> name', () => {
    for (const token of TS_SEMANTIC) {
      if (token.ref.kind !== 'step') continue
      const roles = rolesForStep(token.ref.step)
      expect(
        roles.includes(token.path) || roles.includes(collapseTone(token.path)),
        token.path,
      ).toBe(true)
    }
  })

  it('collapses a role that every tone shares on a step', () => {
    expect(rolesForStep(9)).toContain(
      'background.interactive.<tone>.emphasis.default',
    )
    for (const tone of TONES) {
      expect(rolesForStep(9)).not.toContain(
        `background.interactive.${tone}.emphasis.default`,
      )
    }
  })

  it('keeps the full path of a role that a single tone uses', () => {
    const textPrimary = getSemanticToken('text.primary')
    expect(textPrimary?.ref.kind).toBe('step')
    if (textPrimary?.ref.kind !== 'step') return
    expect(rolesForStep(textPrimary.ref.step)).toContain('text.primary')
  })

  it('keeps the full path when the path names a different tone than the reference', () => {
    // A path that names one tone but references another must not be
    // mistaken for a per-tone role.
    const mismatched = TS_SEMANTIC.filter((token) => {
      if (token.ref.kind !== 'step') return false
      const pathTone = token.path
        .split('.')
        .find((segment) => (TONES as readonly string[]).includes(segment))
      return pathTone !== undefined && pathTone !== token.ref.tone
    })
    for (const token of mismatched) {
      if (token.ref.kind !== 'step') continue
      expect(rolesForStep(token.ref.step)).toContain(token.path)
    }
  })

  it('lists each role once', () => {
    for (let step = 1; step <= STEP_COUNT; step++) {
      const roles = rolesForStep(step)
      expect(new Set(roles).size).toBe(roles.length)
    }
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
