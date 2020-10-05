import React, { forwardRef, ElementType } from 'react'
import styled, { css } from 'styled-components'
import { typographyTemplate } from '../_common/templates'
import {
  quickVariants,
  colors,
  typography,
  TypographyVariants,
  ColorVariants,
  TypographyGroups,
} from './Typography.tokens'
import type { Typography as TypographyType } from '@equinor/eds-tokens'

const getElementType = (variant: string, link: boolean): ElementType => {
  if (link) {
    return 'a'
  }
  switch (variant) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return variant
    case 'caption':
    case 'overline':
    case 'ingress':
    case 'meta':
    case 'body_short':
    case 'body_long':
    default:
      return 'p'
  }
}

const findTypography = (
  variantName: TypographyVariants,
  group?: TypographyGroups,
): TypographyType => {
  // For quick use when using paragraphs and headings we can skip group
  if (!group && quickVariants[variantName]) {
    return quickVariants[variantName] as TypographyType
  }
  return (typography[group] as unknown)[variantName] as TypographyType
}

const findColor = (inputColor: ColorVariants): string =>
  typeof colors[inputColor] === 'undefined' ? inputColor : colors[inputColor]

const toVariantName = (
  variant: TypographyVariants,
  bold = false,
  italic = false,
  link = false,
) =>
  `${variant}${bold ? '_bold' : ''}${italic ? '_italic' : ''}${
    link ? '_link' : ''
  }`

type StyledProps = {
  typography: Partial<TypographyType>
  link: boolean
  color: ColorVariants
  lines: number
}

const StyledTypography = styled.p<StyledProps>`
  ${({ typography, link }) => typographyTemplate(typography, link)}
  ${({ color }) => css({ color: findColor(color) })}
  ${({ lines }) =>
    //https://caniuse.com/#feat=css-line-clamp
    lines > 0 &&
    css`
      & {
        display: -webkit-box;
        -webkit-line-clamp: ${lines};
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `}
`
type Props = {
  variant?: TypographyVariants
  group?: TypographyGroups
  bold?: boolean
  italic?: boolean
  link?: boolean
  color?: ColorVariants
  token?: Partial<TypographyType>
  lines?: number
  as?: ElementType
} & React.HTMLAttributes<HTMLElement>

export const Typography = forwardRef<HTMLElement, Props>(function EdsTypography(
  {
    variant = 'body_short',
    children,
    bold,
    italic,
    link,
    group,
    token,
    as: providedAs,
    ...other
  },
  ref,
) {
  const as: ElementType = providedAs
    ? providedAs
    : getElementType(variant, link)

  const variantName = toVariantName(
    variant,
    bold,
    italic,
    link,
  ) as TypographyVariants

  const typography = findTypography(variantName, group)

  if (typeof typography === 'undefined') {
    throw new Error(
      `Typography variant not found for variant "${variantName}" ("${variant}") & group "${
        group || ''
      }"`,
    )
  }

  return (
    <StyledTypography
      as={as}
      typography={{ ...typography, ...token }}
      link={link}
      ref={ref}
      {...other}
    >
      {children}
    </StyledTypography>
  )
})

// Typography.propTypes = {
//   /** @ignore */
//   className: PropTypes.string,
//   /** @ignore */
//   children: PropTypes.node,
//   /** Specifies which variant to use */
//   variant: PropTypes.oneOf(variantNames),
//   /** Specifices which typography group to use  */
//   group: PropTypes.oneOf(groupNames),
//   /** Specifies if text should be bold */
//   bold: PropTypes.bool,
//   /** Specifies if text should be italic */
//   italic: PropTypes.bool,
//   /** Specifies if text should be a link */
//   link: PropTypes.bool,
//   /** Specifies which color to use */
//   color: PropTypes.oneOfType([PropTypes.oneOf(colorNames), PropTypes.string]),
//   /** Specifies which typography token to use */
//   token: PropTypes.object,
//   /** Specifies how many lines of text are shown */
//   lines: PropTypes.number,
// }

Typography.displayName = 'eds-typography'
