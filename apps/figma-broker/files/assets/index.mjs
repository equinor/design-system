import { getFigmaNamePath } from '@utils'
import { fetchFile } from './../../functions/figma'
import { writeFile } from './../../functions/file.mjs'

const fixPageName = (name) =>
  name
    .replace(/(🚧*)(✅*)/, '')
    .toLowerCase()
    .trim()

const getAssetsPaths = (assets) =>
  assets.map((x) => ({ ...getFigmaNamePath(x.name), value: x }))

export const makeAssets = (figmaAssets) => {
  const assets = []

  figmaAssets.forEach((page) => {
    const fixedPageName = fixPageName(page.name)

    if (fixedPageName === 'system icons') {
      const data = page.children.filter((x) => x.type === 'COMPONENT')
      assets.push(...getAssetsPaths(data))
    }
  })

  return assets
}

export async function saveAssets(assets, savePath) {
  assets.forEach(async function({ name, path, assetUrl }) {
    const asset = await fetchFile(assetUrl)
    writeFile(asset, `${savePath}/${path}`, name, 'svg')
  })
}
