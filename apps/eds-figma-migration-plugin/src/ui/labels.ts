/**
 * The window's words, from the plugin's labels with the changes from the UX
 * review (F5): values are counted as values, and the category for legacy
 * variables inside instances is called Inside instances.
 */
import {
  CATEGORY_DESCRIPTIONS as PLUGIN_DESCRIPTIONS,
  CATEGORY_LABELS as PLUGIN_LABELS,
} from '../scan/labels'
import type { Category } from '../scan/types'

export { GROUP_LABELS, KEPT_TARGET_LABEL, propertyLabel } from '../scan/labels'

export const CATEGORY_LABELS: Record<Category, string> = {
  ...PLUGIN_LABELS,
  inInstance: 'Inside instances',
}

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  ...PLUGIN_DESCRIPTIONS,
  none: 'A legacy variable the EDS Beta has no token for, such as a stroke width on a padding or a palette colour. It shows a gap in the tokens, and the report lists it. The plugin proposes a stand-in, such as the spacing token with the same px or the nearest colour for the layer, and Apply changes the value only once you choose the stand-in or another target, in Changes or in Review. A legacy mode marked Waiting counts here too: Apply clears it once no layer below it uses legacy variables, and its row says what it waits for, such as a value below set to Decide later.',
  inInstance:
    'A legacy variable an instance takes from its main component. The plugin does not change it in the instance, because a change there becomes an override. A component in this file changes every instance once its main component is migrated. The plugin migrates variables, not components: swap an instance of a library component to an EDS Beta component in Figma, and its legacy values go with it. A value the instance overrides itself is listed with the other changes.',
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
 * A legacy mode that is only cleared and that the next Apply keeps, because
 * values below it that read it are not changed in that run (mapping.ts,
 * isKeptWaiting). It counts as No equivalent, but it has a change, clearing
 * the mode, that waits for the layers below, so its badge says Waiting.
 */
export const HELD_LABEL = 'Waiting'

/** `kept` is true for a legacy mode the next Apply keeps (isKeptWaiting). */
export function isHeld(category: Category, kept = false): boolean {
  return category === 'none' && kept
}

/** The status shown on one binding or row: its category, or Waiting for a kept mode. */
export function statusLabel(category: Category, kept = false): string {
  return isHeld(category, kept) ? HELD_LABEL : CATEGORY_LABELS[category]
}

/** “1 value”, “14 values” */
export function values(count: number): string {
  return `${count} value${count === 1 ? '' : 's'}`
}
