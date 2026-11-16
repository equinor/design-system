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
  byHand: 'Manual fix',
  none: 'No equivalent',
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
    'A legacy variable whose target depends on what the layer is: interactive or not, selected, the kind of border, or the fill under a text. The plugin proposes a target, and you confirm or change it, or decide later. A Ready value you set to Decide later counts here too, until you choose a target.',
  byHand:
    'A legacy variable an instance overrides where Figma lets nobody change it, in the editor or from a plugin, such as the width or height of an icon inside an instance. The row says how to fix it in Figma, usually by resetting the layer so it takes the variable from its main component again. Apply leaves it, and the report lists it.',
  none: 'A legacy variable the EDS Beta has no token for, such as a stroke width on a padding or a palette colour. It shows a gap in the tokens, and the report lists it. The plugin proposes a stand-in, such as the spacing token with the same px or the nearest colour for the layer, and Apply changes the value only once you choose the stand-in or another target.',
  inInstance:
    'A legacy variable an instance takes from its main component. The plugin does not change it in the instance, because a change there becomes an override. The plugin migrates variables, not components: swap an instance of a library component to an EDS Beta component in Figma, and its legacy values go with it. A value the instance overrides itself is listed with the other changes.',
  other:
    'A variable from another library, or a local one. Not counted in the health.',
}
