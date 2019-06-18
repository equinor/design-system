import { getFigmaNamePath, fixPageName, formatName } from '@utils'
import { makeAssetTokens } from './icon'

// const getAssetsPaths = (assets) =>
//   assets.map((x) => ({ ...getFigmaNamePath(x.name), value: x }))

export const getAssets = (figmaAssets) => {
  const assets = []

  figmaAssets.forEach((page) => {
    const fixedPageName = fixPageName(page.name)

    if (fixedPageName === 'system icons') {
      const data = page.children
        .filter((x) => x.type === 'FRAME')
        .map((icongroup) => makeAssetTokens(icongroup.children, icongroup.name))
        .reduce((acc, val) => [...acc, ...val])
      assets.push({
        name: 'system-icons',
        value: data,
      })
    }
    if (fixedPageName === 'product icons') {
      const data = page.children
        .filter((x) => x.type === 'FRAME')
        .map((icongroup) => makeAssetTokens(icongroup.children, icongroup.name))
        .reduce((acc, val) => [...acc, ...val])
      assets.push({
        name: 'product-icons',
        value: data,
      })
    }
  })

  return assets
}
