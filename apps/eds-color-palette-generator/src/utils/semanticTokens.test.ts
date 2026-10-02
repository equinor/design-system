import { describe, expect, it } from 'vitest'
import {
  SCHEMES,
  STEP_COUNT,
  TONES,
  TS_DATAVIZ,
  TS_HUES,
  TS_SEMANTIC,
  TS_TONE_HUE,
  hueDisplayName,
} from '@/config/tokensStudio'
import {
  findPaletteForTone,
  paletteForTone,
  resolveSemanticColors,
  resolveToken,
  tokenStep,
  tokenTarget,
  tokenTone,
  tokensStudioPalettes,
  toneRamps,
  type ToneRamps,
} from './semanticTokens'

const ramp = (name: string, scheme: 'light' | 'dark') =>
  tokensStudioPalettes(scheme).find((p) => p.name === name)?.steps ?? []

describe('semanticTokens', () => {
  it('maps neutral to gray in light and north-sea in dark', () => {
    const light = toneRamps('light')
    const dark = toneRamps('dark')
    expect(resolveToken('background.canvas', light, 'light')).toBe(
      ramp('Gray', 'light')[0],
    )
    expect(resolveToken('background.canvas', dark, 'dark')).toBe(
      ramp('North Sea', 'dark')[0],
    )
  })

  it('puts background.surface on step 15 and text.primary on step 13', () => {
    const light = toneRamps('light')
    expect(resolveToken('background.surface', light, 'light')).toBe(
      ramp('Gray', 'light')[14],
    )
    expect(resolveToken('text.primary', light, 'light')).toBe(
      ramp('Gray', 'light')[12],
    )
  })

  it('uses a palette whose name matches the tone hue', () => {
    const edited = Array.from({ length: 15 }, () => '#123456')
    const ramps = toneRamps('light', [{ name: 'moss green', steps: edited }])
    expect(
      resolveToken(
        'background.interactive.accent.emphasis.default',
        ramps,
        'light',
      ),
    ).toBe('#123456')
  })

  it('lets an override replace a tone', () => {
    const override = Array.from({ length: 15 }, () => '#abcdef')
    const ramps = toneRamps('light', [], { accent: override })
    expect(resolveToken('text.on-emphasis.accent', ramps, 'light')).toBe(
      '#abcdef',
    )
  })

  it('resolves data visualisation tokens to the Tokens Studio values', () => {
    const colors = resolveSemanticColors(toneRamps('light'), 'light')
    expect(colors['data-visualization.cat.1.1']).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('describes where a token points', () => {
    expect(tokenTarget('text.primary')).toBe('neutral.13')
    expect(tokenTarget('border.interactive.focus')).toBe('info.7')
  })

  it('reads the step and tone a token points at', () => {
    expect(tokenStep('text.primary')).toBe(13)
    expect(tokenTone('text.primary')).toBe('neutral')
    expect(tokenStep('background.interactive.accent.emphasis.default')).toBe(9)
    expect(tokenStep('overlay.scrim')).toBeUndefined()
    expect(tokenStep('no.such.token')).toBeUndefined()
  })

  it('finds the palette that plays a tone, by hue name', () => {
    const own = { name: 'gray', steps: ramp('Gray', 'light') }
    const other = { name: 'Custom', steps: ramp('Red', 'light') }
    expect(paletteForTone([other, own], 'neutral', 'light')).toBe(own)
  })

  it('falls back to the Tokens Studio palette for a tone', () => {
    const other = { name: 'Custom', steps: ramp('Red', 'light') }
    expect(paletteForTone([other], 'neutral', 'light').name).toBe('Gray')
    expect(paletteForTone([other], 'neutral', 'dark').name).toBe('North Sea')
    expect(paletteForTone([], 'info', 'light').steps).toEqual(
      ramp('Blue', 'light'),
    )
  })
})

// The first token of each reference kind, read from Tokens Studio so the
// tests follow a pull instead of naming a token that might move.
const firstOfKind = (kind: 'step' | 'dataviz' | 'literal') =>
  TS_SEMANTIC.find((token) => token.ref.kind === kind)

describe('tokensStudioPalettes', () => {
  it('generates the seven hues with 15 hex steps for each scheme', () => {
    for (const scheme of SCHEMES) {
      const palettes = tokensStudioPalettes(scheme)
      expect(palettes.map((palette) => palette.name)).toEqual(
        TS_HUES.map((hue) => hue.name),
      )
      for (const palette of palettes) {
        expect(palette.steps).toHaveLength(STEP_COUNT)
        for (const step of palette.steps) {
          expect(step).toMatch(/^#[0-9a-f]{6}$/i)
        }
      }
    }
  })

  it('caches the ramps per scheme', () => {
    expect(tokensStudioPalettes('light')).toBe(tokensStudioPalettes('light'))
    expect(tokensStudioPalettes('dark')).not.toBe(tokensStudioPalettes('light'))
  })
})

describe('findPaletteForTone', () => {
  it('matches a palette by display name, spaced name or key', () => {
    const hue = TS_TONE_HUE.light.accent
    for (const name of [hueDisplayName(hue), hue.replace(/-/g, ' '), hue]) {
      const palette = { name }
      expect(findPaletteForTone([palette], 'accent', 'light')).toBe(palette)
    }
  })

  it('follows the scheme for the neutral hue', () => {
    const light = { name: hueDisplayName(TS_TONE_HUE.light.neutral) }
    const dark = { name: hueDisplayName(TS_TONE_HUE.dark.neutral) }
    expect(findPaletteForTone([light, dark], 'neutral', 'light')).toBe(light)
    expect(findPaletteForTone([light, dark], 'neutral', 'dark')).toBe(dark)
  })

  it('returns undefined when no palette plays the tone', () => {
    expect(findPaletteForTone([{ name: 'Custom' }], 'info', 'light')).toBe(
      undefined,
    )
    expect(findPaletteForTone([], 'info', 'light')).toBeUndefined()
  })

  it('finds a Tokens Studio palette for every tone and scheme', () => {
    for (const scheme of SCHEMES) {
      for (const tone of TONES) {
        const palette = findPaletteForTone(
          tokensStudioPalettes(scheme),
          tone,
          scheme,
        )
        expect(palette?.name).toBe(hueDisplayName(TS_TONE_HUE[scheme][tone]))
      }
    }
  })
})

describe('toneRamps', () => {
  it('gives every tone a 15-step ramp by default in both schemes', () => {
    for (const scheme of SCHEMES) {
      const ramps = toneRamps(scheme)
      for (const tone of TONES) {
        expect(ramps[tone]).toHaveLength(STEP_COUNT)
      }
    }
  })

  it('applies a palette named after the dark neutral hue only in dark', () => {
    const edited = Array.from({ length: STEP_COUNT }, () => '#123456')
    const palette = {
      name: hueDisplayName(TS_TONE_HUE.dark.neutral),
      steps: edited,
    }
    expect(toneRamps('dark', [palette]).neutral).toBe(edited)
    expect(toneRamps('light', [palette]).neutral).not.toBe(edited)
  })

  it('prefers an override to a matching palette', () => {
    const override = Array.from({ length: STEP_COUNT }, () => '#abcdef')
    const palette = {
      name: hueDisplayName(TS_TONE_HUE.light.info),
      steps: Array.from({ length: STEP_COUNT }, () => '#123456'),
    }
    expect(toneRamps('light', [palette], { info: override }).info).toBe(
      override,
    )
  })
})

describe('resolveToken', () => {
  it('returns undefined for an unknown token', () => {
    expect(resolveToken('no.such.token', toneRamps('light'), 'light')).toBe(
      undefined,
    )
  })

  it('reads a step token from the ramp of its tone', () => {
    const token = firstOfKind('step')
    expect(token?.ref.kind).toBe('step')
    if (token?.ref.kind !== 'step') return
    const ramps = toneRamps('light')
    expect(resolveToken(token.path, ramps, 'light')).toBe(
      ramps[token.ref.tone][token.ref.step - 1],
    )
  })

  it('returns the literal value of a literal token in both schemes', () => {
    const token = firstOfKind('literal')
    expect(token?.ref.kind).toBe('literal')
    if (token?.ref.kind !== 'literal') return
    for (const scheme of SCHEMES) {
      expect(resolveToken(token.path, toneRamps(scheme), scheme)).toBe(
        token.ref.value,
      )
    }
  })

  it('reads a data visualisation token from the Tokens Studio values for the scheme', () => {
    const token = firstOfKind('dataviz')
    expect(token?.ref.kind).toBe('dataviz')
    if (token?.ref.kind !== 'dataviz') return
    for (const scheme of SCHEMES) {
      expect(resolveToken(token.path, toneRamps(scheme), scheme)).toBe(
        TS_DATAVIZ[scheme][token.ref.path],
      )
    }
  })

  it('ignores the ramps for data visualisation and literal tokens', () => {
    const empty = Object.fromEntries(
      TONES.map((tone) => [tone, []]),
    ) as unknown as ToneRamps
    for (const kind of ['dataviz', 'literal'] as const) {
      const token = firstOfKind(kind)
      if (!token) continue
      expect(resolveToken(token.path, empty, 'light')).toBe(
        resolveToken(token.path, toneRamps('light'), 'light'),
      )
    }
  })
})

describe('resolveSemanticColors', () => {
  it('resolves every semantic token in both schemes', () => {
    for (const scheme of SCHEMES) {
      const colors = resolveSemanticColors(toneRamps(scheme), scheme)
      expect(Object.keys(colors).sort()).toEqual(
        TS_SEMANTIC.map((token) => token.path).sort(),
      )
    }
  })

  it('leaves out step tokens whose ramp is empty', () => {
    const ramps = { ...toneRamps('light'), accent: [] }
    const colors = resolveSemanticColors(ramps, 'light')
    for (const token of TS_SEMANTIC) {
      if (token.ref.kind === 'step' && token.ref.tone === 'accent') {
        expect(colors[token.path]).toBeUndefined()
      }
    }
  })
})

describe('token lookups', () => {
  it('agrees with the Tokens Studio reference of every step token', () => {
    for (const token of TS_SEMANTIC) {
      if (token.ref.kind !== 'step') continue
      expect(tokenStep(token.path)).toBe(token.ref.step)
      expect(tokenTone(token.path)).toBe(token.ref.tone)
      expect(tokenTarget(token.path)).toBe(
        `${token.ref.tone}.${token.ref.step}`,
      )
    }
  })

  it('has no step or tone for data visualisation and literal tokens', () => {
    for (const kind of ['dataviz', 'literal'] as const) {
      const token = firstOfKind(kind)
      if (!token) continue
      expect(tokenStep(token.path)).toBeUndefined()
      expect(tokenTone(token.path)).toBeUndefined()
    }
  })

  it('describes a data visualisation token by its Tokens Studio path', () => {
    const token = firstOfKind('dataviz')
    expect(token?.ref.kind).toBe('dataviz')
    if (token?.ref.kind !== 'dataviz') return
    expect(tokenTarget(token.path)).toBe(token.ref.path)
  })

  it('describes a literal token by its value', () => {
    const token = firstOfKind('literal')
    expect(token?.ref.kind).toBe('literal')
    if (token?.ref.kind !== 'literal') return
    expect(tokenTarget(token.path)).toBe(token.ref.value)
  })

  it('returns nothing for an unknown token', () => {
    expect(tokenTarget('no.such.token')).toBe('')
    expect(tokenTone('no.such.token')).toBeUndefined()
  })
})
