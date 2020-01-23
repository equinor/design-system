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
import { sleep } from '@utils'

const svgContent = (svg) => R.head(R.match(/(?<=svg">)(.*?)(?=<\/svg>)/g, svg))

const svgPathData = (svg) => R.head(R.tail(R.match(/d="(.[^"]+)"/, svg)))

const writeSVGSprite = (assets) => {
  const value = R.pipe(
    R.find((x) => x.name === 'system-icons'),
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

const createJSindex = (assets) =>
  R.pipe(
    R.map((iconGroups) =>
      R.pipe(
        R.reduce(
          (acc, icon) => {
            const name = `${icon.name}`
            const path = `./${iconGroups.name}/${icon.path}/${icon.name}.svg`

            const import_ = `import { default as ${name} } from '${path}'\n`
            const export_ = `export { default as ${name} } from '${path}'\n`
            const name_ = `${name},\n`

            return {
              imports: `${acc.imports}${import_}`,
              exports: `${acc.exports}${export_}`,
              names: `${acc.names}${name_}`,
            }
          },
          { imports: '', exports: '', names: '' },
        ),
        (x) => `${x.imports}${x.exports}export default {\n${x.names}}`,
      )(iconGroups.value),
    ),
    R.join('\n'),
  )(assets)

const writeJsFile = (assets) => {
  const prefix = 'eds'
  const jsFile = R.pipe(
    R.map((iconGroups) =>
      R.pipe(
        R.reduce((acc, icon) => {
          const {
            name,
            height,
            width,
            d: { clean: svgPathData },
          } = icon

          const svgObj = `
export const ${name} = {
  name: "${name}",
  prefix: "${prefix}",
  height: "${height}",
  width: "${width}",
  svgPathData: "${svgPathData}",
}
`
          return `${acc}${svgObj}`
        }, ''),
      )(iconGroups.value),
    ),
    R.head,
  )(assets)

  writeFile(PATHS.ICON_FILES, 'icons', 'js', jsFile)
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
          const svgCleanDataUri = await svgoDataUri.optimize(svgDirty)
          const dClean = svgPathData(svgClean.data)
          const dDirty = svgPathData(svgDirty)

          const { height, width } = svgClean.info

          return {
            ...asset,
            value: svgClean.data,
            viewbox: `0 0 ${height} ${width}`,
            height,
            width,
            datauri: svgCleanDataUri.data,
            d: {
              clean: dClean,
              dirty: dDirty,
            },
          }
        }),
      ),
    })),
  )

  // Write svg to files
  // TODO: Disabled for now as not sure if needed yet and not to polute repo with 600+ svgs yet...
  // writeResultsIndividually(assetsWithSvg, PATHS.ICON_FILES, 'svg')
  // Write index.js for individual icons

  // const npmIndex = createJSindex(assetsWithSvg)
  // writeResults(
  //   [
  //     {
  //       name: 'index',
  //       value: npmIndex,
  //     },
  //   ],
  //   PATHS.ICON_FILES,
  //   'js',
  // )

  // Write token
  // writeResults(assetsWithSvg, PATHS.ICONS)

  // writeSVGSprite(assetsWithSvg)
  writeJsFile(assetsWithSvg)

  return assetsWithSvg
}
