/** How targets are written in the window. */
import { CLEAR_VALUE, literalText } from '../mapping/literal'
import { isResetTarget, resetText } from '../mapping/reset'
import { CLEAR_MODE } from '../scan/classify'
import { DECIDE_LATER } from '../scan/mapping'
import type { EffectiveTarget } from '../scan/mapping'

/** The label of Decide later, in the picker and as the target of a value set to it. */
export const DECIDE_LATER_LABEL = 'Decide later'

/** A target in words; null is a value the rules have no proposal for. */
export function targetLabel(target: string | null): string {
  if (target === null) return 'No target'
  if (target === DECIDE_LATER) return DECIDE_LATER_LABEL
  if (isResetTarget(target)) return resetText(target)
  const literal = literalText(target)
  if (literal !== undefined) {
    return target === CLEAR_VALUE ? literal : `${literal}, without a variable`
  }
  if (target === CLEAR_MODE) {
    return 'Clear the mode once nothing below uses legacy variables'
  }
  return target
}

/**
 * What a No equivalent value says before anybody has chosen a target: the
 * stand-in the plugin proposes for the gap in the EDS Beta, or why a legacy
 * mode is kept. A string or boolean variable has no stand-in.
 */
export function unchangedLabel(
  rule: string | undefined,
  standIn?: string | null,
): string {
  if (rule === 'mode/kept') return 'Kept: legacy values below read it'
  if (rule === 'mode/after-review')
    return 'Kept until the values below are reviewed'
  if (standIn) {
    return `Stand-in: ${standIn === CLEAR_MODE ? 'Remove the legacy mode' : targetLabel(standIn)}`
  }
  return 'No equivalent and no stand-in'
}

/**
 * Who chose the target, under the target of a value. Decide later also says
 * what it means for the next run, since the value is not changed.
 */
export function sourceLabel(
  source: EffectiveTarget['source'],
  target?: EffectiveTarget['target'],
): string | undefined {
  const later = target === DECIDE_LATER
  switch (source) {
    case 'record':
      return later
        ? 'Your choice for this value. Apply leaves it until you choose a target.'
        : 'Your choice for this value'
    case 'row':
      return later
        ? 'Your choice for all of these. Apply leaves them until you choose a target.'
        : 'Your choice for all of these'
    default:
      return undefined
  }
}
