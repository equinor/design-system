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

/**
 * WCAG 2.1 contrast thresholds based on different text and UI categories
 */
const WCAGThresholds = {
  fluentText: {
    preferred: 7, // Level AAA for normal text
    minimum: 4.5, // Level AA for normal text
  },
  bodyText: {
    preferred: 7, // Level AAA for normal text
    minimum: 4.5, // Level AA for normal text
  },
  headlines: {
    minimum: 3, // Level AA for large text (>=18.66px or 14px bold)
  },
  spotReadable: {
    minimum: 3, // Level AA for large text and UI components
  },
  nonText: {
    minimum: 3, // Level AA for non-text UI components
  },
} as const

/**
 * APCA contrast thresholds based on different text and UI categories
 */
const APCAThresholds = {
  fluentText: {
    preferred: 90, // For body text >=18px/300 or 14px/400, or non-body >=12px/400
    minimum: 75, // For body text >=24px/300, 18px/400, 16px/500, 14px/700
  },
  bodyText: {
    preferred: 75, // For important readable content
    minimum: 60, // For non-body content text, ex: 24px/400, 18px/600, 16px/700
  },
  headlines: {
    minimum: 45, // For large headlines (>=36px/400 or 24px/700) and detailed icons
  },
  spotReadable: {
    minimum: 30, // Minimum for any other text, placeholders, and solid icons
  },
  nonText: {
    minimum: 15, // Minimum for non-semantic elements like dividers (>=5px solid)
  },
} as const

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

function getThresholds(method: ContrastMethod) {
  return method === 'WCAG21' ? WCAGThresholds : APCAThresholds
}

type ContrastResult = {
  contrastValue: string
  fluentText: {
    preferred: boolean
    minimum: boolean
    threshold: {
      preferred: number
      minimum: number
    }
  }
  contentText: {
    preferred: boolean
    minimum: boolean
    threshold: {
      preferred: number
      minimum: number
    }
  }
  headlines: {
    minimum: boolean
    threshold: {
      minimum: number
    }
  }
  spotReadable: {
    minimum: boolean
    threshold: {
      minimum: number
    }
  }
  nonText: {
    minimum: boolean
    threshold: {
      minimum: number
    }
  }
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

    const thresholds = getThresholds(method)

    return {
      contrastValue:
        method === 'APCA' ? contrast.toFixed(0) : contrast.toFixed(1),
      fluentText: {
        preferred: contrast >= thresholds.fluentText.preferred,
        minimum: contrast >= thresholds.fluentText.minimum,
        threshold: thresholds.fluentText,
      },
      contentText: {
        preferred: contrast >= thresholds.bodyText.preferred,
        minimum: contrast >= thresholds.bodyText.minimum,
        threshold: thresholds.bodyText,
      },
      headlines: {
        minimum: contrast >= thresholds.headlines.minimum,
        threshold: thresholds.headlines,
      },
      spotReadable: {
        minimum: contrast >= thresholds.spotReadable.minimum,
        threshold: thresholds.spotReadable,
      },
      nonText: {
        minimum: contrast >= thresholds.nonText.minimum,
        threshold: thresholds.nonText,
      },
    }
  } catch (error) {
    console.error('Error in checkContrast:', error)
    // Return default values in case of error
    return {
      contrastValue: '0',
      fluentText: {
        preferred: false,
        minimum: false,
        threshold: getThresholds(method).fluentText,
      },
      contentText: {
        preferred: false,
        minimum: false,
        threshold: getThresholds(method).bodyText,
      },
      headlines: {
        minimum: false,
        threshold: getThresholds(method).headlines,
      },
      spotReadable: {
        minimum: false,
        threshold: getThresholds(method).spotReadable,
      },
      nonText: {
        minimum: false,
        threshold: getThresholds(method).nonText,
      },
    }
  }
}
