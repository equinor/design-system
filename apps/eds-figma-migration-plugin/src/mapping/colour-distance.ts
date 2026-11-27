/**
 * How different two colours look, for marking mappings that are right by
 * role but change the look. The distance is measured in OKLab and given
 * times 100: about 2 is just noticeable, 5 is clearly visible. Colours with
 * alpha are laid over the surface of their colour scheme first.
 */
import type { ColorScheme } from './scheme'

/** From this distance, a change counts as clearly visible. */
export const VISIBLE_CHANGE = 5

const SURFACE: Record<ColorScheme, [number, number, number]> = {
  light: [1, 1, 1],
  dark: [3 / 255, 3 / 255, 3 / 255],
}

function parse(hex: string): [number, number, number, number] | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(hex.trim())
  if (!match) return undefined
  let digits = match[1]
  if (digits.length === 3) {
    digits = digits
      .split('')
      .map((digit) => digit + digit)
      .join('')
  }
  const channel = (index: number) =>
    parseInt(digits.slice(index, index + 2), 16) / 255
  return [
    channel(0),
    channel(2),
    channel(4),
    digits.length === 8 ? channel(6) : 1,
  ]
}

function linear(channel: number): number {
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4
}

function oklab(rgb: [number, number, number]): [number, number, number] {
  const [r, g, b] = rgb.map(linear)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

function onSurface(
  colour: [number, number, number, number],
  scheme: ColorScheme,
): [number, number, number] {
  const [r, g, b, alpha] = colour
  const surface = SURFACE[scheme]
  return [
    r * alpha + surface[0] * (1 - alpha),
    g * alpha + surface[1] * (1 - alpha),
    b * alpha + surface[2] * (1 - alpha),
  ]
}

/** The distance between two hex colours, times 100; undefined when one cannot be read. */
export function colourDistance(
  a: string,
  b: string,
  scheme: ColorScheme = 'light',
): number | undefined {
  const first = parse(a)
  const second = parse(b)
  if (!first || !second) return undefined
  const [l1, a1, b1] = oklab(onSurface(first, scheme))
  const [l2, a2, b2] = oklab(onSurface(second, scheme))
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2) * 100
}
