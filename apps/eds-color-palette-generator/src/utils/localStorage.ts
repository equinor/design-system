import type { ColorFormat } from '@/types'

/** The Tokens Studio density modes */
export type Density = 'relaxed' | 'comfortable' | 'compact'

// Keys for localStorage
export const STORAGE_KEYS = {
  COLOR_SCHEME: 'colorPalette_colorScheme',
  COLOR_FORMAT: 'colorPalette_colorFormat',
  DENSITY: 'colorPalette_density',
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

// The saved choices from the settings dialog and the Theme Builder
export const localStorageUtils = {
  getColorScheme: <T extends 'light' | 'dark' | null>(defaultValue: T) =>
    getItem<'light' | 'dark' | T>(STORAGE_KEYS.COLOR_SCHEME, defaultValue),
  setColorScheme: (value: 'light' | 'dark') =>
    setItem(STORAGE_KEYS.COLOR_SCHEME, value),

  getColorFormat: (defaultValue: ColorFormat) =>
    getItem(STORAGE_KEYS.COLOR_FORMAT, defaultValue),
  setColorFormat: (value: ColorFormat) =>
    setItem(STORAGE_KEYS.COLOR_FORMAT, value),

  getDensity: (defaultValue: Density) =>
    getItem(STORAGE_KEYS.DENSITY, defaultValue),
  setDensity: (value: Density) => setItem(STORAGE_KEYS.DENSITY, value),
}
