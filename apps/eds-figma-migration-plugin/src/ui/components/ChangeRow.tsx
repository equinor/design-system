/**
 * One row of Changes: a legacy variable or typography with its target, laid
 * out like Figma's Check designs. Changes and the Typography tab both list
 * their rows with it, so a conversion shows its text style and colour the
 * same way Apply's changes show theirs.
 */
import type { ReactNode } from 'react'
import {
  Button,
  Checkbox,
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
import { schemesOf } from '../../mapping/scheme'
import { CLEAR_MODE } from '../../scan/classify'
import {
  bindingOutcome,
  DECIDE_LATER,
  isUndecided,
  keptModeText,
  NO_KEPT_MODES,
  ownChoices,
  targetCounts,
} from '../../scan/mapping'
import type {
  BindingOutcome,
  KeptMode,
  KeptModes,
  MappingBinding,
  MappingGroup,
  MappingRow,
  Overrides,
  TargetCount,
} from '../../scan/mapping'
import type { Category } from '../../scan/types'
import { isHeld, KEPT_TARGET_LABEL, statusLabel } from '../labels'
import { plainReason } from '../plain'
import { groupState } from '../selection'
import type { Selection, SelectedBinding } from '../selection'
import {
  REMOVE_ANYWAY_LABEL,
  sourceLabel,
  targetLabel,
  unchangedLabel,
} from '../targets'
import { ResetEffects } from './ResetEffects'
import { Preview, pxList, valueText } from './VariableList'

export type Item = { group: MappingGroup; row: MappingRow }

/** The run that changes a row's values: Apply in Changes, Convert on the Typography tab. */
export type Run = 'Apply' | 'Convert'

/**
 * The legacy side of a row in words (final review FR2 and FR3): typography as
 * “UI body, sm, squished” instead of three variable names, and a mode with
 * its collection, “Appearance: Danger”.
 */
export function legacyText(group: MappingGroup): string {
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

/**
 * What one target in a row is called: a mode that is only cleared says so,
 * a No equivalent value nobody has decided on shows its stand-in, and a
 * legacy mode the next Apply keeps says that it is kept.
 */
function countLabel({ target, noEquivalent, kept }: TargetCount): string {
  if (kept) return KEPT_TARGET_LABEL
  if (noEquivalent) return unchangedLabel(target)
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
export function shortTarget(
  row: MappingRow,
  overrides: Overrides,
  kept: KeptModes = NO_KEPT_MODES,
): string {
  const counts = targetCounts([row], overrides, kept)
  return counts.length === 1
    ? countLabel(counts[0])
    : counts.map(countText).join(', ')
}

/**
 * The target most of the row's values get, for the swatch and the value
 * beside it: for No equivalent, the stand-in. Null when nothing changes yet:
 * the values are set to Decide later, or a legacy mode is kept.
 */
function mainTarget(
  row: MappingRow,
  overrides: Overrides,
  kept: KeptModes,
): string | null {
  const [first] = targetCounts([row], overrides, kept)
  return !first || first.target === DECIDE_LATER || first.kept
    ? null
    : first.target
}

/** The row's own target: its change if it has one, otherwise the proposal or the stand-in. */
function rowTargetText(row: MappingRow, overrides: Overrides): string {
  if (row.key in overrides.rows) return targetLabel(overrides.rows[row.key])
  return row.outcome === 'none'
    ? unchangedLabel(row.proposal)
    : targetLabel(row.proposal ?? null)
}

/**
 * What one value in a row shows: its outcome, its target in words, and who
 * chose it. A legacy mode the next Apply keeps says that it is kept.
 */
export function bindingTarget(
  row: MappingRow,
  binding: MappingBinding,
  overrides: Overrides,
  run: Run = 'Apply',
  kept: KeptModes = NO_KEPT_MODES,
): { outcome: BindingOutcome; target: string; note?: string } {
  const outcome = bindingOutcome(row, binding, overrides, kept)
  const mine = outcome.source === 'record'
  return {
    outcome,
    target: mine
      ? targetLabel(outcome.target)
      : outcome.held && outcome.kept
        ? KEPT_TARGET_LABEL
        : rowTargetText(row, overrides),
    ...(mine ? { note: sourceLabel('record', outcome.target, run) } : {}),
  }
}

/** The values in a row that are legacy modes the next Apply keeps, with what each waits for. */
export function keptInRow(
  row: MappingRow,
  overrides: Overrides,
  kept: KeptModes,
): { binding: MappingBinding; kept: KeptMode }[] {
  return row.bindings.flatMap((binding) => {
    const found = bindingOutcome(row, binding, overrides, kept).kept
    return found ? [{ binding, kept: found }] : []
  })
}

/**
 * What the kept legacy modes in a row wait for, in one sentence: the text
 * of the one mode, or of all of them when it is the same, and otherwise a
 * pointer to the values, which say it each.
 */
function keptRowText(
  entries: { binding: MappingBinding; kept: KeptMode }[],
): string | undefined {
  if (entries.length === 0) return undefined
  const texts = [...new Set(entries.map((entry) => keptModeText(entry.kept)))]
  if (texts.length === 1) return texts[0]
  return entries[0].kept.setsMode
    ? 'Each legacy mode stays beside the new one until the values below it change. Open the row to see what each waits for.'
    : 'Each legacy mode is cleared once the values below it change. Open the row to see what each waits for.'
}

/**
 * True when the new colour looks clearly different from the legacy colour
 * on at least one of the row's layers, each with its own target and in its
 * own colour scheme: the mapping is right by role, but the look moves
 * (decided 2026-11-12). A stand-in counts as the target. A value set to
 * Decide later never counts.
 */
export function looksDifferent(row: MappingRow, overrides: Overrides): boolean {
  return row.bindings.some((binding) => {
    const { target } = bindingOutcome(row, binding, overrides)
    if (!target || target === DECIDE_LATER || !binding.oldColour) return false
    const scheme = binding.scheme ?? 'light'
    const next = getNewVariable(target)?.values?.[scheme]
    if (typeof next !== 'string') return false
    const distance = colourDistance(binding.oldColour, next, scheme)
    return distance !== undefined && distance >= VISIBLE_CHANGE
  })
}

export function selectableBinding(
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
  kept: KeptModes,
): [Category, number][] {
  const counts = new Map<Category, number>()
  for (const binding of row.bindings) {
    const { category } = bindingOutcome(row, binding, overrides, kept)
    counts.set(category, (counts.get(category) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
}

/**
 * Why a row needs a check, has no equivalent or is a Manual fix, in plain
 * words, while any of its values is undecided or set to Decide later. A
 * Manual fix keeps its "How to fix it" once accepted, since the dialog lists
 * what the reset also removes and sets again. A row of legacy modes the next
 * Apply keeps says what they wait for, also when the run sets a new mode.
 */
function rowReason(
  row: MappingRow,
  overrides: Overrides,
  kept: KeptModes,
): string | undefined {
  const keptText = keptRowText(keptInRow(row, overrides, kept))
  if (keptText) return keptText
  const undecided = row.bindings.some((binding) =>
    isUndecided(bindingOutcome(row, binding, overrides)),
  )
  if (row.outcome === 'byHand' && !undecided) {
    return 'Apply resets the layer, and sets again the other changes the reset removes.'
  }
  return (row.outcome === 'check' ||
    row.outcome === 'none' ||
    row.outcome === 'byHand') &&
    undecided &&
    row.reason
    ? (plainReason(row.reason) ?? row.reason)
    : undefined
}

/**
 * The status of a row as dots in the colours of the health bar, so a row
 * stays on one line, as in Check designs. When the row needs a check or does
 * not change, the status is a button: its tooltip says why in a few words,
 * and a click opens the whole reason. The names are there for screen
 * readers and on hover.
 */
function StatusCell({
  categories,
  kept = false,
  why,
  onWhy,
}: {
  categories: [Category, number][]
  /** The row has legacy modes the next Apply keeps, which show as Waiting */
  kept?: boolean
  why?: string
  onWhy: () => void
}) {
  const text = categories
    .map(([category, count]) =>
      categories.length === 1
        ? statusLabel(category, kept)
        : `${statusLabel(category, kept)} ${count}`,
    )
    .join(', ')
  const needsCheck = categories.some(([category]) => category === 'check')
  const dots = categories.map(([category]) => (
    <span
      key={category}
      className="health-swatch"
      data-category={isHeld(category, kept) ? 'held' : category}
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
    <Tooltip title={why} placement="left" className="reason-tooltip">
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

type ChangeRowProps = {
  item: Item
  overrides: Overrides
  /** The legacy modes the next Apply keeps, from the plugin */
  kept?: KeptModes
  /** Show the number of values in the row, from the settings menu */
  showCounts: boolean
  /** What the row's values are on, in the button labels: layers, or instances */
  noun?: string
  /** The run that changes the values, for the note on Decide later */
  run?: Run
  /**
   * Ticks the row's values for the bulk bar. Without it, and for a Manual
   * fix, which is decided one at a time, the row has no checkbox.
   */
  selection?: Selection
  open: boolean
  onToggle: () => void
  /** A click on the legacy side: selects the layers that use it */
  onSelectOld: () => void
  /** A click on the target: opens the picker for every value in the row */
  onChangeRow: () => void
  /** A click on the status of a row that needs a check: opens the whole reason */
  onWhy: () => void
  /** The values in the row, given while it is open */
  children?: ReactNode
}

/**
 * The row: the number of values, the legacy side with its colour or px,
 * the target with its swatch or value, the status, and the chevron that
 * lists the values. A click on the legacy side selects its layers; the
 * target opens the picker.
 */
export function ChangeRow({
  item,
  overrides,
  kept = NO_KEPT_MODES,
  showCounts,
  noun = 'layers',
  run = 'Apply',
  selection,
  open,
  onToggle,
  onSelectOld,
  onChangeRow,
  onWhy,
  children,
}: ChangeRowProps) {
  const { group, row } = item
  const counts = targetCounts([row], overrides, kept)
  const target = mainTarget(row, overrides, kept)
  const keptHere = keptInRow(row, overrides, kept).some(
    (entry) => !entry.kept.setsMode,
  )
  // The new number in the density each layer will have, and the legacy
  // number as it resolves on each layer, in px.
  const extra = valueText(target, [
    ...new Set(row.bindings.map((binding) => binding.density ?? 'comfortable')),
  ])
  const oldValues = pxList(
    group.old,
    row.bindings
      .map((binding) => binding.oldValue)
      .filter((value): value is number => value !== undefined),
  )
  // The legacy colours as they resolve on the layers, as in Check designs,
  // so the old and the new can be compared.
  const oldColours = [
    ...new Set(
      row.bindings
        .map((binding) => binding.oldColour)
        .filter((colour): colour is string => !!colour),
    ),
  ].slice(0, 2)
  const own = ownChoices(row, overrides)
  const manual = row.outcome === 'byHand'
  const state =
    selection && !manual
      ? groupState(
          selection,
          row.bindings.map((binding) => binding.id),
        )
      : undefined
  return (
    <li className="check-row-block">
      <div className="check-row">
        {selection && state ? (
          <Checkbox
            className="binding-check"
            aria-label={`Select the ${row.count} values that use ${group.old}`}
            checked={state.checked}
            indeterminate={state.indeterminate}
            onChange={(event) =>
              selection.set(
                row.bindings.map((binding) => selectableBinding(item, binding)),
                event.target.checked,
              )
            }
          />
        ) : (
          <span className="binding-check" aria-hidden="true" />
        )}
        <button
          type="button"
          className="check-legacy"
          title={`${group.old}${group.oldCollection ? ` (${group.oldCollection})` : ''}`}
          aria-label={`Go to the ${row.count} ${noun} that use ${group.old}`}
          onClick={onSelectOld}
        >
          {showCounts && <span className="check-count">{row.count}</span>}
          {oldColours.length > 0 && (
            <span className="check-swatches" aria-hidden="true">
              {oldColours.map((colour) => (
                <span
                  key={colour}
                  className="swatch"
                  style={{ backgroundColor: colour }}
                />
              ))}
            </span>
          )}
          <span className="check-legacy-name">{legacyText(group)}</span>
          {oldValues && <span className="option-value">{oldValues}</span>}
        </button>
        <span className="check-arrow" aria-hidden="true">
          →
        </span>
        <button
          type="button"
          className="check-target"
          aria-label={`Change the target of all ${row.count}: now ${shortTarget(row, overrides, kept)}`}
          onClick={onChangeRow}
        >
          <Preview name={target} schemes={schemesOf(row.bindings)} />
          <span className="check-target-text">
            <span className="check-target-name">
              {shortTarget(row, overrides, kept)}
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
                  ? sourceLabel('row', overrides.rows[row.key], run)
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
            <Tooltip
              title="The new colour looks clearly different from the legacy colour on these layers. The mapping is right by role; check the look before you apply."
              placement="left"
              className="reason-tooltip"
            >
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
            categories={rowCategories(row, overrides, kept)}
            kept={keptHere}
            why={rowReason(row, overrides, kept)}
            onWhy={onWhy}
          />
        </span>
        <Button
          variant="ghost"
          size="small"
          icon
          aria-expanded={open}
          aria-label={
            open
              ? `Hide the ${noun} that use ${group.old}`
              : `Show the ${noun} that use ${group.old}`
          }
          onClick={onToggle}
        >
          <Icon data={open ? chevron_up : chevron_down} size="sm" />
        </Button>
      </div>
      {children}
    </li>
  )
}

/**
 * One value per layer: the width and the height of a layer are two values
 * in a Manual fix row, but one reset with the same effects.
 */
function layersOf(row: MappingRow): MappingBinding[] {
  const layers = new Map<string, MappingBinding>()
  for (const binding of row.bindings) {
    if (!layers.has(binding.nodeId)) layers.set(binding.nodeId, binding)
  }
  return [...layers.values()]
}

/** A layer's name with its parent's, since many layers share a name, such as an icon in each field. */
function layerName(binding: MappingBinding): string {
  const parent = binding.path[binding.path.length - 1]
  return parent && parent !== binding.nodeName
    ? `${binding.nodeName} in ${parent}`
    : binding.nodeName
}

/**
 * The whole reason a row needs a check, has no equivalent or is a Manual
 * fix, with the way to change it. A Manual fix also lists, per layer, what
 * the reset removes and the plugin sets again, whatever its status.
 */
export function WhyDialog({
  item,
  overrides,
  kept = NO_KEPT_MODES,
  onClose,
  onChangeRow,
}: {
  item?: Item
  overrides: Overrides
  /** The legacy modes the next Apply keeps, from the plugin */
  kept?: KeptModes
  onClose: () => void
  onChangeRow: (group: MappingGroup, row: MappingRow) => void
}) {
  // A row of legacy modes the next Apply keeps says what each waits for.
  const keptHere = item ? keptInRow(item.row, overrides, kept) : []
  const waiting = keptHere.some((entry) => !entry.kept.setsMode)
  const keptTexts = [
    ...new Set(keptHere.map((entry) => keptModeText(entry.kept))),
  ]
  return (
    <Dialog
      open={item !== undefined}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      {item && (
        <>
          <Dialog.Header>
            <Dialog.Title>
              {keptHere.length > 0
                ? waiting
                  ? 'Waiting for the values below'
                  : 'The legacy mode stays beside the new one'
                : item.row.outcome === 'check'
                  ? 'Why it needs a check'
                  : item.row.outcome === 'byHand'
                    ? 'How to fix it'
                    : 'No equivalent in the EDS Beta'}
            </Dialog.Title>
          </Dialog.Header>
          <Dialog.Content>
            <p className="binding-swap">
              <span className="binding-old">{legacyText(item.group)}</span>
              <span aria-hidden="true"> → </span>
              <span className="binding-new">
                {shortTarget(item.row, overrides, kept)}
              </span>
            </p>
            {keptHere.length > 0 ? (
              <>
                {keptTexts.length === 1 ? (
                  <p>{keptTexts[0]}</p>
                ) : (
                  <ul className="review-summary">
                    {keptHere.map((entry) => (
                      <li key={entry.binding.id}>
                        {layerName(entry.binding)}: {keptModeText(entry.kept)}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="muted">
                  {waiting
                    ? `Apply keeps the legacy mode, because values below it read it and are not changed in the same run. To remove it in the next run anyway, choose ${REMOVE_ANYWAY_LABEL}: the legacy values below that read it then change.`
                    : 'Apply sets the new mode, and keeps the legacy one beside it while values below read it. It clears the legacy mode in a later run, once they are changed.'}
                </p>
              </>
            ) : (
              <p>{plainReason(item.row.reason) ?? item.row.reason}</p>
            )}
            {keptHere.length === 0 && plainReason(item.row.reason) && (
              <details className="review-details">
                <summary>Details</summary>
                {item.row.reason}
              </details>
            )}
            {item.row.outcome === 'byHand' &&
              layersOf(item.row).map((binding, _, layers) => (
                <ResetEffects
                  key={binding.nodeId}
                  effects={binding.resetEffects}
                  {...(layers.length > 1 ? { layer: layerName(binding) } : {})}
                />
              ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                onClose()
                onChangeRow(item.group, item.row)
              }}
            >
              {item.row.outcome === 'byHand' || waiting
                ? 'Choose what to do'
                : item.row.outcome === 'none'
                  ? 'Choose a target'
                  : 'Change target'}
            </Button>
          </Dialog.Actions>
        </>
      )}
    </Dialog>
  )
}
