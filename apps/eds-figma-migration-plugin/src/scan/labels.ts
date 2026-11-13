/** Names for properties and categories, as the window and the report show them. */
import type { Category, PropertyGroup, PropertyRef } from './types'

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

/**
 * The names designers see. The outcome `sure` is shown as Ready: one target,
 * applied without asking.
 */
export const CATEGORY_LABELS: Record<Category, string> = {
  migrated: 'Migrated',
  sure: 'Ready',
  check: 'Needs check',
  none: 'No equivalent',
  excluded: 'Excluded',
  inInstance: 'In instance',
  other: 'Other libraries',
}

export const GROUP_LABELS: Record<PropertyGroup, string> = {
  colour: 'Colour',
  typography: 'Typography',
  spacing: 'Spacing',
  size: 'Size',
  radius: 'Corner radius',
  modes: 'Modes',
  other: 'Other',
}

/** What each category means, for the legend dialog. */
export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  migrated: 'Bound to an EDS Beta variable or text style. Nothing left to do.',
  sure: 'A legacy variable with one target in the EDS Beta. The plugin swaps it without asking when you apply.',
  check:
    'A legacy variable whose target depends on what the layer is: interactive or not, selected, the kind of border, or the fill under a text. The plugin proposes a target, and you confirm, change or skip it.',
  none: 'A legacy variable with nothing to swap to, such as an icon size or Bg/Backdrop. It stays as it is and is listed in the report.',
  excluded:
    'A legacy variable you chose to keep. Apply leaves it out, and the report lists it. Select it and choose Reset choices to get the proposal back.',
  inInstance:
    'A legacy variable inside an instance, or on one. The plugin never changes instances, because a change there becomes an override. Update the component in its library, then swap the instance.',
  other:
    'A variable from another library, or a local one. Not counted in the health.',
}
