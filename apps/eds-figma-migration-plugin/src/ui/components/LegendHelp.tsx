import { CATEGORY_DESCRIPTIONS, CATEGORY_LABELS } from '../labels'
import { SCORED_CATEGORIES } from '../../scan/types'
import { InfoButton } from './InfoButton'

/** An info button that explains the categories of the health bar in a dialog. */
export function LegendHelp() {
  return (
    <InfoButton label="What the categories mean">
      <dl className="legend-help">
        {[...SCORED_CATEGORIES, 'other' as const].map((category) => (
          <div key={category} className="legend-help-item">
            <dt>
              {category !== 'other' && (
                <span
                  className="health-swatch"
                  data-category={category}
                  aria-hidden="true"
                />
              )}
              {CATEGORY_LABELS[category]}
            </dt>
            <dd>{CATEGORY_DESCRIPTIONS[category]}</dd>
          </div>
        ))}
      </dl>
      <p>
        Health is the share of migrated values among all EDS values in the
        scope: migrated ÷ (migrated + ready + needs check + manual fix + no
        equivalent + inside instances). Other libraries are left out. A value
        set to Decide later keeps counting as not migrated, so health reaches
        100% only when no legacy variable is left.
      </p>
    </InfoButton>
  )
}
