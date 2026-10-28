import { describe, expect, it } from 'vitest'
import { TS_HUES } from '@/config/tokensStudio'
import {
  anchorProposals,
  withOklchColours,
  palettesFile,
  palettesFromConfig,
  palettesToColors,
  tokensStudioAnchorsFile,
} from './paletteConfigFile'

const moss = TS_HUES.find((h) => h.key === 'moss-green')!

describe('palettesToColors', () => {
  it('writes single colours as OKLCH, converting old hex values', () => {
    expect(
      palettesToColors([
        { name: 'Moss Green', baseColor: moss.anchor },
        { name: 'Old', baseColor: 'ffffff' },
      ]),
    ).toEqual([
      { name: 'Moss Green', value: 'oklch(0.4973 0.084851 204.553)' },
      { name: 'Old', value: 'oklch(1 0 0)' },
    ])
  })
})

describe('palettesFile and palettesFromConfig', () => {
  it('holds only the palettes', () => {
    expect(
      Object.keys(palettesFile([{ name: 'Red', baseColor: 'e20337' }])),
    ).toEqual(['colors'])
  })

  it('round-trips', () => {
    const palettes = [{ name: 'Moss Green', baseColor: moss.anchor }]
    expect(palettesFromConfig(palettesFile(palettes))).toEqual(palettes)
  })

  it('reads older palette configs and converts hex to OKLCH', () => {
    const palettes = palettesFromConfig({
      lightModeValues: [],
      colors: [{ name: 'Gray', value: '#ffffff' }],
    })
    expect(palettes).toEqual([{ name: 'Gray', baseColor: 'oklch(1 0 0)' }])
  })

  it('reads an older palette with several anchors as one OKLCH colour', () => {
    // The frozen 2.x Moss Green; Tokens Studio kept its step 9 anchor
    const palettes = palettesFromConfig({
      colors: [
        {
          name: 'Moss Green',
          anchors: [
            { value: 'oklch(0.5915 0.0731 184.63)', step: 6 },
            { value: 'oklch(0.4973 0.084851 204.553)', step: 9 },
          ],
        },
        { name: 'Light', anchors: [{ value: '#ffffff', step: 2 }] },
      ],
    })
    expect(palettes).toEqual([
      { name: 'Moss Green', baseColor: moss.anchor },
      { name: 'Light', baseColor: 'oklch(1 0 0)' },
    ])
  })

  it('rejects files without valid palettes', () => {
    expect(palettesFromConfig(null)).toBeNull()
    expect(palettesFromConfig({})).toBeNull()
    expect(palettesFromConfig({ colors: [] })).toBeNull()
    expect(
      palettesFromConfig({ colors: [{ name: 'X', value: 'nope' }] }),
    ).toBeNull()
    expect(
      palettesFromConfig({
        colors: [{ name: 'X', anchors: [{ step: 20, value: '#fff' }] }],
      }),
    ).toBeNull()
  })
})

describe('anchorProposals', () => {
  it('compares each palette with the Tokens Studio anchor of the same name', () => {
    const proposals = anchorProposals([
      { name: 'Moss Green', baseColor: moss.anchor },
      { name: 'Red', baseColor: 'oklch(0.6 0.2 25)' },
      { name: 'Brand Purple', baseColor: 'oklch(0.5 0.15 300)' },
    ])
    expect(proposals.map((p) => [p.key, p.status])).toEqual([
      ['moss-green', 'unchanged'],
      ['red', 'changed'],
      ['brand-purple', 'new'],
    ])
    expect(proposals[1].value).toBe('oklch(0.6, 0.2, 25)')
    expect(proposals[1].tokensStudioValue).toBe('oklch(0.5776, 0.2314, 21.12)')
  })

  it('writes changed and new anchors in the Tokens Studio set format', () => {
    const file = tokensStudioAnchorsFile(
      anchorProposals([
        { name: 'Moss Green', baseColor: moss.anchor },
        { name: 'Red', baseColor: 'oklch(0.6 0.2 25)' },
      ]),
    )
    expect(file).toEqual({
      input: {
        palette: {
          red: {
            anchor: {
              $value: 'oklch(0.6, 0.2, 25)',
              $type: 'color',
              $extensions: { 'com.figma': { hiddenFromPublishing: true } },
            },
          },
        },
      },
    })
  })
})

describe('withOklchColours', () => {
  it('converts hex from old links and keeps OKLCH as written', () => {
    expect(
      withOklchColours([
        { name: 'Old', baseColor: 'ffffff' },
        { name: 'Moss Green', baseColor: moss.anchor },
      ]),
    ).toEqual([
      { name: 'Old', baseColor: 'oklch(1 0 0)' },
      { name: 'Moss Green', baseColor: moss.anchor },
    ])
  })
})
