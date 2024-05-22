import { run as syncFigmaToTokens } from './scripts/sync_figma_to_tokens'
import { run as syncTokensToFigma } from './scripts/sync_tokens_to_figma'
import { readJsonFiles } from './utils/token_import'

export { readJsonFiles, syncFigmaToTokens, syncTokensToFigma }
