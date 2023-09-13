import { StyledObject } from 'styled-components'
import type { Typography } from '@equinor/eds-tokens'

/** Simpler version `typographyTemplate` that does not set `color` and `margin` */
export const typographyMixin = (
  typography: Partial<Typography>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): StyledObject<any> => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    textTransform: textTransform as StyledObject<any>['textTransform'],
    fontStyle,
  }
}
