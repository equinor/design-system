import R from 'ramda'
import { propName, withType, toConst } from '@utils'
import { makeVariant } from './variants'

export const makeDesktopComponents = (figmaFile) => {
  let variantsBuffer = ''
  const { pages, getStyle } = figmaFile

  pages.forEach((page) => {
    const name = propName(page.name).replace('__', '_')
    const data = page.children

    const componentSets = R.filter(withType('component_set'), data)

    if (componentSets.length > 0) {
      const variantConst = toConst(name, makeVariant(componentSets, getStyle))
      variantsBuffer = `${R.concat(variantsBuffer, variantConst)}\n`
    }
  })

  return variantsBuffer
}
