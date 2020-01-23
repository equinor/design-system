#!/usr/bin/env NODE_NO_WARNINGS=1 node
/* eslint-disable no-unused-vars */
import dotenv from 'dotenv'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import KoaLogger from 'koa-logger'
import KoaBody from 'koa-body'

import {
  createTokens,
  createAssets,
  createComponentTokens,
  createFigmaImages,
} from './actions'

dotenv.config()

const PORT = process.env.PORT || 9001

const app = new Koa()
const router = new KoaRouter()
const logger = new KoaLogger()

router
  .post('/tokens', KoaBody(), createTokens)
  .post('/assets', KoaBody(), createAssets)
  .post('/desktop-ui', KoaBody(), createComponentTokens)
  .post('/figma-images', KoaBody(), createFigmaImages)

app
  .use(logger)
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(PORT)

// eslint-disable-next-line no-console
console.info('Started Figma Broker 👨🏻‍💼💼🎉')
