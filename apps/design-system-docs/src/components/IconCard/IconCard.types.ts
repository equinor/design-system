import type { ReactNode } from 'react'
import type { IconData } from '@equinor/eds-icons'

export type IconCardBadge = {
  label: string
  tone?: 'accent' | 'neutral'
}

export type IconCardProps = {
  /**
   * Icon shown in the card's icon square. Pass an `@equinor/eds-icons`
   * `IconData` (preferred), or a raw SVG node for brand marks not in the EDS
   * icon set.
   */
  icon: IconData | ReactNode
  title: ReactNode
  description: ReactNode
  /** When set (and not disabled) the whole card is a link and shows a forward arrow. */
  to?: string
  /** Optional status pill (e.g. "In progress", "Coming soon"). */
  badge?: IconCardBadge
  /** Renders a non-interactive card even when `to` is provided. */
  disabled?: boolean
}

export type IconCardGridProps = {
  /** Column count at the widest breakpoint. Defaults to 3. */
  columns?: 2 | 3 | 4
  children: ReactNode
}
