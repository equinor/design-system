import 'dotenv/config'
import * as fs from 'fs'

import { FigmaApi } from '../api/figma_api.ts'

import { green } from '../utils/utils.ts'
import {
  generatePostVariablesPayload,
  readJsonFiles,
} from '../utils/token_import.ts'

export async function run() {
  const fileKeyIdx = process.argv.indexOf('--file-key')
  let fileKey: string

  if (fileKeyIdx !== -1) {
    fileKey = process.argv[fileKeyIdx + 1]
  } else {
    throw new Error(
      'Missing --file-key variable. Please provide the file key of the Figma file to sync from.',
    )
  }

  if (!process.env.PERSONAL_ACCESS_TOKEN) {
    throw new Error('PERSONAL_ACCESS_TOKEN environment variable are required')
  }

  const tokensDir = `tokens/${fileKey}`

  const tokensFiles = fs
    .readdirSync(tokensDir)
    .map((file: string) => `${tokensDir}/${file}`)

  const tokensByFile = readJsonFiles(tokensFiles)

  console.log('Read tokens files:', Object.keys(tokensByFile))

  const api = new FigmaApi(process.env.PERSONAL_ACCESS_TOKEN)
  const localVariables = await api.getLocalVariables(fileKey)

  const postVariablesPayload = generatePostVariablesPayload(
    tokensByFile,
    localVariables,
  )

  if (
    Object.values(postVariablesPayload).every((value) => value.length === 0)
  ) {
    console.log(green('✅ Tokens are already up to date with the Figma file'))
    return
  }

  const apiResp = await api.postVariables(fileKey, postVariablesPayload)

  console.log('POST variables API response:', apiResp)

  if (
    postVariablesPayload.variableCollections &&
    postVariablesPayload.variableCollections.length
  ) {
    console.log(
      'Updated variable collections',
      postVariablesPayload.variableCollections,
    )
  }

  if (
    postVariablesPayload.variableModes &&
    postVariablesPayload.variableModes.length
  ) {
    console.log('Updated variable modes', postVariablesPayload.variableModes)
  }

  if (postVariablesPayload.variables && postVariablesPayload.variables.length) {
    console.log('Updated variables', postVariablesPayload.variables)
  }

  if (
    postVariablesPayload.variableModeValues &&
    postVariablesPayload.variableModeValues.length
  ) {
    console.log(
      'Updated variable mode values',
      postVariablesPayload.variableModeValues,
    )
  }

  console.log(green('✅ Figma file has been updated with the new tokens'))
}
