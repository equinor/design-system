import { describe, expect, it } from 'vitest'
import { typography as uiBodyMatrix } from '../../build/ts/typography/font-family-ui'
import { typography as headerMatrix } from '../../build/ts/typography/font-family-header'
import { sizeExtras } from '../../build/ts/typography/size-extras'
import { composeTextStyle } from './composeTextStyle'

// Tests assert that the helper picks the right cell from the matrix; the
// expected numbers come from the same build output the helper imports, so
// these tests survive Figma value changes and only fail when the picker
// logic is wrong.

describe('composeTextStyle', () => {
  it('resolves the UI Body md row with default weight/line-height/tracking', () => {
    const md = uiBodyMatrix.fontFamilySize.md
    expect(composeTextStyle({ fontFamily: 'ui', fontSize: 'md' })).toEqual({
      fontFamily: uiBodyMatrix.typography.fontFamily,
      fontSize: md.fontSize,
      fontWeight: md.fontWeightNormal,
      lineHeight: md.lineHeightDefault,
      letterSpacing: md.trackingNormal,
    })
  })

  it('resolves bolder weight, squished line-height, wide tracking on UI md', () => {
    const md = uiBodyMatrix.fontFamilySize.md
    expect(
      composeTextStyle({
        fontFamily: 'ui',
        fontSize: 'md',
        fontWeight: 'bolder',
        lineHeight: 'squished',
        tracking: 'wide',
      }),
    ).toEqual({
      fontFamily: uiBodyMatrix.typography.fontFamily,
      fontSize: md.fontSize,
      fontWeight: md.fontWeightBolder,
      lineHeight: md.lineHeightSquished,
      letterSpacing: md.trackingWide,
    })
  })

  it('resolves the Header xl row with lighter weight and tight tracking', () => {
    const xl = headerMatrix.fontFamilySize.xl
    expect(
      composeTextStyle({
        fontFamily: 'header',
        fontSize: 'xl',
        fontWeight: 'lighter',
        tracking: 'tight',
      }),
    ).toEqual({
      fontFamily: headerMatrix.typography.fontFamily,
      fontSize: xl.fontSize,
      fontWeight: xl.fontWeightLighter,
      lineHeight: xl.lineHeightDefault,
      letterSpacing: xl.trackingTight,
    })
  })

  it('treats tracking "loose" as an alias for "wide"', () => {
    const wide = composeTextStyle({
      fontFamily: 'ui',
      fontSize: 'lg',
      tracking: 'wide',
    })
    const loose = composeTextStyle({
      fontFamily: 'ui',
      fontSize: 'lg',
      tracking: 'loose',
    })
    expect(loose.letterSpacing).toBe(wide.letterSpacing)
  })

  it('emits string fontWeight when format is react-native', () => {
    const style = composeTextStyle({
      fontFamily: 'ui',
      fontSize: 'md',
      format: 'react-native',
    })
    expect(style.fontWeight).toBe(
      String(uiBodyMatrix.fontFamilySize.md.fontWeightNormal),
    )
    expect(typeof style.fontWeight).toBe('string')
  })

  it('returns size extras from size-extras.ts when includeSizeExtras is true', () => {
    expect(
      composeTextStyle({
        fontFamily: 'ui',
        fontSize: 'md',
        includeSizeExtras: true,
      }),
    ).toMatchObject({
      iconSize: sizeExtras.md.iconSize,
      gapHorizontal: sizeExtras.md.gapHorizontal,
      gapVertical: sizeExtras.md.gapVertical,
    })
  })

  it('omits size extras by default', () => {
    const style = composeTextStyle({ fontFamily: 'ui', fontSize: 'md' })
    expect(style).not.toHaveProperty('iconSize')
    expect(style).not.toHaveProperty('gapHorizontal')
    expect(style).not.toHaveProperty('gapVertical')
  })

  it('throws RangeError on invalid fontFamily', () => {
    expect(() =>
      composeTextStyle({
        // @ts-expect-error -- intentionally invalid
        fontFamily: 'display',
        fontSize: 'md',
      }),
    ).toThrow(RangeError)
  })

  it('throws RangeError on invalid fontSize', () => {
    expect(() =>
      composeTextStyle({
        fontFamily: 'ui',
        // @ts-expect-error -- intentionally invalid
        fontSize: '7xl',
      }),
    ).toThrow(/fontSize/)
  })

  it('returns a frozen object', () => {
    const style = composeTextStyle({ fontFamily: 'ui', fontSize: 'md' })
    expect(Object.isFrozen(style)).toBe(true)
  })

  it('resolves UI 6xl row correctly (matrix edge)', () => {
    const sixXl = uiBodyMatrix.fontFamilySize.sixXl
    expect(
      composeTextStyle({
        fontFamily: 'ui',
        fontSize: '6xl',
        tracking: 'tight',
      }),
    ).toEqual({
      fontFamily: uiBodyMatrix.typography.fontFamily,
      fontSize: sixXl.fontSize,
      fontWeight: sixXl.fontWeightNormal,
      lineHeight: sixXl.lineHeightDefault,
      letterSpacing: sixXl.trackingTight,
    })
    // sanity: size-extras for 6xl is present and positive
    expect(sizeExtras['6xl'].iconSize).toBeGreaterThan(0)
  })
})
