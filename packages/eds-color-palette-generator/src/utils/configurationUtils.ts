import { ColorDefinition, ColorFormat } from '@/types'
import { generateColorScale } from './color'
import { formatColorsAsTokens } from './tokenFormatter'
import { PALETTE_STEPS, getLightnessValues } from '@/config/config'

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
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 0)
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
    lightColors[colorDef.name] = generateColorScale(
      colorDef.hex,
      customLightModeValues,
      meanLight,
      stdDevLight,
      format, // Use the user's selected format
    )

    darkColors[colorDef.name] = generateColorScale(
      colorDef.hex,
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
  setTimeout(() => {
    document.body.removeChild(lightAnchor)
    document.body.removeChild(darkAnchor)
    URL.revokeObjectURL(lightUrl)
    URL.revokeObjectURL(darkUrl)
  }, 0)
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
    const lightColorScale = generateColorScale(
      colorDef.hex,
      lightModeValues,
      meanLight,
      stdDevLight,
      colorFormat,
    )

    const darkColorScale = generateColorScale(
      colorDef.hex,
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
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 0)
}
