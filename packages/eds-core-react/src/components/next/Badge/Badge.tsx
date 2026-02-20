import { forwardRef } from 'react'
import { Icon } from '../Icon'
import type { BadgeProps, BadgeSemanticColor } from './Badge.types'
import './badge.css'

const SEMANTIC_COLORS = new Set<string>([
  'neutral',
  'accent',
  'danger',
  'warning',
  'info',
  'success',
])

const isSemanticColor = (color: string): color is BadgeSemanticColor =>
  SEMANTIC_COLORS.has(color)

/**
 * Badge is a non-interactive component for displaying short pieces of
 * information that require more visual emphasis than plain text.
 *
 * If you need interactivity (click, select, delete), use the Chip component
 * instead.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    children,
    size = 'md',
    emphasis = 'primary',
    color = 'neutral',
    icon,
    className,
    ...rest
  },
  ref,
) {
  const semanticColor = isSemanticColor(color)
  const colorAppearance = semanticColor ? color : 'neutral'

  const classes = ['eds-badge', className].filter(Boolean).join(' ')

  return (
    <span
      ref={ref}
      className={classes}
      data-size={size}
      data-emphasis={emphasis}
      data-color-appearance={colorAppearance}
      {...(!semanticColor && {
        'data-badge-color': color,
        'data-colored': '',
      })}
      {...rest}
    >
      {icon && (
        <Icon
          data={icon}
          size="xs"
          className="eds-badge__icon"
          aria-hidden
        />
      )}
      <span className="eds-badge__text">{children}</span>
    </span>
  )
})
