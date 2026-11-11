/**
 * What an apply run changes, worked out from the scan and the designer's
 * choices without touching the document, so it can be tested without Figma.
 */
import { blockedModes, CLEAR_MODE } from './classify'
import { effectiveCategory, effectiveTarget, isMappable } from './mapping'
import type { Overrides } from './mapping'
import type { BindingRecord } from './types'

/** How a change came about, for the change log. */
export type ChangeOutcome =
  /** The rule's only target */
  | 'sure'
  /** A proposal that needed a check or had no equivalent, confirmed by a designer */
  | 'confirmed'
  /** A target a designer chose instead of the proposal */
  | 'override'

export type PlannedChange = {
  record: BindingRecord
  /** A variable or text style name, `collection: mode`, or CLEAR_MODE */
  target: string
  outcome: ChangeOutcome
}

export function changeOutcome(
  record: BindingRecord,
  target: string,
): ChangeOutcome {
  if (target !== record.candidates?.[0]) return 'override'
  return record.category === 'sure' ? 'sure' : 'confirmed'
}

/**
 * Every binding in the entries that is Ready, after the designer's choices,
 * and has a target. Bindings and typography come first, and modes last,
 * because a legacy mode is only cleared once the bindings below it have
 * changed.
 */
export function planChanges(
  records: BindingRecord[],
  overrides: Overrides,
  entryIds: Set<string>,
): PlannedChange[] {
  const changes: PlannedChange[] = []
  for (const record of records) {
    if (!entryIds.has(record.entryId) || !isMappable(record)) continue
    if (effectiveCategory(record, overrides) !== 'sure') continue
    const { target } = effectiveTarget(record, overrides)
    if (target === null) continue
    changes.push({ record, target, outcome: changeOutcome(record, target) })
  }
  const isMode = (change: PlannedChange) =>
    change.record.property.type === 'mode'
  return [
    ...changes.filter((change) => !isMode(change)),
    ...changes.filter(isMode),
  ]
}

/** A binding on a legacy variable, outside a mode: what keeps a legacy mode in place. */
function isLegacyBinding(record: BindingRecord): boolean {
  return (
    record.property.type !== 'mode' &&
    ['sure', 'check', 'none', 'inInstance'].includes(record.category)
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

/** Splits `density: compact` into its collection and mode; null for a mode that is only cleared. */
export function parseModeTarget(
  target: string,
): { collection: 'density' | 'color-scheme'; mode: string } | null {
  if (target === CLEAR_MODE) return null
  const [collection, mode] = target.split(':').map((part) => part.trim())
  if ((collection !== 'density' && collection !== 'color-scheme') || !mode) {
    throw new Error(`Not a mode target: ${target}`)
  }
  return { collection, mode }
}
