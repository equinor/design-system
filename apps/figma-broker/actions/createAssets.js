import SVGO from 'svgo'
import * as R from 'ramda'
import {
  fetchFigmaFile,
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
import { PATHS, FILE_IDS } from '../constants'
import { sleep, mergeStrings } from '@utils'

const svgContent = (svg) => R.head(R.match(/(?<=svg">)(.*?)(?=<\/svg>)/g, svg))

const svgPathData = R.pipe(
  R.match(/d="(.+?)"/g),
  R.map(R.match(/[^d="](.+)[^"]/g)),
  mergeStrings,
)

const writeSVGSprite = (assets) => {
  const value = R.pipe(
    R.find((x) => x.name === 'system'),
    R.prop('value'),
    R.reduce(
      (acc, val) =>
        `${acc}${`
    <symbol id="${val.name}" viewBox="${val.viewbox}">
      <title>${val.name}</title>
      <desc>${val.path}-${val.name}</desc>
      ${svgContent(val.value)}
    </symbol>`}`,
      '',
    ),
    (x) => `
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
      ${x}
    </svg>
    `,
  )(assets)

  writeResults([{ name: 'system', value }], `${PATHS.ASSETS_ICONS}`, 'svg')
}

const writeJsFile = (assets) => {
  const prefix = 'eds'
  const jsFile = R.pipe(
    R.map((iconGroups) =>
      R.pipe(
        R.reduce((acc, icon) => {
          const { name, height, width, pathData } = icon

          const svgObj = `
export const ${name} = {
  name: '${name}',
  prefix: '${prefix}',
  height: '${height}',
  width: '${width}',
  svgPathData: '${pathData}',
}
`
          return `${acc}${svgObj}`
        }, ''),
      )(iconGroups.value),
    ),
    R.head,
  )(assets)

  writeFile(PATHS.ICON_FILES, 'index', 'js', jsFile)
}

const writeJsonAssets = (assets) => {
  writeResults(assets, PATHS.ICONS, 'json')
}

const writeSVGs = (assets) => {
  writeResultsIndividually(assets, PATHS.ASSETS_ICONS, 'svg')
}

export async function createAssets(ctx) {
  const plugins = [
    { removeDoctype: true },
    { cleanupAttrs: true },
    { removeUnknownsAndDefaults: true },
    { removeUselessStrokeAndFill: true },
    { removeAttrs: { attrs: '(fill)' } },
    { removeViewBox: false },
  ]
  const svgo = new SVGO({
    plugins,
  })
  const svgoDataUri = new SVGO({
    datauri: 'base64',
    plugins,
  })

  const data = await fetchFigmaFile(FILE_IDS.ASSETS)

  const figmaFile = processFigmaFile(data)
  const assetPages = getAssets(figmaFile)

  // Update with svg image urls from Figma
  const assetsWithUrl = await Promise.all(
    assetPages.map(async (assetPage) => {
      const ids = assetPage.value.map((x) => x.id)
      const result = await fetchFigmaImageUrls(FILE_IDS.ASSETS, ids)
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
  // Wait for Figma to generate all endpoints
  await sleep(20000)

  // Fetch svg image as string for each asset
  const assetsWithSvg = await Promise.all(
    [R.head(assetsWithUrl)].map(async (assetPage) => ({
      ...assetPage,
      value: await Promise.all(
        assetPage.value.map(async (asset) => {
          const svgDirty = await fetchFile(asset.url)
          const svgClean = await svgo.optimize(svgDirty)
          // TODO: Remove datauri when storefront uses eds-icons
          const svgCleanDataUri = await svgoDataUri.optimize(svgDirty)
          const { height, width } = svgClean.info

          return {
            ...asset,
            value: svgClean.data,
            viewbox: `0 0 ${height} ${width}`,
            height,
            width,
            datauri: svgCleanDataUri.data,
            pathData: svgPathData(svgClean.data),
          }
        }),
      ),
    })),
  )

  // Write svg to files

  // TODO: Disabled for now as not sure if needed yet and not to polute repo with 600+ svgs yet...
  // writeSVGs(assetsWithSvg)
  // writeSVGSprite(assetsWithSvg)

  writeJsonAssets(assetsWithSvg)
  writeJsFile(assetsWithSvg)

  return assetsWithSvg
}
