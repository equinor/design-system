import { css } from 'styled-components'
import type { FlattenSimpleInterpolation } from 'styled-components'
import type {
  Typography,
  Border,
  Spacing,
  Borders,
  Outline,
} from '@equinor/eds-tokens'

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

const shorthand = ({ width, style, color }: Border | Outline): string =>
  `${width} ${style} ${color}`

export const bordersTemplate = (border: Borders): StyledCSS => {
  switch (border.type) {
    case 'border':
      return css({
        border: shorthand(border),
        borderRadius: border.radius,
      })
    case 'outline':
      return css({
        outline: shorthand(border),
        outlineOffset: border.offset,
      })
    case 'bordergroup':
      const {
        left: { radius: leftRadius },
        right: { radius: rightRadius },
      } = border
      return css({
        borderBottom: shorthand(border.bottom),
        borderTop: shorthand(border.top),
        borderLeft: shorthand(border.left),
        borderRight: shorthand(border.right),
        borderBottomLeftRadius: leftRadius,
        borderTopLeftRadius: leftRadius,
        borderBottomRightRadius: rightRadius,
        borderTopRightRadius: rightRadius,
      })
  }
}

export const boxshadowTemplate = (border: Border): StyledCSS =>
  css({
    boxShadow: `inset 0 -${border.width} 0 0 ${border.color};`,
  })
