import { fixPageName } from '@utils'
import { makeAssetTokens } from './icon'
import * as R from 'ramda'

const getAssetTokens = R.pipe(
  R.filter((x) => x.type === 'FRAME'),
  R.map(({ children, name }) => makeAssetTokens(children, name)),
  R.flatten,
)

export const getAssets = (figmaAssets) => {
  const assets = []

  figmaAssets.forEach((page) => {
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
