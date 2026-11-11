/** The items of the ⚠ review: every binding that needs a check and has no choice yet. */
import { bindingOutcome } from '../../../src/scan/mapping'
import type {
  MappingBinding,
  MappingGroup,
  MappingRow,
  Overrides,
} from '../../../src/scan/mapping'

export type ReviewItem = {
  group: MappingGroup
  row: MappingRow
  binding: MappingBinding
}

/**
 * Bindings that need a check and that nobody has decided on, in the order of
 * the Mapping view: the most used legacy variables first. With an entry id,
 * only the bindings in that frame.
 */
export function reviewItems(
  groups: MappingGroup[],
  overrides: Overrides,
  entryId?: string,
): ReviewItem[] {
  const items: ReviewItem[] = []
  for (const group of groups) {
    for (const row of group.rows) {
      if (row.outcome !== 'check') continue
      for (const binding of row.bindings) {
        if (entryId && binding.entryId !== entryId) continue
        const outcome = bindingOutcome(row, binding, overrides)
        if (outcome.source !== 'proposal') continue
        items.push({ group, row, binding })
      }
    }
  }
  return items
}
