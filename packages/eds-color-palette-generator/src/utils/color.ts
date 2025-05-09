import Color from 'colorjs.io'

export function gaussian(
  x: number,
  mean: number = 0.6,
  stdDev: number = 2,
): number {
  const exponent = (-25 / stdDev) * Math.pow(mean * -1 + x, 2)
  return Math.exp(exponent)
}

export function generateNextSolidColor({
  baseColor,
  colorScheme,
  amount = 0.2,
}: {
  baseColor: string
  colorScheme: 'light' | 'dark'
  amount?: number
}): string {
  if (colorScheme === 'dark') {
    const baseLighten = new Color(baseColor)
    baseLighten.lighten(amount)
    return baseLighten.toString({ format: 'hex' })
  }

  const baseDarken = new Color(baseColor)
  baseDarken.darken(amount)
  return baseDarken.toString({ format: 'hex' })
}

export function generateColorScale(
  baseColor: string,
  lightnessValues: number[],
  mean: number,
  stdDev: number,
  colorScheme: 'light' | 'dark' = 'light',
): string[] {
  const base = new Color(baseColor)
  const colors: string[] = []
  const steps = lightnessValues.length

  for (let i = 0; i < steps; i++) {
    const lightness = lightnessValues[i]
    const color = new Color(base)
    const chroma = gaussian(lightness, mean, stdDev) * color.to('oklch').c
    color.set('oklch.l', lightness)
    color.set('oklch.c', chroma)
    colors.push(color.toString({ format: 'hex' }))
  }

  // Set lightness to 0.62 for base color in dark mode to ensure contrast against background and text
  const newBaseColor = new Color(baseColor)
  if (colorScheme === 'dark') {
    newBaseColor.set('oklch.l', 0.62)
  }

  colors.push(newBaseColor.toString({ format: 'hex' }))

  const solidHover = generateNextSolidColor({
    baseColor,
    colorScheme,
    amount: 0.15,
  })
  const solidActive = generateNextSolidColor({
    baseColor,
    colorScheme,
    amount: 0.25,
  })
  colors.push(solidHover)
  colors.push(solidActive)

  return colors
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
}

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
}

type ContrastMethod = 'WCAG21' | 'APCA'

function getThresholds(method: ContrastMethod) {
  return method === 'WCAG21' ? WCAGThresholds : APCAThresholds
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
) {
  const fg = typeof foreground === 'string' ? new Color(foreground) : foreground
  const bg = typeof background === 'string' ? new Color(background) : background

  const contrastValue = fg.contrast(bg, method)
  const thresholds = getThresholds(method)
  const contrast = method === 'APCA' ? Math.abs(contrastValue) : contrastValue

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
}
