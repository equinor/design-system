import type { ReactNode } from 'react'

export type SectionHeadingProps = {
  /** Heading level. Defaults to `h2`. */
  as?: 'h1' | 'h2' | 'h3'
  title: ReactNode
  /** Optional supporting copy rendered under the heading. */
  subtitle?: ReactNode
  className?: string
}
