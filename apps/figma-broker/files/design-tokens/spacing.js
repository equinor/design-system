import * as R from 'ramda'
import { formatName, withType, pickChildren, toDict } from '@utils'
import { px } from '@units'

const toSpacingTokens = R.pipe(
  R.filter(withType('frame')),
  pickChildren,
  R.filter(withType('component')),
  R.map((spacing) => {
    let name
    let value = ''
    try {
      name = formatName(spacing.name)
      value = px(spacing.absoluteBoundingBox.height)
    } catch (error) {
      throw Error(`Height not found for ${name}. ${error.message}`)
    }
    return {
      name,
      value,
    }
  }),
  toDict,
)
export const makeSpacingTokens = (spacings) => toSpacingTokens(spacings)
