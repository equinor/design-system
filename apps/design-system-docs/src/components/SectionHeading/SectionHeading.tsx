import type { SectionHeadingProps } from './SectionHeading.types'

import './section-heading.css'

/**
 * Mirrors Docusaurus's markdown heading ids so `<SectionHeading title="External
 * References" />` is reachable at `#external-references`, the same as a `##`.
 */
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

/** Section title + optional subtitle. Replaces the per-page `sectionHeading`/`sectionSubtitle` pairs. */
export function SectionHeading({
  as: As = 'h2',
  title,
  id,
  subtitle,
  className,
}: SectionHeadingProps) {
  const classes = ['docs-section-heading', className].filter(Boolean).join(' ')
  const anchorId =
    id ?? (typeof title === 'string' ? slugify(title) : undefined)

  return (
    <div className={classes}>
      <As id={anchorId} className="docs-section-heading__title">
        {title}
      </As>
      {subtitle && <p className="docs-section-heading__subtitle">{subtitle}</p>}
    </div>
  )
}

SectionHeading.displayName = 'SectionHeading'
