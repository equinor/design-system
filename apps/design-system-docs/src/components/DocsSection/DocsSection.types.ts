import type { ReactNode } from 'react'

export type DocsSectionProps = {
  /** Section heading, rendered via SectionHeading. Omit for a bare section. */
  title?: ReactNode
  /** Supporting copy under the heading. */
  subtitle?: ReactNode
  /** Heading level for the title. Defaults to `h2`. */
  as?: 'h1' | 'h2' | 'h3'
  /** Anchor id for deep links (see SectionHeading). */
  id?: string
  /** `muted` renders the section on the surface background. */
  tone?: 'muted'
  children?: ReactNode
}
