import { useState } from 'react'
import {
  Accordion,
  Badge,
  Button,
  Checkbox,
  Chip,
} from '@equinor/eds-core-react/next'
import { CATEGORY_LABELS, GROUP_LABELS, propertyLabel } from '../../scan/labels'
import { bindingOutcome, targetCounts } from '../../scan/mapping'
import type {
  MappingBinding,
  MappingGroup,
  MappingRow,
  Overrides,
  TargetCount,
} from '../../scan/mapping'
import { PROPERTY_GROUPS } from '../../scan/types'
import type { Category, PropertyGroup } from '../../scan/types'
import { BADGES } from '../badges'
import { pathBelow } from '../paths'
import { groupState } from '../selection'
import type { Selection, SelectedBinding } from '../selection'
import { sourceLabel, targetLabel } from '../targets'
import { BindingRow } from './BindingRow'

type MappingViewProps = {
  groups: MappingGroup[]
  overrides: Overrides
  /** Entry id → name, to say which frame a binding is in */
  entryNames: Map<string, string>
  selection: Selection
  onSelectOld: (oldKey: string) => void
  onSelectLayer: (nodeIds: string[]) => void
  onChangeRow: (group: MappingGroup, row: MappingRow) => void
  onChangeBinding: (
    group: MappingGroup,
    row: MappingRow,
    binding: MappingBinding,
  ) => void
}

type Status = 'all' | 'sure' | 'check' | 'none'

const STATUSES: Exclude<Status, 'all'>[] = ['sure', 'check', 'none']

/** The row's own target: its change if it has one, otherwise the proposal. */
function rowTargetText(row: MappingRow, overrides: Overrides): string {
  if (row.key in overrides.rows) return targetLabel(overrides.rows[row.key])
  return row.outcome === 'none'
    ? 'No equivalent; stays as it is'
    : targetLabel(row.proposal ?? null)
}

function countText({ target, noEquivalent, count }: TargetCount): string {
  const label = noEquivalent
    ? 'No equivalent; stays as it is'
    : targetLabel(target)
  return `${label} ×${count}`
}

/**
 * What the bindings become, counted over each binding's own target, so a
 * change on single bindings shows in the heading too: “→ text/primary ×13 ·
 * Leave as it is ×3”.
 */
function targetsText(counts: TargetCount[], shown: number): string {
  const head = counts.slice(0, shown).map(countText).join(' · ')
  const rest = counts.length - shown
  return rest > 0
    ? `→ ${head} · ${rest} more target${rest === 1 ? '' : 's'}`
    : `→ ${head}`
}

function selectableBinding(
  group: MappingGroup,
  row: MappingRow,
  binding: MappingBinding,
): SelectedBinding {
  return {
    id: binding.id,
    kind: binding.kind,
    group: group.group,
    candidates: row.candidates,
  }
}

/** The categories in a row with their counts, most first. */
function rowCategories(
  row: MappingRow,
  overrides: Overrides,
): [Category, number][] {
  const counts = new Map<Category, number>()
  for (const binding of row.bindings) {
    const { category } = bindingOutcome(row, binding, overrides)
    counts.set(category, (counts.get(category) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
}

/** Says which of the row's bindings follow a choice someone made. */
function rowNotes(row: MappingRow, overrides: Overrides): string[] {
  const notes: string[] = []
  const rowChoice = sourceLabel(row.key in overrides.rows ? 'row' : 'proposal')
  if (rowChoice) notes.push(rowChoice)
  const own = row.bindings.filter(
    (binding) => binding.id in overrides.records,
  ).length
  if (own === row.count) notes.push('Your choice for each binding')
  else if (own > 0)
    notes.push(`Your choice for ${own} of ${row.count}, one by one`)
  return notes
}

function CategoryBadge({
  category,
  count,
}: {
  category: Category
  count?: number
}) {
  const badge = BADGES[category]
  return (
    <Badge tone={badge.tone} emphasis={badge.emphasis}>
      {category === 'check' ? '⚠ ' : ''}
      {CATEGORY_LABELS[category]}
      {count === undefined ? '' : ` ${count}`}
    </Badge>
  )
}

/**
 * Every binding still to migrate, grouped by the legacy variable it uses, in
 * an accordion. Each group opens to one row per proposal, with the layers
 * under it. Changing a row's target changes it for every binding in the row;
 * a change on one binding wins over it. A binding a designer has decided on
 * counts as Ready, or as No equivalent when it is left as it is.
 */
export function MappingView({
  groups,
  overrides,
  entryNames,
  selection,
  onSelectOld,
  onSelectLayer,
  onChangeRow,
  onChangeBinding,
}: MappingViewProps) {
  const [status, setStatus] = useState<Status>('all')
  const [property, setProperty] = useState<'all' | PropertyGroup>('all')
  const [open, setOpen] = useState<Set<string>>(new Set())

  const matches = (row: MappingRow, binding: MappingBinding) =>
    status === 'all' ||
    bindingOutcome(row, binding, overrides).category === status
  const bindingCount = (
    filter: (group: MappingGroup) => boolean,
    test: (row: MappingRow, binding: MappingBinding) => boolean,
  ) =>
    groups
      .filter(filter)
      .flatMap((group) => group.rows)
      .reduce(
        (sum, row) =>
          sum + row.bindings.filter((binding) => test(row, binding)).length,
        0,
      )
  const countFor = (outcome: Exclude<Status, 'all'>) =>
    bindingCount(
      (group) => property === 'all' || group.group === property,
      (row, binding) =>
        bindingOutcome(row, binding, overrides).category === outcome,
    )
  const properties = PROPERTY_GROUPS.filter((candidate) =>
    groups.some((group) => group.group === candidate),
  )
  const shown = groups
    .filter((group) => property === 'all' || group.group === property)
    .map((group) => ({
      ...group,
      rows: group.rows.filter((row) =>
        row.bindings.some((binding) => matches(row, binding)),
      ),
    }))
    .filter((group) => group.rows.length > 0)
  // With one frame in the scope, its name would be the same on every row.
  const entries = new Set(
    groups.flatMap((group) =>
      group.rows.flatMap((row) => row.bindings.map((b) => b.entryId)),
    ),
  )
  const bindingPath = (binding: MappingBinding) =>
    entries.size === 1
      ? pathBelow(binding.path, entryNames.get(binding.entryId))
      : binding.path.join(' / ') || entryNames.get(binding.entryId)

  if (groups.length === 0) {
    return <p className="muted">Nothing left to migrate in the scope.</p>
  }

  return (
    <div className="stack">
      <p className="muted">
        Every legacy variable in the scope, with what it becomes. Open one to
        see the layers that use it. A change on a row applies to every binding
        in it; tick bindings to change many at once.
      </p>
      <div className="filter-row">
        <span className="filter-label" id="mapping-status">
          Status
        </span>
        <div className="filters" role="group" aria-labelledby="mapping-status">
          <Chip selected={status === 'all'} onClick={() => setStatus('all')}>
            All
          </Chip>
          {STATUSES.map((outcome) => (
            <Chip
              key={outcome}
              selected={status === outcome}
              onClick={() => setStatus(outcome)}
            >
              {CATEGORY_LABELS[outcome]} {countFor(outcome)}
            </Chip>
          ))}
        </div>
      </div>
      {properties.length > 1 && (
        <div className="filter-row">
          <span className="filter-label" id="mapping-property">
            Property
          </span>
          <div
            className="filters"
            role="group"
            aria-labelledby="mapping-property"
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
                {bindingCount((group) => group.group === candidate, matches)}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <Accordion className="binding-groups">
        {shown.map((group) => {
          const isOpen = open.has(group.oldKey)
          return (
            <Accordion.Item
              key={group.oldKey}
              open={isOpen}
              onOpenChange={(next) =>
                setOpen((previous) => {
                  const copy = new Set(previous)
                  if (next) copy.add(group.oldKey)
                  else copy.delete(group.oldKey)
                  return copy
                })
              }
            >
              <Accordion.Header>
                <span className="group-header">
                  <span className="binding-name">{group.old}</span>
                  <span className="binding-path">
                    {[
                      group.oldCollection,
                      `${group.count} binding${group.count === 1 ? '' : 's'}`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                  <span className="binding-swap">
                    {targetsText(targetCounts(group.rows, overrides), 1)}
                  </span>
                </span>
              </Accordion.Header>
              <Accordion.Panel>
                {isOpen && (
                  <div className="stack-tight">
                    <div>
                      <Button
                        size="small"
                        variant="secondary"
                        aria-label={`Go to the layers that use ${group.old}`}
                        onClick={() => onSelectOld(group.oldKey)}
                      >
                        Go to layers
                      </Button>
                    </div>
                    {group.rows.map((row) => {
                      const categories = rowCategories(row, overrides)
                      const undecided = row.bindings.some(
                        (binding) =>
                          bindingOutcome(row, binding, overrides).source ===
                          'proposal',
                      )
                      const state = groupState(
                        selection,
                        row.bindings.map((binding) => binding.id),
                      )
                      return (
                        <section key={row.key} className="mapping-row-block">
                          <div className="mapping-row">
                            <Checkbox
                              className="binding-check"
                              aria-label={`Select all ${row.count} bindings that become ${rowTargetText(row, overrides)}`}
                              checked={state.checked}
                              indeterminate={state.indeterminate}
                              onChange={(event) =>
                                selection.set(
                                  row.bindings.map((binding) =>
                                    selectableBinding(group, row, binding),
                                  ),
                                  event.target.checked,
                                )
                              }
                            />
                            <div className="mapping-target">
                              <span className="binding-swap binding-new">
                                {targetsText(targetCounts([row], overrides), 2)}
                              </span>
                              {rowNotes(row, overrides).map((note) => (
                                <span key={note} className="override-note">
                                  {note}
                                </span>
                              ))}
                              {row.outcome !== 'sure' &&
                                undecided &&
                                row.reason && (
                                  <span className="binding-reason">
                                    {row.reason}
                                  </span>
                                )}
                            </div>
                            <div className="binding-actions">
                              {categories.length === 1 ? (
                                <CategoryBadge category={categories[0][0]} />
                              ) : (
                                categories.map(([category, count]) => (
                                  <CategoryBadge
                                    key={category}
                                    category={category}
                                    count={count}
                                  />
                                ))
                              )}
                              <Button
                                size="small"
                                variant="secondary"
                                aria-label={`Change the target of all ${row.count}`}
                                onClick={() => onChangeRow(group, row)}
                              >
                                Change all
                              </Button>
                            </div>
                          </div>
                          <ul className="binding-list nested">
                            {row.bindings
                              .filter((binding) => matches(row, binding))
                              .map((binding) => {
                                const outcome = bindingOutcome(
                                  row,
                                  binding,
                                  overrides,
                                )
                                const own = outcome.source === 'record'
                                return (
                                  <BindingRow
                                    key={binding.id}
                                    title={`${binding.nodeName} · ${propertyLabel(binding.property)}`}
                                    subtitle={bindingPath(binding)}
                                    target={
                                      own
                                        ? targetLabel(outcome.target)
                                        : rowTargetText(row, overrides)
                                    }
                                    note={
                                      own ? sourceLabel('record') : undefined
                                    }
                                    category={outcome.category}
                                    changeable
                                    selected={selection.has(binding.id)}
                                    onToggle={(selected) =>
                                      selection.set(
                                        [
                                          selectableBinding(
                                            group,
                                            row,
                                            binding,
                                          ),
                                        ],
                                        selected,
                                      )
                                    }
                                    onSelectLayer={() =>
                                      onSelectLayer([binding.nodeId])
                                    }
                                    onChange={() =>
                                      onChangeBinding(group, row, binding)
                                    }
                                  />
                                )
                              })}
                          </ul>
                        </section>
                      )
                    })}
                  </div>
                )}
              </Accordion.Panel>
            </Accordion.Item>
          )
        })}
      </Accordion>
    </div>
  )
}
