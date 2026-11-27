/**
 * What Convert does with each Typography instance, as the Typography tab
 * shows it before converting. It reads the conversion rows the plugin sends
 * and decides with the same functions as the plugin's plan
 * (scan/apply-plan.ts, planConversions), so the counts and the disabled
 * Convert buttons match what a run does.
 */
import { conversionColour, conversionSkipReason } from '../scan/apply-plan'
import type { ConversionDecision } from '../scan/apply-plan'
import { bindingOutcome } from '../scan/mapping'
import type { MappingGroup, Overrides } from '../scan/mapping'

export type ConversionState = {
  /** Why Convert leaves the instance; undefined when it is converted */
  skip?: string
  /** The legacy colour variable the new text layer keeps, when its colour is not Ready */
  legacyColour?: string
}

/** The state of each instance in `instanceIds`, after the designer's choices. */
export function conversionStates(
  groups: MappingGroup[],
  overrides: Overrides,
  instanceIds: string[],
): Map<string, ConversionState> {
  const styles = new Map<string, ConversionDecision>()
  const fills = new Map<string, ConversionDecision & { old: string }>()
  for (const group of groups) {
    for (const row of group.rows) {
      for (const binding of row.bindings) {
        const { category, target } = bindingOutcome(row, binding, overrides)
        if (binding.property.type === 'typography') {
          styles.set(binding.nodeId, { category, target })
        } else {
          fills.set(binding.nodeId, { category, target, old: group.old })
        }
      }
    }
  }
  const states = new Map<string, ConversionState>()
  for (const id of instanceIds) {
    const fill = fills.get(id)
    const skip = conversionSkipReason(styles.get(id))
    states.set(id, {
      ...(skip !== undefined ? { skip } : {}),
      ...(fill && conversionColour(fill) === undefined
        ? { legacyColour: fill.old }
        : {}),
    })
  }
  return states
}
