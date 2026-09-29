import { TeamCard } from './TeamCard'
import type { TeamCardGridProps } from './TeamCard.types'

import './team-card.css'

/** Responsive grid of {@link TeamCard}s driven by a single team data source. */
export function TeamCardGrid({ members }: TeamCardGridProps) {
  return (
    <div className="docs-team-card-grid">
      {members.map((member) => (
        <TeamCard key={member.name} {...member} />
      ))}
    </div>
  )
}

TeamCardGrid.displayName = 'TeamCardGrid'
