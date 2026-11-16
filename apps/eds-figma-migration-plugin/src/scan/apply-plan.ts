/**
 * What an apply run changes, worked out from the scan and the designer's
 * choices without touching the document, so it can be tested without Figma.
 */
import { isResetTarget } from '../mapping/reset'
import { blockedModes, CLEAR_MODE } from './classify'
import { conversionId } from './conversions'
import {
  DECIDE_LATER,
  effectiveCategory,
  effectiveTarget,
  isMappable,
} from './mapping'
import type { Overrides } from './mapping'
import type { BindingRecord, Category } from './types'

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
  /** A variable or text style name, `collection: mode`, CLEAR_MODE, or a reset (mapping/reset.ts) */
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
  const isMode = (change: PlannedChange) =>
    change.record.property.type === 'mode'
  // A reset removes the changes on a layer and the layers below it, and puts
  // them back as they were, so it runs before anything else changes there.
  const isReset = (change: PlannedChange) => isResetTarget(change.target)
  return [
    ...changes.filter(isReset),
    ...changes.filter((change) => !isMode(change) && !isReset(change)),
    ...changes.filter(isMode),
  ]
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
