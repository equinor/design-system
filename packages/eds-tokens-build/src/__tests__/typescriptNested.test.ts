import { describe, it, expect } from 'vitest'
import type { TransformedToken } from 'style-dictionary/types'
import {
  toCamelCase,
  buildNestedObject,
  typescriptNestedFormat,
} from '../format/typescriptNested'
import type { FormatFnArguments } from 'style-dictionary/types'

describe('typescriptNested format', () => {
  describe('toCamelCase', () => {
    it('converts single PascalCase word to camelCase', () => {
      expect(toCamelCase('Bg')).toBe('bg')
      expect(toCamelCase('Neutral')).toBe('neutral')
      expect(toCamelCase('Canvas')).toBe('canvas')
    })

    it('converts space-separated words to camelCase', () => {
      expect(toCamelCase('Fill Muted')).toBe('fillMuted')
      expect(toCamelCase('Fill Emphasis')).toBe('fillEmphasis')
    })

    it('handles multi-word segments', () => {
      expect(toCamelCase('Subtle on emphasis')).toBe('subtleOnEmphasis')
    })

    it('preserves already lowercase single words', () => {
      expect(toCamelCase('default')).toBe('default')
    })

    it('handles single character segments', () => {
      expect(toCamelCase('A')).toBe('a')
    })
  })

  describe('buildNestedObject', () => {
    it('builds a nested structure from token paths', () => {
      const tokens = [
        mockToken(['Bg', 'Neutral', 'Canvas'], '#f5f5f5'),
        mockToken(['Bg', 'Neutral', 'Surface'], '#ffffff'),
        mockToken(['Bg', 'Neutral', 'Fill Muted', 'Default'], '#e1e1e1'),
        mockToken(['Bg', 'Neutral', 'Fill Muted', 'Hover'], '#d4d4d4'),
        mockToken(['Text', 'Neutral', 'Default'], '#333333'),
      ] as TransformedToken[]

      const result = buildNestedObject(tokens)

      expect(result).toEqual({
        bg: {
          neutral: {
            canvas: '#f5f5f5',
            surface: '#ffffff',
            fillMuted: {
              default: '#e1e1e1',
              hover: '#d4d4d4',
            },
          },
        },
        text: {
          neutral: {
            default: '#333333',
          },
        },
      })
    })

    it('handles numeric path segments', () => {
      const tokens = [
        mockToken(['Neutral', '1'], '#111111'),
        mockToken(['Neutral', '2'], '#222222'),
      ] as TransformedToken[]

      const result = buildNestedObject(tokens)

      expect(result).toEqual({
        neutral: {
          '1': '#111111',
          '2': '#222222',
        },
      })
    })
  })

  describe('typescriptNestedFormat', () => {
    it('outputs a valid TypeScript module with nested object', () => {
      const tokens = [
        mockToken(['Bg', 'Neutral', 'Canvas'], '#f5f5f5'),
        mockToken(['Bg', 'Neutral', 'Fill Muted', 'Default'], '#e1e1e1'),
      ] as TransformedToken[]

      const result = typescriptNestedFormat({
        dictionary: { allTokens: tokens, tokens: {}, unfilteredTokens: {} },
        options: { rootName: 'color' },
        file: { destination: 'test.ts' },
        platform: {},
      } as unknown as FormatFnArguments)

      expect(result).toMatchInlineSnapshot(`
        "/**
         * Do not edit directly, this file was auto-generated.
         */

        export const color = {
          bg: {
            neutral: {
              canvas: '#f5f5f5',
              fillMuted: {
                default: '#e1e1e1',
              },
            },
          },
        } as const
        "
      `)
    })

    it('defaults rootName to "tokens" when not specified', () => {
      const tokens = [
        mockToken(['Bg', 'Neutral', 'Canvas'], '#f5f5f5'),
      ] as TransformedToken[]

      const result = typescriptNestedFormat({
        dictionary: { allTokens: tokens, tokens: {}, unfilteredTokens: {} },
        options: {},
        file: { destination: 'test.ts' },
        platform: {},
      } as unknown as FormatFnArguments)

      expect(result).toContain('export const tokens =')
    })

    it('quotes numeric keys in the output', () => {
      const tokens = [
        mockToken(['Neutral', '1'], '#111111'),
      ] as TransformedToken[]

      const result = typescriptNestedFormat({
        dictionary: { allTokens: tokens, tokens: {}, unfilteredTokens: {} },
        options: { rootName: 'color' },
        file: { destination: 'test.ts' },
        platform: {},
      } as unknown as FormatFnArguments)

      expect(result).toContain("'1': '#111111'")
    })
  })
})

function mockToken(path: string[], value: string): Partial<TransformedToken> {
  return {
    path,
    value,
    $value: value,
    name: path.join('-').toLowerCase(),
    original: { value, $value: value },
  }
}
