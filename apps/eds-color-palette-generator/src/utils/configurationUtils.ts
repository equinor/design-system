import { ColorDefinition, ColorFormat, ColorAnchor } from '@/types'
import { generateColorScale } from './color'
import { formatColorsAsTokens } from './tokenFormatter'
import { PALETTE_STEPS } from '@/config/config'
import { getLightnessValues } from '@/config/helpers'

/**
 * Helper function to get color input from a ColorDefinition
 * @param colorDef - Color definition object
 * @returns The color input (anchors array or value string)
 * @throws Error if both anchors and value are missing
 */
function getColorInput(colorDef: ColorDefinition): ColorAnchor[] | string {
  const colorInput = colorDef.anchors || colorDef.value
  if (!colorInput) {
    throw new Error(
      `Color "${colorDef.name}" is missing both 'anchors' and 'value'. Please provide at least one to generate color tokens.`,
    )
  }
  return colorInput
}

/**
 * Download the current configuration as a JSON file
 */
export const downloadConfiguration = (
  customLightModeValues: number[],
  customDarkModeValues: number[],
  meanLight: number,
  stdDevLight: number,
  meanDark: number,
  stdDevDark: number,
  colors: ColorDefinition[],
) => {
  const config = {
    lightModeValues: customLightModeValues,
    darkModeValues: customDarkModeValues,
    meanLight,
    stdDevLight,
    meanDark,
    stdDevDark,
    colors,
  }

  const configData = JSON.stringify(config, null, 2)
  const blob = new Blob([configData], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'color-palette-config.json'
  document.body.appendChild(a)
  a.click()

  // Clean up
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Download color tokens in W3C format
 */
export const downloadColorTokens = (
  colors: ColorDefinition[],
  customLightModeValues: number[],
  customDarkModeValues: number[],
  meanLight: number,
  stdDevLight: number,
  meanDark: number,
  stdDevDark: number,
  format: ColorFormat,
) => {
  // Create objects with the required structure
  const lightColors: Record<string, string[]> = {}
  const darkColors: Record<string, string[]> = {}

  // Add colors to objects
  colors.forEach((colorDef) => {
    const colorInput = getColorInput(colorDef)

    lightColors[colorDef.name] = generateColorScale(
      colorInput,
      customLightModeValues,
      meanLight,
      stdDevLight,
      format, // Use the user's selected format
    )

    darkColors[colorDef.name] = generateColorScale(
      colorInput,
      customDarkModeValues,
      meanDark,
      stdDevDark,
      format, // Use the user's selected format
    )
  })

  // Format and download light tokens
  const lightTokenData = formatColorsAsTokens(lightColors)

  const lightBlob = new Blob([lightTokenData], {
    type: 'application/json',
  })
  const lightUrl = URL.createObjectURL(lightBlob)

  const lightAnchor = document.createElement('a')
  lightAnchor.href = lightUrl
  lightAnchor.download = 'color-tokens-light.json'
  document.body.appendChild(lightAnchor)
  lightAnchor.click()

  // Format and download dark tokens
  const darkTokenData = formatColorsAsTokens(darkColors)

  const darkBlob = new Blob([darkTokenData], {
    type: 'application/json',
  })
  const darkUrl = URL.createObjectURL(darkBlob)

  const darkAnchor = document.createElement('a')
  darkAnchor.href = darkUrl
  darkAnchor.download = 'color-tokens-dark.json'
  document.body.appendChild(darkAnchor)
  darkAnchor.click()

  // Clean up
  document.body.removeChild(lightAnchor)
  document.body.removeChild(darkAnchor)
  URL.revokeObjectURL(lightUrl)
  URL.revokeObjectURL(darkUrl)
}

/**
 * Generate CSS variables for design system colors using light-dark() function
 */
export const generateDesignSystemCSS = (
  colors: ColorDefinition[],
  meanLight: number = 0.7,
  stdDevLight: number = 2,
  meanDark: number = 0.7,
  stdDevDark: number = 2,
  colorFormat: ColorFormat,
) => {
  // Use the palette steps for lightness values
  const lightModeValues = getLightnessValues('light')(PALETTE_STEPS)
  const darkModeValues = getLightnessValues('dark')(PALETTE_STEPS)

  // Generate CSS using light-dark() function
  let css =
    ':root {\n  /* Design system colors using light-dark() function */\n'

  colors.forEach((colorDef) => {
    const colorInput = getColorInput(colorDef)

    const lightColorScale = generateColorScale(
      colorInput,
      lightModeValues,
      meanLight,
      stdDevLight,
      colorFormat,
    )

    const darkColorScale = generateColorScale(
      colorInput,
      darkModeValues,
      meanDark,
      stdDevDark,
      colorFormat,
    )

    const colorName = colorDef.name.toLowerCase().replace(/\s+/g, '-')

    lightColorScale.forEach((lightColor, index) => {
      const darkColor = darkColorScale[index]
      css += `  --color-${colorName}-${index + 1}: light-dark(${lightColor}, ${darkColor});\n`
    })
    css += '\n'
  })

  css += '}\n'
  return css
}

/**
 * Download CSS variables for design system colors
 */
export const downloadDesignSystemCSS = (
  colors: ColorDefinition[],
  meanLight: number,
  stdDevLight: number,
  meanDark: number,
  stdDevDark: number,
  colorFormat: ColorFormat,
) => {
  const cssContent = generateDesignSystemCSS(
    colors,
    meanLight,
    stdDevLight,
    meanDark,
    stdDevDark,
    colorFormat,
  )

  const blob = new Blob([cssContent], {
    type: 'text/css',
  })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'colors.css'
  document.body.appendChild(a)
  a.click()

  // Clean up
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
