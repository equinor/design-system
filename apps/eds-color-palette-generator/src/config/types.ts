import { APCA_CONTRAST_LEVELS } from './APCA_CONTRAST_LEVELS'
import { WCAG_CONTRAST_LEVELS } from './WCAG_CONTRAST_LEVELS'
import { ColorDefinition } from '@/types'

export interface ContrastRequirement {
  targetStep: string
  lc: (typeof APCA_CONTRAST_LEVELS)[keyof typeof APCA_CONTRAST_LEVELS]
  wcag: (typeof WCAG_CONTRAST_LEVELS)[keyof typeof WCAG_CONTRAST_LEVELS]
  /** The Tokens Studio pairing this requirement checks, for display */
  pairing: string
}

/**
 * The first segment of the step's main semantic role in Tokens Studio, or
 * `unused` for the steps no semantic token references (6 and 14).
 */
export type StepCategory = 'background' | 'border' | 'text' | 'unused'

export interface StepDefinition {
  /** 1-based step number, as in the Tokens Studio primitive `accent.9` */
  step: number
  id: string
  name: string
  /** Short label for the step's main role, e.g. `emphasis hover` */
  label: string
  /** The Tokens Studio semantic role this step is named after */
  primaryRole: string | null
  /** Every Tokens Studio semantic role that references this step */
  roles: string[]
  category: StepCategory
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
