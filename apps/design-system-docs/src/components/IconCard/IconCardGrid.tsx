import type { IconCardGridProps } from './IconCard.types'

import './icon-card.css'

/** Responsive grid wrapper for {@link IconCard}s. */
export function IconCardGrid({
  layout = 'grid',
  columns = 3,
  children,
}: IconCardGridProps) {
  return (
    <div
      className="docs-icon-card-grid"
      data-layout={layout}
      data-columns={layout === 'grid' ? columns : undefined}
    >
      {children}
    </div>
  )
}

IconCardGrid.displayName = 'IconCardGrid'
