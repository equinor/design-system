import R from 'ramda'
import { propName, withType } from '@utils'
import { makeVariant } from './variants'

export const makeDesktopComponents = (figmaFile) => {
  const components = []
  const { pages, getStyle } = figmaFile

  pages.forEach((page) => {
    const name = propName(page.name)
    const data = page.children

    const componentSets = R.filter(withType('component_set'), data)

    if (componentSets.length > 0) {
      components.push({
        name,
        value: makeVariant(componentSets, getStyle),
        path: 'variants',
      })
    }
  })

  return components
}
