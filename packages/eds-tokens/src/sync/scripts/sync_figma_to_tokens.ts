import 'dotenv/config'
import * as fs from 'fs'

import FigmaApi from '../api/figma_api.ts'

import { green } from '../utils/utils.ts'
import { tokenFilesFromLocalVariables } from '../utils/token_export.ts'

/**
 * Usage:
 *
 * // Defaults to writing to the tokens_new directory
 * npm run sync-figma-to-tokens
 *
 * // Writes to the specified directory
 * npm run sync-figma-to-tokens -- --output directory_name
 */

async function main() {
  const fileKeyIdx = process.argv.indexOf('--file-key')
  let fileKey

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

  const api = new FigmaApi(process.env.PERSONAL_ACCESS_TOKEN)
  const localVariables = await api.getLocalVariables(fileKey)

  const tokensFiles = tokenFilesFromLocalVariables(localVariables)

  const outputDir = `tokens/${fileKey}`

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  Object.entries(tokensFiles).forEach(([fileName, fileContent]) => {
    fs.writeFileSync(
      `${outputDir}/${fileName}`,
      JSON.stringify(fileContent, null, 2),
    )
    console.log(`Wrote ${fileName}`)
  })

  console.log(
    green(`✅ Tokens files have been written to the ${outputDir} directory`),
  )
}

main()
