import Color from 'colorjs.io'

export type CVDType =
  | 'none'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia'

export const CVD_OPTIONS: { key: CVDType; label: string }[] = [
  { key: 'none', label: 'Normal vision' },
  { key: 'protanopia', label: 'Protanopia (no red)' },
  { key: 'deuteranopia', label: 'Deuteranopia (no green)' },
  { key: 'tritanopia', label: 'Tritanopia (no blue)' },
  { key: 'achromatopsia', label: 'Achromatopsia (grayscale)' },
]

/** The three dichromacies used for generation-time distinctness scoring. */
export const CVD_DICHROMACIES = [
  'protanopia',
  'deuteranopia',
  'tritanopia',
] as const

/**
 * SVG feColorMatrix values (4×5) for colour-vision-deficiency simulation.
 * Shared by the on-screen SVG filter (CVDFilter) and the numeric simulateCVD
 * below, so the preview and the headless accessibility scoring use identical
 * maths.
 */
export const CVD_MATRICES: Record<Exclude<CVDType, 'none'>, string> = {
  protanopia:
    '0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0',
  deuteranopia:
    '0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0',
  tritanopia:
    '0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0',
  achromatopsia:
    '0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0',
}

function parseMatrix(values: string): number[] {
  return values.trim().split(/\s+/).map(Number)
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/**
 * Numerically simulate how a colour appears under a given CVD type, so
 * distinguishability can be scored without a DOM. Applies the same
 * feColorMatrix used for the on-screen SVG filter, in (gamma-encoded) sRGB.
 * @param input - Colour string (any colorjs.io-supported format)
 * @param type - CVD type; 'none' returns the input unchanged
 * @returns a hex string; the input unchanged for 'none' or on error
 */
export function simulateCVD(input: string, type: CVDType): string {
  if (type === 'none') return input
  try {
    const m = parseMatrix(CVD_MATRICES[type])
    const [r, g, b] = new Color(input)
      .to('srgb')
      .coords.map((c) => clamp01(c ?? 0))
    // feColorMatrix rows: out = m[row*5+0]*r + *1*g + *2*b + *3*a + *4(offset).
    // Alpha is fixed at 1, so the alpha column (index 3) drops out.
    const apply = (row: number) =>
      clamp01(
        m[row * 5] * r + m[row * 5 + 1] * g + m[row * 5 + 2] * b + m[row * 5 + 4],
      )
    const out = new Color('srgb', [apply(0), apply(1), apply(2)])
    out.alpha = 1
    return out.toString({ format: 'hex' })
  } catch {
    return input
  }
}
