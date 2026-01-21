import { forwardRef } from 'react'
import { TypographyNext } from '../../Typography'
import type { ButtonProps } from './Button.types'
import './button.css'

const sizeToSelectableSpace = {
  small: 'sm',
  default: 'md',
  large: 'lg',
} as const

const sizeToTypographySize = {
  small: 'md',
  default: 'lg',
  large: 'xl',
} as const

/**
 * Button component for triggering actions.
 *
 * Supports three variants (primary, outline, ghost), three sizes (small, default, large),
 * and three color appearances (accent, neutral, danger) through `data-color-appearance`.
 *
 * @example
 * ```tsx
 * import { Button } from '@equinor/eds-core-react/next'
 *
 * // Primary button
 * <Button variant="primary">Submit</Button>
 *
 * // Outline button with icon
 * <Button variant="outline" iconStart={<Icon data={add} />}>
 *   Add item
 * </Button>
 *
 * // Danger ghost button
 * <Button variant="ghost" colorAppearance="danger">
 *   Delete
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'default',
      colorAppearance = 'accent',
      iconStart,
      iconEnd,
      children,
      className,
      disabled,
      type = 'button',
      ...rest
    },
    ref,
  ) {
    const classes = ['eds-button', className].filter(Boolean).join(' ')

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        data-variant={variant}
        data-color-appearance={disabled ? 'neutral' : colorAppearance}
        data-selectable-space={sizeToSelectableSpace[size]}
        data-space-proportions="squished"
        data-font-size={sizeToTypographySize[size]}
        {...rest}
      >
        {iconStart && (
          <span className="eds-button__icon" aria-hidden="true">
            {iconStart}
          </span>
        )}
        {children && (
          <TypographyNext
            as="span"
            family="ui"
            size={sizeToTypographySize[size]}
            baseline="center"
          >
            {children}
          </TypographyNext>
        )}
        {iconEnd && (
          <span className="eds-button__icon" aria-hidden="true">
            {iconEnd}
          </span>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
