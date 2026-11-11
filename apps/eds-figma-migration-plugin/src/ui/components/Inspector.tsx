import { useState } from 'react'
import { Badge, Button, Chip, Icon } from '@equinor/eds-core-react/next'
import type { BadgeTone } from '@equinor/eds-core-react/next'
import { arrow_back } from '@equinor/eds-icons'
import { CATEGORY_LABELS, GROUP_LABELS, propertyLabel } from '../../scan/labels'
import { formatHealth } from '../../scan/summary'
import { PROPERTY_GROUPS, SCORED_CATEGORIES } from '../../scan/types'
import type {
  BindingRecord,
  Category,
  EntrySummary,
  OldInstance,
  PropertyGroup,
} from '../../scan/types'
import { HealthBar, HealthLegend } from './HealthBar'

type InspectorProps = {
  entry: EntrySummary
  records?: BindingRecord[]
  oldInstances?: OldInstance[]
  onBack: () => void
  onSelect: (nodeIds: string[]) => void
}

const BADGES: Record<
  Category,
  { tone: BadgeTone; emphasis: 'low' | 'medium' }
> = {
  migrated: { tone: 'success', emphasis: 'medium' },
  sure: { tone: 'info', emphasis: 'low' },
  check: { tone: 'warning', emphasis: 'medium' },
  none: { tone: 'danger', emphasis: 'low' },
  inInstance: { tone: 'neutral', emphasis: 'low' },
  other: { tone: 'neutral', emphasis: 'low' },
}

function targetText(record: BindingRecord): string {
  switch (record.category) {
    case 'migrated':
    case 'other':
      return record.current ?? ''
    case 'inInstance':
      return 'Not changed inside an instance'
    case 'none':
      return 'No equivalent; stays as it is'
    default:
      return (
        record.candidates?.[0] ??
        'Cleared when nothing below uses legacy variables'
      )
  }
}

function Row({
  record,
  onSelect,
}: {
  record: BindingRecord
  onSelect: (nodeIds: string[]) => void
}) {
  const badge = BADGES[record.category]
  return (
    <li className="binding-row">
      <button
        type="button"
        className="binding-select"
        onClick={() => onSelect([record.nodeId])}
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
          <span className="binding-new">{targetText(record)}</span>
        </span>
        {record.reason && record.category !== 'sure' && (
          <span className="binding-reason">{record.reason}</span>
        )}
      </button>
      <Badge tone={badge.tone} emphasis={badge.emphasis}>
        {record.category === 'check' ? '⚠ ' : ''}
        {CATEGORY_LABELS[record.category]}
      </Badge>
    </li>
  )
}

type Filter = 'all' | Category

/**
 * Every binding in one entry, filtered by the same categories as the health
 * bar, and the instances in it that still use legacy variables.
 */
export function Inspector({
  entry,
  records,
  oldInstances,
  onBack,
  onSelect,
}: InspectorProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [group, setGroup] = useState<'all' | PropertyGroup>('all')
  const categories: Category[] = [
    ...SCORED_CATEGORIES,
    ...(entry.counts.other > 0 ? (['other'] as const) : []),
  ]
  const byStatus = (records ?? []).filter(
    (record) => filter === 'all' || record.category === filter,
  )
  const groups = PROPERTY_GROUPS.filter((candidate) =>
    (records ?? []).some((record) => record.group === candidate),
  )
  const shown = byStatus.filter(
    (record) => group === 'all' || record.group === group,
  )
  return (
    <div className="stack">
      <div className="inspector-header">
        <Button variant="ghost" size="small" onClick={onBack}>
          <Icon data={arrow_back} size="md" />
          Back
        </Button>
        <Button
          variant="secondary"
          size="small"
          aria-label={`Go to ${entry.name}`}
          onClick={() => onSelect(entry.nodeIds)}
        >
          Go to
        </Button>
      </div>
      <div className="health-heading">
        <h2 className="inspector-title">{entry.name}</h2>
        <span className="health-value">{formatHealth(entry.health)}</span>
      </div>
      <HealthBar counts={entry.counts} />
      <HealthLegend counts={entry.counts} />

      <div className="filter-row">
        <span className="filter-label" id="status-filter">
          Status
        </span>
        <div className="filters" role="group" aria-labelledby="status-filter">
          <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </Chip>
          {categories.map((category) => (
            <Chip
              key={category}
              selected={filter === category}
              onClick={() => setFilter(category)}
            >
              {CATEGORY_LABELS[category]} {entry.counts[category]}
            </Chip>
          ))}
        </div>
      </div>
      {groups.length > 1 && (
        <div className="filter-row">
          <span className="filter-label" id="group-filter">
            Property
          </span>
          <div className="filters" role="group" aria-labelledby="group-filter">
            <Chip selected={group === 'all'} onClick={() => setGroup('all')}>
              All
            </Chip>
            {groups.map((candidate) => (
              <Chip
                key={candidate}
                selected={group === candidate}
                onClick={() => setGroup(candidate)}
              >
                {GROUP_LABELS[candidate]}{' '}
                {byStatus.filter((record) => record.group === candidate).length}
              </Chip>
            ))}
          </div>
        </div>
      )}

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
            Instances with legacy variables
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
                <Badge tone="neutral">{instance.count} legacy</Badge>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
