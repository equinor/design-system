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

    darkColors[`${colorDef.name}Dark`] = generateColorScale(
      colorDef.hex,
      customDarkModeValues,
      mean,
      stdDev,
      'dark',
    )
  })

  // Extract the required standard colors for token formatter
  const standardLightColors = {
    accent: lightColors.accent || [],
    neutral: lightColors.neutral || [],
    success: lightColors.success || [],
    info: lightColors.info || [],
    warning: lightColors.warning || [],
    danger: lightColors.danger || [],
  }

  const standardDarkColors = {
    accentDark: darkColors.accentDark || [],
    neutralDark: darkColors.neutralDark || [],
    successDark: darkColors.successDark || [],
    infoDark: darkColors.infoDark || [],
    warningDark: darkColors.warningDark || [],
    dangerDark: darkColors.dangerDark || [],
  }

  // Format colors as tokens
  const tokenData = formatColorsAsTokens(
    standardLightColors,
    standardDarkColors,
  )

  const blob = new Blob([tokenData], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'color-tokens.json'
  document.body.appendChild(a)
  a.click()

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 0)
}
