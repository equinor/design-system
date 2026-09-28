import { DotField } from '@site/src/components/DotField'

import type { HeroProps } from './Hero.types'

import './hero.css'

/** Page hero. Replaces the four hand-rolled hero blocks across the landing pages. */
export function Hero({
  variant = 'default',
  eyebrow,
  title,
  lead,
  dots,
  children,
}: HeroProps) {
  const classes = ['docs-hero', dots && 'docs-dot-host']
    .filter(Boolean)
    .join(' ')

  return (
    <header className={classes} data-variant={variant}>
      {dots && <DotField />}
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
