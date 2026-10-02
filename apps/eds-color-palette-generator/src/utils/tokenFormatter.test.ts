import { describe, expect, it } from 'vitest'
import { formatColorsAsTokens } from './tokenFormatter'

const parse = (json: string) =>
  JSON.parse(json) as Record<
    string,
    Record<
      string,
      {
        $type: string
        $value: string
        $description: string
        $extensions: Record<string, unknown>
      }
    >
  >

describe('formatColorsAsTokens', () => {
  it('returns an empty object for no colours', () => {
    expect(formatColorsAsTokens({})).toBe('{}')
  })

  it('groups the tokens under each colour name, in order', () => {
    const tokens = parse(
      formatColorsAsTokens({ gray: ['#111111'], blue: ['#222222'] }),
    )
    expect(Object.keys(tokens)).toEqual(['gray', 'blue'])
  })

  it('numbers the steps from 1 and keeps the colour values', () => {
    const steps = ['#111111', '#222222', 'oklch(0.5 0.1 200)']
    const tokens = parse(formatColorsAsTokens({ gray: steps }))
    expect(Object.keys(tokens.gray)).toEqual(['1', '2', '3'])
    expect(Object.values(tokens.gray).map((token) => token.$value)).toEqual(
      steps,
    )
  })

  it('writes each step as a colour token with Figma extensions', () => {
    const tokens = parse(formatColorsAsTokens({ gray: ['#111111'] }))
    expect(tokens.gray['1']).toEqual({
      $type: 'color',
      $value: '#111111',
      $description: '',
      $extensions: {
        'com.figma': {
          hiddenFromPublishing: false,
          scopes: ['ALL_SCOPES'],
          codeSyntax: {},
        },
      },
    })
  })

  it('keeps a colour with no steps as an empty group', () => {
    expect(parse(formatColorsAsTokens({ gray: [] }))).toEqual({ gray: {} })
  })

  it('indents the JSON with two spaces', () => {
    const json = formatColorsAsTokens({ gray: ['#111111'] })
    expect(json).toBe(JSON.stringify(JSON.parse(json), null, 2))
    expect(json.split('\n')[1]).toBe('  "gray": {')
  })
})
