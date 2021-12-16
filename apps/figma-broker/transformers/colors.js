import * as R from 'ramda'

// https://css-tricks.com/converting-color-spaces-in-javascript/

const figmaFillToRgba = (fill) => {
  // for some reason opacity holds correct alpha value
  // when rgba is used in some cases in figma…
  let { color, opacity } = fill
  if (!R.isNil(opacity)) {
    color = { ...color, a: opacity }
  }

  // figma uses rgb percent, we convert to rgb decimals
  const { r = 0, g = 0, b = 0 } = R.map((x) => (x * 100).toFixed(1), color)
  const rgbDecimals = R.map((x) => Math.round((x / 100) * 255), { r, g, b })

  // remove insignificant trailing zeros
  const a = parseFloat(color.a.toFixed(2))

  return { ...rgbDecimals, a }
}

export const fillToRgba = (fill) => {
  if (R.isNil(fill.color)) {
    return 'transparent'
  }

  const { r, g, b, a } = figmaFillToRgba(fill)

  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export const fillToHex = (fill) => {
  const rgbaColors = figmaFillToRgba(fill)

  let { r, g, b, a } = R.map((x) => x.toString(16), rgbaColors)
  a = Math.round(a * 255).toString(16)

  if (r.length == 1) r = '0' + r
  if (g.length == 1) g = '0' + g
  if (b.length == 1) b = '0' + b
  if (a.length == 1) a = '0' + a

  return `#${r}${g}${b}`
}

export const fillToHsla = (fill) => {
  let { r, g, b, a } = figmaFillToRgba(fill)

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

  return `hsla(${h}, ${s}%, ${l}%, ${a})`
}
