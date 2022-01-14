import { forwardRef, ElementType, ReactElement } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { token as buttonToken } from './tokens'
import { ButtonTokenSet, ButtonToken } from './Button.types'
import {
  typographyTemplate,
  bordersTemplate,
  outlineTemplate,
  spacingsTemplate,
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
  useToken,
} from '@equinor/eds-utils'
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

const Inner = styled.span`
  display: grid;
  grid-gap: var(--eds_button__gap, 8px);
  grid-auto-flow: column;
  align-items: center;
  height: 100%;
  justify-content: center;

  & > :is(svg, img) {
    margin-top: var(--eds_button__icon__margin_y, 0);
    margin-bottom: var(--eds_button__icon__margin_y, 0);
  }
`

const ButtonBase: PolymorphicStyledComponent<ButtonProps, 'button'> = styled(
  'button',
)<ButtonProps>(({ theme }: { theme: ButtonToken }) => {
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
  tabIndex?: number
}

export type ButtonAllProps<C extends ElementType> =
  PolymorphicComponentPropsWithRef<C, ButtonProps>

type ButtonComponent = <C extends ElementType = 'button'>(
  props: ButtonAllProps<C>,
) => ReactElement | null

//TODO can these two styled component types be made fully generic?
//based on solution from https://github.com/kripod/react-polymorphic-box
type PolymorphicStyledComponentProps<E extends ElementType, P> = P &
  ButtonAllProps<E>

type PolymorphicStyledComponent<P, D extends ElementType = 'button'> = <
  E extends ElementType = D,
>(
  props: PolymorphicStyledComponentProps<E, P>,
) => ReactElement | null

export const Button: ButtonComponent = forwardRef(
  <C extends ElementType = 'button'>(
    {
      color = 'primary',
      variant = 'contained',
      children,
      disabled = false,
      href,
      tabIndex = 0,
      fullWidth = false,
      ...other
    }: ButtonAllProps<C>,
    ref: PolymorphicRef<C>,
  ) => {
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
