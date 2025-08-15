// Configuration for color palette generator
// Converted from JSON to TS to allow comments and prettier-ignore directives.

import { ColorDefinition } from '@/types'

/**
 * Color palette step definition
 */
export interface StepDefinition {
  /** Step category */
  category: 'background' | 'border' | 'text'
  /** Step variant within category */
  variant: string
  /** Lightness value for light mode */
  lightValue: number
  /** Lightness value for dark mode */
  darkValue: number
}

/**
 * Palette configuration interface
 */
export interface PaletteConfig {
  /** Gaussian distribution mean */
  mean: number
  /** Gaussian distribution standard deviation */
  stdDev: number
  /** Available color definitions */
  colors: ColorDefinition[]
  /** Step definitions with semantic names and values */
  steps: StepDefinition[]
}

/**
 * Color palette step definitions with semantic names and lightness values
 */
// prettier-ignore
export const PALETTE_STEPS: StepDefinition[] = [
  // Background steps (default/subtle)
  { category: 'background', variant: 'default',         lightValue: 1.0,  darkValue: 0.15 },
  { category: 'background', variant: 'subtle',          lightValue: 0.96, darkValue: 0.25 },
  
  // Background steps (medium - interactive states)
  { category: 'background', variant: 'medium-default',  lightValue: 0.88, darkValue: 0.45 },
  { category: 'background', variant: 'medium-hover',    lightValue: 0.84, darkValue: 0.48 },
  { category: 'background', variant: 'medium-active',   lightValue: 0.8,  darkValue: 0.5  },
  
  // Border steps
  { category: 'border',     variant: 'subtle',          lightValue: 0.82, darkValue: 0.63 },
  { category: 'border',     variant: 'medium',          lightValue: 0.7,  darkValue: 0.66 },
  { category: 'border',     variant: 'strong',          lightValue: 0.66, darkValue: 0.68 },
  
  // Background steps (strong - interactive states)
  { category: 'background', variant: 'strong-default',  lightValue: 0.6,  darkValue: 0.78 },
  { category: 'background', variant: 'strong-hover',    lightValue: 0.58, darkValue: 0.85 },
  { category: 'background', variant: 'strong-active',   lightValue: 0.53, darkValue: 0.92 },
  
  // Text steps
  { category: 'text',       variant: 'subtle',          lightValue: 0.5,  darkValue: 0.91 },
  { category: 'text',       variant: 'strong',          lightValue: 0.35, darkValue: 0.99 },
  { category: 'text',       variant: 'inverse-subtle',  lightValue: 0.97, darkValue: 0.18 },
  { category: 'text',       variant: 'inverse-strong',  lightValue: 0.99, darkValue: 0.1  },
]

/**
 * Extract lightness values for a specific mode
 */
export const getLightnessValues =
  (mode: 'light' | 'dark') =>
  (steps: readonly StepDefinition[]): number[] =>
    steps.map((step) => (mode === 'light' ? step.lightValue : step.darkValue))

/**
 * Palette configuration
 */
export const config: PaletteConfig = {
  mean: 0.7,
  stdDev: 2,
  colors: [
    { name: 'Moss Green', hex: '#007079' },
    { name: 'Gray', hex: '#4A4A4A' },
    { name: 'Green', hex: '#3FA13D' },
    { name: 'Blue', hex: '#0084C4' },
    { name: 'Orange', hex: '#E57E00' },
    { name: 'Red', hex: '#E20337' },
  ],
  steps: PALETTE_STEPS,
}

export const lightnessValuesInLightMode =
  getLightnessValues('light')(PALETTE_STEPS)
export const darknessValuesInDarkMode =
  getLightnessValues('dark')(PALETTE_STEPS)

export default config
