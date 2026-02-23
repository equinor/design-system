import { describe, it, expect } from 'vitest'
import type {
  TransformedToken,
  FormatFnArguments,
} from 'style-dictionary/types'
import {
  toCamelCase,
  buildNestedObject,
  typescriptNestedFormat,
} from '../format/typescriptNested'

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

    it('converts hyphenated words to camelCase', () => {
      expect(toCamelCase('font-size')).toBe('fontSize')
      expect(toCamelCase('line-height')).toBe('lineHeight')
      expect(toCamelCase('font-family')).toBe('fontFamily')
    })

    it('handles mixed hyphens and spaces', () => {
      expect(toCamelCase('Semi Bold Italic')).toBe('semiBoldItalic')
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

    it('outputs numeric values unquoted', () => {
      const tokens = [
        mockToken(['line-height', 'default', 'Regular'], '1.5'),
        mockToken(['font-weight', 'normal', 'Regular'], '400'),
        mockToken(['font-size', 'md', 'Regular'], '1rem'),
      ] as TransformedToken[]

      const result = typescriptNestedFormat({
        dictionary: { allTokens: tokens, tokens: {}, unfilteredTokens: {} },
        options: { rootName: 'typography' },
        file: { destination: 'test.ts' },
        platform: {},
      } as unknown as FormatFnArguments)

      expect(result).toContain('regular: 1.5,')
      expect(result).toContain('regular: 400,')
      expect(result).toContain("regular: '1rem',")
    })

    it('outputs spacing tokens with rootName "spacing" and correct structure', () => {
      const tokens = [
        mockToken(['Selectable space', 'Horizontal'], '8'),
        mockToken(['Selectable space', 'Vertical'], '12'),
        mockToken(['Container space', 'Horizontal'], '16'),
      ] as TransformedToken[]

      const result = typescriptNestedFormat({
        dictionary: { allTokens: tokens, tokens: {}, unfilteredTokens: {} },
        options: { rootName: 'spacing' },
        file: { destination: 'selectable-space-xs.ts' },
        platform: {},
      } as unknown as FormatFnArguments)

      // Uses rootName 'spacing', not color or typography
      expect(result).toContain('export const spacing =')
      expect(result).toContain('} as const')
      expect(result).not.toContain('export const color')
      expect(result).not.toContain('export const typography')
      // Paths should be camelCased
      expect(result).toContain('selectableSpace:')
      expect(result).toContain('containerSpace:')
      expect(result).not.toContain('Selectable space')
      expect(result).not.toContain('Container space')
      // Numeric values must not be quoted as strings
      expect(result).not.toMatch(/horizontal: '[\d.]+'/)
      expect(result).not.toMatch(/vertical: '[\d.]+'/)
      // Numeric values must appear as bare numbers
      expect(result).toMatch(/horizontal: \d+,/)
      expect(result).toMatch(/vertical: \d+,/)
    })

    it('outputs spacing density tokens with nested structure and unquoted numerics', () => {
      const tokens = [
        mockToken(['Spacing', 'Icon', 'XS', 'Gap horizontal'], '6.5'),
        mockToken(['Spacing', 'Icon', 'MD', 'Gap horizontal'], '8.5'),
        mockToken(['Spacing', 'Border radius', 'SM'], '4'),
        mockToken(['Spacing', 'Inset', 'Label'], '2px'),
      ] as TransformedToken[]

      const result = typescriptNestedFormat({
        dictionary: { allTokens: tokens, tokens: {}, unfilteredTokens: {} },
        options: { rootName: 'spacing' },
        file: { destination: 'spacious.ts' },
        platform: {},
      } as unknown as FormatFnArguments)

      expect(result).toContain('export const spacing =')
      // Nested structure should exist
      expect(result).toContain('spacing:')
      expect(result).toContain('icon:')
      expect(result).toContain('borderRadius:')
      // Numeric values (int and decimal) must not be quoted
      expect(result).not.toMatch(/gapHorizontal: '[\d.]+'/)
      expect(result).toMatch(/gapHorizontal: \d+\.?\d*,/)
      // Non-numeric values (like '2px') must be quoted
      expect(result).toMatch(/label: '2px'/)
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
