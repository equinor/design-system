import R from 'ramda'
import { propName, withType, pickChildren, toDict } from '@utils'
import { toFocus, toOverlay } from '@transformers'

const toInteractionsTokens = R.pipe(
  R.filter(withType('frame')),
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
export const makeInteractionsTokens = (states) => toInteractionsTokens(states)
