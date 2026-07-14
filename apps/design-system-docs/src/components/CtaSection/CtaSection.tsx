import Link from '@docusaurus/Link'

import type { CtaSectionProps } from './CtaSection.types'

import './cta-section.css'

const isExternal = (to: string) => /^https?:\/\//.test(to)

/** Heading + body + call-to-action button. Replaces the repeated contact/next-steps/contribute sections. */
export function CtaSection({
  title,
  children,
  cta,
  tone = 'plain',
}: CtaSectionProps) {
  const external = isExternal(cta.to)

  return (
    <section className="docs-cta-section" data-tone={tone}>
      <div className="container">
        <h2 className="docs-cta-section__title">{title}</h2>
        <div className="docs-cta-section__body">{children}</div>
        <Link
          to={cta.to}
          className="docs-cta-section__button"
          {...(external
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {cta.label}
        </Link>
      </div>
    </section>
  )
}

CtaSection.displayName = 'CtaSection'
