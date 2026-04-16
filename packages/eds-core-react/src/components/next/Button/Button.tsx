import { forwardRef } from 'react'
import type { ButtonProps } from './Button.types'
import { TypographyNext } from '../../Typography'
import { Slot } from '../Slot'

const SIZE_MAPPING = {
  small: 'sm',
  default: 'md',
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
      asChild,
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

    const sharedProps = {
      ref,
      className: classes,
      disabled,
      'data-variant': variant,
      'data-selectable-space': selectableSpace,
      'data-space-proportions': 'squished' as const,
      'data-color-appearance': disabled ? 'neutral' : tone,
      'data-icon-only': icon || undefined,
      'data-round': icon && round ? true : undefined,
      ...rest,
    }

    if (asChild) {
      return <Slot {...sharedProps}>{children}</Slot>
    }

    return (
      <button type={type} {...sharedProps}>
        {icon ? (
          children
        ) : (
          <TypographyNext
            as="span"
            className="eds-button__label"
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
