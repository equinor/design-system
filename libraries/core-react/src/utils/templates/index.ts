import { css } from 'styled-components'
import type { FlattenSimpleInterpolation } from 'styled-components'
import type { Typography, Border, Spacing } from '@equinor/eds-tokens'

export * from './borders'
export * from './focus'

type StyledCSS = FlattenSimpleInterpolation

export const typographyTemplate = (
  typography: Partial<Typography>,
  link?: boolean,
): string => {
  if (!typography) {
    return ''
  }
  let base = `
  margin: 0;
  color: ${typography.color};
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize};
  font-weight: ${typography.fontWeight};
  line-height: ${typography.lineHeight};
  `

  if (typography.fontStyle) {
    base += `\nfont-style: ${typography.fontStyle};`
  }
  if (typography.letterSpacing) {
    base += `\nletter-spacing: ${typography.letterSpacing};`
  }
  if (typography.textTransform) {
    base += `\ntext-transform: ${typography.textTransform};`
  }
  if (typography.textDecoration) {
    base += `\ntext-decoration: ${typography.textDecoration};`
  }
  if (typography.textAlign) {
    base += `\ntext-align: ${typography.textAlign};`
  }
  if (typography.fontFeature) {
    base += `\nfont-feature-settings: ${typography.fontFeature};`
  }
  if (link) {
    base += `\ncursor: pointer;`
  }

  return base
}

export const spacingsTemplate = (spacings: Spacing): StyledCSS => css`
  padding-left: ${spacings.left};
  padding-right: ${spacings.right};
  padding-top: ${spacings.top};
  padding-bottom: ${spacings.bottom};
`

export const boxshadowTemplate = (border: Border): StyledCSS =>
  css({
    boxShadow: `inset 0 -${border.width} 0 0 ${border.color};`,
  })
