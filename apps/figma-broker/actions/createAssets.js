import * as SVGO from 'svgo'
import R from 'ramda'
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
import { sleep, mergeStrings } from '@utils'

const svgContent = (svg) => R.head(R.match(/(?<=svg">)(.*?)(?=<\/svg>)/g, svg))

const svgPathData = R.pipe(
  R.match(/d="(.+?)"/g),
  R.map(R.match(/[^d="](.+)[^"]/g)),
  mergeStrings,
)

const writeSVGSprite = (assets) => {
  const value = R.pipe(
    R.find((x) => x.name === 'system-icons'),
    R.prop('value'),
    R.reduce(
      (acc, val) =>
        `${acc}${`<symbol id="${val.name}" viewBox="${val.viewbox}">
      <title>${val.name}</title>
      <desc>${val.path}-${val.name}</desc>
      ${svgContent(val.value)}
    </symbol>`}`,
      '',
    ),
    (x) => `
    <svg style="display: none;"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
     ${x}
    </svg>
    `,
  )(assets)

  writeResults(
    [{ name: 'system-icons', value }],
    `${PATHS.ASSETS_ICONS}`,
    'svg',
  )
}

const writeJsFile = (assets) => {
  const prefix = 'eds'
  const svgObjects = R.pipe(
    R.map((iconGroups) =>
      R.pipe(
        R.reduce((acc, icon) => {
          const { name, height, width, pathData } = icon

          const svgObj = `
export const ${name}: IconData = {
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

  const jsFile = `import type { IconData } from './types'\n${svgObjects}`

  writeFile(PATHS.ICON_FILES, 'data', 'ts', jsFile)
}

const writeJsonAssets = (assets) => {
  writeResults(assets, PATHS.ICONS, 'json')
}

const writeSVGs = (assets) => {
  writeResultsIndividually(assets, PATHS.ASSETS_ICONS, 'svg')
}

export async function createAssets({ query }) {
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
  // Wait for Figma to generate all endpoints
  await sleep(20000)

  // Fetch svg image as string for each asset
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
            svgPathData: svgPathData(svgClean.data),
          }
        }),
      ),
    })),
  )

  // Write svg to files

  // TODO: Disabled for now as not sure if needed yet and not to polute repo with 600+ svgs yet...
  writeSVGs(assetsWithSvg)
  writeSVGSprite(assetsWithSvg)

  writeJsonAssets(assetsWithSvg)
  writeJsFile(assetsWithSvg)

  return assetsWithSvg
}
