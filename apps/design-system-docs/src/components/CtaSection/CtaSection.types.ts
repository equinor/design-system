import type { ReactNode } from 'react'

export type CtaSectionProps = {
  title: ReactNode
  /** Body copy. */
  children: ReactNode
  cta: {
    label: string
    to: string
  }
  /** `muted` renders a tinted surface; `plain` uses the page background. Defaults to `plain`. */
  tone?: 'muted' | 'plain'
}
