import React, { forwardRef, ElementType, ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { button, Button as ButtonType, ButtonGroups } from './Button.tokens'
import { typographyTemplate } from '../_common/templates'

const { colors } = button

// display:grid; does not work on Webkit browser engine, so we have to wrap content in element where css-grid works
const ButtonInner = styled.span`
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  align-items: center;
  height: 100%;
`

const Base = ({
  token,
  disabledToken,
}: {
  token: ButtonType
  disabledToken: ButtonType
}) => {
  const { border, spacing, typography, focus, hover } = token

  return css`
    background: ${token.background};
    height: ${token.height};
    width: ${token.width};
    color: ${token.color};
    fill: ${token.color};
    svg {
      justify-self: center;
      height: ${button.icon_size.height};
      width: ${button.icon_size.width};
    }

    border-radius: ${border.radius};
    border-color: ${border.color};
    border-width: ${border.width};
    border-style: solid;

    ${spacing &&
    css`
      padding-left: ${spacing.left};
      padding-right: ${spacing.right};
    `}

    ${typographyTemplate(typography)}
    &::after {
      position: absolute;
      top: -${token.clickboundOffset};
      left: 0;
      width: 100%;
      height: ${token.clickbound};
      content: '';
    }

    &:hover {
      background: ${hover.background};
      ${hover.radius &&
      css`
        border-radius: ${hover.radius};
      `}
    }

    &:focus {
      outline: none;
    }

    &[data-focus-visible-added]:focus {
      outline: ${focus.width} ${focus.type} ${focus.color};
      outline-offset: 2px;
    }
    /* Get rid of ff focus border for buttons */
    &::-moz-focus-inner {
      border: 0;
    }

    &:disabled {
      cursor: not-allowed;
      background: ${disabledToken.background};
      color: ${disabledToken.color};
      fill: ${disabledToken.color};
      border-color: ${disabledToken.border.color};

      &:hover {
        background: ${disabledToken.background};
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
  /** Type of button */
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
      ...other
    },
    ref,
  ) {
    const colorBase: ButtonGroups | Partial<ButtonGroups> = colors[color] || {}
    const token = colorBase[variant] || {}
    const disabledToken = colors.disabled[variant] || {}

    const as: ElementType = href ? 'a' : other.as ? other.as : 'button'
    const type = href || other.as ? undefined : 'button'
    const tabIndex = disabled ? -1 : other.tabIndex

    const buttonProps = {
      ref,
      as,
      href,
      type,
      token,
      disabledToken,
      disabled,
      tabIndex,
      ...other,
    }

    return (
      <ButtonBase {...buttonProps}>
        <ButtonInner>{children}</ButtonInner>
      </ButtonBase>
    )
  },
)

// Button.displayName = 'Button'
