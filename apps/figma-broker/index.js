#!/usr/bin/env NODE_NO_WARNINGS=1 node
/* eslint-disable no-unused-vars */
import dotenv from 'dotenv'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import KoaLogger from 'koa-logger'
import KoaBody from 'koa-body'

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
} from './functions/file'
import { makeComponents } from './transformers/components'
import { convert } from './functions/public'
import file from './files.json'
// Files
import { makeTokens } from './files/design-tokens'
import { makeDesktopComponents } from './files/desktop-ui'
import { getAssets } from './files/assets'

dotenv.config()

const PORT = process.env.PORT || 9001
const TEAM_ID = '590517879490131675'
const COMMON_DIR = '../../common'
const PATHS = {
  TOKENS: COMMON_DIR + '/tokens',
  ASSETS: COMMON_DIR + '/assets',
  COMPONENTS: COMMON_DIR + '/components',
  COMPONENTS_DESKTOP: COMMON_DIR + '/desktop-ui',
  SASS: COMMON_DIR + '/public/sass',
  CSS: COMMON_DIR + '/public/css',
}

const app = new Koa()
const router = new KoaRouter()
const logger = new KoaLogger()

router
  .post('/tokens', KoaBody(), createTokens)
  .get('/tokens', KoaBody(), getTokens)
  // .post("/components", KoaBody(), createComponents)
  .post('/assets', KoaBody(), createAssets)
  .post('/transform-tokens', KoaBody(), transformTokens)
  .post('/desktop-ui', KoaBody(), createDesktopComponents)

app
  .use(logger)
  .use(router.routes())
  .use(router.allowedMethods())

// Tokens

async function createTokens(ctx) {
  const data = await fetchFigmaFile(file.tokens)

  const figmaPages = processFigmaFile(data)
  const tokens = makeTokens(figmaPages)

  writeResults(tokens, PATHS.TOKENS)

  ctx.response.body = JSON.stringify(tokens)
}

async function getTokens(ctx) {
  const tokens = [{ name: 'TODO 🙈' }]
  ctx.response.body = JSON.stringify(tokens)
}

// Components

// async function createComponents(ctx) {
//   const data = await fetchFigmaComponents(TEAM_ID);

//   const figmaComponents = processFigmaComponents(data);
//   const components = makeComponents(figmaComponents);

//   writeComponents(components, PATHS.COMPONENTS);

//   ctx.response.body = JSON.stringify(components);
// }

// Assets

async function createAssets(ctx) {
  const data = await fetchFigmaFile(file.assets)

  const figmaPages = processFigmaFile(data)
  const assetPages = getAssets(figmaPages)

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
          const svg = await fetchFile(asset.url)
          return {
            ...asset,
            svg,
          }
        }),
      ),
    })),
  )

  // const updatedAssets = assets.map((x) => ({
  //   ...x,
  //   assetUrl: images[x.value.id],
  // }))

  // writeResults({}, PATHS.ASSETS, 'svg')

  ctx.response.body = JSON.stringify(assetsWithSvg)
}

// Transform tokens

async function transformTokens(ctx) {
  const tokens = readTokens(PATHS.TOKENS)
  const transformed = convert(tokens)
  transformed.forEach((file) => {
    writeFile(file.sassString, PATHS.SASS, `_${file.name}`, 'scss')
    writeFile(file.cssString, PATHS.CSS, file.name, 'css')
  })

  ctx.response.body = JSON.stringify(transformed)
}

// Desktop UI

async function createDesktopComponents(ctx) {
  const data = await fetchFigmaFile(file.desktop)

  const figmaPages = processFigmaFile(data)
  const components = makeDesktopComponents(figmaPages)

  writeResults(components, PATHS.COMPONENTS_DESKTOP)

  ctx.response.body = JSON.stringify(components)
}

app.listen(PORT)

// eslint-disable-next-line no-console
console.info('Started Figma Broker 😄')
