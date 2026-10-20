import { SectionHeading } from '@site/src/components/SectionHeading'

import type { DocsSectionProps } from './DocsSection.types'

/**
 * Standard landing-page section: full-width band (optionally muted) with a
 * centred container and an optional SectionHeading. Replaces the repeated
 * `<section className="docs-section"><div className="container">…` boilerplate
 * in the MDX landing docs and React pages.
 */
export function DocsSection({
  title,
  subtitle,
  as,
  id,
  tone,
  children,
}: DocsSectionProps) {
  const classes = ['docs-section', tone === 'muted' && 'docs-section--muted']
    .filter(Boolean)
    .join(' ')

  return (
    <section className={classes}>
      <div className="container">
        {title && (
          <SectionHeading title={title} subtitle={subtitle} as={as} id={id} />
        )}
        {children}
      </div>
    </section>
  )
}

DocsSection.displayName = 'DocsSection'
