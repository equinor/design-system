#!/usr/bin/env NODE_NO_WARNINGS=1 node
/* eslint-disable no-unused-vars */
import dotenv from 'dotenv'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import KoaLogger from 'koa-logger'
import KoaBody from 'koa-body'
import SVGO from 'svgo'

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
} from './functions/file'
import { convert } from './functions/public'
import file from './files.json'
// Files
import { makeTokens } from './files/design-tokens'
import { makeDesktopComponents } from './files/desktop-ui'
import { getAssets } from './files/assets'

dotenv.config()

const PORT = process.env.PORT || 9001
const TEAM_ID = process.env.FIGMA_TEAM_ID || ''

const COMMON_DIR = '../../common'
const TOKENS_DIR = '../../libraries/tokens/'
const ASSETS_DIR = '../../libraries/eds-static/'

const PATHS = {
  TOKENS: `${TOKENS_DIR}/base`,
  ASSETS: `${ASSETS_DIR}/assets`,
  COMPONENTS_DESKTOP: `${TOKENS_DIR}/components`,
  SASS: `${COMMON_DIR}/public/sass`,
  CSS: `${COMMON_DIR}/public/css`,
}

const app = new Koa()
const router = new KoaRouter()
const logger = new KoaLogger()
const svgo = new SVGO({
  plugins: [
    { removeDoctype: true },
    { removeUnknownsAndDefaults: true },
    { removeUselessStrokeAndFill: true },
    { removeAttrs: { attrs: '(stroke|fill|fill-rule|clip-rule)' } },
  ],
})

router
  .post('/tokens', KoaBody(), createTokens)
  .post('/assets', KoaBody(), createAssets)
  .post('/transform-tokens', KoaBody(), transformTokens)
  .post('/desktop-ui', KoaBody(), createDesktopComponents)

app
  .use(logger)
  .use(router.routes())
  .use(router.allowedMethods())

// Tokens
async function createTokens(ctx) {
  try {
    const data = await fetchFigmaFile(file.tokens)

    const figmaFile = processFigmaFile(data)
    const tokens = makeTokens(figmaFile)

    writeResults(tokens, PATHS.TOKENS)

    ctx.response.body = JSON.stringify(tokens)
  } catch (err) {
    ctx.response.status = err.status || 500
    ctx.response.body = err.message
  }
}

// Assets

async function createAssets(ctx) {
  try {
    const data = await fetchFigmaFile(file.assets)

    const figmaFile = processFigmaFile(data)
    const assetPages = getAssets(figmaFile)

    // Update with svg image urls from Figma
    const assetsWithUrl = await Promise.all(
      assetPages.map(async (assetPage) => {
        const ids = assetPage.value.map((x) => x.id)
        const result = await fetchFigmaImageUrls(file.assets, ids)
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
    // Fetch svg image as string for each asset
    const assetsWithSvg = await Promise.all(
      assetsWithUrl.map(async (assetPage) => ({
        ...assetPage,
        value: await Promise.all(
          assetPage.value.map(async (asset) => {
            const svgDirty = await fetchFile(asset.url)
            const svgClean = await svgo.optimize(svgDirty)
            return {
              ...asset,
              value: svgClean.data,
            }
          }),
        ),
      })),
    )

    // Write svg to files
    // TODO: Disabled for now as not sure if needed yet and not to polute repo with 600+ svgs yet...
    // writeResultsIndividually(assetsWithSvg, PATHS.ASSETS, 'svg')
    // Write token
    writeResults(assetsWithSvg, PATHS.ASSETS)

    ctx.response.body = JSON.stringify(assetsWithSvg)
  } catch (err) {
    ctx.response.status = err.status || 500
    ctx.response.body = err.message
  }
}

// Transform tokens

async function transformTokens(ctx) {
  const tokens = readTokens(PATHS.TOKENS)
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
  const data = await fetchFigmaFile(file.desktop)

  const figmaFile = processFigmaFile(data)
  const components = makeDesktopComponents(figmaFile)

  writeResults(components, PATHS.COMPONENTS_DESKTOP)

  ctx.response.body = JSON.stringify(components)
  // } catch (err) {
  //   ctx.response.status = err.status || 500
  //   ctx.response.body = err.message
  // }
}

app.listen(PORT)

// eslint-disable-next-line no-console
console.info('Started Figma Broker 👨🏻‍💼💼🎉')
