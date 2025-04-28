import {
  forwardRef,
  ElementType,
  HTMLAttributes,
  AnchorHTMLAttributes,
  ReactNode,
} from 'react'
import styled, { css } from 'styled-components'
import {
  typographyTemplate,
  outlineTemplate,
  OverridableComponent,
} from '@equinor/eds-utils'
import {
  quickVariants,
  colors,
  typography,
  TypographyVariants,
  ColorVariants,
  TypographyGroups,
  link as linktokens,
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

  if (!group) {
    throw new Error(`Group is required for variant ${variantName}`)
  }

  const typographyGroup = typography[group]
  if (!typographyGroup) {
    throw new Error(`Typography group "${group}" not found`)
  }

  const variant = typographyGroup[variantName] as TypographyType
  if (!variant) {
    throw new Error(
      `Typography variant "${variantName}" not found in group "${group}"`,
    )
  }

  return variant
}

const findColor = (
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  inputColor: ColorVariants | string | undefined = undefined,
): string => {
  if (inputColor === undefined || inputColor === null) {
    return ''
  }

  return typeof colors[inputColor as ColorVariants] === 'undefined'
    ? inputColor
    : colors[inputColor as ColorVariants]
}

const toVariantName = (
  variant: TypographyVariants,
  bold: boolean = false,
  italic: boolean = false,
  link: boolean = false,
): TypographyVariants => {
  const variantName =
    `${variant}${bold ? '_bold' : ''}${italic ? '_italic' : ''}${
      link ? '_link' : ''
    }` as TypographyVariants

  return variantName
}

type StyledProps = {
  $typography: Partial<TypographyType>
  $link: boolean
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  $color: ColorVariants | string | undefined
  $lines: number | undefined
}

const StyledTypography = styled.p<StyledProps>`
  ${({ $typography, $link }) => typographyTemplate($typography, $link)}
  ${({ $color }) => $color && css({ color: findColor($color) })}
  ${({ $lines }) =>
    $lines &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: ${$lines};
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
  ${({ $link }) =>
    $link &&
    css`
      &:focus {
        outline: none;
      }
      &[data-focus-visible-added]:focus {
        ${outlineTemplate(linktokens.states.focus.outline)}
      }
      &:focus-visible {
        ${outlineTemplate(linktokens.states.focus.outline)}
      }
    `}
`

export type TypographyProps = {
  /** Typography variants, specifies which variant to use. */
  variant?: TypographyVariants
  /** Typography groups, specifies which group to use. */
  group?: TypographyGroups
  /** Bold text. */
  bold?: boolean
  /** Italic text. */
  italic?: boolean
  /** Link. */
  link?: boolean
  /** Typography colors. */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  color?: ColorVariants | string
  /** Token. */
  token?: Partial<TypographyType>
  /** Number of lines. */
  lines?: number
  /** Children content */
  children?: ReactNode
} & (HTMLAttributes<HTMLElement> | AnchorHTMLAttributes<HTMLAnchorElement>)

export const Typography: OverridableComponent<TypographyProps, HTMLElement> =
  forwardRef(function Typography(
    {
      variant = 'body_short',
      children,
      bold = false,
      italic = false,
      link = false,
      lines,
      color,
      group,
      token,
      as: providedAs,
      ...other
    },
    ref,
  ) {
    const as: ElementType = providedAs
      ? providedAs
      : getElementType(variant, !!link)

    const variantName = toVariantName(variant, !!bold, !!italic, !!link)

    const typographyToken = findTypography(variantName, group)

    if (typeof typographyToken === 'undefined') {
      throw new Error(
        `Typography variant not found for variant "${variantName}" ("${variant}") & group "${
          group || ''
        }"`,
      )
    }

    return (
      <StyledTypography
        as={as}
        $typography={{ ...typographyToken, ...token }}
        $link={!!link}
        $lines={lines}
        ref={ref}
        $color={color}
        {...other}
      >
        {children}
      </StyledTypography>
    )
  })

// Typography.displayName = 'EdsTypography';
