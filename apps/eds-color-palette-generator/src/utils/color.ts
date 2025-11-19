import Color from 'colorjs.io'
import { ColorFormat, ColorAnchor } from '@/types'
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

export function gaussian(
  x: number,
  mean: number = 0.6,
  stdDev: number = 2,
): number {
  const exponent = (-25 / stdDev) * Math.pow(mean * -1 + x, 2)
  return Math.exp(exponent)
}

/**
 * Generates a color scale by interpolating between multiple anchor colors at specific steps
 * @param anchors - Array of color anchors with step positions
 * @param lightnessValues - Array of target lightness values for each step
 * @param mean - Mean value for Gaussian chroma adjustment
 * @param stdDev - Standard deviation for Gaussian chroma adjustment
 * @param format - Output color format (OKLCH or HEX)
 * @returns Array of color strings in the specified format
 */
export function generateColorScaleWithInterpolation(
  anchors: ColorAnchor[],
  lightnessValues: number[],
  mean: number,
  stdDev: number,
  format: ColorFormat = 'OKLCH',
): string[] {
  // Validate anchors
  if (!anchors || anchors.length === 0) {
    throw new Error('At least one anchor is required')
  }

  // Sort anchors by step to ensure correct interpolation order
  const sortedAnchors = [...anchors].sort((a, b) => a.step - b.step)

  const colors: string[] = []
  const steps = lightnessValues.length

  try {
    for (let i = 0; i < steps; i++) {
      const currentStep = i + 1 // Steps are 1-indexed
      const targetLightness = lightnessValues[i]

      // Find the surrounding anchors for this step
      let lowerAnchor = sortedAnchors[0]
      let upperAnchor = sortedAnchors[sortedAnchors.length - 1]

      for (let j = 0; j < sortedAnchors.length; j++) {
        if (sortedAnchors[j].step <= currentStep) {
          lowerAnchor = sortedAnchors[j]
        }
        if (
          sortedAnchors[j].step >= currentStep &&
          sortedAnchors[j].step < upperAnchor.step
        ) {
          upperAnchor = sortedAnchors[j]
          break
        }
      }

      // If current step matches an anchor exactly, use it directly (no interpolation needed)
      const exactAnchor = sortedAnchors.find((a) => a.step === currentStep)

      let interpolatedColor: Color

      if (exactAnchor) {
        // Use the exact anchor color
        interpolatedColor = new Color(exactAnchor.value)
      } else if (lowerAnchor.step === upperAnchor.step) {
        // Only one anchor or all anchors at same step
        interpolatedColor = new Color(lowerAnchor.value)
      } else {
        // Interpolate between lower and upper anchors
        const color1 = new Color(lowerAnchor.value)
        const color2 = new Color(upperAnchor.value)

        // Create a range in OKLCH space with shorter hue interpolation
        const range = color1.range(color2, {
          space: 'oklch',
          hue: 'shorter',
        })

        // Calculate interpolation factor (0 to 1)
        const stepRange = upperAnchor.step - lowerAnchor.step
        const stepOffset = currentStep - lowerAnchor.step
        const t = stepOffset / stepRange

        // Get the interpolated color
        interpolatedColor = range(t)
      }

      // Convert to OKLCH to extract and modify values
      const oklchColor = interpolatedColor.to('oklch')

      // Get the interpolated hue and base chroma
      const interpolatedHue = isNaN(oklchColor.h) ? 0 : oklchColor.h
      const baseChroma = oklchColor.c

      // Apply Gaussian function to chroma based on target lightness
      const adjustedChroma =
        gaussian(targetLightness, mean, stdDev) * baseChroma

      // Create the final color with target lightness and adjusted chroma
      const finalColor = new Color('oklch', [
        targetLightness,
        adjustedChroma,
        interpolatedHue,
      ])

      // Format output based on the selected format
      if (format === 'OKLCH') {
        const oklch = finalColor.to('oklch')
        const hue = isNaN(oklch.h) ? 0 : oklch.h
        colors.push(
          `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${hue.toFixed(1)})`,
        )
      } else {
        // Default to HEX format
        const srgbColor = finalColor.to('srgb')
        srgbColor.alpha = 1
        let hexColor = srgbColor.toString({ format: 'hex' })
        // Expand shorthand hex
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
    }

    return colors
  } catch (error) {
    console.error('Error in generateColorScaleWithInterpolation:', error)
    // Return a default color scale if there's an error
    const fallbackColor = format === 'OKLCH' ? 'oklch(0.5 0.0 0.0)' : '#808080'
    return Array(lightnessValues.length).fill(fallbackColor)
  }
}

export function generateColorScale(
  baseColor: string | ColorAnchor[],
  lightnessValues: number[],
  mean: number,
  stdDev: number,
  format: ColorFormat = 'OKLCH',
): string[] {
  // Check if we're dealing with multiple anchors
  if (Array.isArray(baseColor)) {
    return generateColorScaleWithInterpolation(
      baseColor,
      lightnessValues,
      mean,
      stdDev,
      format,
    )
  }

  // Original single-color logic
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
