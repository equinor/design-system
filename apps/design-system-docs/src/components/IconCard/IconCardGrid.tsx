import type { IconCardGridProps } from './IconCard.types'

import './icon-card.css'

/** Responsive grid wrapper for {@link IconCard}s. */
export function IconCardGrid({ columns = 3, children }: IconCardGridProps) {
  return (
    <div className="docs-icon-card-grid" data-columns={columns}>
      {children}
    </div>
  )
}

IconCardGrid.displayName = 'IconCardGrid'
