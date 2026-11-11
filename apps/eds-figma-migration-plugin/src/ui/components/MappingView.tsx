import { useState } from 'react'
import {
  Accordion,
  Badge,
  Button,
  Checkbox,
  Chip,
} from '@equinor/eds-core-react/next'
import { CATEGORY_LABELS, GROUP_LABELS, propertyLabel } from '../../scan/labels'
import type {
  MappingBinding,
  MappingGroup,
  MappingRow,
  Overrides,
} from '../../scan/mapping'
import { PROPERTY_GROUPS } from '../../scan/types'
import type { PropertyGroup } from '../../scan/types'
import { BADGES } from '../badges'
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

function rowTarget(row: MappingRow, overrides: Overrides) {
  return row.key in overrides.rows
    ? { target: overrides.rows[row.key], source: 'row' as const }
    : { target: row.proposal ?? null, source: 'proposal' as const }
}

function rowTargetText(row: MappingRow, overrides: Overrides): string {
  const { target, source } = rowTarget(row, overrides)
  return row.outcome === 'none' && source === 'proposal'
    ? 'No equivalent; stays as it is'
    : targetLabel(target)
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

/** “→ background/surface ×40 · 1 more target” */
function groupTargets(group: MappingGroup, overrides: Overrides): string {
  const [first, ...rest] = group.rows
  const text = `→ ${rowTargetText(first, overrides)} ×${first.count}`
  return rest.length > 0
    ? `${text} · ${rest.length} more target${rest.length === 1 ? '' : 's'}`
    : text
}

/**
 * Every binding still to migrate, grouped by the legacy variable it uses, in
 * an accordion. Each group opens to one row per proposal, with the layers
 * under it. Changing a row's target changes it for every binding in the row;
 * a change on one binding wins over it.
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

  const countFor = (outcome: Exclude<Status, 'all'>) =>
    groups
      .flatMap((group) => group.rows)
      .filter((row) => row.outcome === outcome)
      .reduce((sum, row) => sum + row.count, 0)
  const properties = PROPERTY_GROUPS.filter((candidate) =>
    groups.some((group) => group.group === candidate),
  )
  const shown = groups
    .filter((group) => property === 'all' || group.group === property)
    .map((group) => ({
      ...group,
      rows: group.rows.filter(
        (row) => status === 'all' || row.outcome === status,
      ),
    }))
    .filter((group) => group.rows.length > 0)

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
                {GROUP_LABELS[candidate]}
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
                    {groupTargets(group, overrides)}
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
                      const { source } = rowTarget(row, overrides)
                      const badge = BADGES[row.outcome]
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
                              <span className="binding-swap">
                                <span aria-hidden="true">→ </span>
                                <span className="binding-new">
                                  {rowTargetText(row, overrides)}
                                </span>
                                <span className="binding-path">
                                  {' '}
                                  ×{row.count}
                                </span>
                              </span>
                              {sourceLabel(source) && (
                                <span className="override-note">
                                  {sourceLabel(source)}
                                </span>
                              )}
                              {row.outcome !== 'sure' && row.reason && (
                                <span className="binding-reason">
                                  {row.reason}
                                </span>
                              )}
                            </div>
                            <div className="binding-actions">
                              <Badge
                                tone={badge.tone}
                                emphasis={badge.emphasis}
                              >
                                {row.outcome === 'check' ? '⚠ ' : ''}
                                {CATEGORY_LABELS[row.outcome]}
                              </Badge>
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
                            {row.bindings.map((binding) => {
                              const own = binding.id in overrides.records
                              return (
                                <BindingRow
                                  key={binding.id}
                                  title={`${binding.nodeName} · ${propertyLabel(binding.property)}`}
                                  subtitle={entryNames.get(binding.entryId)}
                                  target={
                                    own
                                      ? targetLabel(
                                          overrides.records[binding.id],
                                        )
                                      : rowTargetText(row, overrides)
                                  }
                                  note={own ? sourceLabel('record') : undefined}
                                  category={row.outcome}
                                  changeable
                                  selected={selection.has(binding.id)}
                                  onToggle={(selected) =>
                                    selection.set(
                                      [selectableBinding(group, row, binding)],
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
