import type { ReactNode } from 'react'

export type HeroVariant = 'default' | 'display'

export type HeroProps = {
  /**
   * `display` is the homepage brand header: a single centred 112px title on
   * its own, per the Figma design. `default` is the left-aligned
   * eyebrow/title/lead stack used by every other landing page.
   */
  variant?: HeroVariant
  /** Small label rendered above the title. */
  eyebrow?: ReactNode
  title: ReactNode
  /** Lead paragraph(s) rendered under the title. */
  lead?: ReactNode
  /**
   * Render the EDS dot grid behind the hero content, with a pointer-following
   * spotlight that lifts nearby dots to full opacity. Opt-in per hero so a page
   * only ever carries the pattern on one of them.
   */
  dots?: boolean
  /** Extra content rendered after the lead (e.g. an entry-point grid). */
  children?: ReactNode
}
