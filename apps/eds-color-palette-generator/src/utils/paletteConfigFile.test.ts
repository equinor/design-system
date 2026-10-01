import { describe, expect, it } from 'vitest'
import { palettesFromConfig, palettesToColors } from './paletteConfigFile'

describe('palettesToColors', () => {
  it('writes single colours with a hash and keeps anchors', () => {
    expect(
      palettesToColors([
        { name: 'Moss Green', baseColor: '007079' },
        {
          name: 'Teal',
          baseColor: '',
          anchors: [{ step: 6, value: 'oklch(0.59 0.07 184.6)' }],
        },
      ]),
    ).toEqual([
      { name: 'Moss Green', value: '#007079' },
      { name: 'Teal', anchors: [{ step: 6, value: 'oklch(0.59 0.07 184.6)' }] },
    ])
  })
})

describe('palettesFromConfig', () => {
  it('reads the palettes from a downloaded palette config', () => {
    const config = {
      lightModeValues: [],
      darkModeValues: [],
      colors: [
        { name: 'Gray', value: 'oklch(0.4091 0 0)' },
        {
          name: 'Teal',
          anchors: [
            { step: 6, value: '#3c959e' },
            { step: 9, value: '#21767e' },
          ],
        },
      ],
    }
    const palettes = palettesFromConfig(config)
    expect(palettes?.[0]).toEqual({ name: 'Gray', baseColor: '4a4a4a' })
    expect(palettes?.[1].anchors).toHaveLength(2)
  })

  it('round-trips with palettesToColors', () => {
    const palettes = [{ name: 'Red', baseColor: 'e20337' }]
    expect(palettesFromConfig({ colors: palettesToColors(palettes) })).toEqual(
      palettes,
    )
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
