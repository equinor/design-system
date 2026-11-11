/** How targets are written in the window. */
import { literalValue } from '../../../src/mapping/literal'
import { CLEAR_MODE } from '../../../src/scan/classify'
import type { EffectiveTarget } from '../../../src/scan/mapping'

export function targetLabel(target: string | null): string {
  if (target === null) return 'Leave as it is'
  const literal = literalValue(target)
  if (literal !== undefined) return `${literal}px, without a variable`
  if (target === CLEAR_MODE) {
    return 'Clear the mode once nothing below uses legacy variables'
  }
  return target
}

/** What a row without a change says: no equivalent, or why a legacy mode is kept. */
export function unchangedLabel(rule: string | undefined): string {
  if (rule === 'mode/kept') return 'Kept: legacy values below read it'
  if (rule === 'mode/after-review')
    return 'Kept until the values below are reviewed'
  return 'No equivalent; stays as it is'
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
