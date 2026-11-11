import { useState } from 'react'
import {
  Accordion,
  Badge,
  Button,
  Checkbox,
  Chip,
  Icon,
} from '@equinor/eds-core-react/next'
import { arrow_back } from '@equinor/eds-icons'
import { CATEGORY_LABELS, GROUP_LABELS, propertyLabel } from '../../scan/labels'
import { effectiveTarget, isMappable } from '../../scan/mapping'
import type { Overrides } from '../../scan/mapping'
import { formatHealth } from '../../scan/summary'
import { PROPERTY_GROUPS, SCORED_CATEGORIES } from '../../scan/types'
import type {
  BindingRecord,
  Category,
  EntrySummary,
  OldInstance,
  PropertyGroup,
} from '../../scan/types'
import { groupState } from '../selection'
import type { Selection, SelectedBinding } from '../selection'
import { sourceLabel, targetLabel } from '../targets'
import { BindingRow } from './BindingRow'
import { HealthBar, HealthLegend } from './HealthBar'
import { Tabs } from './Tabs'

type InspectorProps = {
  entry: EntrySummary
  records?: BindingRecord[]
  oldInstances?: OldInstance[]
  overrides: Overrides
  selection: Selection
  onBack: () => void
  onSelect: (nodeIds: string[]) => void
  onChange: (record: BindingRecord) => void
}

type Filter = 'all' | Category
type Pivot = 'layers' | 'variables'

export function targetText(
  record: BindingRecord,
  overrides: Overrides,
): string {
  switch (record.category) {
    case 'migrated':
    case 'other':
      return record.current ?? ''
    case 'inInstance':
      return 'Not changed inside an instance'
    default: {
      const { target, source } = effectiveTarget(record, overrides)
      if (record.category === 'none' && source === 'proposal') {
        return 'No equivalent; stays as it is'
      }
      return targetLabel(target)
    }
  }
}

export function selectable(record: BindingRecord): SelectedBinding {
  return {
    id: record.id,
    kind: record.kind,
    group: record.group,
    candidates: record.candidates ?? [],
  }
}

type Group = {
  key: string
  title: string
  subtitle?: string
  records: BindingRecord[]
}

function groupRecords(records: BindingRecord[], pivot: Pivot): Group[] {
  const groups = new Map<string, Group>()
  for (const record of records) {
    const key =
      pivot === 'layers'
        ? record.nodeId
        : (record.oldKey ?? `current:${record.current ?? record.id}`)
    let group = groups.get(key)
    if (!group) {
      group =
        pivot === 'layers'
          ? {
              key,
              title: record.nodeName,
              subtitle: record.path.join(' / ') || undefined,
              records: [],
            }
          : {
              key,
              title: record.old ?? record.current ?? record.nodeName,
              subtitle: record.oldCollection,
              records: [],
            }
      groups.set(key, group)
    }
    group.records.push(record)
  }
  const result = [...groups.values()]
  // In the Variables view, the most used variables first.
  if (pivot === 'variables') {
    result.sort((a, b) => b.records.length - a.records.length)
  }
  return result
}

/** How many bindings a group has, and how many need attention. */
function groupSummary(records: BindingRecord[]): string {
  const parts = [`${records.length} binding${records.length === 1 ? '' : 's'}`]
  for (const category of ['check', 'none'] as const) {
    const count = records.filter(
      (record) => record.category === category,
    ).length
    if (count > 0) {
      parts.push(`${count} ${CATEGORY_LABELS[category].toLowerCase()}`)
    }
  }
  return parts.join(' · ')
}

/**
 * Every binding in one entry, grouped by layer or by legacy variable in an
 * accordion, filtered by the same categories as the health bar, and the
 * instances in it that still use legacy variables.
 */
export function Inspector({
  entry,
  records,
  oldInstances,
  overrides,
  selection,
  onBack,
  onSelect,
  onChange,
}: InspectorProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [property, setProperty] = useState<'all' | PropertyGroup>('all')
  const [pivot, setPivot] = useState<Pivot>('layers')
  const [open, setOpen] = useState<Set<string>>(new Set())

  const categories: Category[] = [
    ...SCORED_CATEGORIES,
    ...(entry.counts.other > 0 ? (['other'] as const) : []),
  ]
  const byStatus = (records ?? []).filter(
    (record) => filter === 'all' || record.category === filter,
  )
  const properties = PROPERTY_GROUPS.filter((candidate) =>
    (records ?? []).some((record) => record.group === candidate),
  )
  const shown = byStatus.filter(
    (record) => property === 'all' || record.group === property,
  )
  const groups = groupRecords(shown, pivot)
  const toggleOpen = (key: string, isOpen: boolean) =>
    setOpen((previous) => {
      const next = new Set(previous)
      if (isOpen) next.add(key)
      else next.delete(key)
      return next
    })

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
      {properties.length > 1 && (
        <div className="filter-row">
          <span className="filter-label" id="group-filter">
            Property
          </span>
          <div className="filters" role="group" aria-labelledby="group-filter">
            <Chip
              selected={property === 'all'}
              onClick={() => setProperty('all')}
            >
              All
            </Chip>
            {properties.map((candidate) => (
              <Chip
                key={candidate}
                selected={property === candidate}
                onClick={() => setProperty(candidate)}
              >
                {GROUP_LABELS[candidate]}{' '}
                {byStatus.filter((record) => record.group === candidate).length}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <Tabs
        label="Group by"
        tabs={[
          { id: 'layers', label: 'Layers' },
          { id: 'variables', label: 'Variables' },
        ]}
        selected={pivot}
        onSelect={(next) => {
          setPivot(next)
          setOpen(new Set())
        }}
      >
        {!records ? (
          <p className="muted">Loading…</p>
        ) : groups.length === 0 ? (
          <p className="muted">Nothing in this category.</p>
        ) : (
          <Accordion className="binding-groups">
            {groups.map((group) => {
              const isOpen = open.has(group.key)
              const mappable = group.records.filter(isMappable)
              const state = groupState(
                selection,
                mappable.map((record) => record.id),
              )
              return (
                <Accordion.Item
                  key={group.key}
                  open={isOpen}
                  onOpenChange={(next) => toggleOpen(group.key, next)}
                >
                  <Accordion.Header>
                    <span className="group-header">
                      <span className="binding-name">{group.title}</span>
                      <span className="binding-path">
                        {[group.subtitle, groupSummary(group.records)]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </span>
                  </Accordion.Header>
                  <Accordion.Panel>
                    {isOpen && (
                      <div className="stack-tight">
                        <div className="panel-actions">
                          {mappable.length > 1 ? (
                            <Checkbox
                              label={`Select all ${mappable.length} to change`}
                              checked={state.checked}
                              indeterminate={state.indeterminate}
                              onChange={(event) =>
                                selection.set(
                                  mappable.map(selectable),
                                  event.target.checked,
                                )
                              }
                            />
                          ) : (
                            <span />
                          )}
                          <Button
                            size="small"
                            variant="secondary"
                            aria-label={
                              pivot === 'layers'
                                ? `Go to ${group.title}`
                                : `Go to the layers that use ${group.title}`
                            }
                            onClick={() =>
                              onSelect([
                                ...new Set(
                                  group.records.map((record) => record.nodeId),
                                ),
                              ])
                            }
                          >
                            {pivot === 'layers' ? 'Go to' : 'Go to layers'}
                          </Button>
                        </div>
                        <ul className="binding-list">
                          {group.records.map((record) => (
                            <BindingRow
                              key={record.id}
                              title={
                                pivot === 'layers'
                                  ? propertyLabel(record.property)
                                  : `${record.nodeName} · ${propertyLabel(record.property)}`
                              }
                              subtitle={
                                pivot === 'variables'
                                  ? record.path.join(' / ') || undefined
                                  : undefined
                              }
                              old={pivot === 'layers' ? record.old : undefined}
                              target={targetText(record, overrides)}
                              note={
                                isMappable(record)
                                  ? sourceLabel(
                                      effectiveTarget(record, overrides).source,
                                    )
                                  : undefined
                              }
                              reason={record.reason}
                              category={record.category}
                              changeable={isMappable(record)}
                              selected={selection.has(record.id)}
                              onToggle={(selected) =>
                                selection.set([selectable(record)], selected)
                              }
                              onSelectLayer={() => onSelect([record.nodeId])}
                              onChange={() => onChange(record)}
                            />
                          ))}
                        </ul>
                      </div>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              )
            })}
          </Accordion>
        )}
      </Tabs>

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
