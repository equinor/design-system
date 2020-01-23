#!/usr/bin/env NODE_NO_WARNINGS=1 node
/* eslint-disable no-unused-vars */
import dotenv from 'dotenv'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import KoaLogger from 'koa-logger'
import KoaBody from 'koa-body'
import childProcess from 'child_process'
import * as R from 'ramda'
import util from 'util'

import {
  fetchFigmaFile,
  processFigmaFile,
  fetchFigmaImageUrls,
} from './functions/figma'
import { writeResults, writeUrlToFile, deletePaths } from './functions/file'
// Files
import { isNotEmpty, sleep } from '@utils'
import { createTokens, createAssets, createComponentTokens } from './actions'

dotenv.config()

const PORT = process.env.PORT || 9001

const TOKENS_DIR = '../../libraries/tokens'
const STATIC_DIR = '../../libraries/eds-static'
const ICONS_DIR = '../../libraries/icons'
const STOREFRONT_DIR = '../storefront'

const PATHS = {
  BASE_TOKENS: `${TOKENS_DIR}/base`,
  ASSETS_ICONS: `${STATIC_DIR}/icons`,
  COMPONENTS_DESKTOP: `${TOKENS_DIR}/components`,
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
  .post('/desktop-ui', KoaBody(), createComponentTokens)
  .post('/figma-images', KoaBody(), fetchFigmaImages)

app
  .use(logger)
  .use(router.routes())
  .use(router.allowedMethods())

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
