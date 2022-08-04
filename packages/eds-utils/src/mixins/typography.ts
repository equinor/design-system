import { CSSObject } from 'styled-components'
import type { Typography } from '@equinor/eds-tokens'

/** Simpler version `typographyTemplate` that does not set `color` and `margin` */
export const typographyMixin = (typography: Partial<Typography>): CSSObject => {
  const {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    fontFeature,
    textDecoration,
    textTransform,
    fontStyle,
  } = typography
  return {
    fontFeatureSettings: fontFeature,
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    lineHeight,
    textDecoration,
    textTransform: textTransform as CSSObject['textTransform'],
    fontStyle,
  }
}
