import React, {
  forwardRef,
  ElementType,
  ButtonHTMLAttributes,
  createElement,
} from 'react'
import clsx from 'clsx'
import { InnerFullWidth } from './InnerFullWidth'
import { useEds } from '../EdsProvider'
import './button.css'
import './button.inner.css'

type Colors = 'primary' | 'secondary' | 'danger'
type Variants = 'contained' | 'outlined' | 'ghost' | 'ghost_icon'
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

    const as: ElementType =
      href && !disabled ? 'a' : other.as ? other.as : 'button'
    // const type = href || other.as ? undefined : 'button'

    const classNames = clsx([
      'eds-btn',
      'eds-typography-navigation__btn',
      getColorClass(color),
      getVariantClass(variant),
      getDensityClass(density),
      other.className,
    ])

    const buttonProps = {
      ref,
      as,
      href,
      disabled,
      tabIndex,
      className: classNames,
      ...other,
    }

    return createElement(as, buttonProps, [
      fullWidth ? (
        <InnerFullWidth key="inner-full-width">{children}</InnerFullWidth>
      ) : (
        <span className="eds-btn-inner" key="inner">
          {children}
        </span>
      ),
    ])
  },
)
