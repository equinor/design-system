import Color from 'colorjs.io'
import { ColorFormat } from '@/types'
import { Algorithms } from 'colorjs.io/fn'

/**
 * Validates if a string is a valid color format supported by colorjs.io
 * @param input - Color string to validate
 * @returns true if valid, false otherwise
 */
export function isValidColorFormat(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false
  }

  const trimmedInput = input.trim()

  // Use colorjs.io to validate any supported color format
  try {
    new Color(trimmedInput)
    return true
  } catch {
    return false
  }
}

/**
 * Converts a color string (any format supported by colorjs.io, e.g. OKLCH, HEX, RGB, HSL, LAB, named colors, etc.) to HEX format
 * @param input - Color string in any format supported by colorjs.io (OKLCH, HEX, RGB, HSL, LAB, named colors, etc.)
 * @returns HEX color string, or null if invalid
 */
export function parseColorToHex(input: string): string | null {
  if (!input || typeof input !== 'string') {
    return null
  }

  const trimmedInput = input.trim()

  try {
    const color = new Color(trimmedInput)
    // Convert to sRGB first to ensure proper hex conversion
    const srgbColor = color.to('srgb')
    // Force alpha to 1 to ensure 6-digit hex output
    srgbColor.alpha = 1
    const hexString = srgbColor.toString({ format: 'hex' })
    // Normalize the hex string to always be lowercase
    return hexString.toLowerCase()
  } catch {
    return null
  }
}

/**
 * Threshold below which a color is considered low-saturation for averaging purposes.
 */
const LOW_SATURATION_THRESHOLD = 0.05

/**
 * Checks if a color has low saturation based on its chroma value.
 * @param chroma - The chroma value from OKLCH color space
 * @returns true if the color has low saturation (chroma < LOW_SATURATION_THRESHOLD)
 */
export function isLowSaturation(chroma: number): boolean {
  return chroma < LOW_SATURATION_THRESHOLD
}

/**
 * Calculates the average chroma from an array of base colors.
 * Filters out low-saturation colors and returns the average chroma value
 * of the remaining colors. This can be used to ensure consistent chroma across a color palette.
 *
 * @param baseColors - Array of color strings in any format supported by colorjs.io
 * @returns Average chroma value, or undefined if no valid colors found
 *
 * @example
 * const colors = ['#ff0000', '#00ff00', '#0000ff', '#808080']
 * const avgChroma = calculateAverageChroma(colors)
 * // Returns average chroma of red, green, and blue (grayscale and low saturation colors are excluded)
 */
export function calculateAverageChroma(
  baseColors: string[],
): number | undefined {
  if (!baseColors || baseColors.length === 0) {
    return undefined
  }

  const chromaValues: number[] = []

  for (const colorString of baseColors) {
    try {
      const color = new Color(colorString)
      const oklch = color.to('oklch')

      // Filter out low saturation colors
      if (!isLowSaturation(oklch.c)) {
        chromaValues.push(oklch.c)
      }
    } catch (error) {
      // Skip invalid colors
      console.warn(`Skipping invalid color: ${colorString}`, error)
    }
  }

  // If no valid saturated colors found, return default
  if (chromaValues.length === 0) {
    return undefined
  }

  // Calculate and return the average chroma
  const sum = chromaValues.reduce((acc, val) => acc + val, 0)
  return sum / chromaValues.length
}

export function gaussian(
  x: number,
  mean: number = 0.6,
  stdDev: number = 2,
): number {
  const exponent = (-25 / stdDev) * Math.pow(mean * -1 + x, 2)
  return Math.exp(exponent)
}

/**
 * Generates a color scale based on a base color with consistent chroma across steps.
 * Uses a gaussian function to distribute chroma values, with grayscale colors preserved.
 *
 * @param baseColor - Base color string in any format supported by colorjs.io
 * @param lightnessValues - Array of lightness values (0-1) for each step in the scale
 * @param mean - Mean value for the gaussian distribution (default 0.6)
 * @param stdDev - Standard deviation for the gaussian distribution (default 2)
 * @param format - Output format: 'OKLCH' or 'HEX' (default 'OKLCH')
 * @param maxChroma - Maximum chroma value to use in the scale (default: uses base color's chroma)
 *                   Can be calculated using calculateAverageChroma() for palette consistency
 * @returns Array of color strings in the specified format
 *
 * @example
 * // Using base color's chroma
 * const colors = generateColorScale('#ff0000', [0.2, 0.4, 0.6, 0.8], 0.6, 2)
 *
 * @example
 * // Using calculated average chroma from palette for consistency
 * const baseColors = ['#ff0000', '#00ff00', '#0000ff']
 * const avgChroma = calculateAverageChroma(baseColors)
 * const redScale = generateColorScale('#ff0000', [0.2, 0.4, 0.6, 0.8], 0.6, 2, 'OKLCH', avgChroma)
 */
export function generateColorScale(
  baseColor: string,
  lightnessValues: number[],
  mean: number,
  stdDev: number,
  format: ColorFormat = 'OKLCH',
  maxChroma?: number | undefined,
): string[] {
  // Validate the baseColor to ensure it's a proper color string
  try {
    // Create a Color object from the baseColor
    const base = new Color(baseColor)
    const colors: string[] = []
    const steps = lightnessValues.length

    // Get the base color's chroma to check if it's grayscale
    const baseOklch = base.to('oklch')
    const baseIsLowSaturation = isLowSaturation(baseOklch.c)

    // Clone the base color for each step to avoid mutation issues
    for (let i = 0; i < steps; i++) {
      try {
        const lightness = lightnessValues[i]
        // Create a new color instance for each step to avoid mutation issues
        const color = new Color(base.toString({ format: 'hex' }))
        // Calculate new chroma based on gaussian function
        // Use maxChroma parameter to ensure consistent chroma across all colors at the same step
        // Exception: if the base color is low saturation (chroma < LOW_SATURATION_THRESHOLD), keep it low saturation
        const baseChroma = color.to('oklch').c
        const chroma = baseIsLowSaturation
          ? baseChroma
          : gaussian(lightness, mean, stdDev) * (maxChroma ?? baseChroma)
        // Apply new lightness and chroma values
        color.set('oklch.l', lightness)
        color.set('oklch.c', chroma)

        // Format output based on the selected format
        if (format === 'OKLCH') {
          const oklch = color.to('oklch')
          // Handle NaN hue for grayscale colors (set to 0)
          const hue = isNaN(oklch.h) ? 0 : oklch.h
          colors.push(
            `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${hue.toFixed(1)})`,
          )
        } else {
          // Default to HEX format - convert to sRGB first to ensure proper conversion
          const srgbColor = color.to('srgb')
          // Force alpha to 1 to ensure 6-digit hex output
          srgbColor.alpha = 1
          let hexColor = srgbColor.toString({ format: 'hex' })
          // Expand shorthand hex (e.g., #fff -> #ffffff)
          if (hexColor.length === 4) {
            hexColor =
              '#' +
              hexColor[1] +
              hexColor[1] +
              hexColor[2] +
              hexColor[2] +
              hexColor[3] +
              hexColor[3]
          }
          colors.push(hexColor)
        }
      } catch (error) {
        console.error(`Error generating color for step ${i}:`, error)
        // Fallback to a default color if there's an error
        colors.push(format === 'OKLCH' ? 'oklch(0.5 0.0 0.0)' : '#808080')
      }
    }

    return colors
  } catch (error) {
    console.error('Error in generateColorScale:', error)
    // Return a default color scale if there's an error with the base color
    const fallbackColor = format === 'OKLCH' ? 'oklch(0.5 0.0 0.0)' : '#808080'
    return Array(lightnessValues.length).fill(fallbackColor)
  }
}

/**
 * Calculates contrast between two colors using specified method
 * @param foreground - Text/foreground color (OKLCH or HEX string)
 * @param background - Background color (OKLCH or HEX string)
 * @param algorithm - Contrast calculation algorithm ("WCAG21" or "APCA")
 * @param silent - Whether to suppress error logging (useful for tests)
 * @returns Contrast score as number or string
 */
export function contrast({
  foreground,
  background,
  algorithm,
  silent = false,
}: {
  foreground: string
  background: string
  algorithm: Algorithms
  silent?: boolean
}): string | number {
  try {
    const fgColor = new Color(foreground)
    const bgColor = new Color(background)
    const decimals = algorithm === 'WCAG21' ? 1 : 0

    // Remove all the decimals in the result
    return Math.abs(Number(bgColor.contrast(fgColor, algorithm))).toFixed(
      decimals,
    )
  } catch (error) {
    if (!silent) {
      console.error('Error calculating contrast:', error)
    }
    // Return default values in case of error
    return '0'
  }
}
