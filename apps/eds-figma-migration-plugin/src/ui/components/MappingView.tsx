import { useState } from 'react'
import type { ReactNode } from 'react'
import { Button, Chip } from '@equinor/eds-core-react/next'
import { resetEffectsText } from '../../scan/classify'
import { bindingOutcome, isUndecided } from '../../scan/mapping'
import type {
  MappingBinding,
  MappingGroup,
  MappingRow,
  Overrides,
} from '../../scan/mapping'
import { PROPERTY_GROUPS } from '../../scan/types'
import type { PropertyGroup } from '../../scan/types'
import { CATEGORY_LABELS, isHeld, propertyLabel, values } from '../labels'
import { pathBelow } from '../paths'
import type { Selection } from '../selection'
import { BindingRow } from './BindingRow'
import {
  bindingTarget,
  ChangeRow,
  looksDifferent,
  selectableBinding,
  WhyDialog,
} from './ChangeRow'
import type { Item } from './ChangeRow'
import { Tabs } from './Tabs'

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
  /**
   * The Typography tab, after the kinds of value: the instances of the
   * legacy Typography component, and the view that converts them
   */
  typography?: { count: number; content: ReactNode }
  onSelectOld: (oldKey: string) => void
  onSelectLayer: (nodeIds: string[]) => void
  onChangeRow: (group: MappingGroup, row: MappingRow) => void
  onChangeBinding: (
    group: MappingGroup,
    row: MappingRow,
    binding: MappingBinding,
  ) => void
}

type Status = 'all' | 'sure' | 'check' | 'byHand' | 'none'

const STATUSES: Exclude<Status, 'all'>[] = ['sure', 'check', 'byHand', 'none']

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

/** The section of a row: what its values are on. */
function sectionOf(item: Item): string {
  if (item.group.group === 'typography') return 'typography'
  if (item.group.group === 'modes') return 'modes'
  return item.row.kind ?? 'other'
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
  typography,
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
    ...(typography ? (['typography-component'] as const) : []),
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

  // Values instances take from their main component are never listed here,
  // and the designer should not have to guess why the numbers differ from
  // the health bar. Values an instance overrides are listed.
  const instancesNote = (
    <p className="muted">
      {inInstances > 0
        ? `Values that instances take from their main component are not part of Changes. The ${inInstances} legacy value${inInstances === 1 ? '' : 's'} inside instances change${inInstances === 1 ? 's' : ''} with ${inInstances === 1 ? 'its' : 'their'} main component or library; the Instances tab lists them. Values an instance overrides are listed here, marked Overridden in the instance.`
        : 'Values that instances take from their main component are not part of Changes; they change with the main component or its library. Values an instance overrides are listed here, marked Overridden in the instance.'}
      {typography &&
        ' The legacy Typography component is the exception: its instances are on the Typography tab, to be converted to text.'}
    </p>
  )

  if (groups.length === 0 && !typography) {
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
  // Every value Apply can change is listed, Manual fixes included: an
  // accepted fix is Ready and counted in Apply, so it has to show here too.
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
                  ? (typography?.count ?? 0)
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
          typography?.content
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
                      const manual = row.outcome === 'byHand'
                      return (
                        <ChangeRow
                          key={row.key}
                          item={item}
                          overrides={overrides}
                          showCounts={showCounts}
                          selection={selection}
                          open={open.has(row.key)}
                          onToggle={() => toggle(row.key)}
                          onSelectOld={() => onSelectOld(group.oldKey)}
                          onChangeRow={() => onChangeRow(group, row)}
                          onWhy={() => setWhy(item)}
                        >
                          {open.has(row.key) && (
                            <ul className="binding-list nested">
                              {row.bindings
                                .filter((binding) => matches(row, binding))
                                .map((binding) => {
                                  const { outcome, target, note } =
                                    bindingTarget(row, binding, overrides)
                                  // Changes lists a Manual fix only when the
                                  // plugin can make it.
                                  const effects = manual
                                    ? resetEffectsText(
                                        binding.resetEffects,
                                        true,
                                      )
                                    : undefined
                                  return (
                                    <BindingRow
                                      key={binding.id}
                                      title={`${binding.nodeName}, ${propertyLabel(binding.property)}`}
                                      subtitle={bindingPath(binding)}
                                      target={target}
                                      note={note}
                                      // A Manual fix says how to make it by
                                      // hand until it is decided, and what
                                      // the reset also removes and sets
                                      // again whatever its status.
                                      {...(manual &&
                                      isUndecided(outcome) &&
                                      binding.reason
                                        ? { reason: binding.reason }
                                        : {})}
                                      effects={effects ? [effects] : []}
                                      category={outcome.category}
                                      held={isHeld(outcome.category, row.rule)}
                                      {...(binding.override
                                        ? { origin: 'override' as const }
                                        : {})}
                                      changeable
                                      selectable={!manual}
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
                        </ChangeRow>
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
      <WhyDialog
        item={why}
        overrides={overrides}
        onClose={() => setWhy(undefined)}
        onChangeRow={onChangeRow}
      />
    </div>
  )
}
