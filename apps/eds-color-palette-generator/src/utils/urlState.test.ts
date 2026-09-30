import { describe, expect, it } from 'vitest'
import { deserializeState, serializeState } from './urlState'

const parse = (query: string) => deserializeState(new URLSearchParams(query))

describe('urlState tabs', () => {
  it('round-trips the tab', () => {
    expect(parse(serializeState({ activeTab: 'examples' })).activeTab).toBe(
      'examples',
    )
  })

  it('leaves the default tab out of the URL', () => {
    expect(serializeState({ activeTab: 'system' })).toBe('')
  })

  it('accepts the Norwegian keys from links shared before the translation', () => {
    expect(parse('tab=fargesystem').activeTab).toBe('system')
    expect(parse('tab=eksempler').activeTab).toBe('examples')
    expect(parse('tab=kontrast').activeTab).toBe('contrast')
  })

  it('ignores unknown tabs', () => {
    expect(parse('tab=nope').activeTab).toBeUndefined()
  })
})

describe('urlState palettes', () => {
  it('round-trips names that contain the delimiters', () => {
    const palettes = [
      { name: 'Blue, Green: 50% @ night = cool', baseColor: '0070a9' },
      { name: 'Moss Green', baseColor: '21767e' },
    ]
    expect(parse(serializeState({ palettes })).palettes).toEqual(palettes)
  })

  it('round-trips anchor values written with commas', () => {
    const palettes = [
      {
        name: 'Teal',
        baseColor: '',
        anchors: [
          { step: 6, value: 'oklch(0.59, 0.07, 184.6)' },
          { step: 9, value: 'oklch(0.4973 0.084851 204.553)' },
        ],
      },
    ]
    expect(parse(serializeState({ palettes })).palettes).toEqual(palettes)
  })

  it('does not write client ids to the URL', () => {
    expect(
      serializeState({
        palettes: [{ id: 'x', name: 'Red', baseColor: 'f00' }],
      }),
    ).not.toContain('x')
  })

  it('reads links from before escaping', () => {
    expect(parse('p=Moss+Green:206f77,Gray:696969').palettes).toEqual([
      { name: 'Moss Green', baseColor: '206f77' },
      { name: 'Gray', baseColor: '696969' },
    ])
  })
})
