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
  const iconDataObj = (icon) => {
    const prefix = 'eds'
    const { name, height, width, svgPathData, sizes } = icon

    return `{
      name: '${name}',
      prefix: '${prefix}',
      height: '${height}',
      width: '${width}',
      svgPathData: '${svgPathData}',
      ${sizes ? `sizes: { small: ${iconDataObj(sizes.small)} }` : ``}
    }
    `
  }
  const iconDataTemplate = (icon) =>
    `export const ${icon.name}: IconData = {${JSON.stringify(
      iconDataObj(icon),
    )}}`

  const mergedSizes = R.map(
    (iconGroup) => ({
      ...iconGroup,
      value: R.reduce(
        (acc, val) => {
          const smallAnnote = '__small'

          if (R.endsWith(smallAnnote, val.name)) {
            const parentName = R.head(R.split(smallAnnote, val.name))
            const parent = acc.find(
              (p) => p.name === parentName,
              iconGroup.value,
            )

            if (parent) {
              // This will result in double iconData 🤔
              return [
                ...acc,
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
    }),
    assets,
  )

  const svgObjects = R.pipe(
    R.map((iconGroups) =>
      R.pipe(R.reduce((acc, icon) => `${acc}${iconDataTemplate(icon)}`, ''))(
        iconGroups.value,
      ),
    ),
    R.head,
  )(mergedSizes)

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
  console.info('Started exporting assets')

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
  // writeSVGs(assetsWithSvg)
  // writeSVGSprite(assetsWithSvg)

  // writeJsonAssets(assetsWithSvg)
  writeJsFile(assetsWithSvg)

  console.info('Finished exporting assets')

  return assetsWithSvg
}
