/**
 * The items of the ⚠ review: every binding that needs a check, every No
 * equivalent value with a stand-in, and every Manual fix the plugin can
 * make, that has no choice yet. A stand-in and a Manual fix are only applied
 * once a designer accepts them here or in Changes.
 */
import { bindingOutcome, isHeldMode } from '../scan/mapping'
import type {
  MappingBinding,
  MappingGroup,
  MappingRow,
  Overrides,
} from '../scan/mapping'

export type ReviewItem = {
  group: MappingGroup
  row: MappingRow
  binding: MappingBinding
}

/**
 * A row whose values wait for a designer: Needs check, a Manual fix, or No
 * equivalent with a stand-in. A legacy mode the plugin keeps (Waiting) waits
 * for the values below it instead, so it is not reviewed on its own.
 */
function needsDecision(row: MappingRow): boolean {
  if (row.outcome === 'check' || row.outcome === 'byHand') return true
  return (
    row.outcome === 'none' &&
    row.proposal !== undefined &&
    !isHeldMode(row.rule)
  )
}

/**
 * Bindings that wait for a designer and that nobody has decided on, in the
 * order of the Mapping view: the most used legacy variables first. With
 * entry ids, only the bindings in those frames or main components.
 */
export function reviewItems(
  groups: MappingGroup[],
  overrides: Overrides,
  entryIds?: ReadonlySet<string>,
): ReviewItem[] {
  const items: ReviewItem[] = []
  for (const group of groups) {
    for (const row of group.rows) {
      if (!needsDecision(row)) continue
      for (const binding of row.bindings) {
        if (entryIds && !entryIds.has(binding.entryId)) continue
        const outcome = bindingOutcome(row, binding, overrides)
        if (outcome.source !== 'proposal') continue
        items.push({ group, row, binding })
      }
    }
  }
  return items
}
