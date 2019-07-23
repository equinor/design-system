import * as R from 'ramda'
import { withType } from '@utils'
import { rootFontSize, rem, em } from '@units'
import { fillToRgba } from './colors'

export { fillToHex, fillToHsla, fillToRgba } from './colors'

const fallback = {}

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
  const textAlignLens = R.lensProp('textAlign')
  const textAlign = R.toLower(textAlignHorizontal)

  let typography = {
    color: fillToRgba(fill),
    fontFamily,
    fontSize: rem(fontSizeRem),
    fontWeight,
    letterSpacing: letterSpacing ? em(letterSpacingEm) : 0,
    lineHeight: em(lineHeightEm),
  }

  if (textAlign !== 'left') {
    typography = R.set(textAlignLens, textAlign, typography)
  }

  return typography
}
