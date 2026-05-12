import { describe, it, expect } from 'vitest'
import { typography as uiBody } from '../../build/ts/typography/font-family-ui'
import { typography as header } from '../../build/ts/typography/font-family-header'

/**
 * Smoke tests for the emitted nested typography TS shape. These guard
 * the contract consumers depend on: each size cell exposes `fontSize`,
 * nested `tracking` / `fontWeight` / `lineHeight` objects, and inlined
 * `iconSize` / `gapHorizontal` / `gapVertical` extras.
 *
 * The values themselves come from Figma — the tests assert structure and
 * representative variant keys, not specific numbers.
 */
describe('typography family TS output', () => {
  describe.each([
    ['ui-body', uiBody],
    ['header', header],
  ])('%s family', (_label, family) => {
    it('exposes documentation, typography, and fontFamilySize at the root', () => {
      expect(family.documentation).toBeTypeOf('string')
      expect(family.typography.fontFamily).toBeTypeOf('string')
      expect(family.fontFamilySize).toBeTypeOf('object')
    })

    it('emits all ten size cells (xs..6xl with numeric prefixes converted)', () => {
      const expected = [
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        'twoXl',
        'threeXl',
        'fourXl',
        'fiveXl',
        'sixXl',
      ]
      expect(Object.keys(family.fontFamilySize)).toEqual(expected)
    })

    it('nests fontWeight under the size cell with lighter/normal/bolder keys', () => {
      const md = family.fontFamilySize.md
      expect(md.fontWeight).toEqual(
        expect.objectContaining({
          lighter: expect.any(Number),
          normal: expect.any(Number),
          bolder: expect.any(Number),
        }),
      )
    })

    it('nests tracking under the size cell with tight/normal/wide keys', () => {
      const md = family.fontFamilySize.md
      expect(md.tracking).toEqual(
        expect.objectContaining({
          tight: expect.any(Number),
          normal: expect.any(Number),
          wide: expect.any(Number),
        }),
      )
    })

    it('nests lineHeight under the size cell with default/squished keys', () => {
      const md = family.fontFamilySize.md
      expect(md.lineHeight).toEqual(
        expect.objectContaining({
          default: expect.any(Number),
          squished: expect.any(Number),
        }),
      )
    })

    it('inlines family-independent size extras alongside the axes', () => {
      const md = family.fontFamilySize.md
      expect(md.iconSize).toBeTypeOf('number')
      expect(md.gapHorizontal).toBeTypeOf('number')
      expect(md.gapVertical).toBeTypeOf('number')
    })

    it('has fontSize as a number, not a nested object', () => {
      expect(family.fontFamilySize.md.fontSize).toBeTypeOf('number')
    })
  })

  it('inlined size extras are family-independent (ui-body matches header)', () => {
    // iconSize/gapHorizontal/gapVertical reference primitives shared across
    // families — both family files must agree per size.
    for (const sizeKey of Object.keys(uiBody.fontFamilySize) as Array<
      keyof typeof uiBody.fontFamilySize
    >) {
      const u = uiBody.fontFamilySize[sizeKey]
      const h = header.fontFamilySize[sizeKey]
      expect(u.iconSize).toBe(h.iconSize)
      expect(u.gapHorizontal).toBe(h.gapHorizontal)
      expect(u.gapVertical).toBe(h.gapVertical)
    }
  })

  it('keys derive variant names at the type level via keyof', () => {
    // Compile-time check via a runtime sample: keyof of a size's fontWeight
    // must yield 'lighter' | 'normal' | 'bolder' — proven by the typed const
    // surviving narrowing.
    const weightKeys: Array<keyof typeof uiBody.fontFamilySize.md.fontWeight> =
      ['lighter', 'normal', 'bolder']
    expect(weightKeys).toHaveLength(3)
  })
})
