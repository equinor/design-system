import type { ReactNode } from 'react'

export type SectionHeadingProps = {
  /** Heading level. Defaults to `h2`. */
  as?: 'h1' | 'h2' | 'h3'
  title: ReactNode
  /**
   * Anchor id for deep links. Defaults to a slug of `title` when `title` is a
   * plain string; pass explicitly when `title` is JSX.
   */
  id?: string
  /** Optional supporting copy rendered under the heading. */
  subtitle?: ReactNode
  className?: string
}
