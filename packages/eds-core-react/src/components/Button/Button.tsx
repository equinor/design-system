import { forwardRef, ElementType, ButtonHTMLAttributes } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
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

type Colors = 'primary' | 'secondary' | 'danger'
type Variants = 'contained' | 'outlined' | 'ghost' | 'ghost_icon'

const getVariant = (
  tokenSet: ButtonTokenSet,
  variant: Variants,
): ButtonToken => {
  switch (variant) {
    case 'ghost':
      return { ...tokenSet.ghost, background: 'orange' }
    case 'ghost_icon':
      return {
        ...tokenSet.ghost_icon,
        background: 'lime',
        border: {
          type: 'border',
          width: '1px',
          style: 'solid',
          color: 'maroon',
          radius: '50% !important',
        },
      }
    case 'outlined':
      return {
        ...tokenSet.outlined,
        background: 'yellow',
        height: 'unset',
        spacings: {
          top: 'inherit',
          bottom: 'inherit',
        },
      }
    case 'contained':
    default:
      return {
        ...tokenSet.contained,
        background: 'violet',
        height: 'unset',
        spacings: {
          ...tokenSet.contained.spacings,
          top: 'calc(0.7142em - 1px)', // calc(10px - 1px) - 10/14 (line-height er 1.143em = 16.002px)
          bottom: 'calc(0.7142em - 1px)',
        },
        border: {
          ...tokenSet.contained.border,
          type: 'border',
          radius: '0.2857em', // 4px - 4/14
        },
        minHeight: '0.875rem',
        typography: {
          fontSize: '0.875rem', // 14px - 14/16
        },
        modes: {
          compact: {
            ...tokenSet.contained.modes.compact,
            height: 'unset',
            spacings: {
              ...tokenSet.contained.modes.compact.spacings,
              top: 'calc(0.5714em - 1px)', // calc(8px - 1px) - 8/14
              bottom: 'calc(0.5714em - 1px)',
              left: '1.1428em',
              right: '1.1428em',
            },
          },
        },
      }
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

const Inner = styled.span`
  display: grid;
  grid-gap: 0.5714em; // 8px - (16/14)/2
  grid-auto-flow: column;
  align-items: center;
  height: 100%;
  justify-content: center;

  & > :is(svg, img) {
    margin-top: -4px;
    margin-bottom: -4px;
  }
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

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background: ${hover.background};
        color: ${hover.typography?.color};
        ${bordersTemplate(hover?.border)};
      }
    }

    &:focus {
      outline: none;
    }

    &[data-focus-visible-added]:focus {
      ${outlineTemplate(focus.outline)}
    }
    &:focus-visible {
      ${outlineTemplate(focus.outline)}
    }
    /* Get rid of ff focus border for buttons */
    &::-moz-focus-inner {
      border: 0;
    }

    &:disabled {
      cursor: not-allowed;
      background: ${disabled.background};
      ${bordersTemplate(disabled.border)};
      ${typographyTemplate(disabled.typography)};

      @media (hover: hover) and (pointer: fine) {
        &:hover {
          background: ${disabled.background};
        }
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
    const { density } = useEds()
    const token = useToken({ density }, getToken(variant, color))

    const as: ElementType =
      href && !disabled ? 'a' : other.as ? other.as : 'button'
    const type = href || other.as ? undefined : 'button'

    tabIndex = disabled ? -1 : tabIndex

    const buttonProps = {
      ref,
      as,
      href,
      type,
      disabled,
      tabIndex,
      ...other,
    }

    return (
      <ThemeProvider theme={token}>
        <ButtonBase {...buttonProps}>
          {fullWidth ? (
            <InnerFullWidth>{children}</InnerFullWidth>
          ) : (
            <Inner>{children}</Inner>
          )}
        </ButtonBase>
      </ThemeProvider>
    )
  },
)
