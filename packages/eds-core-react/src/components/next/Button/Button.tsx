import { forwardRef } from 'react'
import type { ButtonProps } from './Button.types'
import { TypographyNext } from '../../Typography'

const SIZE_MAPPING = {
  small: 'sm',
  default: 'md',
  large: 'lg',
} as const

const sizeToTypography = SIZE_MAPPING
const sizeToSelectableSpace = SIZE_MAPPING

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'default',
      tone = 'accent',
      icon = false,
      round = false,
      children,
      className,
      disabled,
      type = 'button',
      ...rest
    },
    ref,
  ) {
    const classes = ['eds-button', className].filter(Boolean).join(' ')
    const typographySize = sizeToTypography[size]
    const selectableSpace = sizeToSelectableSpace[size]

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        data-variant={variant}
        data-selectable-space={selectableSpace}
        data-space-proportions="squished"
        data-color-appearance={disabled ? 'neutral' : tone}
        data-icon-only={icon || undefined}
        data-round={icon && round ? true : undefined}
        {...rest}
      >
        {icon ? (
          children
        ) : (
          <TypographyNext
            as="span"
            family="ui"
            size={typographySize}
            lineHeight="squished"
            baseline="center"
          >
            {children}
          </TypographyNext>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
