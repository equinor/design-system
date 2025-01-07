import * as R from 'ramda'
import {
  propName,
  withType,
  pickChildren,
  toDict,
  mergeStrings,
  withName,
} from '../../functions/utils.js'
import { px } from '../../functions/units.js'

const processGroup = R.pipe(
  pickChildren,
  R.filter(withType('component')),
  R.map((node) => {
    let name
    let value = ''
    try {
      name = propName(node.name)

      const component = R.head(node.children)

      const values = {
        minHeight: px(component.absoluteBoundingBox.height),
        minWidth: px(component.absoluteBoundingBox.width),
        borderRadius: px(component.cornerRadius),
      }

      value = values
    } catch (error) {
      throw Error(`Error parsing shape for ${name}. ${error.message}`)
    }
    return {
      name,
      value,
    }
  }),
  toDict,
)

const toShapeTokens = R.pipe(
  R.filter(withType('frame')),
  R.groupBy((group) => {
    if (withName('default')(group)) {
      return 'default'
    }
    if (withName('compact')(group)) {
      return 'compact'
    }
    return 'unknown'
  }),
  R.evolve({
    default: processGroup,
    compact: processGroup,
    unknown: (x) => {
      if (x.length > 0) {
        console.warn('Unknown token group', x)
      }
    },
  }),
  (groups) => ({
    _modes: {
      compact: groups.compact,
    },
    ...groups.default,
  }),
)

export const makeShapeTokens = (shapes) => toShapeTokens(shapes)

const classTemplate = (shape, name) => {
  if (name === '_modes') {
    return ''
  }
  return `\n  --eds_shape_${name}_min_height: ${shape.minHeight};
  --eds_shape_${name}_min_width: ${shape.minHeight};${
    R.isEmpty(shape.borderRadius)
      ? ''
      : `\n  --eds_shape_${name}_border_radius: ${shape.borderRadius};`
  }\n`
}

export const makeShapeCss = R.pipe(
  R.mapObjIndexed(classTemplate),
  R.values,
  mergeStrings,
)
