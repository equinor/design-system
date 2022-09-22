import {
  forwardRef,
  ElementType,
  ButtonHTMLAttributes,
  createElement,
} from 'react'
import { clsx } from 'clsx'
import { InnerFullWidth } from './InnerFullWidth'
import { useEds } from '@equinor/eds-core-react'
import './button.css'
//** Injecting root css properties needs to be solved */
import '@equinor/eds-tokens/tokens.css'

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
  /** FullWidth (stretched) button  */
  fullWidth?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export const CSSButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      color = 'primary',
      variant = 'contained',
      children,
      disabled = false,
      href,
      tabIndex = 0,
      fullWidth = false,
      className,
      ...other
    },
    ref,
  ) {
    const { density } = useEds()

    const as: ElementType =
      href && !disabled ? 'a' : other.as ? other.as : 'button'
    // const type = href || other.as ? undefined : 'button'

    const classNames: string = clsx([
      'eds-typography-navigation__btn',
      'eds-btn',
      color,
      variant,
      density,
      className,
    ])

    const buttonProps = {
      ref,
      href,
      disabled,
      tabIndex,
      className: classNames,
      ...other,
    }

    return createElement(
      as,
      buttonProps,
      fullWidth ? (
        <InnerFullWidth>{children}</InnerFullWidth>
      ) : (
        <span className="eds-btn-inner">{children}</span>
      ),
    )
  },
)
