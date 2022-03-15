import * as SVGO from 'svgo'
import * as R from 'ramda'
import {
  getFigmaFile,
  processFigmaFile,
  fetchFigmaImageUrls,
} from '../functions/figma'
import {
  writeResults,
  writeFile,
  fetchFile,
  writeResultsIndividually,
} from '../functions/file'
import { getAssets } from '../files/assets'
import { PATHS } from '../constants'
import { sleep, mergeStrings } from '../functions/utils'

const getSvgPathData = R.pipe(
  R.match(/d="(.+?)"/g),
  R.map(R.match(/[^d="](.+)[^"]/g)),
  mergeStrings,
)

const svgContent = (asset) => {
  if (!asset) return { symbol: '', use: '' }

  const { svgPathData, name, viewbox, width, height } = asset
  const id = R.endsWith('_small', name) ? 'small' : 'medium'

  return {
    symbol: `<symbol height="${height}" width="${width}" id="${name}" viewBox="${viewbox}"><path fill-rule="evenodd" clip-rule="evenodd" d="${svgPathData}"/></symbol>`,
    use: `<use id="${id}" xlink:href="#${name}" />`,
  }
}

const svgSprite = (asset) => {
  if (!asset.sizes) {
    return asset
  }
  const normal = svgContent(asset)
  const small = svgContent(asset.sizes ? asset.sizes.small : null)

  return `<svg style="display: none;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<style>use,use:target~use:last-child { display: none; }use:target,use:last-child { display: inline; }</style>
<defs>${normal.symbol}${small.symbol}</defs>${small.use}${normal.use}
</svg>\n`
}

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

  const updateAssets = R.pipe(
    R.map((iconGroup) => ({
      ...iconGroup,
      value: R.map(
        (asset) => ({ ...asset, value: svgSprite(asset) }),
        iconGroup.value,
      ),
    })),
  )(assets)

  writeResultsIndividually(updateAssets, PATHS.ASSETS_ICONS, 'svg')
}

export async function createAssets({ query }) {
  console.info('Started exporting assets from Figma')

  const data = await getFigmaFile(query)

  const figmaFile = processFigmaFile(data)
  const assetPages = getAssets(figmaFile)

  const plugins = SVGO.extendDefaultPlugins([
    {
      name: 'removeAttrs',
      active: true,
      params: {
        attrs: '(fill)',
      },
    },
    {
      name: 'removeViewBox',
      active: false,
    },
  ])

  console.info('Get asset urls from Figma')
  // Update with svg image urls from Figma
  const assetsWithUrl = await Promise.all(
    assetPages.map(async (assetPage) => {
      const ids = assetPage.value.map((x) => x.id)
      const result = await fetchFigmaImageUrls(query.fileId, ids)
      if (!result.err) {
        return {
          ...assetPage,
          value: assetPage.value.map((asset) => ({
            ...asset,
            url: result.images[asset.id],
          })),
        }
      }
      return assetPage
    }),
  )

  const sleepTimer = 20000
  console.info(
    `Waiting ${sleepTimer / 1000}s for asset urls to generate in Figma`,
  )
  // Wait for Figma to generate all endpoints
  await sleep(sleepTimer)

  assetPages.forEach((x) =>
    console.info(`Found ${R.length(x.value)} ${x.name}`),
  )
  console.info(
    `Fetching ${R.head(assetPages).name} assets as svgs from Figma urls`,
  )
  const assetsWithSvg = await Promise.all(
    [R.head(assetsWithUrl)].map(async (assetPage) => ({
      ...assetPage,
      value: await Promise.all(
        assetPage.value.map(async (asset) => {
          const svgDirty = await fetchFile(asset.url)
          const svgClean = SVGO.optimize(svgDirty, {
            plugins,
          })

          const { height, width } = svgClean.info

          return {
            ...asset,
            value: svgClean.data,
            viewbox: `0 0 ${height} ${width}`,
            height,
            width,
            svgPathData: getSvgPathData(svgClean.data),
          }
        }),
      ),
    })),
  )

  // Write svg to files

  // TODO: Disabled for now as not sure if needed yet and not to polute repo with 600+ svgs yet...
  // writeSVGSprite(assetsWithSvg)

  const mergedAssets = R.pipe(
    mergeAssetsSizes,
    removeSmallAssets,
  )(assetsWithSvg)

  writeSVGs(mergedAssets)
  writeJsonAssets(mergedAssets)
  makeIconDataFile(mergedAssets)

  console.info('Finished exporting assets')

  return assetsWithSvg
}
