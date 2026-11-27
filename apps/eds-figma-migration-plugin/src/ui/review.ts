/**
 * The items of the ⚠ review: every binding that needs a check, every No
 * equivalent value with a stand-in, and every Manual fix the plugin can
 * make, that has no choice yet or is set to Decide later. A stand-in and a
 * Manual fix are only applied once a designer accepts them here or in
 * Changes.
 */
import {
  bindingOutcome,
  DECIDE_LATER,
  isUndecided,
  NO_KEPT_MODES,
} from '../scan/mapping'
import type {
  KeptModes,
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
 * equivalent with a stand-in. A Ready value set to Decide later waits for a
 * designer too, as a Needs check does. A legacy mode the next Apply keeps
 * (Waiting) waits for the values below it instead, so it is not reviewed on
 * its own (reviewItems).
 */
function needsDecision(row: MappingRow, deferred: boolean): boolean {
  if (row.outcome === 'check' || row.outcome === 'byHand') return true
  if (row.outcome === 'sure') return deferred
  return row.outcome === 'none' && row.proposal !== undefined
}

/**
 * Bindings that wait for a designer and that nobody has decided on, or that
 * a designer set to Decide later, in the order of the Mapping view: the most
 * used legacy variables first. With entry ids, only the bindings in those
 * frames or main components. A legacy mode the next Apply keeps (`kept`)
 * is Waiting, and waits for the values below it, which are reviewed instead.
 */
export function reviewItems(
  groups: MappingGroup[],
  overrides: Overrides,
  entryIds?: ReadonlySet<string>,
  kept: KeptModes = NO_KEPT_MODES,
): ReviewItem[] {
  const items: ReviewItem[] = []
  for (const group of groups) {
    for (const row of group.rows) {
      for (const binding of row.bindings) {
        if (entryIds && !entryIds.has(binding.entryId)) continue
        const outcome = bindingOutcome(row, binding, overrides, kept)
        if (!isUndecided(outcome) || outcome.held) continue
        if (!needsDecision(row, outcome.target === DECIDE_LATER)) continue
        items.push({ group, row, binding })
      }
    }
  }
  return items
}

/**
 * What a designer did with a value in Review. Decide later is the only way
 * to put a value off, so every value Review steps through gets a choice
 * that is saved and shows in Changes.
 */
export type ReviewDecision = 'confirmed' | 'changed' | 'later'

/** The closing summary of a review: how many values got each decision, in the order Review shows them. */
export function reviewSummary(
  decisions: readonly (ReviewDecision | undefined)[],
): { decision: ReviewDecision; count: number; text: string }[] {
  const count = (decision: ReviewDecision) =>
    decisions.filter((candidate) => candidate === decision).length
  return [
    {
      decision: 'confirmed',
      count: count('confirmed'),
      text: 'proposals confirmed',
    },
    {
      decision: 'changed',
      count: count('changed'),
      text: 'given another target',
    },
    {
      decision: 'later',
      count: count('later'),
      text: 'set to Decide later, left for a later run',
    },
  ]
}
