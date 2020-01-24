#!/usr/bin/env NODE_NO_WARNINGS=1 node
/* eslint-disable no-unused-vars */
import dotenv from 'dotenv'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import KoaLogger from 'koa-logger'
import KoaBody from 'koa-body'
import * as R from 'ramda'

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

const runAction = R.curry(async (action, ctx) => {
  const result = await action(ctx)
  ctx.response.body = JSON.stringify(result)
})

router
  .post('/create-tokens', KoaBody(), runAction(createTokens))
  .post('/create-component-tokens', KoaBody(), runAction(createComponentTokens))
  .post('/create-assets', KoaBody(), runAction(createAssets))
  .post('/create-figma-images', KoaBody(), runAction(createFigmaImages))

app
  .use(logger)
  .use(router.routes())
  .use(router.allowedMethods())

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500
    ctx.body = {
      message: err.message,
    }
  }
})

app.listen(PORT)

// eslint-disable-next-line no-console
console.info('Started Figma Broker 👨🏻‍💼💼🎉')
