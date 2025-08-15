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
  category: 'background' | 'border' | 'text'
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
 * Step group for UI layout
 */
export interface StepGroup {
  /** Group title */
  title: string
  /** Number of steps in this group */
  span: number
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
 * Color palette step definitions with semantic names, lightness values, and contrast requirements
 */
// prettier-ignore
export const PALETTE_STEPS: StepDefinition[] = [
  // Background steps (default/subtle)
  { 
    id: 'bg-default', 
    name: 'Background Default', 
    category: 'background', 
    variant: 'default', 
    lightValue: 1.0, 
    darkValue: 0.15 
  },
  { 
    id: 'bg-subtle', 
    name: 'Background Subtle', 
    category: 'background', 
    variant: 'subtle', 
    lightValue: 0.96, 
    darkValue: 0.25 
  },
  
  // Background steps (medium - interactive states)
  { 
    id: 'bg-medium-default', 
    name: 'Background Medium Default', 
    category: 'background', 
    variant: 'medium-default', 
    lightValue: 0.88, 
    darkValue: 0.45,
    contrastWith: [
      { targetStep: 'bg-default', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS },
      { targetStep: 'bg-subtle', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS }
    ]
  },
  { 
    id: 'bg-medium-hover', 
    name: 'Background Medium Hover', 
    category: 'background', 
    variant: 'medium-hover', 
    lightValue: 0.84, 
    darkValue: 0.48,
    contrastWith: [
      { targetStep: 'bg-default', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS },
      { targetStep: 'bg-subtle', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS }
    ]
  },
  { 
    id: 'bg-medium-active', 
    name: 'Background Medium Active', 
    category: 'background', 
    variant: 'medium-active', 
    lightValue: 0.8, 
    darkValue: 0.5,
    contrastWith: [
      { targetStep: 'bg-default', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS },
      { targetStep: 'bg-subtle', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS }
    ]
  },
  
  // Border steps
  { 
    id: 'border-subtle', 
    name: 'Border Subtle', 
    category: 'border', 
    variant: 'subtle', 
    lightValue: 0.82, 
    darkValue: 0.63,
    contrastWith: [
      { targetStep: 'bg-default', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS },
      { targetStep: 'bg-subtle', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS },
      { targetStep: 'bg-medium-default', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS },
      { targetStep: 'bg-medium-hover', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS },
      { targetStep: 'bg-medium-active', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS }
    ]
  },
  { 
    id: 'border-medium', 
    name: 'Border Medium', 
    category: 'border', 
    variant: 'medium', 
    lightValue: 0.7, 
    darkValue: 0.66,
    contrastWith: [
      { targetStep: 'bg-default', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS },
      { targetStep: 'bg-subtle', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS },
      { targetStep: 'bg-medium-default', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS },
      { targetStep: 'bg-medium-hover', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS },
      { targetStep: 'bg-medium-active', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS }
    ]
  },
  { 
    id: 'border-strong', 
    name: 'Border Strong', 
    category: 'border', 
    variant: 'strong', 
    lightValue: 0.66, 
    darkValue: 0.68,
    contrastWith: [
      { targetStep: 'bg-default', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS },
      { targetStep: 'bg-subtle', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS },
      { targetStep: 'bg-medium-default', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS },
      { targetStep: 'bg-medium-hover', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS },
      { targetStep: 'bg-medium-active', lc: APCA_CONTRAST_LEVELS.LC_15, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS }
    ]
  },
  
  // Background steps (strong - interactive states)
  { 
    id: 'bg-strong-default', 
    name: 'Background Strong Default', 
    category: 'background', 
    variant: 'strong-default', 
    lightValue: 0.6, 
    darkValue: 0.78,
    contrastWith: [
      { targetStep: 'bg-default', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL },
      { targetStep: 'bg-subtle', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL }
    ]
  },
  { 
    id: 'bg-strong-hover', 
    name: 'Background Strong Hover', 
    category: 'background', 
    variant: 'strong-hover', 
    lightValue: 0.58, 
    darkValue: 0.85,
    contrastWith: [
      { targetStep: 'bg-default', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL },
      { targetStep: 'bg-subtle', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL }
    ]
  },
  { 
    id: 'bg-strong-active', 
    name: 'Background Strong Active', 
    category: 'background', 
    variant: 'strong-active', 
    lightValue: 0.53, 
    darkValue: 0.92,
    contrastWith: [
      { targetStep: 'bg-default', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL },
      { targetStep: 'bg-subtle', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL }
    ]
  },
  
  // Text steps
  { 
    id: 'text-subtle', 
    name: 'Text Subtle', 
    category: 'text', 
    variant: 'subtle', 
    lightValue: 0.5, 
    darkValue: 0.91,
    contrastWith: [
      { targetStep: 'bg-default', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL },
      { targetStep: 'bg-subtle', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL },
      { targetStep: 'bg-medium-default', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL },
      { targetStep: 'bg-medium-hover', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL },
      { targetStep: 'bg-medium-active', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL }
    ]
  },
  { 
    id: 'text-strong', 
    name: 'Text Strong', 
    category: 'text', 
    variant: 'strong', 
    lightValue: 0.35, 
    darkValue: 0.99,
    contrastWith: [
      { targetStep: 'bg-default', lc: APCA_CONTRAST_LEVELS.LC_90, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL },
      { targetStep: 'bg-subtle', lc: APCA_CONTRAST_LEVELS.LC_90, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL },
      { targetStep: 'bg-medium-default', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL },
      { targetStep: 'bg-medium-hover', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL },
      { targetStep: 'bg-medium-active', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL }
    ]
  },
  { 
    id: 'text-inv-subtle', 
    name: 'Text Inverse Subtle', 
    category: 'text', 
    variant: 'inverse-subtle', 
    lightValue: 0.97, 
    darkValue: 0.18,
    contrastWith: [
      { targetStep: 'bg-strong-default', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL },
      { targetStep: 'bg-strong-hover', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL },
      { targetStep: 'bg-strong-active', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL }
    ]
  },
  { 
    id: 'text-inv-strong', 
    name: 'Text Inverse Strong', 
    category: 'text', 
    variant: 'inverse-strong', 
    lightValue: 0.99, 
    darkValue: 0.1,
    contrastWith: [
      { targetStep: 'bg-strong-default', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL },
      { targetStep: 'bg-strong-hover', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL },
      { targetStep: 'bg-strong-active', lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL }
    ]
  },
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
 * Generate step groups for UI layout based on current step order
 */
export const generateStepGroups = (
  steps: readonly StepDefinition[],
): StepGroup[] => {
  const groups: StepGroup[] = []
  let currentCategory = ''
  let currentGroup: StepGroup | null = null

  steps.forEach((step) => {
    const groupKey = `${step.category}-${step.variant.split('-')[0]}`

    if (groupKey !== currentCategory) {
      if (currentGroup) {
        groups.push(currentGroup)
      }

      // Create readable group titles
      const titles: Record<string, string> = {
        'background-default': 'Background [default, subtle]',
        'background-medium': 'Background [medium]',
        'border-subtle': 'Border',
        'background-strong': 'Background [strong]',
        'text-subtle': 'Text default [subtle, strong]',
        'text-inverse': 'Text inverse [subtle, strong]',
      }

      currentGroup = {
        title: titles[groupKey] || `${step.category} [${step.variant}]`,
        span: 1,
      }
      currentCategory = groupKey
    } else if (currentGroup) {
      currentGroup.span++
    }
  })

  if (currentGroup) {
    groups.push(currentGroup)
  }

  return groups
}

/**
 * Legacy color pair format for backward compatibility
 */
export interface LegacyColorPairRequirements {
  stepIndex: number
  lc: (typeof APCA_CONTRAST_LEVELS)[keyof typeof APCA_CONTRAST_LEVELS]
  wcag: (typeof WCAG_CONTRAST_LEVELS)[keyof typeof WCAG_CONTRAST_LEVELS]
}

export interface LegacyColorPair {
  usedOnStep?: Array<LegacyColorPairRequirements>
}

/**
 * Convert new format to legacy color pairs format for backward compatibility
 */
export const generateColorPairs = (
  steps: readonly StepDefinition[],
): Array<LegacyColorPair | null> => {
  return steps.map((step) => {
    if (!step.contrastWith || step.contrastWith.length === 0) {
      return {}
    }

    return {
      usedOnStep: step.contrastWith
        .map((req) => ({
          stepIndex: getStepIndex(req.targetStep)(steps),
          lc: req.lc,
          wcag: req.wcag,
        }))
        .filter((pair) => pair.stepIndex !== -1), // Filter out invalid step references
    }
  })
}

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

// Generated exports for backward compatibility and UI
export const stepGroups = generateStepGroups(PALETTE_STEPS)
export const colorPairs = generateColorPairs(PALETTE_STEPS)
export const lightnessValuesInLightMode =
  getLightnessValues('light')(PALETTE_STEPS)
export const darknessValuesInDarkMode =
  getLightnessValues('dark')(PALETTE_STEPS)

export default config
