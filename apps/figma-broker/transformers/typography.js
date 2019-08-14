import * as R from 'ramda'
import { withType, withName, removeNilAndEmpty } from '@utils'
import { rootFontSize, rem, em, px } from '@units'
import { fillToRgba } from './colors'

export { fillToHex, fillToHsla, fillToRgba } from './colors'

const fallback = {}

export const toTypography = (figmaNode, name) => {
  let typography = {}
  const {
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    textAlignHorizontal = 'center',
    lineHeightPercentFontSize,
    textDecoration,
    textCase,
    italic,
  } = figmaNode.style
  const { fills } = figmaNode

  const isMonospaced = withName('monospaced', {
    name: R.isNil(name) ? figmaNode.name : name,
  })

  if (isMonospaced) {
    typography = {
      ...typography,
      fontFeature: "'tnum' on, 'lnum' on",
    }
  }

  const fill = R.find(withType('solid'), fills) || fallback

  const fontSizeRem = (fontSize / rootFontSize).toFixed(3)
  const lineHeightEm = (lineHeightPercentFontSize / 100).toFixed(3)
  const letterSpacingEm = (letterSpacing / rootFontSize).toFixed(3)
  const textAlignLens = R.lensProp('textAlign')
  const textAlign = R.toLower(textAlignHorizontal)

  typography = {
    ...typography,
    color: fillToRgba(fill),
    fontFamily,
    fontSize: rem(fontSizeRem),
    fontWeight,
    letterSpacing: letterSpacing ? em(letterSpacingEm) : null,
    lineHeight: em(lineHeightEm),
    textDecoration,
    textTransform: textCase ? `${textCase}CASE` : null,
    fontStyle: italic ? 'italic' : null,
  }

  if (textAlign !== 'left') {
    typography = R.set(textAlignLens, textAlign, typography)
  }

  return removeNilAndEmpty(typography)
}
