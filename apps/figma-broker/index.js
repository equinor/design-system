#!/usr/bin/env NODE_NO_WARNINGS=1 node
/* eslint-disable no-unused-vars */
import dotenv from 'dotenv'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import KoaLogger from 'koa-logger'
import KoaBody from 'koa-body'
import SVGO from 'svgo'
import childProcess from 'child_process'
import * as R from 'ramda'
import util from 'util'
import prettier from 'prettier'

import {
  fetchFigmaFile,
  processFigmaFile,
  fetchFigmaImageUrls,
} from './functions/figma'
import {
  readTokens,
  writeFile,
  writeResults,
  fetchFile,
  writeResultsIndividually,
  writeUrlToFile,
  deletePaths,
} from './functions/file'
import { convert } from './functions/public'
import FILE_ID from './files.json'
// Files
import { makeTokens } from './files/design-tokens'
import { makeDesktopComponents } from './files/desktop-ui'
import { getAssets } from './files/assets'
import { isNotEmpty, sleep } from '@utils'

dotenv.config()

const PORT = process.env.PORT || 9001
const TEAM_ID = process.env.FIGMA_TEAM_ID || ''

const COMMON_DIR = '../../common'
const TOKENS_DIR = '../../libraries/tokens'
const STATIC_DIR = '../../libraries/eds-static'
const ICONS_DIR = '../../libraries/icons'
const STOREFRONT_DIR = '../storefront'

const PATHS = {
  BASE_TOKENS: `${TOKENS_DIR}/base`,
  ASSETS_ICONS: `${STATIC_DIR}/icons`,
  COMPONENTS_DESKTOP: `${TOKENS_DIR}/components`,
  SASS: `${COMMON_DIR}/public/sass`,
  CSS: `${COMMON_DIR}/public/css`,
  IMAGES: `${STOREFRONT_DIR}/src/assets/figma`,
  ICONS: `${STOREFRONT_DIR}/src/assets/icons`,
  ICON_FILES: `${ICONS_DIR}`,
}

const app = new Koa()
const router = new KoaRouter()
const logger = new KoaLogger()

router
  .post('/tokens', KoaBody(), createTokens)
  .post('/assets', KoaBody(), createAssets)
  .post('/transform-tokens', KoaBody(), transformTokens)
  .post('/desktop-ui', KoaBody(), createDesktopComponents)
  .post('/figma-images', KoaBody(), fetchFigmaImages)

app
  .use(logger)
  .use(router.routes())
  .use(router.allowedMethods())

// Tokens
async function createTokens(ctx) {
  try {
    const data = await fetchFigmaFile(FILE_ID.tokens)

    const figmaFile = processFigmaFile(data)
    const tokens = makeTokens(figmaFile)

    writeResults(tokens, PATHS.BASE_TOKENS, 'js')

    const baseIndexContent = `${tokens
      .map((token) => `import { ${token.name} } from './${token.name}'`)
      .join('\n')}

    export const tokens = {
      ${tokens.map((token) => token.name).join(',\n')}
    }

    `
    writeFile(
      PATHS.BASE_TOKENS,
      'index',
      'js',
      prettier.format(baseIndexContent, {
        semi: false,
        trailingComma: true,
        singleQuote: true,
      }),
    )

    // Disabled – shouldn’t really be done here…
    // writeFile(`${TOKENS_DIR}`, 'index', 'js', `export { tokens } from './base'`)

    ctx.response.body = JSON.stringify(tokens)
  } catch (err) {
    ctx.response.status = err.status || 500
    ctx.response.body = err.message
  }
}

// Assets

const createSvgSprite = (assets) => `
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  ${assets.value.reduce((acc, val) => {
    const svgContent = R.head(val.value.match(/(?<=svg">)(.*?)(?=<\/svg>)/g))
    const symbol = `
    <symbol id="${val.name}" viewBox="${val.viewbox}">
      <title>${val.name}</title>
      <desc>${val.path}-${val.name}</desc>
      ${svgContent}
    </symbol>`
    return `${acc}${symbol}`
  }, '')}
</svg>
`

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

async function createAssets(ctx) {
  try {
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

    const data = await fetchFigmaFile(FILE_ID.assets)

    const figmaFile = processFigmaFile(data)
    const assetPages = getAssets(figmaFile)

    // Update with svg image urls from Figma
    const assetsWithUrl = await Promise.all(
      assetPages.map(async (assetPage) => {
        const ids = assetPage.value.map((x) => x.id)
        const result = await fetchFigmaImageUrls(FILE_ID.assets, ids)
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
    // Wait for Figma to start endpoints
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
            const { height, width } = svgClean.info

            return {
              ...asset,
              value: svgClean.data,
              viewbox: `0 0 ${height} ${width}`,
              datauri: svgCleanDataUri.data,
            }
          }),
        ),
      })),
    )

    // Write svg to files
    // TODO: Disabled for now as not sure if needed yet and not to polute repo with 600+ svgs yet...
    writeResultsIndividually(assetsWithSvg, PATHS.ICON_FILES, 'svg')
    // Write index.js for individual icons
    const npmIndex = createJSindex(assetsWithSvg)
    writeResults(
      [
        {
          name: 'index',
          value: npmIndex,
        },
      ],
      PATHS.ICON_FILES,
      'js',
    )
    // Write token
    writeResults(assetsWithSvg, PATHS.ICONS)

    const systemIconsSprite = createSvgSprite(
      assetsWithSvg.find((x) => x.name === 'system-icons'),
    )

    writeResults(
      [
        {
          name: 'system',
          value: systemIconsSprite,
        },
      ],
      `${PATHS.ASSETS_ICONS}`,
      'svg',
    )

    ctx.response.body = JSON.stringify(assetsWithSvg)
  } catch (err) {
    ctx.response.status = err.status || 500
    ctx.response.body = err.message
  }
}

// Transform tokens

async function transformTokens(ctx) {
  const tokens = readTokens(PATHS.BASE_TOKENS)
  const transformed = convert(tokens)
  transformed.forEach((token) => {
    writeFile(token.sassString, PATHS.SASS, `_${token.name}`, 'scss')
    writeFile(token.cssString, PATHS.CSS, token.name, 'css')
  })

  ctx.response.body = JSON.stringify(transformed)
}

// Desktop UI

async function createDesktopComponents(ctx) {
  // try {
  const data = await fetchFigmaFile(FILE_ID.desktop)

  const figmaFile = processFigmaFile(data)
  const components = makeDesktopComponents(figmaFile)

  writeResults(components, PATHS.COMPONENTS_DESKTOP)

  ctx.response.body = JSON.stringify(components)
  // } catch (err) {
  //   ctx.response.status = err.status || 500
  //   ctx.response.body = err.message
  // }
}

async function fetchFigmaImages(ctx) {
  const exec = util.promisify(childProcess.exec)
  // find all figma urls defined in storefront content files
  const { stdout, stderr } = await exec(
    `grep -rni "\\"https://www.figma" ./../storefront/src/content/* | awk -F"[\\"\\"]" '{print $2}' | sed "s/.*file//"`,
  )

  if (stderr) {
    console.error(`error: ${stderr}`)
  }

  // Parse figma urls node & file id
  const imageIdsByFileId = R.pipe(
    R.split(`\n`),
    R.filter(isNotEmpty),
    R.map((line) => {
      const id = R.replace(
        '%3A',
        ':',
        R.head(R.match(/(?<=node-id=).*/g, line)),
      )
      const fileId = R.head(R.match(/[^/]+(?=\/)/g, line))
      const name = `${fileId}.${R.replace(':', '_', id)}`

      return {
        id,
        name,
        fileId,
      }
    }),
    R.groupBy(R.view(R.lensProp('fileId'))),
  )(stdout)

  // Fetch figma image url for each node id
  const imagesWithUrls = await Promise.all(
    Object.keys(imageIdsByFileId).map(async (fileId) => {
      const images = imageIdsByFileId[fileId]
      const ids = images.map((x) => x.id).toString()
      const result = await fetchFigmaImageUrls(fileId, ids, 'png')

      if (!result.err) {
        const imagesWithUrl = images.map((image) => {
          const url = result.images[image.id]

          if (!url) {
            console.log(
              `Missing url, fileId: ${image.fileId}, nodeId: ${image.id}`,
            )
          }

          return {
            ...image,
            url,
          }
        })
        return imagesWithUrl
      }
      return images
    }),
  )

  const images = R.pipe(R.values, R.flatten)(imagesWithUrls)

  // Wait for Figma to start endpoints
  await sleep(2000)

  // Reset figme images
  await deletePaths([PATHS.IMAGES], {
    force: true,
  })

  // Save content of url as file
  writeUrlToFile(images, PATHS.IMAGES, 'png')

  ctx.response.body = images
}

app.listen(PORT)

// eslint-disable-next-line no-console
console.info('Started Figma Broker 👨🏻‍💼💼🎉')
