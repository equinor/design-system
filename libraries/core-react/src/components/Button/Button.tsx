import { forwardRef, ElementType, ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { token as buttonToken } from './tokens'
import { ButtonTokenSet, ButtonToken } from './Button.types'
import {
  typographyTemplate,
  bordersTemplate,
  outlineTemplate,
  spacingsTemplate,
} from '../../utils'
import { InnerFullWidth } from './InnerFullWidth'
import { useEds } from '../EdsProvider'

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

const ButtonInner = styled.span`
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  align-items: center;
  height: 100%;
  justify-content: center;
`

const Base = ({ token, density }: { token: ButtonToken; density: string }) => {
  const { spacings, states } = token
  const { focus, hover, disabled } = states

  let height = token.height
  let width = token.width
  let clickbound = token.clickbound

  if (density === 'compact') {
    height = token.modes.compact.height
    width = token.modes.compact.width
    clickbound = token.modes.compact.clickbound
  }

  return css`
    background: ${token.background};
    height: ${height};
    width: ${width};
    svg {
      justify-self: center;
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
  /** FullWidth (stretched) button  */
  fullWidth?: boolean
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
      fullWidth = false,
      ...other
    },
    ref,
  ) {
    const token = getToken(variant, color)
    const { density } = useEds()
    const as: ElementType =
      href && !disabled ? 'a' : other.as ? other.as : 'button'
    const type = href || other.as ? undefined : 'button'

    tabIndex = disabled ? -1 : tabIndex

    const buttonProps = {
      ref,
      as,
      href,
      type,
      token,
      disabled,
      tabIndex,
      density,
      ...other,
    }

    return (
      <ButtonBase {...buttonProps}>
        {fullWidth ? (
          <InnerFullWidth>{children}</InnerFullWidth>
        ) : (
          <ButtonInner>{children}</ButtonInner>
        )}
      </ButtonBase>
    )
  },
)
