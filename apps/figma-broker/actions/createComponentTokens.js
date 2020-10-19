import { writeResults } from '../functions/file'

import { fetchFigmaFile, processFigmaFile } from '../functions/figma'
import { makeDesktopComponents } from '../files/desktop-ui'
import { PATHS, FILE_IDS } from '../constants'

export async function createComponentTokens() {
  const data = await fetchFigmaFile(FILE_IDS.DESKTOP_UI)

  const figmaFile = processFigmaFile(data)
  const components = makeDesktopComponents(figmaFile)

  writeResults(components, PATHS.COMPONENTS_TOKENS, 'ts')

  return components
}
