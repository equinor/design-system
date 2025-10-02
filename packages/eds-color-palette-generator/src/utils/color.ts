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
 * Converts a color string (OKLCH or HEX) to HEX format
 * @param input - Color string in OKLCH or HEX format
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
    const hexString = srgbColor.toString({ format: 'hex' })
    // Normalize the hex string to always be lowercase and 6 digits
    return hexString.toLowerCase()
  } catch {
    return null
  }
}

export function gaussian(
  x: number,
  mean: number = 0.6,
  stdDev: number = 2,
): number {
  const exponent = (-25 / stdDev) * Math.pow(mean * -1 + x, 2)
  return Math.exp(exponent)
}

export function generateColorScale(
  baseColor: string,
  lightnessValues: number[],
  mean: number,
  stdDev: number,
  format: ColorFormat = 'OKLCH',
): string[] {
  // Validate the baseColor to ensure it's a proper color string
  try {
    // Create a Color object from the baseColor
    const base = new Color(baseColor)
    const colors: string[] = []
    const steps = lightnessValues.length

    // Clone the base color for each step to avoid mutation issues
    for (let i = 0; i < steps; i++) {
      try {
        const lightness = lightnessValues[i]
        // Create a new color instance for each step to avoid mutation issues
        const color = new Color(base.toString({ format: 'hex' }))
        // Convert to OKLCH to get the chroma value
        const oklchColor = color.to('oklch')
        // Calculate new chroma based on gaussian function
        const chroma = gaussian(lightness, mean, stdDev) * oklchColor.c
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
          // Default to HEX format
          colors.push(color.toString({ format: 'hex' }))
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
