import { writeFile } from '../functions/file'

import { fetchFigmaFile, processFigmaFile } from '../functions/figma'
import { makeDesktopComponents } from '../files/desktop-ui'
import { PATHS, FILE_IDS } from '../constants'

export async function createVariantTokens() {
  const data = await fetchFigmaFile(FILE_IDS.DESKTOP_UI)

  const figmaFile = processFigmaFile(data)
  const variantsString = makeDesktopComponents(figmaFile)

  writeFile(PATHS.COMPONENTS_TOKENS, 'variants', 'ts', variantsString)

  return variantsString
}
