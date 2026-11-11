import { useState } from 'react'
import { Badge, Button, Chip, Icon } from '@equinor/eds-core-react/next'
import type { BadgeTone } from '@equinor/eds-core-react/next'
import { arrow_back, arrow_forward } from '@equinor/eds-icons'
import { CATEGORY_LABELS, propertyLabel } from '../../scan/labels'
import { formatHealth } from '../../scan/summary'
import type {
  BindingRecord,
  Category,
  EntrySummary,
  OldInstance,
} from '../../scan/types'
import { HealthBar, HealthLegend } from './HealthBar'

type InspectorProps = {
  entry: EntrySummary
  records?: BindingRecord[]
  oldInstances?: OldInstance[]
  onBack: () => void
  onSelect: (nodeIds: string[]) => void
}

const TONES: Record<Category, BadgeTone> = {
  migrated: 'success',
  sure: 'accent',
  check: 'warning',
  none: 'danger',
  inInstance: 'neutral',
  other: 'neutral',
}

const FILTERS: { label: string; categories: Category[] }[] = [
  { label: 'Old', categories: ['sure', 'check', 'none'] },
  { label: 'Needs check', categories: ['check'] },
  { label: 'No equivalent', categories: ['none'] },
  { label: 'In instance', categories: ['inInstance'] },
  { label: 'Migrated', categories: ['migrated'] },
]

function Row({
  record,
  onSelect,
}: {
  record: BindingRecord
  onSelect: (nodeIds: string[]) => void
}) {
  const proposal = record.candidates?.[0]
  const target =
    record.category === 'migrated' || record.category === 'other'
      ? record.current
      : record.category === 'inInstance'
        ? 'Not changed inside an instance'
        : record.category === 'none'
          ? 'No equivalent; stays'
          : (proposal ?? 'Cleared when nothing below uses old variables')
  return (
    <li className="binding-row">
      <button
        type="button"
        className="binding-select"
        onClick={() => onSelect([record.nodeId])}
        title={record.reason}
      >
        <span className="binding-layer">
          <span className="binding-name">{record.nodeName}</span>
          <span className="binding-property">
            {propertyLabel(record.property)}
          </span>
        </span>
        {record.path.length > 0 && (
          <span className="binding-path">{record.path.join(' / ')}</span>
        )}
        <span className="binding-swap">
          {record.old && <span className="binding-old">{record.old}</span>}
          {record.old && <span aria-hidden="true"> → </span>}
          <span className="binding-new">{target}</span>
        </span>
        {record.reason && record.category !== 'sure' && (
          <span className="binding-reason">{record.reason}</span>
        )}
      </button>
      <Badge
        tone={TONES[record.category]}
        emphasis={record.category === 'check' ? 'medium' : 'low'}
      >
        {record.category === 'check' ? '⚠ ' : ''}
        {CATEGORY_LABELS[record.category]}
      </Badge>
    </li>
  )
}

/** Every binding in one frame, with a filter by category, and the instances in it that still use old variables. */
export function Inspector({
  entry,
  records,
  oldInstances,
  onBack,
  onSelect,
}: InspectorProps) {
  const [filter, setFilter] = useState(0)
  const shown = (records ?? []).filter((record) =>
    FILTERS[filter].categories.includes(record.category),
  )
  return (
    <div className="stack">
      <div className="inspector-header">
        <Button
          icon
          variant="ghost"
          size="small"
          aria-label="Back to frames"
          onClick={onBack}
        >
          <Icon data={arrow_back} size="md" />
        </Button>
        <h2 className="inspector-title">{entry.name}</h2>
        <span className="entry-health">{formatHealth(entry.health)}</span>
        <Button
          icon
          variant="ghost"
          size="small"
          aria-label={`Go to ${entry.name}`}
          onClick={() => onSelect(entry.nodeIds)}
        >
          <Icon data={arrow_forward} size="md" />
        </Button>
      </div>
      <HealthBar counts={entry.counts} />
      <HealthLegend counts={entry.counts} />

      <div className="filters" role="group" aria-label="Show">
        {FILTERS.map((option, index) => (
          <Chip
            key={option.label}
            selected={filter === index}
            onClick={() => setFilter(index)}
          >
            {option.label}
          </Chip>
        ))}
      </div>

      {!records ? (
        <p className="muted">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="muted">Nothing in this category.</p>
      ) : (
        <ul className="binding-list">
          {shown.map((record) => (
            <Row key={record.id} record={record} onSelect={onSelect} />
          ))}
        </ul>
      )}

      {oldInstances && oldInstances.length > 0 && (
        <section className="stack-tight" aria-labelledby="old-instances">
          <h3 id="old-instances" className="section-title">
            Instances that still use old variables
          </h3>
          <p className="muted">
            Update the component in its library, then swap these instances by
            hand. The plugin never changes anything inside an instance.
          </p>
          <ul className="binding-list">
            {oldInstances.map((instance) => (
              <li key={instance.id} className="binding-row">
                <button
                  type="button"
                  className="binding-select"
                  onClick={() => onSelect([instance.id])}
                >
                  <span className="binding-name">{instance.name}</span>
                  <span className="binding-path">
                    {instance.mainComponent
                      ? `${instance.mainComponent.name}${instance.mainComponent.remote ? ', from a library' : ', in this file'}`
                      : 'Main component not found'}
                  </span>
                </button>
                <Badge tone="neutral">{instance.count} old</Badge>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
