import type { HTMLAttributes, ReactNode } from 'react'
import type { IconData } from '@equinor/eds-icons'

/** Badge sizes */
export type BadgeSize = 'md' | 'sm' | 'xs'

/** Visual emphasis level */
export type BadgeEmphasis = 'primary' | 'secondary'

/** Semantic color tones resolved via the dynamic token system */
export type BadgeSemanticColor =
  | 'neutral'
  | 'accent'
  | 'danger'
  | 'warning'
  | 'info'
  | 'success'

/** Data-visualization colors from the EDS infographic palette */
export type BadgeDatavizColor =
  | 'moss-green'
  | 'energy-red'
  | 'weathered-red'
  | 'slate-blue'
  | 'spruce-wood'
  | 'mist-blue'
  | 'lichen-green'
  | 'purple-berry'
  | 'pink-rose'
  | 'pink-salmon'
  | 'green-cucumber'
  | 'green-succulent'
  | 'green-mint'
  | 'blue-ocean'
  | 'blue-overcast'
  | 'blue-sky'

/** All available badge colors */
export type BadgeColor = BadgeSemanticColor | BadgeDatavizColor

export type BadgeProps = {
  /** Badge content */
  children: ReactNode
  /**
   * Size of the badge.
   * - `md` (default): 20 px height
   * - `sm`: 16 px height
   * - `xs`: 12 px height
   * @default 'md'
   */
  size?: BadgeSize
  /**
   * Visual emphasis level.
   * - `primary`: strong filled background with high-contrast text
   * - `secondary`: subtle muted background with coloured text
   * @default 'primary'
   */
  emphasis?: BadgeEmphasis
  /**
   * Colour of the badge. Supports semantic tones that integrate with
   * the EDS dynamic token system, plus data-visualisation colours from
   * the EDS infographic palette.
   * @default 'neutral'
   */
  color?: BadgeColor
  /**
   * Optional leading icon from `@equinor/eds-icons`.
   * Rendered at a size proportional to the badge.
   */
  icon?: IconData
} & Omit<HTMLAttributes<HTMLSpanElement>, 'color'>
