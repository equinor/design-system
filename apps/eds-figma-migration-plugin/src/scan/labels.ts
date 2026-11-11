/** Names for properties and categories, as the window and the report show them. */
import type { Category, PropertyRef } from './types'

const FIELD_LABELS: Record<string, string> = {
  paddingLeft: 'Padding left',
  paddingRight: 'Padding right',
  paddingTop: 'Padding top',
  paddingBottom: 'Padding bottom',
  itemSpacing: 'Gap',
  counterAxisSpacing: 'Wrap gap',
  gridRowGap: 'Row gap',
  gridColumnGap: 'Column gap',
  width: 'Width',
  height: 'Height',
  minWidth: 'Min width',
  maxWidth: 'Max width',
  minHeight: 'Min height',
  maxHeight: 'Max height',
  cornerRadius: 'Corner radius',
  topLeftRadius: 'Radius top left',
  topRightRadius: 'Radius top right',
  bottomLeftRadius: 'Radius bottom left',
  bottomRightRadius: 'Radius bottom right',
  strokeWeight: 'Stroke weight',
  strokeTopWeight: 'Stroke weight top',
  strokeRightWeight: 'Stroke weight right',
  strokeBottomWeight: 'Stroke weight bottom',
  strokeLeftWeight: 'Stroke weight left',
  opacity: 'Opacity',
  visible: 'Visible',
  characters: 'Text',
}

function rangeLabel(range?: [number, number]): string {
  return range ? `, characters ${range[0] + 1}–${range[1]}` : ''
}

export function propertyLabel(property: PropertyRef): string {
  switch (property.type) {
    case 'paint': {
      const name = property.field === 'fills' ? 'Fill' : 'Stroke'
      return `${name}${property.index > 0 ? ` ${property.index + 1}` : ''}${rangeLabel(property.range)}`
    }
    case 'effect':
      return `Effect ${property.index + 1} ${property.field === 'color' ? 'colour' : property.field}`
    case 'field':
      return FIELD_LABELS[property.field] ?? property.field
    case 'typography':
      return `Typography${rangeLabel(property.range)}`
    case 'mode':
      return 'Mode'
  }
}

export const CATEGORY_LABELS: Record<Category, string> = {
  migrated: 'Migrated',
  sure: 'Sure',
  check: 'Needs check',
  none: 'No equivalent',
  inInstance: 'In instance',
  other: 'Other libraries',
}
