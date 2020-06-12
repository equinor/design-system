import * as R from 'ramda'
import { fixPageName } from '@utils'
import { makeAssetTokens } from './icon'

const getAssetTokens = R.pipe(
  R.filter((x) => x.type === 'FRAME'),
  R.map(({ children, name }) => makeAssetTokens(children, name)),
  R.flatten,
)

export const getAssets = (figmaFile) => {
  const assets = []
  const { pages } = figmaFile

  pages.forEach((page) => {
    const fixedPageName = fixPageName(page.name)

    if (fixedPageName === 'system icons') {
      assets.push({
        name: 'system-icons',
        value: getAssetTokens(page.children),
      })
    }
    if (fixedPageName === 'product icons') {
      assets.push({
        name: 'product-icons',
        value: getAssetTokens(page.children),
      })
    }
  })

  return assets
}
