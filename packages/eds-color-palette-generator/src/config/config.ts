// Configuration for color palette generator
// Converted from JSON to TS to allow comments and prettier-ignore directives.

import { ColorDefinition } from '@/types'
import { APCA_CONTRAST_LEVELS } from './APCA_CONTRAST_LEVELS'
import { WCAG_CONTRAST_LEVELS } from './WCAG_CONTRAST_LEVELS'

/**
 * Contrast requirements for a step pairing
 */
export interface ContrastRequirement {
  /** Target step identifier */
  targetStep: string
  /** APCA contrast level */
  lc: (typeof APCA_CONTRAST_LEVELS)[keyof typeof APCA_CONTRAST_LEVELS]
  /** WCAG contrast level */
  wcag: (typeof WCAG_CONTRAST_LEVELS)[keyof typeof WCAG_CONTRAST_LEVELS]
}

/**
 * Color palette step definition with contrast requirements
 */
export interface StepDefinition {
  /** Unique identifier for this step */
  id: string
  /** Display name for the step */
  name: string
  /** Step category */
  category:
    | 'background'
    | 'background-medium'
    | 'background-strong'
    | 'border'
    | 'text'
  /** Step variant within category */
  variant: string
  /** Lightness value for light mode */
  lightValue: number
  /** Lightness value for dark mode */
  darkValue: number
  /** Contrast requirements (which steps this should have good contrast with) */
  contrastWith?: ContrastRequirement[]
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
 * Individual step definitions using semantic IDs as constant names
 */

// Background steps (default/subtle)
export const BG_DEFAULT: StepDefinition = {
  id: 'bg-default',
  name: 'Background Default',
  category: 'background',
  variant: 'default',
  lightValue: 1.0,
  darkValue: 0.15,
}

export const BG_SUBTLE: StepDefinition = {
  id: 'bg-subtle',
  name: 'Background Subtle',
  category: 'background',
  variant: 'subtle',
  lightValue: 0.96,
  darkValue: 0.25,
}

// Background steps (medium - interactive states)
export const BG_MEDIUM_DEFAULT: StepDefinition = {
  id: 'bg-medium-default',
  name: 'Background Medium Default',
  category: 'background-medium',
  variant: 'medium-default',
  lightValue: 0.88,
  darkValue: 0.45,
  contrastWith: [
    {
      targetStep: 'bg-default',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-subtle',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BG_MEDIUM_HOVER: StepDefinition = {
  id: 'bg-medium-hover',
  name: 'Background Medium Hover',
  category: 'background-medium',
  variant: 'medium-hover',
  lightValue: 0.84,
  darkValue: 0.48,
  contrastWith: [
    {
      targetStep: 'bg-default',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-subtle',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BG_MEDIUM_ACTIVE: StepDefinition = {
  id: 'bg-medium-active',
  name: 'Background Medium Active',
  category: 'background-medium',
  variant: 'medium-active',
  lightValue: 0.8,
  darkValue: 0.5,
  contrastWith: [
    {
      targetStep: 'bg-default',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-subtle',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

// Border steps
export const BORDER_SUBTLE: StepDefinition = {
  id: 'border-subtle',
  name: 'Border Subtle',
  category: 'border',
  variant: 'subtle',
  lightValue: 0.82,
  darkValue: 0.63,
  contrastWith: [
    {
      targetStep: 'bg-default',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-subtle',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-medium-default',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-medium-hover',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-medium-active',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BORDER_MEDIUM: StepDefinition = {
  id: 'border-medium',
  name: 'Border Medium',
  category: 'border',
  variant: 'medium',
  lightValue: 0.7,
  darkValue: 0.66,
  contrastWith: [
    {
      targetStep: 'bg-default',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-subtle',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-medium-default',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-medium-hover',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-medium-active',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BORDER_STRONG: StepDefinition = {
  id: 'border-strong',
  name: 'Border Strong',
  category: 'border',
  variant: 'strong',
  lightValue: 0.66,
  darkValue: 0.68,
  contrastWith: [
    {
      targetStep: 'bg-default',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-subtle',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-medium-default',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-medium-hover',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-medium-active',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

// Background steps (strong - interactive states)
export const BG_STRONG_DEFAULT: StepDefinition = {
  id: 'bg-strong-default',
  name: 'Background Strong Default',
  category: 'background-strong',
  variant: 'strong-default',
  lightValue: 0.5,
  darkValue: 0.78,
  contrastWith: [
    {
      targetStep: 'bg-default',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'bg-subtle',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
  ],
}

export const BG_STRONG_HOVER: StepDefinition = {
  id: 'bg-strong-hover',
  name: 'Background Strong Hover',
  category: 'background-strong',
  variant: 'strong-hover',
  lightValue: 0.44,
  darkValue: 0.85,
  contrastWith: [
    {
      targetStep: 'bg-default',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'bg-subtle',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
  ],
}

export const BG_STRONG_ACTIVE: StepDefinition = {
  id: 'bg-strong-active',
  name: 'Background Strong Active',
  category: 'background-strong',
  variant: 'strong-active',
  lightValue: 0.42,
  darkValue: 0.92,
  contrastWith: [
    {
      targetStep: 'bg-default',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'bg-subtle',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
  ],
}

// Text steps
export const TEXT_SUBTLE: StepDefinition = {
  id: 'text-subtle',
  name: 'Text Subtle',
  category: 'text',
  variant: 'subtle',
  lightValue: 0.36,
  darkValue: 0.91,
  contrastWith: [
    {
      targetStep: 'bg-default',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
    {
      targetStep: 'bg-subtle',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
    {
      targetStep: 'bg-medium-default',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
    {
      targetStep: 'bg-medium-hover',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
    {
      targetStep: 'bg-medium-active',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
  ],
}

export const TEXT_STRONG: StepDefinition = {
  id: 'text-strong',
  name: 'Text Strong',
  category: 'text',
  variant: 'strong',
  lightValue: 0.32,
  darkValue: 0.99,
  contrastWith: [
    {
      targetStep: 'bg-default',
      lc: APCA_CONTRAST_LEVELS.LC_90,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'bg-subtle',
      lc: APCA_CONTRAST_LEVELS.LC_90,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'bg-medium-default',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'bg-medium-hover',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'bg-medium-active',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
  ],
}

export const TEXT_INV_SUBTLE: StepDefinition = {
  id: 'text-inv-subtle',
  name: 'Text Inverse Subtle',
  category: 'text',
  variant: 'inverse-subtle',
  lightValue: 0.97,
  darkValue: 0.18,
  contrastWith: [
    {
      targetStep: 'bg-strong-default',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'bg-strong-hover',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'bg-strong-active',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
  ],
}

export const TEXT_INV_STRONG: StepDefinition = {
  id: 'text-inv-strong',
  name: 'Text Inverse Strong',
  category: 'text',
  variant: 'inverse-strong',
  lightValue: 0.99,
  darkValue: 0.1,
  contrastWith: [
    {
      targetStep: 'bg-strong-default',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'bg-strong-hover',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'bg-strong-active',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
  ],
}

/**
 * Color palette step definitions array combining all individual step constants
 */
// prettier-ignore
export const PALETTE_STEPS: StepDefinition[] = [
  BG_DEFAULT,
  BG_SUBTLE,
  BG_MEDIUM_DEFAULT,
  BG_MEDIUM_HOVER,
  BG_MEDIUM_ACTIVE,
  BORDER_SUBTLE,
  BORDER_MEDIUM,
  BORDER_STRONG,
  BG_STRONG_DEFAULT,
  BG_STRONG_HOVER,
  BG_STRONG_ACTIVE,
  TEXT_SUBTLE,
  TEXT_STRONG,
  TEXT_INV_SUBTLE,
  TEXT_INV_STRONG,
]

/**
 * Extract lightness values for a specific mode
 */
export const getLightnessValues =
  (mode: 'light' | 'dark') =>
  (steps: readonly StepDefinition[]): number[] =>
    steps.map((step) => (mode === 'light' ? step.lightValue : step.darkValue))

/**
 * Find step by ID
 */
export const findStepById =
  (id: string) =>
  (steps: readonly StepDefinition[]): StepDefinition | undefined =>
    steps.find((step) => step.id === id)

/**
 * Get step index by ID
 */
export const getStepIndex =
  (id: string) =>
  (steps: readonly StepDefinition[]): number =>
    steps.findIndex((step) => step.id === id)

/**
 * Palette configuration
 */
export const config: PaletteConfig = {
  mean: 0.6,
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

// Generated exports for backward compatibility and UI
export const lightnessValuesInLightMode =
  getLightnessValues('light')(PALETTE_STEPS)
export const darknessValuesInDarkMode =
  getLightnessValues('dark')(PALETTE_STEPS)

export default config
