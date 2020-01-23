import { writeResults } from '../functions/file'

import { fetchFigmaFile, processFigmaFile } from '../functions/figma'
import { makeDesktopComponents } from '../files/desktop-ui'
import { PATHS, FILE_IDS } from '../constants'

export async function createComponentTokens(ctx) {
  try {
    const data = await fetchFigmaFile(FILE_IDS.DESKTOP_UI)

    const figmaFile = processFigmaFile(data)
    const components = makeDesktopComponents(figmaFile)

    writeResults(components, PATHS.COMPONENTS_TOKENS)

    ctx.response.body = JSON.stringify(components)
  } catch (err) {
    ctx.response.status = err.status || 500
    ctx.response.body = err.message
  }
}
