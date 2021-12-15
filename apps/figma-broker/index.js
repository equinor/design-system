import { argv } from 'process'
import dotenv from 'dotenv'
import * as R from 'ramda'

import { createTokens, createAssets } from './actions'

dotenv.config()

console.log('argsv', JSON.stringify(argv))

// const runAction = R.curry(async (action, ctx) => {
//   const result = await action(ctx)
//   ctx.response.body = JSON.stringify(result)
// })

// router
//   .post('/create-tokens', KoaBody(), runAction(createTokens))
//   .post('/create-assets', KoaBody(), runAction(createAssets))

// app.use(logger).use(router.routes()).use(router.allowedMethods())

// app.use(async (ctx, next) => {
//   try {
//     await next()
//   } catch (err) {
//     ctx.status = err.statusCode || err.status || 500
//     ctx.body = {
//       message: err.message,
//     }
//   }
// })

// app.listen(PORT)

// eslint-disable-next-line no-console
console.info('Started Figma Broker 👨🏻‍💼💼🎉')
