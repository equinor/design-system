/**
 * The items of the ⚠ review: every binding that needs a check, and every
 * Manual fix the plugin can make, that has no choice yet. A Manual fix is
 * only applied once a designer accepts it here.
 */
import { bindingOutcome } from '../scan/mapping'
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
 * Bindings that need a check and that nobody has decided on, in the order of
 * the Mapping view: the most used legacy variables first. With entry ids,
 * only the bindings in those frames or main components.
 */
export function reviewItems(
  groups: MappingGroup[],
  overrides: Overrides,
  entryIds?: ReadonlySet<string>,
): ReviewItem[] {
  const items: ReviewItem[] = []
  for (const group of groups) {
    for (const row of group.rows) {
      if (row.outcome !== 'check' && row.outcome !== 'byHand') continue
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
