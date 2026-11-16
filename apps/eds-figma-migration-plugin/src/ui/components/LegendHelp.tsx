import { useState } from 'react'
import { Button, Dialog, Icon } from '@equinor/eds-core-react/next'
import { info_circle } from '@equinor/eds-icons'
import { CATEGORY_DESCRIPTIONS, CATEGORY_LABELS } from '../labels'
import { SCORED_CATEGORIES } from '../../scan/types'

/** An info button that explains the categories of the health bar in a dialog. */
export function LegendHelp() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        icon
        variant="ghost"
        size="small"
        aria-label="What the categories mean"
        onClick={() => setOpen(true)}
      >
        <Icon data={info_circle} size="md" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header>
          <Dialog.Title>What the categories mean</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
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
            equivalent + inside instances). Other libraries are left out. A
            value set to Decide later keeps counting as not migrated, so health
            reaches 100% only when no legacy variable is left.
          </p>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
