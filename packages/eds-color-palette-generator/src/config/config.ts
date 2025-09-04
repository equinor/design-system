// Configuration for color palette generator
// Converted from JSON to TS to allow comments and prettier-ignore directives.

import { APCA_CONTRAST_LEVELS } from './APCA_CONTRAST_LEVELS'
import { WCAG_CONTRAST_LEVELS } from './WCAG_CONTRAST_LEVELS'
import { StepDefinition } from './types'
import { getLightnessValues } from './helpers'

/**
 * Contrast requirements for a step pairing
 */

/**
 * Individual step definitions using semantic IDs as constant names
 */

export const BG_CANVAS: StepDefinition = {
  id: 'background-canvas',
  name: 'Background Canvas',
  category: 'background',
  variant: 'default',
  lightValue: 0.97,
  darkValue: 0.15,
}

export const BG_SURFACE: StepDefinition = {
  id: 'background-surface',
  name: 'Background Surface',
  category: 'background',
  variant: 'surface',
  lightValue: 0.99,
  darkValue: 0.25,
}

export const BG_MEDIUM_DEFAULT: StepDefinition = {
  id: 'background-medium-default',
  name: 'Background Medium Default',
  category: 'background-medium',
  variant: 'medium-default',
  lightValue: 0.89,
  darkValue: 0.47,
  contrastWith: [
    {
      targetStep: 'background-surface',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BG_MEDIUM_HOVER: StepDefinition = {
  id: 'background-medium-hover',
  name: 'Background Medium Hover',
  category: 'background-medium',
  variant: 'medium-hover',
  lightValue: 0.85,
  darkValue: 0.52,
  contrastWith: [
    {
      targetStep: 'background-surface',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BG_MEDIUM_ACTIVE: StepDefinition = {
  id: 'background-medium-active',
  name: 'Background Medium Active',
  category: 'background-medium',
  variant: 'medium-active',
  lightValue: 0.8,
  darkValue: 0.58,
  contrastWith: [
    {
      targetStep: 'background-surface',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BORDER_SUBTLE: StepDefinition = {
  id: 'border-subtle',
  name: 'Border Subtle',
  category: 'border',
  variant: 'subtle',
  lightValue: 0.87,
  darkValue: 0.47,
  contrastWith: [
    {
      targetStep: 'background-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'background-surface',
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
  lightValue: 0.75,
  darkValue: 0.61,
  contrastWith: [
    {
      targetStep: 'background-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'background-surface',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'background-medium-default',
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
  lightValue: 0.52,
  darkValue: 0.76,
  contrastWith: [
    {
      targetStep: 'background-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'background-surface',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'background-medium-default',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'background-medium-hover',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'border-medium',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BG_STRONG_DEFAULT: StepDefinition = {
  id: 'background-strong-default',
  name: 'Background Strong Default',
  category: 'background-strong',
  variant: 'strong-default',
  lightValue: 0.5,
  darkValue: 0.82,
  contrastWith: [
    {
      targetStep: 'background-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'background-surface',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BG_STRONG_HOVER: StepDefinition = {
  id: 'background-strong-hover',
  name: 'Background Strong Hover',
  category: 'background-strong',
  variant: 'strong-hover',
  lightValue: 0.44,
  darkValue: 0.88,
  contrastWith: [
    {
      targetStep: 'background-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'background-surface',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BG_STRONG_ACTIVE: StepDefinition = {
  id: 'background-strong-active',
  name: 'Background Strong Active',
  category: 'background-strong',
  variant: 'strong-active',
  lightValue: 0.42,
  darkValue: 0.93,
  contrastWith: [
    {
      targetStep: 'background-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'background-surface',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const TEXT_SUBTLE: StepDefinition = {
  id: 'text-subtle',
  name: 'Text Subtle',
  category: 'text',
  variant: 'subtle',
  lightValue: 0.42,
  darkValue: 0.91,
  contrastWith: [
    {
      targetStep: 'background-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
    {
      targetStep: 'background-surface',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
    {
      targetStep: 'background-medium-default',
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
  lightValue: 0.23,
  darkValue: 0.99,
  contrastWith: [
    {
      targetStep: 'background-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_90,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'background-surface',
      lc: APCA_CONTRAST_LEVELS.LC_90,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'background-medium-default',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
  ],
}

export const TEXT_CONTRAST_SUBTLE: StepDefinition = {
  id: 'text-contrast-subtle',
  name: 'Text Contrast Subtle',
  category: 'text',
  variant: 'contrast-subtle',
  lightValue: 0.9,
  darkValue: 0.33,
  contrastWith: [
    {
      targetStep: 'background-strong-default',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
    {
      targetStep: 'background-strong-hover',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
    {
      targetStep: 'background-strong-active',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
  ],
}

export const TEXT_CONTRAST_STRONG: StepDefinition = {
  id: 'text-contrast-strong',
  name: 'Text Contrast Strong',
  category: 'text',
  variant: 'contrast-strong',
  lightValue: 1,
  darkValue: 0.1,
  contrastWith: [
    {
      targetStep: 'background-strong-default',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'background-strong-hover',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'background-strong-active',
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
  BG_CANVAS,
  BG_SURFACE,
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
  TEXT_CONTRAST_SUBTLE,
  TEXT_CONTRAST_STRONG,
]

// Generated exports for backward compatibility and UI
export const lightnessValuesInLightMode =
  getLightnessValues('light')(PALETTE_STEPS)
export const darknessValuesInDarkMode =
  getLightnessValues('dark')(PALETTE_STEPS)
