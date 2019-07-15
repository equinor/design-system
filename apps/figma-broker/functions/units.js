import * as R from 'ramda'
import { colortoRgba, withType } from './utils'

const fallback = {}
const defaultToEmpty = R.defaultTo('')
const unitProcessor = (val, unit) => {
  const number = defaultToEmpty(val)
  return R.isEmpty(number) ? number : `${number}${unit}`
}

export const rootFontSize = 16

export const px = (val) => unitProcessor(val, 'px')
export const em = (val) => unitProcessor(val, 'em')
export const rem = (val) => unitProcessor(val, 'rem')

export const toTypography = (figmaNode) => {
  const {
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    textAlignHorizontal = 'center',
    lineHeightPercentFontSize,
  } = figmaNode.style

  const { fills } = figmaNode

  const fill = R.find(withType('solid'), fills) || fallback

  const fontSizeRem = (fontSize / rootFontSize).toFixed(3)
  const lineHeightEm = (lineHeightPercentFontSize / 100).toFixed(3)
  const letterSpacingEm = (letterSpacing / fontSizeRem).toFixed(3)

  return {
    color: colortoRgba(fill.color),
    fontFamily,
    fontSize: rem(fontSizeRem),
    fontWeight,
    letterSpacing: letterSpacing ? em(letterSpacingEm) : 0,
    lineHeight: em(lineHeightEm),
    textAlign: R.toLower(textAlignHorizontal),
  }
}
