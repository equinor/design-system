import useBaseUrl from '@docusaurus/useBaseUrl'

import type { TeamCardProps } from './TeamCard.types'

import './team-card.css'

/** A single team-member portrait card. */
export function TeamCard({ image, name, role }: TeamCardProps) {
  const imageUrl = useBaseUrl(image)

  return (
    <div className="docs-team-card">
      <img
        className="docs-team-card__image"
        src={imageUrl}
        // Decorative: the name is rendered as visible text directly below,
        // so alt={name} would make a screen reader announce it twice.
        alt=""
        loading="lazy"
      />
      <p className="docs-team-card__name">{name}</p>
      <p className="docs-team-card__role">{role}</p>
    </div>
  )
}

TeamCard.displayName = 'TeamCard'
