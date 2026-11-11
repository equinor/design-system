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

export { GROUP_LABELS, propertyLabel } from '../scan/labels'

export const CATEGORY_LABELS: Record<Category, string> = {
  ...PLUGIN_LABELS,
  inInstance: 'Inside instances',
}

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  ...PLUGIN_DESCRIPTIONS,
  none: 'A legacy variable with nothing to swap to yet, such as an icon size. It stays as it is and is listed in the report.',
  inInstance:
    'A legacy variable inside an instance, or on one. The plugin never changes instances, because a change there becomes an override. Update the component in its library, and the instances follow.',
}

/** “1 value”, “14 values” */
export function values(count: number): string {
  return `${count} value${count === 1 ? '' : 's'}`
}
