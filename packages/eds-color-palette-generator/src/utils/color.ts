import Color, { Coords } from 'colorjs.io'
import { APCAcontrast, displayP3toY } from 'apca-w3'
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
 * Calculates APCA contrast score between two colors in P3
 * @param foreground - Text/foreground color
 * @param background - Background color
 * @returns APCA contrast score rounded to the nearest integer
 */

export const calculateApcaScore = (fg: Coords, bg: Coords): number => {
  const fgY = displayP3toY(fg)
  const bgY = displayP3toY(bg)
  const contrast = APCAcontrast(fgY, bgY)

  return Math.abs(Math.round(Number(contrast)))
}

/**
 * Calculates contrast between two colors using specified method and checks against categories
 * @param foreground - Text/foreground color
 * @param background - Background color
 * @param method - Contrast calculation method ("WCAG21" or "APCA")
 * @returns Object with contrast value and pass/fail status for each category
 */
export function getContrastScore(
  foreground: string,
  background: string,
  method: ContrastMethod,
): string | number {
  try {
    // Create Color objects from input strings (supports both HEX and OKLCH formats)
    const fgColor = new Color(foreground)
    const bgColor = new Color(background)

    // Convert to Display P3 to get RGB coordinates for P3 color space
    const fgP3 = fgColor.to('p3')
    const bgP3 = bgColor.to('p3')

    if (method === 'APCA') {
      return calculateApcaScore(fgP3.coords, bgP3.coords)
    } else {
      return fgColor.contrast(bgColor, method).toFixed(1)
    }
  } catch (error) {
    console.error('Error in checkContrast:', error)
    // Return default values in case of error
    return '0'
  }
}
