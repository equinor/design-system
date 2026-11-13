/**
 * The window's words, from the plugin's labels with the changes from the UX
 * review (F5): values are counted as values, and the category for legacy
 * variables inside instances is called Inside instances.
 */
import {
  CATEGORY_DESCRIPTIONS as PLUGIN_DESCRIPTIONS,
  CATEGORY_LABELS as PLUGIN_LABELS,
} from '../scan/labels'
import { isHeldMode } from '../scan/mapping'
import type { Category } from '../scan/types'

export { GROUP_LABELS, propertyLabel } from '../scan/labels'

export const CATEGORY_LABELS: Record<Category, string> = {
  ...PLUGIN_LABELS,
  inInstance: 'Inside instances',
}

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  ...PLUGIN_DESCRIPTIONS,
  none: 'A legacy variable with nothing to swap to yet, such as an icon size. It stays as it is and is listed in the report. A legacy mode marked Waiting counts here too: Apply clears it once no layer below it uses legacy variables.',
  inInstance:
    'A legacy variable an instance takes from its main component. The plugin does not change it in the instance, because a change there becomes an override. Update the main component, in this file or in its library, and the instances follow. A value the instance overrides itself is listed with the other changes.',
}

/**
 * Where a value inside an instance comes from: the instance overrides it,
 * so the plugin can change it there, or it takes it from its main component
 * and changes with that.
 */
export type ValueOrigin = 'override' | 'main'

export const ORIGIN_LABELS: Record<ValueOrigin, string> = {
  override: 'Overridden in the instance',
  main: 'From the main component',
}

/**
 * A legacy mode the plugin keeps for now, because layers below still read
 * legacy values (mapping.ts, isHeldMode). It counts as No equivalent, but it
 * has a change, clearing the mode, that waits for the layers below, so its
 * badge says Waiting.
 */
export const HELD_LABEL = 'Waiting'

export function isHeld(category: Category, rule: string | undefined): boolean {
  return category === 'none' && isHeldMode(rule)
}

/** The status shown on one binding or row: its category, or Waiting for a held mode. */
export function statusLabel(
  category: Category,
  rule: string | undefined,
): string {
  return isHeld(category, rule) ? HELD_LABEL : CATEGORY_LABELS[category]
}

/** “1 value”, “14 values” */
export function values(count: number): string {
  return `${count} value${count === 1 ? '' : 's'}`
}
