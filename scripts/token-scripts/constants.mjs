import { PATHS } from '../figma-broker/constants.js'

export const BUILD_DIR = `${PATHS.FIGMA}/readonly`

export const density = {
  TIGHT: 'tight',
  COMPRESSED: 'compressed',
  COMFORTABLE: 'comfortable',
  RELAXED: 'relaxed',
}

export const tokenType = {
  COMPOSITION: 'composition',
  SPACING: 'spacing',
  OTHER: 'other',
}

export const gridResolution = 4
