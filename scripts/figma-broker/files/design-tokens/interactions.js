import * as R from 'ramda'
import {
  propName,
  withType,
  pickChildren,
  toDict,
  withName,
} from '../../functions/utils.js'
import { toFocus, toOverlay } from '../../transformers/index.js'

const processGroup = R.pipe(
  pickChildren,
  R.filter(withType('component')),
  R.map((node) => {
    let name
    let value = ''
    try {
      name = propName(node.name)
      const component = R.head(node.children)

      if (R.includes('overlay', name)) {
        value = toOverlay(component)
      }
      if (R.includes('focus', name)) {
        value = toFocus(component)
      }
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

const toInteractionsTokens = R.pipe(
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
export const makeInteractionsTokens = (states) => toInteractionsTokens(states)
