import { useState } from 'react'
import { Button, Checkbox, Chip, Icon } from '@equinor/eds-core-react/next'
import { chevron_down, chevron_up, edit } from '@equinor/eds-icons'
import { bindingOutcome, targetCounts } from '../../../../src/scan/mapping'
import type {
  MappingBinding,
  MappingGroup,
  MappingRow,
  Overrides,
  TargetCount,
} from '../../../../src/scan/mapping'
import { PROPERTY_GROUPS } from '../../../../src/scan/types'
import type { Category, PropertyGroup } from '../../../../src/scan/types'
import { CLEAR_MODE } from '../../../../src/scan/classify'
import { CATEGORY_LABELS, propertyLabel, values } from '../labels'
import { pathBelow } from '../paths'
import { groupState } from '../selection'
import type { Selection, SelectedBinding } from '../selection'
import { sourceLabel, targetLabel } from '../targets'
import { BindingRow } from './BindingRow'
import { Tabs } from './Tabs'
import { Preview, valueText } from './VariableList'

type MappingViewProps = {
  groups: MappingGroup[]
  overrides: Overrides
  /** Entry id → name, to say which frame a binding is in */
  entryNames: Map<string, string>
  selection: Selection
  colorScheme: 'light' | 'dark'
  /** Show the number of layers in each row, from the settings menu */
  showCounts?: boolean
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

/** Sections inside a tab, by what the values are on, as in Figma's Check designs. */
const SECTION_LABELS: Record<string, string> = {
  fill: 'Fill',
  textFill: 'Text colour',
  stroke: 'Stroke',
  effect: 'Effect colour',
  spacing: 'Padding and gaps',
  size: 'Width and height',
  radius: 'Corner radius',
  strokeWeight: 'Stroke weight',
  opacity: 'Opacity',
  typography: 'Text style',
  modes: 'Mode',
  other: 'Other',
}

/** Short tab labels, so all six fit in the window (final review FR8). */
const TAB_LABELS: Record<PropertyGroup, string> = {
  colour: 'Colour',
  typography: 'Type',
  spacing: 'Spacing',
  size: 'Size',
  radius: 'Radius',
  modes: 'Modes',
  other: 'Other',
}

/**
 * The legacy side of a row in words (final review FR2 and FR3): typography as
 * “UI body · sm · squished” instead of three variable names, and a mode with
 * its collection, “Appearance: Danger”.
 */
function legacyText(group: MappingGroup): string {
  if (group.group === 'typography') {
    const names = group.old.split(', ')
    const family = names.some((name) => name.includes('/header/'))
      ? 'Header'
      : 'UI body'
    const step = names
      .map((name) => /\/([a-z0-9]+)\/font-size/.exec(name)?.[1])
      .find(Boolean)
    const lineHeight = names
      .map((name) => /line-height-(\w+)/.exec(name)?.[1])
      .find(Boolean)
    const weight = names.some((name) => name.includes('font-weight-bolder'))
      ? 'bolder'
      : undefined
    return [family, step, lineHeight, weight].filter(Boolean).join(' · ')
  }
  if (group.group === 'modes' && group.oldCollection) {
    const collection = group.oldCollection.replace(/^[^\p{L}]+/u, '')
    return `${collection}: ${group.old}`
  }
  return group.old
}

/** The target of a row in a few words; a mode that is only cleared says so. */
function shortTarget(row: MappingRow, overrides: Overrides): string {
  const target = rowTarget(row, overrides)
  if (target === CLEAR_MODE) return 'Remove the legacy mode'
  return rowTargetText(row, overrides)
}

type Item = { group: MappingGroup; row: MappingRow }

function sectionOf(item: Item): string {
  if (item.group.group === 'typography') return 'typography'
  if (item.group.group === 'modes') return 'modes'
  return item.row.kind ?? 'other'
}

/** The row's own target: its change if it has one, otherwise the proposal. */
function rowTargetText(row: MappingRow, overrides: Overrides): string {
  if (row.key in overrides.rows) return targetLabel(overrides.rows[row.key])
  return row.outcome === 'none'
    ? 'No equivalent; stays as it is'
    : targetLabel(row.proposal ?? null)
}

function rowTarget(row: MappingRow, overrides: Overrides): string | null {
  if (row.key in overrides.rows) return overrides.rows[row.key]
  return row.proposal ?? null
}

function countText({ target, noEquivalent, count }: TargetCount): string {
  const label = noEquivalent
    ? 'No equivalent; stays as it is'
    : targetLabel(target)
  return `${label} ×${count}`
}

function selectableBinding(
  item: Item,
  binding: MappingBinding,
): SelectedBinding {
  return {
    id: binding.id,
    kind: binding.kind,
    group: item.group.group,
    candidates: item.row.candidates,
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

/**
 * The status of a row as dots in the colours of the health bar, so a row
 * stays on one line, as in Check designs. The names are there for screen
 * readers and on hover.
 */
function StatusDots({ categories }: { categories: [Category, number][] }) {
  const text = categories
    .map(([category, count]) =>
      categories.length === 1
        ? CATEGORY_LABELS[category]
        : `${CATEGORY_LABELS[category]} ${count}`,
    )
    .join(', ')
  return (
    <span className="check-status" title={text}>
      {categories.map(([category]) => (
        <span
          key={category}
          className="health-swatch"
          data-category={category}
          aria-hidden="true"
        />
      ))}
      {categories.some(([category]) => category === 'check') && (
        <span aria-hidden="true">⚠</span>
      )}
      <span className="visually-hidden">{text}</span>
    </span>
  )
}

/**
 * Every legacy variable in the scope with what it becomes, laid out like
 * Figma's Check designs (UX review F6 and F7): tabs by kind of value,
 * sections by what the values are on, and one row per legacy variable and
 * target, with the number of layers, the legacy variable, and the target
 * with its colour or value. A click on a row selects its layers; the target
 * opens the picker; the chevron lists the layers, each with its own Change.
 */
export function MappingView({
  groups,
  overrides,
  entryNames,
  selection,
  colorScheme,
  showCounts = true,
  onSelectOld,
  onSelectLayer,
  onChangeRow,
  onChangeBinding,
}: MappingViewProps) {
  const properties = PROPERTY_GROUPS.filter((candidate) =>
    groups.some((group) => group.group === candidate),
  )
  const [tab, setTab] = useState<PropertyGroup>(
    properties.includes('colour') ? 'colour' : (properties[0] ?? 'colour'),
  )
  const [status, setStatus] = useState<Status>('all')
  const [open, setOpen] = useState<Set<string>>(new Set())

  if (groups.length === 0) {
    return <p className="muted">Nothing left to migrate in the scope.</p>
  }

  const matches = (row: MappingRow, binding: MappingBinding) =>
    status === 'all' ||
    bindingOutcome(row, binding, overrides).category === status
  const items: Item[] = groups.flatMap((group) =>
    group.rows.map((row) => ({ group, row })),
  )
  const countIn = (
    filter: (item: Item) => boolean,
    test: (row: MappingRow, binding: MappingBinding) => boolean,
  ) =>
    items
      .filter(filter)
      .reduce(
        (sum, { row }) =>
          sum + row.bindings.filter((binding) => test(row, binding)).length,
        0,
      )
  const inTab = (item: Item) => item.group.group === tab
  const shown = items.filter(
    (item) =>
      inTab(item) &&
      item.row.bindings.some((binding) => matches(item.row, binding)),
  )
  const sections = new Map<string, Item[]>()
  for (const item of shown) {
    const key = sectionOf(item)
    sections.set(key, [...(sections.get(key) ?? []), item])
  }
  // With one frame in the scope, its name would be the same on every row.
  const entries = new Set(
    items.flatMap(({ row }) => row.bindings.map((b) => b.entryId)),
  )
  const bindingPath = (binding: MappingBinding) =>
    entries.size === 1
      ? pathBelow(binding.path, entryNames.get(binding.entryId))
      : binding.path.join(' / ') || entryNames.get(binding.entryId)
  const toggle = (key: string) =>
    setOpen((previous) => {
      const copy = new Set(previous)
      if (copy.has(key)) copy.delete(key)
      else copy.add(key)
      return copy
    })

  return (
    <div className="stack">
      <Tabs
        compact
        label="Kind of value"
        tabs={properties.map((candidate) => ({
          id: candidate,
          label: (
            <>
              {TAB_LABELS[candidate]}{' '}
              <span className="tab-count">
                {countIn((item) => item.group.group === candidate, matches)}
              </span>
            </>
          ),
        }))}
        selected={tab}
        onSelect={(next) => {
          setTab(next)
          setOpen(new Set())
        }}
      >
        <div className="filter-row">
          <span className="filter-label" id="mapping-status">
            Status
          </span>
          <div
            className="filters"
            role="group"
            aria-labelledby="mapping-status"
          >
            <Chip selected={status === 'all'} onClick={() => setStatus('all')}>
              All
            </Chip>
            {STATUSES.map((outcome) => {
              const count = countIn(
                inTab,
                (row, binding) =>
                  bindingOutcome(row, binding, overrides).category === outcome,
              )
              return count > 0 ? (
                <Chip
                  key={outcome}
                  selected={status === outcome}
                  onClick={() => setStatus(outcome)}
                >
                  {CATEGORY_LABELS[outcome]} {count}
                </Chip>
              ) : null
            })}
          </div>
        </div>

        {shown.length === 0 && (
          <p className="muted">Nothing with this status in the tab.</p>
        )}

        {[...sections.entries()].map(([section, sectionItems]) => {
          const layers = [
            ...new Set(
              sectionItems.flatMap(({ row }) =>
                row.bindings.map((binding) => binding.nodeId),
              ),
            ),
          ]
          return (
            <section key={section} className="check-section">
              <div className="check-section-header">
                <h3 className="group-title">
                  {SECTION_LABELS[section] ?? section}
                </h3>
                <Button
                  size="small"
                  variant="ghost"
                  aria-label={`Go to the ${layers.length} layers with ${SECTION_LABELS[section] ?? section}`}
                  onClick={() => onSelectLayer(layers)}
                >
                  Go to all
                </Button>
              </div>
              <ul className="check-rows">
                {sectionItems.map((item) => {
                  const { group, row } = item
                  const isOpen = open.has(row.key)
                  const counts = targetCounts([row], overrides)
                  const categories = rowCategories(row, overrides)
                  const target = rowTarget(row, overrides)
                  const extra = valueText(target)
                  const state = groupState(
                    selection,
                    row.bindings.map((binding) => binding.id),
                  )
                  const own = row.bindings.filter(
                    (binding) => binding.id in overrides.records,
                  ).length
                  return (
                    <li key={row.key} className="check-row-block">
                      <div className="check-row">
                        <Checkbox
                          className="binding-check"
                          aria-label={`Select the ${row.count} values that use ${group.old}`}
                          checked={state.checked}
                          indeterminate={state.indeterminate}
                          onChange={(event) =>
                            selection.set(
                              row.bindings.map((binding) =>
                                selectableBinding(item, binding),
                              ),
                              event.target.checked,
                            )
                          }
                        />
                        <button
                          type="button"
                          className="check-legacy"
                          title={`${group.old}${group.oldCollection ? ` (${group.oldCollection})` : ''}`}
                          aria-label={`Go to the ${row.count} layers that use ${group.old}`}
                          onClick={() => onSelectOld(group.oldKey)}
                        >
                          {showCounts && (
                            <span className="check-count">{row.count}</span>
                          )}
                          <span className="check-legacy-name">
                            {legacyText(group)}
                          </span>
                        </button>
                        <span className="check-arrow" aria-hidden="true">
                          →
                        </span>
                        <button
                          type="button"
                          className="check-target"
                          aria-label={`Change the target of all ${row.count}: now ${rowTargetText(row, overrides)}`}
                          onClick={() => onChangeRow(group, row)}
                        >
                          <Preview name={target} colorScheme={colorScheme} />
                          <span className="check-target-text">
                            <span className="check-target-name">
                              {counts.length === 1
                                ? shortTarget(row, overrides)
                                : counts.map(countText).join(' · ')}
                            </span>
                            {extra && counts.length === 1 && (
                              <span className="option-value">{extra}</span>
                            )}
                          </span>
                          {(own > 0 || row.key in overrides.rows) && (
                            <span
                              className="check-choice"
                              title={
                                row.key in overrides.rows
                                  ? sourceLabel('row')
                                  : own === row.count
                                    ? 'Your choice for each value'
                                    : `Your choice for ${own} of ${row.count}`
                              }
                            >
                              <Icon data={edit} size="sm" />
                            </span>
                          )}
                          <StatusDots categories={categories} />
                          <Icon data={chevron_down} size="sm" />
                        </button>
                        <Button
                          variant="ghost"
                          size="small"
                          icon
                          aria-expanded={isOpen}
                          aria-label={
                            isOpen
                              ? `Hide the layers that use ${group.old}`
                              : `Show the layers that use ${group.old}`
                          }
                          onClick={() => toggle(row.key)}
                        >
                          <Icon
                            data={isOpen ? chevron_up : chevron_down}
                            size="sm"
                          />
                        </Button>
                      </div>
                      {isOpen && (
                        <ul className="binding-list nested">
                          {row.bindings
                            .filter((binding) => matches(row, binding))
                            .map((binding) => {
                              const outcome = bindingOutcome(
                                row,
                                binding,
                                overrides,
                              )
                              const mine = outcome.source === 'record'
                              return (
                                <BindingRow
                                  key={binding.id}
                                  title={`${binding.nodeName} · ${propertyLabel(binding.property)}`}
                                  subtitle={bindingPath(binding)}
                                  target={
                                    mine
                                      ? targetLabel(outcome.target)
                                      : rowTargetText(row, overrides)
                                  }
                                  note={
                                    mine ? sourceLabel('record') : undefined
                                  }
                                  category={outcome.category}
                                  changeable
                                  selected={selection.has(binding.id)}
                                  onToggle={(selected) =>
                                    selection.set(
                                      [selectableBinding(item, binding)],
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
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </Tabs>
      <p className="muted">
        {values(
          countIn(
            () => true,
            () => true,
          ),
        )}{' '}
        still to migrate in the scope. A click on a legacy variable selects its
        layers; the target opens the picker and changes every value in the row.
      </p>
    </div>
  )
}
