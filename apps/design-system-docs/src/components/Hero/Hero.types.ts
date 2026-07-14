import type { ReactNode } from 'react'

export type HeroProps = {
  /** Small label rendered above the title. */
  eyebrow?: ReactNode
  title: ReactNode
  /** Lead paragraph(s) rendered under the title. */
  lead?: ReactNode
  /** Extra content rendered after the lead (e.g. an entry-point grid). */
  children?: ReactNode
}
