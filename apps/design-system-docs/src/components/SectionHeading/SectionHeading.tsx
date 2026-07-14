import type { SectionHeadingProps } from './SectionHeading.types'

import './section-heading.css'

/** Section title + optional subtitle. Replaces the per-page `sectionHeading`/`sectionSubtitle` pairs. */
export function SectionHeading({
  as: As = 'h2',
  title,
  subtitle,
  className,
}: SectionHeadingProps) {
  const classes = ['docs-section-heading', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <As className="docs-section-heading__title">{title}</As>
      {subtitle && <p className="docs-section-heading__subtitle">{subtitle}</p>}
    </div>
  )
}

SectionHeading.displayName = 'SectionHeading'
