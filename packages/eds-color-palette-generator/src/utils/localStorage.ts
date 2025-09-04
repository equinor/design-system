import { ColorDefinition, ContrastMethod, ColorFormat } from '@/types'

// Keys for localStorage
const STORAGE_KEYS = {
  MEAN_LIGHT: 'colorPalette_meanLight',
  STD_DEV_LIGHT: 'colorPalette_stdDevLight',
  MEAN_DARK: 'colorPalette_meanDark',
  STD_DEV_DARK: 'colorPalette_stdDevDark',
  LIGHT_MODE_VALUES: 'colorPalette_lightModeValues',
  DARK_MODE_VALUES: 'colorPalette_darkModeValues',
  COLORS: 'colorPalette_colors',
  COLOR_SCHEME: 'colorPalette_colorScheme',
  SHOW_CONTRAST: 'colorPalette_showContrast',
  SHOW_LIGHTNESS_INPUTS: 'colorPalette_showLightnessInputs',
  SHOW_GAUSSIAN_PARAMETERS: 'colorPalette_showGaussianParameters',
  CONTRAST_METHOD: 'colorPalette_contrastMethod',
  COLOR_FORMAT: 'colorPalette_colorFormat',
} as const

// Generic localStorage utility functions
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn(`Error reading from localStorage for key "${key}":`, error)
    return defaultValue
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Error writing to localStorage for key "${key}":`, error)
  }
}

// Specific functions for each configuration type
export const localStorageUtils = {
  // Gaussian parameters
  getMeanLight: (defaultValue: number) =>
    getItem(STORAGE_KEYS.MEAN_LIGHT, defaultValue),
  setMeanLight: (value: number) => setItem(STORAGE_KEYS.MEAN_LIGHT, value),

  getStdDevLight: (defaultValue: number) =>
    getItem(STORAGE_KEYS.STD_DEV_LIGHT, defaultValue),
  setStdDevLight: (value: number) => setItem(STORAGE_KEYS.STD_DEV_LIGHT, value),

  getMeanDark: (defaultValue: number) =>
    getItem(STORAGE_KEYS.MEAN_DARK, defaultValue),
  setMeanDark: (value: number) => setItem(STORAGE_KEYS.MEAN_DARK, value),

  getStdDevDark: (defaultValue: number) =>
    getItem(STORAGE_KEYS.STD_DEV_DARK, defaultValue),
  setStdDevDark: (value: number) => setItem(STORAGE_KEYS.STD_DEV_DARK, value),

  // Lightness values
  getLightModeValues: (defaultValue: number[]) =>
    getItem(STORAGE_KEYS.LIGHT_MODE_VALUES, defaultValue),
  setLightModeValues: (value: number[]) =>
    setItem(STORAGE_KEYS.LIGHT_MODE_VALUES, value),

  getDarkModeValues: (defaultValue: number[]) =>
    getItem(STORAGE_KEYS.DARK_MODE_VALUES, defaultValue),
  setDarkModeValues: (value: number[]) =>
    setItem(STORAGE_KEYS.DARK_MODE_VALUES, value),

  // Colors
  getColors: (defaultValue: ColorDefinition[]) =>
    getItem(STORAGE_KEYS.COLORS, defaultValue),
  setColors: (value: ColorDefinition[]) => setItem(STORAGE_KEYS.COLORS, value),

  // Color scheme
  getColorScheme: (defaultValue: 'light' | 'dark') =>
    getItem(STORAGE_KEYS.COLOR_SCHEME, defaultValue),
  setColorScheme: (value: 'light' | 'dark') =>
    setItem(STORAGE_KEYS.COLOR_SCHEME, value),

  // Display options
  getShowContrast: (defaultValue: boolean) =>
    getItem(STORAGE_KEYS.SHOW_CONTRAST, defaultValue),
  setShowContrast: (value: boolean) =>
    setItem(STORAGE_KEYS.SHOW_CONTRAST, value),

  getShowLightnessInputs: (defaultValue: boolean) =>
    getItem(STORAGE_KEYS.SHOW_LIGHTNESS_INPUTS, defaultValue),
  setShowLightnessInputs: (value: boolean) =>
    setItem(STORAGE_KEYS.SHOW_LIGHTNESS_INPUTS, value),

  getShowGaussianParameters: (defaultValue: boolean) =>
    getItem(STORAGE_KEYS.SHOW_GAUSSIAN_PARAMETERS, defaultValue),
  setShowGaussianParameters: (value: boolean) =>
    setItem(STORAGE_KEYS.SHOW_GAUSSIAN_PARAMETERS, value),

  getContrastMethod: (defaultValue: ContrastMethod) =>
    getItem(STORAGE_KEYS.CONTRAST_METHOD, defaultValue),
  setContrastMethod: (value: ContrastMethod) =>
    setItem(STORAGE_KEYS.CONTRAST_METHOD, value),

  getColorFormat: (defaultValue: ColorFormat) =>
    getItem(STORAGE_KEYS.COLOR_FORMAT, defaultValue),
  setColorFormat: (value: ColorFormat) =>
    setItem(STORAGE_KEYS.COLOR_FORMAT, value),

  // Clear all stored data
  clearAll: () => {
    if (typeof window === 'undefined') return

    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  },

  // Clear only configuration-related data (colors, Gaussian parameters, lightness values)
  clearConfiguration: () => {
    if (typeof window === 'undefined') return

    const configurationKeys = [
      STORAGE_KEYS.MEAN_LIGHT,
      STORAGE_KEYS.STD_DEV_LIGHT,
      STORAGE_KEYS.MEAN_DARK,
      STORAGE_KEYS.STD_DEV_DARK,
      STORAGE_KEYS.LIGHT_MODE_VALUES,
      STORAGE_KEYS.DARK_MODE_VALUES,
      STORAGE_KEYS.COLORS,
    ]

    configurationKeys.forEach((key) => {
      localStorage.removeItem(key)
    })
  },
}
