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
import { CATEGORY_LABELS, GROUP_LABELS, propertyLabel, values } from '../labels'
import {
  effectiveCategory,
  effectiveTarget,
  isMappable,
} from '../../scan/mapping'
import type {
  MappingBinding,
  MappingGroup,
  MappingRow,
  Overrides,
} from '../../scan/mapping'
import { formatHealth } from '../../scan/summary'
import { PROPERTY_GROUPS, SCORED_CATEGORIES } from '../../scan/types'
import type {
  BindingRecord,
  Category,
  EntrySummary,
  OldInstance,
  PropertyGroup,
} from '../../scan/types'
import { groupInstances } from '../instances'
import { pathBelow } from '../paths'
import { groupState } from '../selection'
import type { Selection, SelectedBinding } from '../selection'
import { sourceLabel, targetLabel, unchangedLabel } from '../targets'
import { filterGroups } from '../groups'
import { ApplyActions } from './ApplyActions'
import { MappingView } from './MappingView'
import { BindingRow } from './BindingRow'
import { HealthBar, HealthLegend } from './HealthBar'
import { Tabs } from './Tabs'

type InspectorProps = {
  entry: EntrySummary
  records?: BindingRecord[]
  oldInstances?: OldInstance[]
  overrides: Overrides
  selection: Selection
  busy: boolean
  onApply: () => void
  onReview: () => void
  onRevert: () => void
  onBack: () => void
  onSelect: (nodeIds: string[]) => void
  onChange: (record: BindingRecord) => void
  /** The Changes rows of the scan, narrowed to this frame for the Variables view (final review FR9) */
  mapping: MappingGroup[]
  showCounts: boolean
  onChangeRow: (group: MappingGroup, row: MappingRow) => void
  onChangeBinding: (
    group: MappingGroup,
    row: MappingRow,
    binding: MappingBinding,
  ) => void
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
        return unchangedLabel(record.rule)
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
    ...(record.scheme ? { scheme: record.scheme } : {}),
  }
}

type Group = {
  key: string
  title: string
  subtitle?: string
  records: BindingRecord[]
}

function groupRecords(
  records: BindingRecord[],
  pivot: Pivot,
  entryName: string,
): Group[] {
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
              subtitle: pathBelow(record.path, entryName),
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
function groupSummary(
  records: BindingRecord[],
  categoryOf: (record: BindingRecord) => Category,
): string {
  const parts = [values(records.length)]
  for (const category of ['check', 'none'] as const) {
    const count = records.filter(
      (record) => categoryOf(record) === category,
    ).length
    if (count > 0) {
      parts.push(`${count} ${CATEGORY_LABELS[category].toLowerCase()}`)
    }
  }
  return parts.join(', ')
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
  busy,
  onApply,
  onReview,
  onRevert,
  onBack,
  onSelect,
  onChange,
  mapping,
  showCounts,
  onChangeRow,
  onChangeBinding,
}: InspectorProps) {
  const frameGroups = filterGroups(
    mapping,
    (binding) => binding.entryId === entry.id,
  )
  const [filter, setFilter] = useState<Filter>('all')
  const [property, setProperty] = useState<'all' | PropertyGroup>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [pivot, setPivot] = useState<Pivot>('layers')
  const [open, setOpen] = useState<Set<string>>(new Set())

  const categories: Category[] = [
    ...SCORED_CATEGORIES,
    ...(entry.counts.other > 0 ? (['other'] as const) : []),
  ]
  // After a designer's choice a binding counts as Ready or No equivalent,
  // the same as in the health bar.
  const categoryOf = (record: BindingRecord) =>
    effectiveCategory(record, overrides)
  const byStatus = (records ?? []).filter(
    (record) => filter === 'all' || categoryOf(record) === filter,
  )
  const properties = PROPERTY_GROUPS.filter((candidate) =>
    (records ?? []).some((record) => record.group === candidate),
  )
  const shown = byStatus.filter(
    (record) => property === 'all' || record.group === property,
  )
  const groups = groupRecords(shown, pivot, entry.name)
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

      {/* UX review F1: the filters fold into one line, so the layers start
          higher in the window. F9: only categories with values are offered. */}
      {pivot === 'layers' && (
        <>
          <div className="filter-summary">
            <span className="muted">
              Showing{' '}
              <strong>
                {filter === 'all' ? 'every status' : CATEGORY_LABELS[filter]}
              </strong>
              {' and '}
              <strong>
                {property === 'all' ? 'every property' : GROUP_LABELS[property]}
              </strong>
            </span>
            <Button
              variant="ghost"
              size="small"
              aria-expanded={showFilters}
              onClick={() => setShowFilters((previous) => !previous)}
            >
              {showFilters ? 'Hide filters' : 'Filter'}
            </Button>
          </div>
          {showFilters && (
            <>
              <div className="filter-row">
                <span className="filter-label" id="status-filter">
                  Status
                </span>
                <div
                  className="filters"
                  role="group"
                  aria-labelledby="status-filter"
                >
                  <Chip
                    selected={filter === 'all'}
                    onClick={() => setFilter('all')}
                  >
                    All
                  </Chip>
                  {categories
                    .filter((category) => entry.counts[category] > 0)
                    .map((category) => (
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
                  <div
                    className="filters"
                    role="group"
                    aria-labelledby="group-filter"
                  >
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
                        {
                          byStatus.filter(
                            (record) => record.group === candidate,
                          ).length
                        }
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
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
        {pivot === 'variables' ? (
          <MappingView
            groups={frameGroups}
            overrides={overrides}
            entryNames={new Map([[entry.id, entry.name]])}
            selection={selection}
            showCounts={showCounts}
            onSelectOld={(oldKey) =>
              onSelect([
                ...new Set(
                  frameGroups
                    .filter((group) => group.oldKey === oldKey)
                    .flatMap((group) => group.rows)
                    .flatMap((row) => row.bindings)
                    .map((binding) => binding.nodeId),
                ),
              ])
            }
            onSelectLayer={onSelect}
            onChangeRow={onChangeRow}
            onChangeBinding={onChangeBinding}
          />
        ) : !records ? (
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
                        {[
                          group.subtitle,
                          groupSummary(group.records, categoryOf),
                        ]
                          .filter(Boolean)
                          .join(', ')}
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
                            aria-label={`Go to ${group.title}`}
                            onClick={() =>
                              onSelect([
                                ...new Set(
                                  group.records.map((record) => record.nodeId),
                                ),
                              ])
                            }
                          >
                            Go to
                          </Button>
                        </div>
                        <ul className="binding-list">
                          {group.records.map((record) => {
                            const decided =
                              isMappable(record) &&
                              effectiveTarget(record, overrides).source !==
                                'proposal'
                            return (
                              <BindingRow
                                key={record.id}
                                title={propertyLabel(record.property)}
                                old={record.old}
                                target={targetText(record, overrides)}
                                note={
                                  isMappable(record)
                                    ? sourceLabel(
                                        effectiveTarget(record, overrides)
                                          .source,
                                      )
                                    : undefined
                                }
                                reason={decided ? undefined : record.reason}
                                category={categoryOf(record)}
                                changeable={isMappable(record)}
                                selected={selection.has(record.id)}
                                onToggle={(selected) =>
                                  selection.set([selectable(record)], selected)
                                }
                                onSelectLayer={() => onSelect([record.nodeId])}
                                onChange={() => onChange(record)}
                              />
                            )
                          })}
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
            {groupInstances(oldInstances).map((group) => (
              <li key={group.key} className="binding-row">
                <div className="entry-info">
                  <span className="binding-name">{group.name}</span>
                  <span className="binding-path">
                    {group.instances.length} instance
                    {group.instances.length === 1 ? '' : 's'}, {group.source}
                  </span>
                </div>
                <div className="binding-actions">
                  <Badge tone="neutral">{group.count} legacy</Badge>
                  <Button
                    size="small"
                    variant="secondary"
                    aria-label={`Go to the ${group.instances.length} instances of ${group.name}`}
                    onClick={() =>
                      onSelect(group.instances.map((instance) => instance.id))
                    }
                  >
                    Go to
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      {selection.items.size === 0 && (
        <ApplyActions
          ready={entry.counts.sure}
          toReview={entry.counts.check}
          where="in this frame"
          changed={entry.changed}
          busy={busy}
          onApply={onApply}
          onReview={onReview}
          onRevert={onRevert}
        />
      )}
    </div>
  )
}
