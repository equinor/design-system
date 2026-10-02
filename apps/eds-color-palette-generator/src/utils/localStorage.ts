import type { ColorFormat } from '@/types'

/** The Tokens Studio density modes */
export const DENSITIES = ['relaxed', 'comfortable', 'compact'] as const
export type Density = (typeof DENSITIES)[number]

const COLOR_SCHEMES = ['light', 'dark'] as const
const COLOR_FORMATS: readonly ColorFormat[] = ['OKLCH', 'HEX']

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

/**
 * A stored choice, or the default when the stored value is not one of the
 * allowed values (an older version's value, or one edited by hand).
 */
function getOneOf<T extends string, D>(
  key: string,
  allowed: readonly T[],
  defaultValue: D,
): T | D {
  const value = getItem<unknown>(key, defaultValue)
  return (allowed as readonly unknown[]).includes(value)
    ? (value as T)
    : defaultValue
}

// The saved choices from the settings dialog and the Theme Builder
export const localStorageUtils = {
  getColorScheme: <T extends 'light' | 'dark' | null>(defaultValue: T) =>
    getOneOf(STORAGE_KEYS.COLOR_SCHEME, COLOR_SCHEMES, defaultValue),
  setColorScheme: (value: 'light' | 'dark') =>
    setItem(STORAGE_KEYS.COLOR_SCHEME, value),

  getColorFormat: (defaultValue: ColorFormat) =>
    getOneOf(STORAGE_KEYS.COLOR_FORMAT, COLOR_FORMATS, defaultValue),
  setColorFormat: (value: ColorFormat) =>
    setItem(STORAGE_KEYS.COLOR_FORMAT, value),

  getDensity: (defaultValue: Density) =>
    getOneOf(STORAGE_KEYS.DENSITY, DENSITIES, defaultValue),
  setDensity: (value: Density) => setItem(STORAGE_KEYS.DENSITY, value),
}
