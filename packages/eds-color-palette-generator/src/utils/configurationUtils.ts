import { ColorDefinition } from '@/types'
import { generateColorScale } from './color'
import { formatColorsAsTokens } from './tokenFormatter'

/**
 * Download the current configuration as a JSON file
 */
export const downloadConfiguration = (
  customLightModeValues: number[],
  customDarkModeValues: number[],
  mean: number,
  stdDev: number,
  colors: ColorDefinition[],
) => {
  const config = {
    lightModeValues: customLightModeValues,
    darkModeValues: customDarkModeValues,
    mean,
    stdDev,
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
  mean: number,
  stdDev: number,
) => {
  // Create objects with the required structure
  const lightColors: Record<string, string[]> = {}
  const darkColors: Record<string, string[]> = {}

  // Add colors to objects
  colors.forEach((colorDef) => {
    lightColors[colorDef.name] = generateColorScale(
      colorDef.hex,
      customLightModeValues,
      mean,
      stdDev,
      'light',
    )

    darkColors[colorDef.name] = generateColorScale(
      colorDef.hex,
      customDarkModeValues,
      mean,
      stdDev,
      'dark',
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
