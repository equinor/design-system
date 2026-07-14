import type { HeroProps } from './Hero.types'

import './hero.css'

/** Page hero. Replaces the four hand-rolled hero blocks across the landing pages. */
export function Hero({ eyebrow, title, lead, children }: HeroProps) {
  return (
    <header className="docs-hero">
      <div className="container">
        {eyebrow && <span className="docs-hero__eyebrow">{eyebrow}</span>}
        <h1 className="docs-hero__title">{title}</h1>
        {lead && <div className="docs-hero__lead">{lead}</div>}
        {children}
      </div>
    </header>
  )
}

Hero.displayName = 'Hero'
