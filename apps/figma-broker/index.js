import { argv } from 'process'
import dotenv from 'dotenv'
import * as R from 'ramda'

import { createTokens, createAssets } from './actions'

dotenv.config()

const action = argv[2]
const fileId = argv[3]
const force = argv[4]

const options = {
  action,
  query: {
    fileId,
    force,
  },
}

console.info('Started Figma Broker 👨🏻')

switch (action) {
  case 'tokens':
    createTokens(options)
    break
  case 'assets':
    createAssets(options)
    break
  default:
    console.warn(
      `Aborting, action not found for ${action}`,
      JSON.stringify({ action, options }),
    )
}

// eslint-disable-next-line no-console
