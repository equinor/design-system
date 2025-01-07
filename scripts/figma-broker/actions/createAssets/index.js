import * as R from 'ramda'

import {
  writeResults,
  writeFile,
  writeResultsIndividually,
} from '../../functions/file.js'
import { PATHS } from '../../constants.js'
import { fetchAssets } from './fetchAssets.js'

// const svgContent = (asset) => {
//   if (!asset) return { symbol: '', use: '' }

//   const { svgPathData, name, viewbox, width, height } = asset
//   const id = R.endsWith('_small', name) ? 'small' : 'medium'

//   return {
//     symbol: `<symbol height="${height}" width="${width}" id="${name}" viewBox="${viewbox}"><path fill-rule="evenodd" clip-rule="evenodd" d="${svgPathData}"/></symbol>`,
//     use: `<use id="${id}" xlink:href="#${name}" />`,
//   }
// }

// const svgSprite = (asset) => {
//   if (!asset.sizes) {
//     return asset
//   }
//   const normal = svgContent(asset)
//   const small = svgContent(asset.sizes ? asset.sizes.small : null)

//   return `<svg style="display: none;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
// <style>use,use:target~use:last-child { display: none; }use:target,use:last-child { display: inline; }</style>
// <defs>${normal.symbol}${small.symbol}</defs>${small.use}${normal.use}
// </svg>\n`
// }

const mergeAssetsSizes = R.map((iconGroup) => ({
  ...iconGroup,
  value: R.reduce(
    (acc, val) => {
      const smallAnnote = '_small'

      if (R.endsWith(smallAnnote, val.name)) {
        const parentName = R.head(R.split(smallAnnote, val.name))
        const parent = acc.find((p) => p.name === parentName, iconGroup.value)

        if (parent) {
          // remove "old" parent as its replaced by new
          const updatedAcc = R.filter((x) => x.name !== parent.name, acc)
          return [
            ...updatedAcc,
            {
              ...parent,
              sizes: {
                small: val,
              },
            },
          ]
        } else {
          console.log(
            'parent icon not found, skipped: ',
            JSON.stringify({ parentName, name: val.name }),
          )
          return acc
        }
      }

      return [...acc, val]
    },
    [],
    iconGroup.value,
  ),
}))

const removeSmallAssets = R.map((group) => ({
  ...group,
  value: R.filter((asset) => R.not(R.endsWith('_small', asset)), group.value),
}))

const makeIconDataFile = (assets) => {
  console.info('Making & saving data file for eds-icons')
  const toIconDataString = (icon) => {
    const prefix = 'eds'
    const { name, height, width, svgPathData, sizes } = icon

    return `{
      name: '${name}',
      prefix: '${prefix}',
      height: '${height}',
      width: '${width}',
      svgPathData: '${svgPathData}',
      ${sizes ? `sizes: { small: ${toIconDataString(sizes.small)} }` : ``}
    }
    `
  }

  const iconDatasString = R.pipe(
    R.map((iconGroups) =>
      R.pipe(
        R.reduce(
          (acc, icon) =>
            `${acc}export const ${icon.name}: IconData = ${toIconDataString(
              icon,
            )} \n`,
          '',
        ),
      )(iconGroups.value),
    ),
    R.head,
  )(assets)

  writeFile(
    PATHS.ICON_FILES,
    'data',
    'ts',
    `import type { IconData } from './types' \n\n ${iconDatasString}\n`,
  )
}

const writeJsonAssets = (assets) => {
  console.info('Save working json data to file')

  writeResults(assets, PATHS.ICONS, 'json')
}

const writeSVGs = (assets) => {
  console.info('Save icons as svg files')

  writeResultsIndividually(assets, PATHS.ASSETS_ICONS, 'svg')
}

export async function createAssets(args) {
  const assets = await fetchAssets(args)

  const mergedAssets = R.pipe(mergeAssetsSizes, removeSmallAssets)(assets)

  writeSVGs(assets)
  writeJsonAssets(assets)
  makeIconDataFile(mergedAssets)

  console.info('Finished exporting assets')

  return assets
}
