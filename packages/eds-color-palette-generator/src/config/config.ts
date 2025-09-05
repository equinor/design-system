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

export const BG: StepDefinition = {
  id: 'bg-canvas',
  name: 'Background',
  category: 'Background',
  lightValue: 0.97,
  darkValue: 0.15,
}

export const BG_SURFACE: StepDefinition = {
  id: 'bg-surface',
  name: 'Background Surface',
  category: 'Background',
  variant: 'surface',
  lightValue: 0.999,
  darkValue: 0.25,
}

export const BG_FILL_MUTED_DEFAULT: StepDefinition = {
  id: 'bg-fill-muted-default',
  name: 'Background Fill Muted Default',
  category: 'Background Fill Muted',
  variant: 'default',
  lightValue: 0.89,
  darkValue: 0.47,
  contrastWith: [
    {
      targetStep: 'bg-surface',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BG_FILL_MUTED_HOVER: StepDefinition = {
  id: 'bg-fill-muted-hover',
  name: 'Background Fill Muted Hover',
  category: 'Background Fill Muted',
  variant: 'hover',
  lightValue: 0.85,
  darkValue: 0.52,
  contrastWith: [
    {
      targetStep: 'bg-surface',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BG_FILL_MUTED_ACTIVE: StepDefinition = {
  id: 'bg-fill-muted-active',
  name: 'Background Fill Muted Active',
  category: 'Background Fill Muted',
  variant: 'active',
  lightValue: 0.8,
  darkValue: 0.58,
  contrastWith: [
    {
      targetStep: 'bg-surface',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BORDER_SUBTLE: StepDefinition = {
  id: 'border-subtle',
  name: 'Border Subtle',
  category: 'Border',
  variant: 'subtle',
  lightValue: 0.87,
  darkValue: 0.47,
  contrastWith: [
    {
      targetStep: 'bg-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-surface',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BORDER_MEDIUM: StepDefinition = {
  id: 'border-medium',
  name: 'Border Medium',
  category: 'Border',
  variant: 'medium',
  lightValue: 0.75,
  darkValue: 0.61,
  contrastWith: [
    {
      targetStep: 'bg-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-surface',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-fill-muted-default',
      lc: APCA_CONTRAST_LEVELS.LC_15,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BORDER_STRONG: StepDefinition = {
  id: 'border-strong',
  name: 'Border Strong',
  category: 'Border',
  variant: 'strong',
  lightValue: 0.52,
  darkValue: 0.76,
  contrastWith: [
    {
      targetStep: 'bg-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-surface',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-fill-muted-default',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-fill-muted-hover',
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

export const BG_FILL_EMPHASIS_DEFAULT: StepDefinition = {
  id: 'bg-fill-emphasis-default',
  name: 'Background Fill Emphasis Default',
  category: 'Background Fill Emphasis',
  variant: 'default',
  lightValue: 0.5,
  darkValue: 0.82,
  contrastWith: [
    {
      targetStep: 'bg-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-surface',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BG_FILL_EMPHASIS_HOVER: StepDefinition = {
  id: 'bg-fill-emphasis-hover',
  name: 'Background Fill Emphasis Hover',
  category: 'Background Fill Emphasis',
  variant: 'hover',
  lightValue: 0.44,
  darkValue: 0.88,
  contrastWith: [
    {
      targetStep: 'bg-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-surface',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const BG_FILL_EMPHASIS_ACTIVE: StepDefinition = {
  id: 'bg-fill-emphasis-active',
  name: 'Background Fill Emphasis Active',
  category: 'Background Fill Emphasis',
  variant: 'active',
  lightValue: 0.42,
  darkValue: 0.93,
  contrastWith: [
    {
      targetStep: 'bg-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
    {
      targetStep: 'bg-surface',
      lc: APCA_CONTRAST_LEVELS.LC_30,
      wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
    },
  ],
}

export const TEXT_SUBTLE: StepDefinition = {
  id: 'text-subtle',
  name: 'Text Subtle',
  category: 'Text',
  variant: 'subtle',
  lightValue: 0.46,
  darkValue: 0.91,
  contrastWith: [
    {
      targetStep: 'bg-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
    {
      targetStep: 'bg-surface',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
    {
      targetStep: 'bg-fill-muted-default',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
  ],
}

export const TEXT_STRONG: StepDefinition = {
  id: 'text-strong',
  name: 'Text Strong',
  category: 'Text',
  variant: 'strong',
  lightValue: 0.23,
  darkValue: 0.99,
  contrastWith: [
    {
      targetStep: 'bg-canvas',
      lc: APCA_CONTRAST_LEVELS.LC_90,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'bg-surface',
      lc: APCA_CONTRAST_LEVELS.LC_90,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'bg-fill-muted-default',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
  ],
}

export const TEXT_SUBTLE_ON_EMPHASIS: StepDefinition = {
  id: 'text-subtle-on-emphasis',
  name: 'Text Subtle on Emphasis',
  category: 'Text',
  variant: 'subtle-on-emphasis',
  lightValue: 0.9,
  darkValue: 0.33,
  contrastWith: [
    {
      targetStep: 'bg-fill-emphasis-default',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
    {
      targetStep: 'bg-fill-emphasis-hover',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
    {
      targetStep: 'bg-fill-emphasis-active',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
    },
  ],
}

export const TEXT_STRONG_ON_EMPHASIS: StepDefinition = {
  id: 'text-strong-on-emphasis',
  name: 'Text Strong on Emphasis',
  category: 'Text',
  variant: 'strong-on-emphasis',
  lightValue: 1,
  darkValue: 0.1,
  contrastWith: [
    {
      targetStep: 'bg-fill-emphasis-default',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'bg-fill-emphasis-hover',
      lc: APCA_CONTRAST_LEVELS.LC_60,
      wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
    },
    {
      targetStep: 'bg-fill-emphasis-active',
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
  BG,
  BG_SURFACE,
  BG_FILL_MUTED_DEFAULT,
  BG_FILL_MUTED_HOVER,
  BG_FILL_MUTED_ACTIVE,
  BORDER_SUBTLE,
  BORDER_MEDIUM,
  BORDER_STRONG,
  BG_FILL_EMPHASIS_DEFAULT,
  BG_FILL_EMPHASIS_HOVER,
  BG_FILL_EMPHASIS_ACTIVE,
  TEXT_SUBTLE,
  TEXT_STRONG,
  TEXT_SUBTLE_ON_EMPHASIS,
  TEXT_STRONG_ON_EMPHASIS,
]

// Generated exports for backward compatibility and UI
export const lightnessValuesInLightMode =
  getLightnessValues('light')(PALETTE_STEPS)
export const darknessValuesInDarkMode =
  getLightnessValues('dark')(PALETTE_STEPS)
