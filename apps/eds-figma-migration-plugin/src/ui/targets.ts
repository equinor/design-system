/** How targets are written in the window. */
import { CLEAR_VALUE, literalText } from '../mapping/literal'
import { isResetTarget, resetText } from '../mapping/reset'
import { CLEAR_MODE } from '../scan/classify'
import type { EffectiveTarget } from '../scan/mapping'

export function targetLabel(target: string | null): string {
  if (target === null) return 'Keeps the legacy variable'
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

export function sourceLabel(
  source: EffectiveTarget['source'],
): string | undefined {
  switch (source) {
    case 'record':
      return 'Your choice for this value'
    case 'row':
      return 'Your choice for all of these'
    default:
      return undefined
  }
}
