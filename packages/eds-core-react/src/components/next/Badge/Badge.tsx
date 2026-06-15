import { forwardRef } from 'react'
import type { BadgeProps } from './Badge.types'

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    tone = 'neutral',
    emphasis = 'low',
    variant = 'solid',
    children,
    className,
    ...rest
  },
  ref,
) {
  const classes = ['eds-badge', className].filter(Boolean).join(' ')

  return (
    <span
      ref={ref}
      className={classes}
      data-color-appearance={tone}
      data-emphasis={emphasis}
      data-variant={variant}
      {...rest}
    >
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'
