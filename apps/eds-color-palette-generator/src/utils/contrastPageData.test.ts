import { describe, expect, it } from 'vitest'
import { PALETTE_STEPS } from '@/config/config'
import { SCHEMES, getSemanticToken } from '@/config/tokensStudio'
import {
  PATTERN_GROUP_SPECS,
  buildPatternGroups,
  buildStepData,
  tokenLabel,
} from './contrastPageData'
import { resolveToken, tokensStudioPalettes, toneRamps } from './semanticTokens'

const HEX = /^#[0-9a-f]{6}$/i

describe('PATTERN_GROUP_SPECS', () => {
  it('only uses tokens that exist in Tokens Studio', () => {
    for (const group of PATTERN_GROUP_SPECS) {
      for (const pair of group.pairs) {
        expect(getSemanticToken(pair.fg), pair.fg).toBeDefined()
        expect(getSemanticToken(pair.bg), pair.bg).toBeDefined()
      }
    }
  })
})

describe('buildPatternGroups', () => {
  it.each(SCHEMES)('resolves every pair to a colour in %s', (scheme) => {
    const groups = buildPatternGroups(scheme)
    expect(groups).toHaveLength(PATTERN_GROUP_SPECS.length)
    groups.forEach((group, i) => {
      expect(group.pairings).toHaveLength(PATTERN_GROUP_SPECS[i].pairs.length)
      for (const pairing of group.pairings) {
        expect(pairing.fg.hex).toMatch(HEX)
        expect(pairing.bg.hex).toMatch(HEX)
        expect(Number.isFinite(parseFloat(pairing.contrast.apca))).toBe(true)
      }
    })
  })

  it('resolves through the scheme mapping', () => {
    const [text] = buildPatternGroups('dark')
    const primaryOnSurface = text.pairings.find(
      (p) =>
        p.fg.label === tokenLabel('text.primary') &&
        p.bg.label === tokenLabel('background.surface'),
    )
    const ramps = toneRamps('dark')
    expect(primaryOnSurface?.fg.hex).toBe(
      resolveToken('text.primary', ramps, 'dark'),
    )
    expect(primaryOnSurface?.bg.hex).toBe(
      resolveToken('background.surface', ramps, 'dark'),
    )
  })

  it('labels each colour with its token path and target', () => {
    expect(tokenLabel('text.primary')).toBe('text.primary · neutral.13')
    expect(tokenLabel('border.interactive.focus')).toBe(
      'border.interactive.focus · info.7',
    )
  })

  it('covers each status tone', () => {
    const groups = buildPatternGroups('light')
    const status = groups[groups.length - 1]
    expect(status.pairings.map((p) => p.fg.label)).toEqual([
      tokenLabel('text.on-emphasis.success'),
      tokenLabel('text.on-emphasis.info'),
      tokenLabel('text.on-emphasis.warning'),
      tokenLabel('text.on-emphasis.danger'),
    ])
  })
})

describe('buildStepData', () => {
  const steps = tokensStudioPalettes('light')[0].steps

  it('labels steps by their Tokens Studio role in semantic order', () => {
    const data = buildStepData(steps, 'semantic')
    expect(data.map((d) => d.role)).toEqual(PALETTE_STEPS.map((s) => s.label))
    expect(data[8].step).toBe(9)
  })

  it('keeps the step numbers when sorted by lightness', () => {
    const data = buildStepData([steps[14], steps[0]], 'gradient', [15, 1])
    expect(data.map((d) => d.step)).toEqual([15, 1])
    expect(data.every((d) => d.role === '')).toBe(true)
  })
})
