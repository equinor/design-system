import { optimize } from 'svgo'
import * as R from 'ramda'
import {
  getFigmaFile,
  processFigmaFile,
  fetchFigmaImageUrls,
} from '../../functions/figma.js'
import { fetchFile } from '../../functions/file.js'
import { getAssets } from '../../files/assets/index.js'
import { sleep, mergeStrings } from '../../functions/utils.js'

const getSvgPathData = R.pipe(
  R.match(/d="(.+?)"/g),
  R.map(R.match(/[^d="](.+)[^"]/g)),
  mergeStrings,
)

export async function fetchAssets({ query }) {
  console.info('Started exporting assets from Figma')

  const data = await getFigmaFile(query)

  const figmaFile = processFigmaFile(data)
  const assetPages = getAssets(figmaFile)

  console.info('Get asset urls from Figma')
  // Update with svg image urls from Figma
  // eslint-disable-next-line no-undef
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

  let width = null
  let height = null
  const plugins = [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          sortAttrs: false,
        },
      },
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: '(fill)',
      },
    },
    {
      name: 'find-size',
      fn: () => {
        return {
          element: {
            enter: (node, parentNode) => {
              if (parentNode.type === 'root') {
                width = node.attributes.width
                height = node.attributes.height
              }
            },
          },
        }
      },
    },
  ]

  // eslint-disable-next-line no-undef
  const assetsWithSvg = await Promise.all(
    [R.head(assetsWithUrl)].map(async (assetPage) => ({
      ...assetPage,
      // eslint-disable-next-line no-undef
      value: await Promise.all(
        assetPage.value.map(async (asset) => {
          const svgDirty = await fetchFile(asset.url)
          const svgClean = optimize(svgDirty, { plugins })

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

  console.info('Finished fetching assets')

  return assetsWithSvg
}
