import type { HTMLAttributes, ReactNode } from 'react'

/**
 * Colour tone for theming, which maps to `data-color-appearance`.
 * - `neutral`: Neutral grey tones (default)
 * - `accent`: Brand or action colour
 * - `success`: Positive/confirmation
 * - `info`: Informational
 * - `warning`: Caution/alerts
 * - `danger`: Destructive/error
 */
export type BadgeTone =
  'neutral' | 'accent' | 'success' | 'info' | 'warning' | 'danger'

/**
 * Visual emphasis level.
 * - `low`: Canvas background or light border
 * - `medium`: More prominent fill or medium border
 */
export type BadgeEmphasis = 'low' | 'medium'

/**
 * Visual style variant.
 * - `solid`: Filled background, no border
 * - `outlined`: Border, transparent or canvas background
 */
export type BadgeVariant = 'solid' | 'outlined'

export type BadgeProps = {
  /**
   * Colour tone for theming.
   * @default 'neutral'
   */
  tone?: BadgeTone
  /**
   * Visual emphasis level.
   * @default 'low'
   */
  emphasis?: BadgeEmphasis
  /**
   * Visual style variant.
   * @default 'solid'
   */
  variant?: BadgeVariant
  /** Badge label text */
  children?: ReactNode
} & HTMLAttributes<HTMLSpanElement>
