/** How targets are written in the window. */
import { CLEAR_MODE } from '../scan/classify'
import type { EffectiveTarget } from '../scan/mapping'

export function targetLabel(target: string | null): string {
  if (target === null) return 'Leave as it is'
  if (target === CLEAR_MODE) {
    return 'Clear the mode once nothing below uses legacy variables'
  }
  return target
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
