import { CATEGORY_LABELS } from '../labels'
import { formatHealth, healthOf, scoredTotal } from '../../scan/summary'
import { SCORED_CATEGORIES } from '../../scan/types'
import type { Counts } from '../../scan/types'
import { LegendHelp } from './LegendHelp'

type HealthBarProps = {
  counts: Counts
  /** `large` for the scope, `small` for a row in the frame list */
  size?: 'large' | 'small'
}

/** Categories the legend lists only when they have values: rare ones. */
const ONLY_WHEN_USED = new Set(['excluded', 'byHand'])

/**
 * The categories to list: Excluded only once a designer has excluded
 * something, since the scan itself never puts a value there, and Manual fix
 * only when a value needs one.
 */
function listed(counts: Counts) {
  return SCORED_CATEGORIES.filter(
    (category) => !ONLY_WHEN_USED.has(category) || counts[category] > 0,
  )
}

/**
 * A bar with one segment per category, migrated first. The Beta has no
 * progress bar or meter, so it is built from tokens here (BETA-GAPS.md).
 */
export function HealthBar({ counts, size = 'large' }: HealthBarProps) {
  const total = scoredTotal(counts)
  const health = healthOf(counts)
  const description =
    total === 0
      ? 'No EDS variables'
      : `${formatHealth(health)} migrated: ${listed(counts)
          .map((category) => `${CATEGORY_LABELS[category]} ${counts[category]}`)
          .join(', ')}`
  return (
    <div
      className="health-bar"
      data-size={size}
      role="img"
      aria-label={description}
    >
      {total > 0 &&
        SCORED_CATEGORIES.filter((category) => counts[category] > 0).map(
          (category) => (
            <span
              key={category}
              className="health-segment"
              data-category={category}
              style={{ flexGrow: counts[category] }}
            />
          ),
        )}
    </div>
  )
}

/** The totals next to the bar, one per category, with the colour of its segment and a button that explains them. */
export function HealthLegend({ counts }: { counts: Counts }) {
  return (
    <div className="health-legend-row">
      <ul className="health-legend">
        {listed(counts).map((category) => (
          <li key={category}>
            <span
              className="health-swatch"
              data-category={category}
              aria-hidden="true"
            />
            {CATEGORY_LABELS[category]} <strong>{counts[category]}</strong>
          </li>
        ))}
        {counts.other > 0 && (
          <li className="muted">
            {CATEGORY_LABELS.other} {counts.other}
          </li>
        )}
      </ul>
      <LegendHelp />
    </div>
  )
}
