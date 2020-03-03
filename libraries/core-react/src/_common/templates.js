import { css } from 'styled-components'

export const typographyTemplate = (typography, isLink) => css`
  margin: 0;
  color: ${typography.color};
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize};
  font-weight: ${typography.fontWeight};
  line-height: ${typography.lineHeight};
  font-style: ${typography.fontStyle};
  letter-spacing: ${typography.letterSpacing};
  text-transform: ${typography.textTransform};
  text-decoration: ${typography.textDecoration};
  font-feature-settings: ${typography.fontFeature};
  ${isLink && `cursor: pointer;`}
`

export const spacingsTemplate = (spacings) => css`
  padding-left: ${spacings.left};
  padding-right: ${spacings.right};
  padding-top: ${spacings.top};
  padding-bottom: ${spacings.bottom};
`

export const bordersTemplate = (border) => css`
  border-radius: ${border.radius};
  border-color: ${border.color};
  border-width: ${border.width};
`
