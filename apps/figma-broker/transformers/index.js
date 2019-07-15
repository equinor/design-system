import * as R from 'ramda'
import { withType } from '@utils'
import { rootFontSize, rem, em, px } from '@units'

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

export const toSpacer = (name, box) => {
  if (R.test(/Vertical/, name)) {
    return box.width
  }
  if (R.test(/Horizontal/, name)) {
    return box.height
  }
  return 0
}

export const toFocus = (figmaNode) => {
  const { strokeDashes } = figmaNode
  const [dashWidth, dashGap] = strokeDashes
  const stroke = figmaNode.strokes.find(withType('solid')) || fallback
  const focusStyle = typeof strokeDashes === 'undefined' ? '' : 'dashed'

  return {
    type: focusStyle,
    color: colortoRgba(stroke.color),
    width: px(dashWidth),
    gap: px(dashGap),
  }
}

export const toOverlay = (figmaNode) => {
  const fill = figmaNode.fills.find(withType('solid')) || fallback
  const opacity = Math.round(fill.opacity * 100) / 100
  return {
    pressedColor: colortoRgba(fill.color),
    pressedOpacity: opacity,
  }
}

export const colortoRgba = (color) => {
  if (!color) {
    return 'transparent'
  }
  const { r, g, b, a } = R.map((x) => Math.round(x * 100) / 100, color)
  const rgbColors = R.map((x) => Math.round(x * 255), { r, g, b })

  return `rgba(${rgbColors.r}, ${rgbColors.g}, ${rgbColors.b}, ${a * 1})`
}
