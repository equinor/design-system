import * as R from 'ramda'
import { withType, withName, removeNilAndEmpty } from '../functions/utils.js'
import { rootFontSize, rem, em } from '../functions/units.js'
import { fillToRgba } from './colors.js'

const fallback = {}
const cssVarName = (name) => `eds_${name}_color`

export const toTypography = (figmaNode, name) => {
  let typography = {}
  const {
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    textAlignHorizontal: textAlign,
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
      fontFeature: "'tnum' on,'lnum' on",
    }
  }

  const fill = R.find(withType('solid'), fills) || fallback

  const fontSizeRem = (fontSize / rootFontSize).toFixed(3)
  const lineHeightEm = (lineHeightPercentFontSize / 100).toFixed(3)
  const letterSpacingEm = (letterSpacing / rootFontSize).toFixed(3)

  typography = {
    ...typography,
    color: `var(--${cssVarName(name)}, ${fillToRgba(fill)})`,
    fontFamily,
    fontSize: rem(fontSizeRem),
    fontWeight,
    letterSpacing: letterSpacing ? em(letterSpacingEm) : null,
    lineHeight: em(lineHeightEm),
    textDecoration: textDecoration ? R.toLower(textDecoration) : null,
    textTransform: textCase ? R.toLower(`${textCase}CASE`) : null,
    fontStyle: italic ? 'italic' : null,
    textAlign: R.toLower(textAlign),
  }

  return removeNilAndEmpty(typography)
}
