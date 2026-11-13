import { useState } from 'react'
import { schemesOf } from '../../mapping/scheme'
import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  Icon,
  Tooltip,
} from '@equinor/eds-core-react/next'
import {
  chevron_down,
  chevron_up,
  edit,
  info_circle,
  visibility,
  warning_filled,
} from '@equinor/eds-icons'
import { colourDistance, VISIBLE_CHANGE } from '../../mapping/colour-distance'
import { getNewVariable } from '../../mapping/inventory'
import { bindingOutcome, targetCounts } from '../../scan/mapping'
import type {
  MappingBinding,
  MappingGroup,
  MappingRow,
  Overrides,
  TargetCount,
} from '../../scan/mapping'
import { PROPERTY_GROUPS } from '../../scan/types'
import type { Category, OldInstance, PropertyGroup } from '../../scan/types'
import { CLEAR_MODE } from '../../scan/classify'
import { CATEGORY_LABELS, propertyLabel, values } from '../labels'
import { pathBelow } from '../paths'
import { plainReason } from '../plain'
import { groupState } from '../selection'
import type { Selection, SelectedBinding } from '../selection'
import { sourceLabel, targetLabel, unchangedLabel } from '../targets'
import { BindingRow } from './BindingRow'
import { Tabs } from './Tabs'
import { TypographyView } from './TypographyView'
import { Preview, pxList, valueText } from './VariableList'

/** The tabs in Changes: a kind of value, or the legacy Typography component */
export type ChangesTab = PropertyGroup | 'typography-component'

type MappingViewProps = {
  groups: MappingGroup[]
  overrides: Overrides
  /** Entry id → name, to say which frame a binding is in */
  entryNames: Map<string, string>
  selection: Selection
  /** Show the number of layers in each row, from the settings menu */
  showCounts?: boolean
  /** Legacy values inside instances in the scope, which Changes leaves out */
  inInstances?: number
  /**
   * The selected tab, when the overview keeps it so the Instances tab can
   * open one. Without it, the view keeps its own (in a frame).
   */
  tab?: ChangesTab
  onTab?: (tab: ChangesTab) => void
  /** Instances of the legacy Typography component, on their own tab */
  typographyInstances?: OldInstance[]
  /** Replaces Typography instances with text layers */
  onConvert?: (instanceIds: string[]) => void
  busy?: boolean
  onSelectOld: (oldKey: string) => void
  onSelectLayer: (nodeIds: string[]) => void
  onChangeRow: (group: MappingGroup, row: MappingRow) => void
  onChangeBinding: (
    group: MappingGroup,
    row: MappingRow,
    binding: MappingBinding,
  ) => void
}

type Status = 'all' | 'sure' | 'check' | 'none' | 'excluded'

const STATUSES: Exclude<Status, 'all'>[] = ['sure', 'check', 'none', 'excluded']

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
 * “UI body, sm, squished” instead of three variable names, and a mode with
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
    return [family, step, lineHeight, weight].filter(Boolean).join(', ')
  }
  if (group.group === 'modes' && group.oldCollection) {
    const collection = group.oldCollection.replace(/^[^\p{L}]+/u, '')
    return `${collection}: ${group.old}`
  }
  return group.old
}

/** What one target in a row is called; a mode that is only cleared says so. */
function countLabel({ target, noEquivalent, rule }: TargetCount): string {
  if (noEquivalent) return unchangedLabel(rule)
  if (target === CLEAR_MODE) return 'Remove the legacy mode'
  return targetLabel(target)
}

function countText(count: TargetCount): string {
  return `${countLabel(count)} ×${count.count}`
}

/**
 * What the row's values get after every choice, in a few words: one target,
 * or each target with its number when they differ. A choice on each value
 * counts too, so the row never names a target its values do not get.
 */
function shortTarget(row: MappingRow, overrides: Overrides): string {
  const counts = targetCounts([row], overrides)
  return counts.length === 1
    ? countLabel(counts[0])
    : counts.map(countText).join(', ')
}

/**
 * The target most of the row's values get, for the swatch and the value
 * beside it. Null when they keep the legacy variable: excluded, or with no
 * equivalent, where a proposal is not applied.
 */
function mainTarget(row: MappingRow, overrides: Overrides): string | null {
  const [first] = targetCounts([row], overrides)
  return !first || first.noEquivalent ? null : first.target
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
    ? unchangedLabel(row.rule)
    : targetLabel(row.proposal ?? null)
}

/**
 * True when the new colour looks clearly different from the legacy colour
 * on at least one of the row's layers, each with its own target and in its
 * own colour scheme: the mapping is right by role, but the look moves
 * (decided 2026-11-12). A value that keeps the legacy variable never counts.
 */
function looksDifferent(row: MappingRow, overrides: Overrides): boolean {
  return row.bindings.some((binding) => {
    const { target, category } = bindingOutcome(row, binding, overrides)
    if (!target || !binding.oldColour || category === 'none') return false
    const scheme = binding.scheme ?? 'light'
    const next = getNewVariable(target)?.values?.[scheme]
    if (typeof next !== 'string') return false
    const distance = colourDistance(binding.oldColour, next, scheme)
    return distance !== undefined && distance >= VISIBLE_CHANGE
  })
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
    ...(binding.scheme ? { scheme: binding.scheme } : {}),
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
/**
 * The status of a row as dots in the colours of the health bar, so a row
 * stays on one line, as in Check designs. When the row needs a check or does
 * not change, the status is a button: its tooltip says why in a few words,
 * and a click opens the whole reason.
 */
function StatusCell({
  categories,
  why,
  onWhy,
}: {
  categories: [Category, number][]
  why?: string
  onWhy: () => void
}) {
  const text = categories
    .map(([category, count]) =>
      categories.length === 1
        ? CATEGORY_LABELS[category]
        : `${CATEGORY_LABELS[category]} ${count}`,
    )
    .join(', ')
  const needsCheck = categories.some(([category]) => category === 'check')
  const dots = categories.map(([category]) => (
    <span
      key={category}
      className="health-swatch"
      data-category={category}
      aria-hidden="true"
    />
  ))
  if (!why) {
    return (
      <span className="check-status" title={text}>
        {dots}
        <span className="visually-hidden">{text}</span>
      </span>
    )
  }
  return (
    <Tooltip title={why} placement="left">
      <button
        type="button"
        className="check-status check-why"
        data-kind={needsCheck ? 'check' : 'none'}
        aria-label={`${text}. Why: ${why}`}
        onClick={onWhy}
      >
        {dots}
        <Icon data={needsCheck ? warning_filled : info_circle} size="sm" />
      </button>
    </Tooltip>
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
  showCounts = true,
  inInstances = 0,
  tab: tabProp,
  onTab,
  typographyInstances = [],
  onConvert = () => {},
  busy = false,
  onSelectOld,
  onSelectLayer,
  onChangeRow,
  onChangeBinding,
}: MappingViewProps) {
  const properties = PROPERTY_GROUPS.filter((candidate) =>
    groups.some((group) => group.group === candidate),
  )
  const [ownTab, setOwnTab] = useState<ChangesTab>('colour')
  const requestedTab = tabProp ?? ownTab
  const selectTab = onTab ?? setOwnTab
  const available: ChangesTab[] = [
    ...properties,
    ...(typographyInstances.length > 0
      ? (['typography-component'] as const)
      : []),
  ]
  // The tab asked for, unless the scan has nothing on it
  const tab: ChangesTab = available.includes(requestedTab)
    ? requestedTab
    : available.includes('colour')
      ? 'colour'
      : (available[0] ?? 'colour')
  const [status, setStatus] = useState<Status>('all')
  // Only the rows whose new colour looks clearly different
  const [onlyChanged, setOnlyChanged] = useState(false)
  const [open, setOpen] = useState<Set<string>>(new Set())
  const [why, setWhy] = useState<Item>()

  // Values inside instances are never listed here, and the designer should
  // not have to guess why the numbers differ from the health bar.
  const instancesNote = (
    <p className="muted">
      {inInstances > 0
        ? `Instances are not part of Changes. The ${inInstances} legacy value${inInstances === 1 ? '' : 's'} inside instances change${inInstances === 1 ? 's' : ''} with ${inInstances === 1 ? 'its' : 'their'} main component or library; the Instances tab lists them.`
        : 'Instances are not part of Changes. Values inside an instance change with its main component or library.'}
      {typographyInstances.length > 0 &&
        ' The legacy Typography component is the exception: its instances are on the Typography tab, to be converted to text.'}
    </p>
  )

  if (groups.length === 0 && typographyInstances.length === 0) {
    return (
      <div className="stack">
        {instancesNote}
        <p className="muted">Nothing left to migrate in the scope.</p>
      </div>
    )
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
  const onTypography = tab === 'typography-component'
  const changes = (item: Item) => looksDifferent(item.row, overrides)
  const changedInTab = items.filter((item) => inTab(item) && changes(item))
  const shown = items.filter(
    (item) =>
      inTab(item) &&
      (!onlyChanged || changes(item)) &&
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
      {instancesNote}
      <Tabs
        compact
        label="Kind of value"
        tabs={available.map((candidate) => ({
          id: candidate,
          label: (
            <>
              {candidate === 'typography-component'
                ? 'Typography'
                : TAB_LABELS[candidate]}{' '}
              <span className="tab-count">
                {candidate === 'typography-component'
                  ? typographyInstances.length
                  : countIn((item) => item.group.group === candidate, matches)}
              </span>
            </>
          ),
        }))}
        selected={tab}
        onSelect={(next) => {
          selectTab(next)
          setOpen(new Set())
        }}
      >
        {onTypography ? (
          <TypographyView
            instances={typographyInstances}
            entryNames={entryNames}
            onSelect={onSelectLayer}
            onConvert={onConvert}
            busy={busy}
          />
        ) : (
          <>
            <div className="filter-row">
              <span className="filter-label" id="mapping-status">
                Status
              </span>
              <div
                className="filters"
                role="group"
                aria-labelledby="mapping-status"
              >
                <Chip
                  selected={status === 'all'}
                  onClick={() => setStatus('all')}
                >
                  All
                </Chip>
                {STATUSES.map((outcome) => {
                  const count = countIn(
                    inTab,
                    (row, binding) =>
                      bindingOutcome(row, binding, overrides).category ===
                      outcome,
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
                {(changedInTab.length > 0 || onlyChanged) && (
                  <Chip
                    selected={onlyChanged}
                    onClick={() => setOnlyChanged((current) => !current)}
                  >
                    Looks different {changedInTab.length}
                  </Chip>
                )}
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
                      const target = mainTarget(row, overrides)
                      // The new number in the density each layer will have, and the
                      // legacy number as it resolves on each layer, in px.
                      const extra = valueText(target, [
                        ...new Set(
                          row.bindings.map(
                            (binding) => binding.density ?? 'comfortable',
                          ),
                        ),
                      ])
                      const oldValues = pxList(
                        group.old,
                        row.bindings
                          .map((binding) => binding.oldValue)
                          .filter(
                            (value): value is number => value !== undefined,
                          ),
                      )
                      // The legacy colours as they resolve on the layers, as in
                      // Check designs, so the old and the new can be compared.
                      const oldColours = [
                        ...new Set(
                          row.bindings
                            .map((binding) => binding.oldColour)
                            .filter((colour): colour is string => !!colour),
                        ),
                      ].slice(0, 2)
                      // A Needs check row says why, in plain words, while any
                      // of its values is undecided.
                      const undecided = row.bindings.some(
                        (binding) =>
                          bindingOutcome(row, binding, overrides).source ===
                          'proposal',
                      )
                      const reason =
                        (row.outcome === 'check' || row.outcome === 'none') &&
                        undecided &&
                        row.reason
                          ? (plainReason(row.reason) ?? row.reason)
                          : undefined
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
                              {oldColours.length > 0 && (
                                <span
                                  className="check-swatches"
                                  aria-hidden="true"
                                >
                                  {oldColours.map((colour) => (
                                    <span
                                      key={colour}
                                      className="swatch"
                                      style={{ backgroundColor: colour }}
                                    />
                                  ))}
                                </span>
                              )}
                              <span className="check-legacy-name">
                                {legacyText(group)}
                              </span>
                              {oldValues && (
                                <span className="option-value">
                                  {oldValues}
                                </span>
                              )}
                            </button>
                            <span className="check-arrow" aria-hidden="true">
                              →
                            </span>
                            <button
                              type="button"
                              className="check-target"
                              aria-label={`Change the target of all ${row.count}: now ${shortTarget(row, overrides)}`}
                              onClick={() => onChangeRow(group, row)}
                            >
                              <Preview
                                name={target}
                                schemes={schemesOf(row.bindings)}
                              />
                              <span className="check-target-text">
                                <span className="check-target-name">
                                  {shortTarget(row, overrides)}
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
                              <Icon data={chevron_down} size="sm" />
                            </button>
                            <span className="check-status-group">
                              {looksDifferent(row, overrides) && (
                                <Tooltip title="The new colour looks clearly different from the legacy colour on these layers. The mapping is right by role; check the look before you apply.">
                                  <span
                                    className="check-visible-change"
                                    role="img"
                                    aria-label="Looks clearly different"
                                  >
                                    <Icon data={visibility} size="sm" />
                                  </span>
                                </Tooltip>
                              )}
                              <StatusCell
                                categories={categories}
                                why={reason}
                                onWhy={() => setWhy({ group, row })}
                              />
                            </span>
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
                                      title={`${binding.nodeName}, ${propertyLabel(binding.property)}`}
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
          </>
        )}
      </Tabs>
      {!onTypography && (
        <p className="muted">
          {values(
            countIn(
              () => true,
              () => true,
            ),
          )}{' '}
          still to migrate in the scope. A click on a legacy variable selects
          its layers; the target opens the picker and changes every value in the
          row.
        </p>
      )}
      <Dialog
        open={why !== undefined}
        onOpenChange={(next) => {
          if (!next) setWhy(undefined)
        }}
      >
        {why && (
          <>
            <Dialog.Header>
              <Dialog.Title>
                {why.row.outcome === 'check'
                  ? 'Why it needs a check'
                  : unchangedLabel(why.row.rule)}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Content>
              <p className="binding-swap">
                <span className="binding-old">{legacyText(why.group)}</span>
                <span aria-hidden="true"> → </span>
                <span className="binding-new">
                  {shortTarget(why.row, overrides)}
                </span>
              </p>
              <p>{plainReason(why.row.reason) ?? why.row.reason}</p>
              {plainReason(why.row.reason) && (
                <details className="review-details">
                  <summary>Details</summary>
                  {why.row.reason}
                </details>
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="ghost" onClick={() => setWhy(undefined)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  const item = why
                  setWhy(undefined)
                  onChangeRow(item.group, item.row)
                }}
              >
                {why.row.outcome === 'none' && why.row.candidates.length > 0
                  ? 'Choose what to do'
                  : 'Change target'}
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </div>
  )
}
