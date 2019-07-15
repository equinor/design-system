import * as R from 'ramda'
import { propName, withType, pickChildren, toDict } from '@utils'
import { px } from '@units'

const toShapeTokens = R.pipe(
  R.filter(withType('frame')),
  pickChildren,
  R.filter(withType('component')),
  R.map((node) => {
    let name
    let value = ''
    try {
      name = propName(node.name)

      const component = R.head(node.children)

      const values = {
        height: px(component.absoluteBoundingBox.height),
        width: px(component.absoluteBoundingBox.width),
        borderRadius: px(component.cornerRadius),
      }

      value = values
    } catch (error) {
      throw Error(`Error parsing shaope for ${name}. ${error.message}`)
    }
    return {
      name,
      value,
    }
  }),
  toDict,
)
export const makeShapeTokens = (shapes) => toShapeTokens(shapes)
