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
import {
  CATEGORY_LABELS,
  GROUP_LABELS,
  HELD_LABEL,
  HIDDEN_LABEL,
  isHeld,
  KEPT_TARGET_LABEL,
  plural,
  propertyLabel,
  values,
} from '../labels'
import {
  DECIDE_LATER,
  effectiveCategory,
  effectiveTarget,
  filterGroups,
  isKeptWaiting,
  isMappable,
  isUndecided,
  keptModeText,
  NO_KEPT_MODES,
} from '../../scan/mapping'
import type {
  KeptModes,
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
  ComponentInstance,
  EntrySummary,
  InstanceStep,
  OldInstance,
  PropertyGroup,
} from '../../scan/types'
import { groupInstances, hasInner, valueTree } from '../instances'
import type { TreeNode } from '../instances'
import { pathBelow } from '../paths'
import { reviewItems } from '../review'
import { groupState } from '../selection'
import type { Selection, SelectedBinding } from '../selection'
import { manualFixTarget, resetEffectsText } from '../../scan/classify'
import { sourceLabel, targetLabel, unchangedLabel } from '../targets'
import { ApplyActions } from './ApplyActions'
import { ComponentInstances } from './ComponentInstances'
import { MappingView } from './MappingView'
import { BindingRow } from './BindingRow'
import { HealthBar, HealthLegend } from './HealthBar'
import { InfoButton, SectionHeading } from './InfoButton'
import { InstanceTree } from './InstanceTree'
import { InsideMainComponent, MainComponentLabel } from './MainComponentLabel'
import { Tabs } from './Tabs'

type InspectorProps = {
  entry: EntrySummary
  records?: BindingRecord[]
  oldInstances?: OldInstance[]
  /** For a main component, or a layer inside one: every instance in it */
  componentInstances?: ComponentInstance[]
  overrides: Overrides
  /** The legacy modes the next Apply keeps, from the plugin */
  kept?: KeptModes
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
  kept: KeptModes = NO_KEPT_MODES,
): string {
  switch (record.category) {
    case 'migrated':
    case 'other':
      return record.current ?? ''
    case 'inInstance':
      return 'Not changed inside an instance'
    case 'byHand':
      // A Manual fix set to Decide later says so, as it does in Changes.
      return isMappable(record) &&
        effectiveTarget(record, overrides).target === DECIDE_LATER
        ? targetLabel(DECIDE_LATER)
        : manualFixTarget(record)
    default: {
      const { target, source } = effectiveTarget(record, overrides)
      if (record.category === 'none' && source === 'proposal') {
        return unchangedLabel(target)
      }
      if (isKeptWaiting(record.id, kept)) return KEPT_TARGET_LABEL
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
  /**
   * In the Layers view: an instance at the top of the frame, with everything
   * inside it in one group, the instances in it too
   */
  instance?: { id: string; mainId?: string; step: InstanceStep }
}

function groupRecords(
  records: BindingRecord[],
  pivot: Pivot,
  entryName: string,
  oldInstances: OldInstance[],
): Group[] {
  const instances = new Map(oldInstances.map((item) => [item.id, item]))
  const groups = new Map<string, Group>()
  for (const record of records) {
    // An instance is one group in the Layers view, with the values it takes
    // from its main component and the ones it overrides, so its layers are
    // not listed as layers of the frame. An instance in slot content another
    // instance owns is in the group of that instance, at the top of the
    // chain, where the tree shows it in the slot.
    // A layer in slot content an instance owns is in that instance's group
    // too, under the slot, though it is not in an instance itself.
    const top =
      pivot !== 'layers'
        ? undefined
        : record.instanceId
          ? (record.instances?.[0] ?? {
              id: record.instanceId,
              name: instances.get(record.instanceId)?.name ?? record.nodeName,
            })
          : record.slotName
            ? record.instances?.[0]
            : undefined
    const instanceId = top?.id
    const key = instanceId
      ? `instance:${instanceId}`
      : pivot === 'layers'
        ? record.nodeId
        : (record.oldKey ?? `current:${record.current ?? record.id}`)
    let group = groups.get(key)
    if (!group) {
      const known = instanceId ? instances.get(instanceId) : undefined
      group = top
        ? {
            key,
            title: top.name,
            subtitle: undefined,
            records: [],
            instance: {
              id: top.id,
              step: top,
              ...(known?.mainComponent?.id && !known.mainComponent.remote
                ? { mainId: known.mainComponent.id }
                : {}),
            },
          }
        : pivot === 'layers'
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
    // The instance's own record gives its name and where it is.
    if (instanceId && record.nodeId === instanceId) {
      group.title = record.nodeName
      group.subtitle = pathBelow(record.path, entryName)
    }
    group.records.push(record)
  }
  const result = [...groups.values()]
  // In the Variables view, the most used variables first; in the Layers
  // view, the layers of the frame first and the instances after them.
  if (pivot === 'variables') {
    result.sort((a, b) => b.records.length - a.records.length)
  } else {
    result.sort((a, b) => Number(!!a.instance) - Number(!!b.instance))
  }
  return result
}

/** How many bindings a group has, and how many need attention. */
function groupSummary(
  records: BindingRecord[],
  categoryOf: (record: BindingRecord) => Category,
  kept: KeptModes,
): string {
  const parts = [values(records.length)]
  const held = (record: BindingRecord) =>
    isHeld(categoryOf(record), isKeptWaiting(record.id, kept))
  for (const category of ['check', 'byHand', 'none'] as const) {
    const count = records.filter(
      (record) => categoryOf(record) === category && !held(record),
    ).length
    if (count > 0) {
      parts.push(`${count} ${CATEGORY_LABELS[category].toLowerCase()}`)
    }
  }
  // Held modes are No equivalent in the counts, but say Waiting here, as
  // their badges do.
  const waiting = records.filter(held).length
  if (waiting > 0) parts.push(`${waiting} ${HELD_LABEL.toLowerCase()}`)
  return parts.join(', ')
}

/**
 * What an instance group says about the values it overrides, the ones it
 * takes from its main component, and the ones on layers in its slots outside
 * the instances there, which are its own, as layers in a frame are.
 */
function instanceNote(
  overridden: number,
  inherited: number,
  inSlots: number,
): string {
  const own =
    overridden === 1
      ? 'This instance overrides 1 value. It is marked Overridden in the instance, and a legacy one changes here.'
      : `This instance overrides ${overridden} values. They are marked Overridden in the instance, and the legacy ones change here.`
  const main =
    inherited === 1
      ? 'The value marked From the main component changes with its main component or library.'
      : 'The values marked From the main component change with its main component or library.'
  const slots =
    inSlots === 1
      ? 'The value on a layer in its slots, outside the instances there, changes here, as in a frame.'
      : `The ${inSlots} values on layers in its slots, outside the instances there, change here, as in a frame.`
  const parts =
    overridden === 0
      ? inherited > 0
        ? [
            'This instance overrides none of the values in it. The ones marked From the main component change with it or its library.',
          ]
        : []
      : [own, ...(inherited > 0 ? [main] : [])]
  return [...parts, ...(inSlots > 0 ? [slots] : [])].join(' ')
}

/**
 * For a main component, or a layer inside one: how far a change reaches,
 * since every instance of the component follows it.
 */
function componentReach(entry: EntrySummary): string {
  const count = entry.instanceCount
  const parts = [
    entry.insideComponent &&
      `This layer is inside the main component ${entry.insideComponent.name}.`,
    count !== undefined &&
      `${entry.insideComponent ? 'It is used' : 'Used'} ${count} time${count === 1 ? '' : 's'} in the file.`,
    'Every instance changes with it, and keeps the text and other overrides set in it.',
  ]
  return parts.filter(Boolean).join(' ')
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
  componentInstances,
  overrides,
  kept = NO_KEPT_MODES,
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
  const frameGroups = filterGroups(mapping, new Set([entry.id]))
  const [chosenFilter, setFilter] = useState<Filter>('all')
  // The frame stays open through the scan after an apply. When the apply
  // empties the status that was chosen, such as Ready, its chip is no longer
  // offered, so the list shows every status instead of nothing.
  const filter: Filter =
    chosenFilter !== 'all' && entry.counts[chosenFilter] === 0
      ? 'all'
      : chosenFilter
  const [property, setProperty] = useState<'all' | PropertyGroup>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [pivot, setPivot] = useState<Pivot>('layers')
  const [open, setOpen] = useState<Set<string>>(new Set())

  const categories: Category[] = [
    ...SCORED_CATEGORIES,
    ...(entry.counts.other > 0 ? (['other'] as const) : []),
  ]
  // After a designer's choice a binding counts as Ready, or as Needs check
  // when a Ready value is set to Decide later, and a legacy mode the next
  // Apply keeps counts as Waiting, the same as in the health bar.
  const categoryOf = (record: BindingRecord) =>
    effectiveCategory(record, overrides, kept)
  const byStatus = (records ?? []).filter(
    (record) => filter === 'all' || categoryOf(record) === filter,
  )
  const properties = PROPERTY_GROUPS.filter((candidate) =>
    (records ?? []).some((record) => record.group === candidate),
  )
  const shown = byStatus.filter(
    (record) => property === 'all' || record.group === property,
  )
  const groups = groupRecords(shown, pivot, entry.name, oldInstances ?? [])
  // Opened main components, and layers inside one, are marked in Figma's
  // component purple, since a change there reaches every instance.
  const isMain = entry.kind === 'component'
  const inside = entry.insideComponent
  const heading = (
    <div className="health-heading">
      <h2 className="inspector-title">{entry.name}</h2>
      <span className="health-value">{formatHealth(entry.health)}</span>
    </div>
  )
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
        <div className="entry-actions">
          {inside && (
            <Button
              variant="secondary"
              size="small"
              aria-label={`Go to the main component ${inside.name}`}
              onClick={() => onSelect([inside.id])}
            >
              Go to main component
            </Button>
          )}
          <Button
            variant="secondary"
            size="small"
            aria-label={`Go to ${entry.name}`}
            onClick={() => onSelect(entry.nodeIds)}
          >
            Go to
          </Button>
        </div>
      </div>
      {isMain || inside ? (
        <div className="stack-tight main-component-context">
          <span>
            {inside ? (
              <InsideMainComponent name={inside.name} />
            ) : (
              <MainComponentLabel />
            )}
          </span>
          {heading}
          <p className="muted">{componentReach(entry)}</p>
        </div>
      ) : (
        heading
      )}
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
            kept={kept}
            entryNames={new Map([[entry.id, entry.name]])}
            selection={selection}
            showCounts={showCounts}
            inInstances={entry.counts.inInstance}
            where={isMain ? 'in this main component' : 'in this frame'}
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
              // A Manual fix is decided one at a time, never in a bulk change.
              const mappable = group.records.filter(
                (record) => isMappable(record) && record.category !== 'byHand',
              )
              const overridden = group.records.filter(
                (record) => record.override,
              ).length
              // Layers in a slot the instance owns, outside the instances
              // there, are neither overridden nor from the main component.
              const inSlots = group.records.filter(
                (record) => record.instanceId === undefined,
              ).length
              const inherited = group.records.length - overridden - inSlots
              // A hidden layer, or an instance hidden as a whole, says so
              // once in its header; a hidden layer in a shown instance says
              // so on its row.
              const hidden = group.records.every((record) => record.hidden)
              const state = groupState(
                selection,
                mappable.map((record) => record.id),
              )
              // One value; in an instance, `node` is the instance in the
              // tree whose own layer it is on.
              const row = (record: BindingRecord, node?: TreeNode) => {
                const target = isMappable(record)
                  ? effectiveTarget(record, overrides)
                  : undefined
                const decided = target !== undefined && !isUndecided(target)
                // What a Manual fix's reset also removes and
                // sets again, whatever its status.
                const effects =
                  record.category === 'byHand'
                    ? resetEffectsText(record.resetEffects, isMappable(record))
                    : undefined
                // A legacy mode the next Apply keeps says what
                // it waits for: as its reason while it waits,
                // beside the new mode once it sets one.
                const keep = kept[record.id]
                const waits = isKeptWaiting(record.id, kept)
                const keptText = keep && keptModeText(keep)
                return (
                  <BindingRow
                    key={record.id}
                    title={
                      node && record.nodeId !== node.id
                        ? `${record.nodeName}: ${propertyLabel(record.property)}`
                        : propertyLabel(record.property)
                    }
                    old={record.old}
                    target={targetText(record, overrides, kept)}
                    note={
                      target
                        ? sourceLabel(target.source, target.target)
                        : undefined
                    }
                    reason={
                      waits && keptText
                        ? keptText
                        : decided
                          ? undefined
                          : record.reason
                    }
                    effects={[
                      ...(effects ? [effects] : []),
                      ...(keptText && !waits ? [keptText] : []),
                    ]}
                    category={categoryOf(record)}
                    held={isHeld(categoryOf(record), waits)}
                    {...(group.instance && record.instanceId
                      ? {
                          origin: record.override
                            ? ('override' as const)
                            : ('main' as const),
                        }
                      : {})}
                    hidden={!hidden && !node?.hidden && record.hidden === true}
                    changeable={isMappable(record)}
                    selectable={
                      isMappable(record) && record.category !== 'byHand'
                    }
                    selected={selection.has(record.id)}
                    onToggle={(selected) =>
                      selection.set([selectable(record)], selected)
                    }
                    onSelectLayer={() => onSelect([record.nodeId])}
                    onChange={() => onChange(record)}
                  />
                )
              }
              // An instance shows the values on its own layers, then the
              // instances in it as a tree with their values as the leaves.
              const tree =
                isOpen && group.instance
                  ? valueTree(group.instance.step, group.records)
                  : undefined
              return (
                <Accordion.Item
                  key={group.key}
                  open={isOpen}
                  onOpenChange={(next) => toggleOpen(group.key, next)}
                >
                  <Accordion.Header>
                    <span className="group-header">
                      <span className="binding-name">
                        {group.instance && (
                          <span className="kind-label">Instance</span>
                        )}{' '}
                        {group.title}
                      </span>
                      {hidden && (
                        <span className="hidden-label">{HIDDEN_LABEL}</span>
                      )}
                      <span className="binding-path">
                        {[
                          group.subtitle,
                          groupSummary(group.records, categoryOf, kept),
                          group.instance &&
                            overridden > 0 &&
                            `${overridden} overridden`,
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
                          <span className="apply-buttons">
                            {group.instance && (
                              <InfoButton
                                label={`About the values in ${group.title}`}
                              >
                                <p>
                                  {instanceNote(overridden, inherited, inSlots)}
                                </p>
                              </InfoButton>
                            )}
                            {group.instance?.mainId && (
                              <Button
                                size="small"
                                variant="secondary"
                                onClick={() =>
                                  onSelect([group.instance?.mainId as string])
                                }
                              >
                                Go to main component
                              </Button>
                            )}
                            <Button
                              size="small"
                              variant="secondary"
                              aria-label={`Go to ${group.title}`}
                              onClick={() =>
                                onSelect([
                                  ...new Set(
                                    group.records.map(
                                      (record) => record.nodeId,
                                    ),
                                  ),
                                ])
                              }
                            >
                              Go to
                            </Button>
                          </span>
                        </div>
                        {tree && hasInner(tree.root) ? (
                          <InstanceTree
                            parent={tree.root}
                            legacyOnly={false}
                            leaves={(key, owner, depth) => (
                              <ul
                                className="binding-list tree-leaves"
                                style={{ '--_depth': depth } as never}
                              >
                                {(tree.own.get(key) ?? []).map((record) =>
                                  row(record, owner),
                                )}
                              </ul>
                            )}
                            onSelect={onSelect}
                          />
                        ) : (
                          // An instance without instances in it lists its
                          // values as a layer does, the overrides first.
                          <ul className="binding-list">
                            {(tree
                              ? (tree.own.get(tree.root.key) ?? [])
                              : group.records
                            ).map((record) => row(record, tree?.root))}
                          </ul>
                        )}
                      </div>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              )
            })}
          </Accordion>
        )}
      </Tabs>

      {(isMain || inside) && (
        <ComponentInstances
          instances={componentInstances}
          componentName={entry.name}
          onSelect={onSelect}
        />
      )}
      {!isMain && !inside && oldInstances && oldInstances.length > 0 && (
        <section className="stack-tight" aria-labelledby="old-instances">
          <SectionHeading
            id="old-instances"
            level={3}
            title="Instances with legacy variables"
            label="About instances with legacy variables"
          >
            <p>
              The plugin does not change a value an instance takes from its main
              component. A component in this file changes with its main
              component. The plugin migrates variables, not components: swap an
              instance of a library component to an EDS Beta component in Figma,
              and its legacy values go with it. A value an instance overrides is
              listed above, marked Overridden in the instance, and changes here.
            </p>
          </SectionHeading>
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
                    aria-label={`Go to the ${plural(group.instances.length, 'instance')} of ${group.name}`}
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
          toReview={
            reviewItems(mapping, overrides, new Set([entry.id]), kept).length
          }
          preview={{ entryIds: [entry.id] }}
          where={isMain ? 'in this main component' : 'in this frame'}
          kind={isMain ? 'component' : 'frame'}
          inComponent={inside !== undefined}
          mainComponents={
            isMain || inside
              ? { count: 1, instances: entry.instanceCount ?? 0 }
              : undefined
          }
          changed={entry.changed}
          done={entry.health === 1}
          busy={busy}
          onApply={onApply}
          onReview={onReview}
          onRevert={onRevert}
        />
      )}
    </div>
  )
}
