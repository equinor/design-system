/**
 * What an apply run changes, worked out from the scan and the designer's
 * choices without touching the document, so it can be tested without Figma.
 */
import { literalValue } from '../mapping/literal'
import { isResetTarget, resetVariable } from '../mapping/reset'
import {
  blockedModes,
  CLEAR_MODE,
  modeBlockers,
  REMOVE_ANYWAY,
} from './classify'
import { conversionId } from './conversions'
import { propertyLabel } from './labels'
import {
  DECIDE_LATER,
  effectiveCategory,
  effectiveTarget,
  isMappable,
} from './mapping'
import type { KeptModes, Overrides } from './mapping'
import type { BindingRecord, Category, OldInstance } from './types'

/** How a change came about, for the change log. */
export type ChangeOutcome =
  /** The rule's only target */
  | 'sure'
  /**
   * A proposal that needed a check or had no equivalent, confirmed by a
   * designer, or a legacy mode a designer removes anyway (REMOVE_ANYWAY)
   */
  | 'confirmed'
  /** A target a designer chose instead of the proposal */
  | 'override'

export type PlannedChange = {
  record: BindingRecord
  /** A variable or text style name, `collection: mode`, CLEAR_MODE, REMOVE_ANYWAY, or a reset (mapping/reset.ts) */
  target: string
  outcome: ChangeOutcome
}

/**
 * How a change came about. Removing a legacy mode anyway is never a
 * proposal, but a designer's decision on a mode the rules or the run keep,
 * so it is confirmed rather than an override.
 */
export function changeOutcome(
  record: BindingRecord,
  target: string,
): ChangeOutcome {
  if (target === REMOVE_ANYWAY) return 'confirmed'
  if (target !== record.candidates?.[0]) return 'override'
  return record.category === 'sure' ? 'sure' : 'confirmed'
}

/**
 * Every binding in the entries that is Ready, after the designer's choices,
 * and has a target. A value set to Decide later is never Ready, and is left
 * out here as well. Bindings and typography come first, and modes last,
 * because a legacy mode is only cleared once the bindings below it have
 * changed. With `recordIds`, only those bindings: Apply on the values a
 * designer has selected.
 */
export function planChanges(
  records: BindingRecord[],
  overrides: Overrides,
  entryIds: Set<string>,
  recordIds?: Set<string>,
): PlannedChange[] {
  const changes: PlannedChange[] = []
  for (const record of records) {
    if (!entryIds.has(record.entryId) || !isMappable(record)) continue
    if (recordIds && !recordIds.has(record.id)) continue
    if (effectiveCategory(record, overrides) !== 'sure') continue
    const { target } = effectiveTarget(record, overrides)
    if (target === null || target === DECIDE_LATER) continue
    changes.push({ record, target, outcome: changeOutcome(record, target) })
  }
  // A reset removes the changes on a layer and the layers below it, and puts
  // them back as they were, so it runs before anything else changes there.
  const isReset = (change: PlannedChange) => isResetTarget(change.target)
  return [
    ...changes.filter(isReset),
    ...changes.filter((change) => !isModeChange(change) && !isReset(change)),
    ...changes.filter(isModeChange),
  ]
}

/** A change of a legacy mode, which a run makes after the bindings. */
export function isModeChange(change: PlannedChange): boolean {
  return change.record.property.type === 'mode'
}

/** A binding on a legacy variable, outside a mode: what keeps a legacy mode in place. */
function isLegacyBinding(record: BindingRecord): boolean {
  return (
    record.property.type !== 'mode' &&
    ['sure', 'check', 'byHand', 'none', 'inInstance'].includes(record.category)
  )
}

/**
 * The legacy modes that have to stay after a run, as `nodeId|collectionKey`:
 * those above a legacy binding that the run did not change.
 */
export function modesToKeep(
  records: BindingRecord[],
  changed: Set<string>,
): Set<string> {
  return blockedModes(
    records,
    (record) => isLegacyBinding(record) && !changed.has(record.id),
  )
}

/**
 * The bindings that keep each legacy mode in a run, by `nodeId|collectionKey`:
 * the legacy bindings below it that read the mode and that the run does not
 * change (`changed` has the ids of the bindings it changes).
 */
function holdersInRun(
  records: BindingRecord[],
  changed: ReadonlySet<string>,
): Map<string, BindingRecord[]> {
  return modeBlockers(
    records,
    (record) => isLegacyBinding(record) && !changed.has(record.id),
  )
}

function modeKey(record: BindingRecord): string | undefined {
  return record.oldMode && `${record.nodeId}|${record.oldMode.collectionKey}`
}

/**
 * The mode changes of a run whose legacy mode stays, by record id, each
 * with the bindings that keep it: the legacy bindings below it that read
 * the mode and that the run does not change (`changed` has the ids of the
 * bindings it changes). A legacy mode stays while values below read it,
 * whatever the target: the proposal, a designer's choice of clearing it,
 * which confirms the proposal, or another new mode. Only REMOVE_ANYWAY, a
 * designer's explicit choice, removes it while values below read it.
 *
 * keptModes plans with it, and applyChanges (plugin/apply/apply.ts) runs
 * with it once the bindings have changed, so the window, the preview and
 * the run keep the same modes. A run keeps more only when a binding below
 * fails.
 */
export function keptModeChanges(
  records: BindingRecord[],
  modes: PlannedChange[],
  changed: ReadonlySet<string>,
): Map<string, BindingRecord[]> {
  const blockers = holdersInRun(records, changed)
  const kept = new Map<string, BindingRecord[]>()
  for (const change of modes) {
    const key = modeKey(change.record)
    if (!key || change.target === REMOVE_ANYWAY) continue
    const holders = blockers.get(key)
    if (holders) kept.set(change.record.id, holders)
  }
  return kept
}

/** The ids of the bindings a run changes: every planned change outside the modes. */
function changedIn(plan: PlannedChange[]): Set<string> {
  return new Set(
    plan
      .filter((change) => !isModeChange(change))
      .map((change) => change.record.id),
  )
}

/** A planned mode change whose legacy mode the run keeps. */
export type KeptModeChange = {
  record: BindingRecord
  target: string
  /**
   * True when the run sets a new mode, and the legacy mode stays beside it.
   * False for a mode that is only cleared: the run changes nothing there.
   */
  setsMode: boolean
  /** The legacy bindings below that read the mode and that the run leaves */
  holders: BindingRecord[]
}

function keptInPlan(
  records: BindingRecord[],
  plan: PlannedChange[],
): KeptModeChange[] {
  const modes = plan.filter(isModeChange)
  const kept = keptModeChanges(records, modes, changedIn(plan))
  return modes.flatMap((change) => {
    const holders = kept.get(change.record.id)
    return holders
      ? [
          {
            record: change.record,
            target: change.target,
            setsMode: parseModeTarget(change.target) !== null,
            holders,
          },
        ]
      : []
  })
}

/**
 * The legacy modes a run would keep: the planned mode changes (planChanges,
 * with the same arguments) above a legacy binding that the run leaves, such
 * as a value set to Decide later, a Needs check nobody has decided, a value
 * inside an instance, or, with `recordIds`, a value that is not selected.
 */
export function keptModes(
  records: BindingRecord[],
  overrides: Overrides,
  entryIds: Set<string>,
  recordIds?: Set<string>,
): KeptModeChange[] {
  return keptInPlan(
    records,
    planChanges(records, overrides, entryIds, recordIds),
  )
}

/** "Icon, width", as the reset effects name a value. */
function valueName(record: BindingRecord): string {
  return `${record.nodeName}, ${propertyLabel(record.property).toLowerCase()}`
}

/** "Icon, width", "Icon, width and Label, fill", "Icon, width and 2 more values below". */
function valuesList(records: BindingRecord[]): string {
  const names = [...new Set(records.map(valueName))]
  if (records.length === 1) return names[0]
  if (records.length === 2 && names.length === 2) {
    return `${names[0]} and ${names[1]}`
  }
  const more = records.length - 1
  return `${names[0]} and ${more} more value${more === 1 ? '' : 's'} below`
}

/** "Icon, width is decided", "Icon, width and 2 more values below are decided". */
function valuesClause(
  records: BindingRecord[],
  [one, many]: [string, string],
): string {
  return `${valuesList(records)} ${records.length === 1 ? one : many}`
}

/** "A", "A and B", "A and 3 more" */
function namesList(names: string[]): string {
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names[0]} and ${names.length - 1} more`
}

/** "a", "a and b", "a, b and c" */
function joinClauses(clauses: string[]): string {
  if (clauses.length <= 1) return clauses[0] ?? ''
  return `${clauses.slice(0, -1).join(', ')} and ${clauses[clauses.length - 1]}`
}

/**
 * What a kept legacy mode waits for, from the bindings that keep it, to
 * follow "once" or "until": "Icon, width is decided", "the main component
 * Button is migrated". Values a designer still decides on, Manual fixes,
 * values without a target, and with `recordIds` Ready values that are not
 * selected are named by layer and property. Values inside instances are
 * named by what migrates them: the main component in this file, the swap
 * to an EDS Beta component for a library component, or the conversion of
 * a Typography instance.
 */
export function waitsFor(
  holders: BindingRecord[],
  overrides: Overrides,
  oldInstances: OldInstance[],
  recordIds?: ReadonlySet<string>,
): string {
  const instances = new Map(oldInstances.map((item) => [item.id, item]))
  const notSelected: BindingRecord[] = []
  const notApplied: BindingRecord[] = []
  const undecided: BindingRecord[] = []
  const fixes: BindingRecord[] = []
  const noTarget: BindingRecord[] = []
  const fromMain: BindingRecord[] = []
  const mains = new Set<string>()
  const swaps = new Set<string>()
  const typography = new Set<string>()
  for (const holder of holders) {
    const category = effectiveCategory(holder, overrides)
    if (category === 'inInstance') {
      const instance = holder.instanceId
        ? instances.get(holder.instanceId)
        : undefined
      const main = instance?.mainComponent
      if (instance?.typography) typography.add(instance.name)
      else if (main && main.remote) swaps.add(instance.name)
      else if (main) mains.add(main.name)
      else fromMain.push(holder)
    } else if (category === 'sure') {
      // Ready, so a run leaves it only when it is not selected, or in
      // another entry than the run's.
      if (recordIds && !recordIds.has(holder.id)) notSelected.push(holder)
      else notApplied.push(holder)
    } else if (category === 'byHand') fixes.push(holder)
    else if (category === 'none' && (holder.candidates?.length ?? 0) === 0) {
      noTarget.push(holder)
    } else undecided.push(holder)
  }
  const clauses: string[] = []
  if (notSelected.length > 0) {
    clauses.push(
      valuesClause(notSelected, [
        'is selected and applied',
        'are selected and applied',
      ]),
    )
  }
  if (notApplied.length > 0) {
    clauses.push(valuesClause(notApplied, ['is applied', 'are applied']))
  }
  if (undecided.length > 0) {
    clauses.push(valuesClause(undecided, ['is decided', 'are decided']))
  }
  if (fixes.length > 0) {
    clauses.push(valuesClause(fixes, ['is fixed', 'are fixed']))
  }
  if (noTarget.length > 0) {
    clauses.push(
      valuesClause(noTarget, [
        'no longer uses a legacy variable',
        'no longer use legacy variables',
      ]),
    )
  }
  if (mains.size > 0) {
    clauses.push(
      mains.size === 1
        ? `the main component ${[...mains][0]} is migrated`
        : `the main components ${namesList([...mains])} are migrated`,
    )
  }
  if (swaps.size > 0) {
    clauses.push(
      swaps.size === 1
        ? `the instance ${[...swaps][0]} is swapped to an EDS Beta component`
        : `the instances ${namesList([...swaps])} are swapped to EDS Beta components`,
    )
  }
  if (typography.size > 0) {
    clauses.push(
      typography.size === 1
        ? `the Typography instance ${[...typography][0]} is converted to text`
        : `the Typography instances ${namesList([...typography])} are converted to text`,
    )
  }
  if (fromMain.length > 0) {
    clauses.push(
      valuesClause(fromMain, [
        'changes with its main component',
        'change with their main components',
      ]),
    )
  }
  return joinClauses(clauses)
}

/**
 * What the window needs to know about the legacy modes in the entries, with
 * the designer's choices, worked out from the plan of the next Apply:
 *
 * - `kept`: the modes the run keeps, by record id, with what each waits
 *   for. The window and the health bar count a kept mode that is only
 *   cleared as Waiting, so Ready is what the run changes.
 * - `blocked`: every legacy mode that values below it read and that the run
 *   leaves, by record id, with what clearing it waits for, whether the run
 *   changes the mode or not. A mode set to Decide later is in it, so Review
 *   and the picker can say what clearing it waits for, and offer
 *   REMOVE_ANYWAY.
 */
export type ModeWaits = {
  kept: KeptModes
  blocked: Record<string, string>
}

export function modeWaits(
  records: BindingRecord[],
  overrides: Overrides,
  entryIds: Set<string>,
  oldInstances: OldInstance[],
): ModeWaits {
  const plan = planChanges(records, overrides, entryIds)
  const kept: KeptModes = Object.fromEntries(
    keptInPlan(records, plan).map((item) => [
      item.record.id,
      {
        setsMode: item.setsMode,
        waitsFor: waitsFor(item.holders, overrides, oldInstances),
      },
    ]),
  )
  const holders = holdersInRun(records, changedIn(plan))
  const blocked: Record<string, string> = {}
  for (const record of records) {
    const key = record.property.type === 'mode' ? modeKey(record) : undefined
    if (!key || !entryIds.has(record.entryId) || !isMappable(record)) continue
    const found = holders.get(key)
    if (found) blocked[record.id] = waitsFor(found, overrides, oldInstances)
  }
  return { kept, blocked }
}

/** The kept legacy modes of modeWaits. */
export function keptModesByRecord(
  records: BindingRecord[],
  overrides: Overrides,
  entryIds: Set<string>,
  oldInstances: OldInstance[],
): KeptModes {
  return modeWaits(records, overrides, entryIds, oldInstances).kept
}

/** A legacy mode a run keeps, as the Apply confirmation names it. */
export type KeptModePreview = {
  id: string
  /** The layer the legacy mode is on */
  layer: string
  /** The legacy mode, such as "Density: Spacious" */
  mode: string
  /** True when the run sets a new mode beside it */
  setsMode: boolean
  /** What it waits for, as in KeptMode */
  waitsFor: string
}

/** A legacy mode a designer removes anyway, as the Apply confirmation names it. */
export type RemovedModePreview = {
  id: string
  /** The layer the legacy mode is on */
  layer: string
  /** The legacy mode, such as "Density: Spacious" */
  mode: string
  /** The values below that read it, and change: "Icon, width and 2 more values below" */
  below: string
}

/** What a run will do, counted from its plan, for the Apply confirmations. */
export type RunPreview = {
  /**
   * Changes the run makes: every planned change except a legacy mode that
   * is only cleared and that the run keeps. The same as the Ready count.
   */
  changes: number
  /** Values bound to EDS Beta variables, a Manual fix's size included */
  variables: number
  /** Numbers set without a variable, such as border widths */
  numbers: number
  /** Text styles applied */
  textStyles: number
  /** New modes set */
  modesSet: number
  /** Legacy modes removed, those removed anyway included */
  modesCleared: number
  /**
   * Of the legacy modes removed, the ones a designer removes anyway
   * (REMOVE_ANYWAY) while values below read them, which then change
   */
  modesRemovedAnyway: RemovedModePreview[]
  /** Legacy modes that stay, with what they wait for */
  modesKept: KeptModePreview[]
  /** Layers inside instances reset for a Manual fix */
  resets: number
  /** Of the changes, values an instance overrides, which change in the instance */
  inInstances: number
}

/** "Density: Spacious" for a legacy mode, as the rows in Changes name it. */
function modeLabel(record: BindingRecord): string {
  const collection = (record.oldCollection ?? '').replace(/^[^\p{L}]+/u, '')
  return collection ? `${collection}: ${record.old ?? ''}` : (record.old ?? '')
}

/**
 * Counts what a run would do, from the same plan the run makes
 * (planChanges) and the same kept modes (keptModes), so the confirmation
 * says what Apply then does. With `recordIds`, Apply on the selected
 * values, and the kept modes name the values below that are not selected.
 */
export function previewRun(
  records: BindingRecord[],
  overrides: Overrides,
  entryIds: Set<string>,
  recordIds?: Set<string>,
  oldInstances: OldInstance[] = [],
): RunPreview {
  const plan = planChanges(records, overrides, entryIds, recordIds)
  const kept = new Map(
    keptInPlan(records, plan).map((item) => [item.record.id, item]),
  )
  const holders = holdersInRun(records, changedIn(plan))
  const preview: RunPreview = {
    changes: 0,
    variables: 0,
    numbers: 0,
    textStyles: 0,
    modesSet: 0,
    modesCleared: 0,
    modesRemovedAnyway: [],
    modesKept: [],
    resets: 0,
    inInstances: 0,
  }
  const reset = new Set<string>()
  for (const change of plan) {
    const { record, target } = change
    const keep = kept.get(record.id)
    if (isModeChange(change)) {
      const setsMode = parseModeTarget(target) !== null
      if (setsMode) preview.modesSet += 1
      if (keep) {
        preview.modesKept.push({
          id: record.id,
          layer: record.nodeName,
          mode: modeLabel(record),
          setsMode,
          waitsFor: waitsFor(keep.holders, overrides, oldInstances, recordIds),
        })
      } else {
        preview.modesCleared += 1
        const key = modeKey(record)
        const below = key ? holders.get(key) : undefined
        if (target === REMOVE_ANYWAY && below) {
          preview.modesRemovedAnyway.push({
            id: record.id,
            layer: record.nodeName,
            mode: modeLabel(record),
            below: valuesList(below),
          })
        }
      }
      // A legacy mode that is only cleared and stays is no change.
      if (keep && !setsMode) continue
    } else if (isResetTarget(target)) {
      reset.add(record.nodeId)
      if (resetVariable(target)) preview.variables += 1
      else preview.numbers += 1
    } else if (record.property.type === 'typography') {
      preview.textStyles += 1
    } else if (literalValue(target) !== undefined) {
      preview.numbers += 1
    } else {
      preview.variables += 1
    }
    preview.changes += 1
    if (record.override) preview.inInstances += 1
  }
  preview.resets = reset.size
  return preview
}

/**
 * Splits `density: compact` into its collection and mode; null for a mode
 * that is only cleared, CLEAR_MODE or REMOVE_ANYWAY.
 */
export function parseModeTarget(
  target: string,
): { collection: 'density' | 'color-scheme'; mode: string } | null {
  if (target === CLEAR_MODE || target === REMOVE_ANYWAY) return null
  const [collection, mode] = target.split(':').map((part) => part.trim())
  if ((collection !== 'density' && collection !== 'color-scheme') || !mode) {
    throw new Error(`Not a mode target: ${target}`)
  }
  return { collection, mode }
}

/** A text style or colour a conversion sets, and how it came about, for the change log. */
export type ConversionTarget = {
  record: BindingRecord
  target: string
  outcome: ChangeOutcome
}

export type PlannedConversion = {
  instanceId: string
  style: ConversionTarget
  /** The EDS Beta colour; without it the legacy fill is copied, and Changes lists it after converting */
  colour?: ConversionTarget
}

/** An instance Convert leaves as it is, and why. */
export type SkippedConversion = {
  instanceId: string
  /** The instance's text, or its name, when the scan has a record for it */
  name?: string
  reason: string
}

export type ConversionPlan = {
  convert: PlannedConversion[]
  skipped: SkippedConversion[]
}

/** What a value of a conversion gets after the designer's choices. */
export type ConversionDecision = {
  category: Category
  target: string | null
}

export const NO_LEGACY_TYPOGRAPHY =
  'No legacy typography was read in the instance, so no text style can be matched.'

/**
 * Why Convert leaves an instance, from its text style after the designer's
 * choices; undefined when the text style is Ready and the instance is
 * converted. The window disables Convert on the instance with this reason,
 * and the plugin reports it when the instance is skipped.
 */
export function conversionSkipReason(
  style: ConversionDecision | undefined,
): string | undefined {
  if (!style) return NO_LEGACY_TYPOGRAPHY
  if (style.target === DECIDE_LATER) {
    return 'Its text style is set to Decide later, so Convert leaves it.'
  }
  if (style.category === 'sure' && style.target !== null) return undefined
  if (style.category === 'none') {
    return 'The EDS Beta has no text style for this text. Choose the stand-in or another style before converting.'
  }
  return 'Its text style needs a check. Confirm the proposal or choose another style before converting.'
}

/**
 * The EDS Beta colour a conversion sets: the target of a Ready colour,
 * proposed or chosen. Undefined when the colour needs a check, has no
 * equivalent and no choice, or is set to Decide later: the new text layer
 * then keeps the legacy variable, and Changes lists it after converting.
 */
export function conversionColour(
  fill: ConversionDecision | undefined,
): string | undefined {
  if (!fill || fill.category !== 'sure') return undefined
  if (fill.target === null || fill.target === DECIDE_LATER) return undefined
  return fill.target
}

/**
 * What Convert does with each instance, worked out from the conversion
 * records and the designer's choices, the same way Apply plans its changes.
 * An instance is converted when its text style is Ready after the choices,
 * with that style and with the colour from conversionColour. Otherwise it is
 * skipped with the reason from conversionSkipReason.
 */
export function planConversions(
  conversions: BindingRecord[],
  overrides: Overrides,
  instanceIds: Iterable<string>,
): ConversionPlan {
  const byId = new Map(conversions.map((record) => [record.id, record]))
  const decided = (record: BindingRecord | undefined) =>
    record && {
      category: effectiveCategory(record, overrides),
      target: effectiveTarget(record, overrides).target,
    }
  const plan: ConversionPlan = { convert: [], skipped: [] }
  for (const instanceId of new Set(instanceIds)) {
    const style = byId.get(conversionId(instanceId, 'typography'))
    const fill = byId.get(conversionId(instanceId, 'fill'))
    const styleDecision = decided(style)
    const reason = conversionSkipReason(styleDecision)
    if (reason !== undefined || !style || !styleDecision?.target) {
      plan.skipped.push({
        instanceId,
        ...(style ? { name: style.nodeName } : {}),
        reason: reason ?? NO_LEGACY_TYPOGRAPHY,
      })
      continue
    }
    const target = styleDecision.target
    const colour = conversionColour(decided(fill))
    plan.convert.push({
      instanceId,
      style: { record: style, target, outcome: changeOutcome(style, target) },
      ...(fill && colour !== undefined
        ? {
            colour: {
              record: fill,
              target: colour,
              outcome: changeOutcome(fill, colour),
            },
          }
        : {}),
    })
  }
  return plan
}
