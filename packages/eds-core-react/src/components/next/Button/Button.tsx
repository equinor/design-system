import { forwardRef } from 'react'
import { TypographyNext } from '../../Typography'
import { ButtonProps } from './Button.types'
import './button.css'

/**
 * Button component for user interactions.
 *
 * Supports three variants (primary, outline, ghost), three sizes (small, default, large),
 * and three color appearances (accent, neutral, danger) through `data-color-appearance`.
 *
 * @example
 * ```tsx
 * import { Button } from '@equinor/eds-core-react/next'
 *
 * <Button variant="primary" colorAppearance="accent">
 *   Save
 * </Button>
 *
 * <Button variant="outline" size="large" colorAppearance="danger">
 *   Delete
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
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
  ) => {
    const classNames = ['eds-button', `eds-button__${variant}`, className]
      .filter(Boolean)
      .join(' ')

    const buttonSize = size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md'

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        data-color-appearance={colorAppearance}
        data-space-proportions="squished"
        data-selectable-space={buttonSize}
        disabled={disabled}
        {...rest}
      >
        {iconStart}
        {children && (
          <TypographyNext as="span" family="ui" size="md" baseline="center">
            {children}
          </TypographyNext>
        )}
        {iconEnd}
      </button>
    )
  },
)

Button.displayName = 'Button'
