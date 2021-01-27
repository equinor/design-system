import * as React from 'react'
import { forwardRef, ElementType, ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { token as buttonToken } from './tokens'
import { ButtonTokenSet, ButtonToken } from './Button.types'
import {
  typographyTemplate,
  bordersTemplate,
  outlineTemplate,
  spacingsTemplate,
} from '@utils'

type Colors = 'primary' | 'secondary' | 'danger'
type Variants = 'contained' | 'outlined' | 'ghost' | 'ghost_icon'

const getVariant = (
  tokenSet: ButtonTokenSet,
  variant: Variants,
): ButtonToken => {
  switch (variant) {
    case 'ghost':
      return tokenSet.ghost
    case 'ghost_icon':
      return tokenSet.ghost_icon
    case 'outlined':
      return tokenSet.outlined
    case 'contained':
    default:
      return tokenSet.contained
  }
}

const getToken = (variant: Variants, color: Colors): ButtonToken => {
  switch (color) {
    case 'danger':
      return getVariant(buttonToken.danger, variant)
    case 'secondary':
      return getVariant(buttonToken.secondary, variant)
    case 'primary':
    default:
      return getVariant(buttonToken.primary, variant)
  }
}

const ButtonInnerText = styled.span`
  text-align: center;
  grid-area: center;
`

const ButtonInner = styled.span<{ isIcon: boolean }>`
  height: 100%;
  display: grid;
  align-items: center;
  grid-template-columns: ${({ isIcon }) => (isIcon ? 'auto' : '24px 1fr 24px')};
  grid-gap: 8px;
  grid-template-areas: 'left center right';

  > img:nth-child(1),
  > svg:nth-child(1) {
    grid-area: left;
  }

  > img:nth-child(n + 2),
  > svg:nth-child(n + 2) {
    grid-area: right;
  }
  > img:only-child,
  > svg:only-child {
    grid-area: center;
  }
`

const Base = ({ token }: { token: ButtonToken }) => {
  const { spacings, states, clickbound, entities } = token
  const { focus, hover, disabled } = states

  return css`
    background: ${token.background};
    height: ${token.height};
    width: ${token.width};
    svg {
      justify-self: center;
      height: ${entities?.icon?.height};
      width: ${entities?.icon?.width};
    }

    ${spacingsTemplate(spacings)}
    ${bordersTemplate(token.border)}
    ${typographyTemplate(token.typography)}

    &::after {
      position: absolute;
      top: -${clickbound?.offset?.top};
      left: -${clickbound?.offset?.left};
      width: ${clickbound?.width};
      height: ${clickbound?.height};
      content: '';
    }

    &:hover {
      background: ${hover.background};
      color: ${hover.typography?.color};
      ${bordersTemplate(hover?.border)}
    }

    &:focus {
      outline: none;
    }

    &[data-focus-visible-added]:focus {
      ${outlineTemplate(focus.outline)}
    }
    /* Get rid of ff focus border for buttons */
    &::-moz-focus-inner {
      border: 0;
    }

    &:disabled {
      cursor: not-allowed;
      background: ${disabled.background};
      ${bordersTemplate(disabled.border)}
      ${typographyTemplate(disabled.typography)}

      &:hover {
        background: ${disabled.background};
      }
    }
  `
}

const ButtonBase = styled.button`
  margin: 0;
  padding: 0;
  ${Base}
  text-decoration: none;
  position: relative;
  cursor: pointer;
  display: inline-block;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: auto;
    min-height: auto;
    content: '';
  }
`
export type ButtonProps = {
  /**  Specifies color */
  color?: 'primary' | 'secondary' | 'danger'
  /** Specifies which variant to use */
  variant?: 'contained' | 'outlined' | 'ghost' | 'ghost_icon'
  /**
   * URL link destination
   * If defined, an 'a' element is used as root instead of 'button'
   */
  href?: string
  /** Is the button disabled */
  disabled?: boolean
  /** Change html element. */
  as?: ElementType
  /** Type of button
   * @default 'button'
   */
  type?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      color = 'primary',
      variant = 'contained',
      children,
      disabled = false,
      href,
      tabIndex = 0,
      ...other
    },
    ref,
  ) {
    const token = getToken(variant, color)

    const as: ElementType = href ? 'a' : other.as ? other.as : 'button'
    const type = href || other.as ? undefined : 'button'
    tabIndex = disabled ? -1 : tabIndex
    const isIcon = variant === 'ghost_icon'

    const buttonProps = {
      ref,
      as,
      href,
      type,
      token,
      disabled,
      tabIndex,
      ...other,
    }

    // We need everything in elements for proper flexing 💪
    const updatedChildren = React.Children.map(children, (child) =>
      typeof child === 'string' ? (
        <ButtonInnerText>{child}</ButtonInnerText>
      ) : (
        child
      ),
    )

    return (
      <ButtonBase {...buttonProps}>
        <ButtonInner isIcon={isIcon}>{updatedChildren}</ButtonInner>
      </ButtonBase>
    )
  },
)

// Button.displayName = 'Button'
