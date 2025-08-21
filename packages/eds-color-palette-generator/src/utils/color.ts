import Color from 'colorjs.io'
import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { ColorFormat } from '@/types'

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

type ContrastMethod = 'WCAG21' | 'APCA'

/**
 * Helper function to calculate APCA contrast between two Color objects
 * @param fg - Foreground Color object
 * @param bg - Background Color object
 * @returns APCA contrast value (always positive, absolute value)
 */
export function calculateAPCAContrast(fg: Color, bg: Color): number {
  try {
    // Convert Color objects to sRGB RGBA arrays with values 0-255
    const fgRgba = fg
      .to('srgb')
      .coords.map((c) => c * 255)
      .concat((fg.alpha || 1) * 255)
    const bgRgba = bg
      .to('srgb')
      .coords.map((c) => c * 255)
      .concat((bg.alpha || 1) * 255)

    // Use sRGBtoY to convert to luminance, then calculate APCA contrast
    const fgLuminance = sRGBtoY(fgRgba.slice(0, 3) as [number, number, number])
    const bgLuminance = sRGBtoY(bgRgba.slice(0, 3) as [number, number, number])

    // Return absolute value to always get positive LC values
    const contrast = APCAcontrast(fgLuminance, bgLuminance)
    return Math.abs(Number(contrast))
  } catch (error) {
    console.error('Error calculating APCA contrast:', error)
    return 0
  }
}

type ContrastResult = {
  contrastValue: string
}

/**
 * Calculates contrast between two colors using specified method and checks against categories
 * @param foreground - Text/foreground color
 * @param background - Background color
 * @param method - Contrast calculation method ("WCAG21" or "APCA")
 * @returns Object with contrast value and pass/fail status for each category
 */
export function checkContrast(
  foreground: string | Color,
  background: string | Color,
  method: ContrastMethod,
): ContrastResult {
  try {
    const fg =
      typeof foreground === 'string' ? new Color(foreground) : foreground
    const bg =
      typeof background === 'string' ? new Color(background) : background

    let contrast: number

    if (method === 'APCA') {
      contrast = calculateAPCAContrast(fg, bg)
    } else {
      contrast = fg.contrast(bg, method)
    }

    return {
      contrastValue:
        method === 'APCA' ? contrast.toFixed(0) : contrast.toFixed(1),
    }
  } catch (error) {
    console.error('Error in checkContrast:', error)
    // Return default values in case of error
    return {
      contrastValue: '0',
    }
  }
}
