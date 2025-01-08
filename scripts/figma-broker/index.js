import { argv } from 'process'
import dotenv from 'dotenv'

import { createTokens, createAssets } from './actions/index.js'

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
      JSON.stringify(options),
    )
}
