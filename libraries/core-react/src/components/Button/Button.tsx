import { forwardRef, ElementType, ButtonHTMLAttributes } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import clsx from 'clsx'
import { token as buttonToken } from './tokens'
import { ButtonTokenSet, ButtonToken } from './Button.types'
import {
  typographyTemplate,
  bordersTemplate,
  outlineTemplate,
  spacingsTemplate,
} from '../../utils'
import { useToken } from '../../hooks'
import { InnerFullWidth } from './InnerFullWidth'
import { useEds } from '../EdsProvider'
import './button.css'

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

const getVariantClass = (variant: Variants): string =>
  `eds-btn--${variant.replace('_', '-')}`

const getColorClass = (color: Colors): string =>
  `eds-btn--${color.replace('_', '-')}`

const getDensityClass = (density: string): string => {
  if (density === 'compact') {
    return `eds-btn--compact`
  }
  return ''
}

const Inner = styled.span`
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  align-items: center;
  height: 100%;
  justify-content: center;
`

const ButtonBase = styled.button(({ theme }: { theme: ButtonToken }) => {
  const { states, clickbound } = theme
  const { focus, hover, disabled } = states

  return css`
    margin: 0;
    padding: 0;
    text-decoration: none;
    position: relative;
    cursor: pointer;
    display: inline-block;
    background: ${theme.background};
    height: ${theme.height};
    width: ${theme.width};

    svg {
      justify-self: center;
    }

    ${spacingsTemplate(theme.spacings)}
    ${bordersTemplate(theme.border)}
    ${typographyTemplate(theme.typography)}

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: auto;
      min-height: auto;
      content: '';
    }

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
})

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
  // type?: string
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
    const { density } = useEds()
    const token = useToken({ density }, getToken(variant, color))()

    const as: ElementType =
      href && !disabled ? 'a' : other.as ? other.as : 'button'
    // const type = href || other.as ? undefined : 'button'

    tabIndex = disabled ? -1 : tabIndex

    const buttonProps = {
      ref,
      as,
      href,
      // type,
      disabled,
      tabIndex,
      ...other,
    }

    const classNames = clsx([
      'eds-btn',
      'eds-typography-navigation__btn',
      getColorClass(color),
      getVariantClass(variant),
      getDensityClass(density),
    ])

    return (
      <ThemeProvider theme={token}>
        <button {...buttonProps} className={classNames}>
          {fullWidth ? (
            <InnerFullWidth>{children}</InnerFullWidth>
          ) : (
            <Inner>{children}</Inner>
          )}
        </button>
      </ThemeProvider>
    )
  },
)
