import { APCA_CONTRAST_LEVELS } from './APCA_CONTRAST_LEVELS'
import { WCAG_CONTRAST_LEVELS } from './WCAG_CONTRAST_LEVELS'
import { ColorDefinition } from '@/types'

export interface ContrastRequirement {
  targetStep: string
  lc: (typeof APCA_CONTRAST_LEVELS)[keyof typeof APCA_CONTRAST_LEVELS]
  wcag: (typeof WCAG_CONTRAST_LEVELS)[keyof typeof WCAG_CONTRAST_LEVELS]
}

export interface StepDefinition {
  id: string
  name: string
  category: 'background' | 'background-medium' | 'background-strong' | 'border' | 'text'
  variant: string
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

