import { forwardRef, Children } from 'react'
import type { ButtonProps } from './Button.types'

const SIZE_MAPPING = {
  small: 'sm',
  default: 'md',
  large: 'lg',
} as const

const sizeToSelectableSpace = SIZE_MAPPING

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'default',
      tone = 'accent',
      icon = false,
      round = false,
      multiline = false,
      children,
      className,
      disabled,
      type = 'button',
      ...rest
    },
    ref,
  ) {
    const classes = ['eds-button', className].filter(Boolean).join(' ')
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
        data-multiline={multiline || undefined}
        {...rest}
      >
        {Children.map(children, (child) =>
          typeof child === 'string' || typeof child === 'number' ? (
            <span className="eds-button__label">{child}</span>
          ) : (
            child
          ),
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
