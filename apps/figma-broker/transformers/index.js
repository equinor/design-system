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
  const textAlignLens = R.lensProp('textAlign')
  const textAlign = R.toLower(textAlignHorizontal)

  let typography = {
    color: colortoRgba(fill.color),
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

const figmaColorToRgba = (color) => {
  const { r, g, b, a } = R.map((x) => Math.round(x * 100) / 100, color)
  const rgbColors = R.map((x) => Math.round(x * 255), { r, g, b })

  return { ...rgbColors, a }
}

export const colortoRgba = (color) => {
  if (!color) {
    return 'transparent'
  }

  const rgbaColors = figmaColorToRgba(color)

  return `rgba(${rgbaColors.r}, ${rgbaColors.g}, ${
    rgbaColors.b
  }, ${rgbaColors.a * 1})`
}

export const colorToHex = (color) => {
  const rgbaColors = figmaColorToRgba(color)

  let { r, g, b } = R.map((x) => x.toString(16), rgbaColors)
  let a = Math.round(color.a * 255).toString(16)

  if (r.length == 1) r = '0' + r
  if (g.length == 1) g = '0' + g
  if (b.length == 1) b = '0' + b
  if (a.length == 1) a = '0' + a

  return '#' + r + g + b
}

export const colorToHsl = (color) => {
  let { r, g, b } = figmaColorToRgba(color)

  // Make r, g, and b fractions of 1
  r /= 255
  g /= 255
  b /= 255

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0

  if (delta == 0) h = 0
  // Red is max
  else if (cmax == r) h = ((g - b) / delta) % 6
  // Green is max
  else if (cmax == g) h = (b - r) / delta + 2
  // Blue is max
  else h = (r - g) / delta + 4

  h = Math.round(h * 60)

  // Make negative hues positive behind 360°
  if (h < 0) h += 360

  // Calculate lightness
  l = (cmax + cmin) / 2

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  return 'hsl(' + h + ',' + s + '%,' + l + '%)'
}
