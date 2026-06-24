import { APCA_CONTRAST_LEVELS } from './APCA_CONTRAST_LEVELS'
import { WCAG_CONTRAST_LEVELS } from './WCAG_CONTRAST_LEVELS'
import { ColorDefinition } from '@/types'

export interface ContrastRequirement {
  targetStep: string
  lc: (typeof APCA_CONTRAST_LEVELS)[keyof typeof APCA_CONTRAST_LEVELS]
  wcag: (typeof WCAG_CONTRAST_LEVELS)[keyof typeof WCAG_CONTRAST_LEVELS]
}

/**
 * Semantic roles for steps whose generated color is reused as chrome by the UI
 * (e.g. as text color on swatches). Resolved by role rather than by fixed
 * position so the scale stays correct when steps are inserted or reordered.
 */
export type StepRole =
  | 'canvas' // background used behind dialogs / detail surfaces
  | 'heading' // accent color for the color-name heading
  | 'swatch-text-light' // text color drawn on light swatches
  | 'swatch-text-dark' // text color drawn on dark swatches

export interface StepDefinition {
  id: string
  name: string
  /** Id of the group this step belongs to (see PALETTE_GROUPS). */
  groupId: string
  variant?: string
  /** Semantic role, when this step's color is reused as UI chrome. */
  role?: StepRole
  lightValue: number
  darkValue: number
  contrastWith?: ContrastRequirement[]
}

export interface PaletteConfig {
  meanLight: number
  stdDevLight: number
  meanDark: number
  stdDevDark: number
  colors: ColorDefinition[]
  steps: StepDefinition[]
}
