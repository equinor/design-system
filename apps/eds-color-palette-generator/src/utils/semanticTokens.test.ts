import { describe, expect, it } from 'vitest'
import {
  paletteForTone,
  resolveSemanticColors,
  resolveToken,
  tokenStep,
  tokenTarget,
  tokenTone,
  tokensStudioPalettes,
  toneRamps,
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
