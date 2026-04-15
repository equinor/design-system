import type { HTMLAttributes, ReactNode } from 'react'

/**
 * Color tone for theming
 * - `neutral`: Neutral gray tones (default)
 * - `accent`: Brand/action color
 * - `success`: Positive/confirmation
 * - `info`: Informational
 * - `warning`: Caution/alerts
 * - `danger`: Destructive/error
 */
export type ChipTone =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'

/**
 * Chip visual style variants
 * - `default`: Solid muted fill background
 * - `outlined`: Transparent background with border
 * - `high-contrast`: Dark emphasis fill with light text
 */
export type ChipVariant = 'default' | 'outlined' | 'high-contrast'

export type ChipProps = {
  /**
   * Color tone for theming
   * @default 'neutral'
   */
  tone?: ChipTone
  /**
   * Visual style variant
   * @default 'default'
   */
  variant?: ChipVariant
  /**
   * Selected state. Shows a leading check icon when true.
   * Use with `onClick` to toggle selection.
   *
   * @default false
   *
   * @example
   * ```tsx
   * const [selected, setSelected] = useState(false)
   * <Chip selected={selected} onClick={() => setSelected(!selected)}>
   *   Filter
   * </Chip>
   * ```
   */
  selected?: boolean
  /**
   * Shows a trailing close icon indicating the chip can be removed.
   * Use with `onClick` to handle deletion.
   * @default false
   */
  deletable?: boolean
  /**
   * Shows a trailing dropdown arrow icon.
   * The actual dropdown/popover behavior is the consumer's responsibility.
   * @default false
   */
  dropdown?: boolean
  /**
   * Chip content
   */
  children?: ReactNode
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>
