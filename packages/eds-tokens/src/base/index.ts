import { clickbounds } from './clickbounds'
import { colors } from './colors'
import { elevation } from './elevation'
import { interactions } from './interactions'
import { shape } from './shape'
import { typography } from './typography'
import { spacings } from './spacings'

/**
 * @deprecated Do not use in new code — this legacy token object will be
 * removed in the next major release. If you need tokens today, use the CSS
 * variables (`@equinor/eds-tokens/css/variables`); the long-term
 * replacement is the new token structure on the beta line
 * (`@equinor/eds-tokens@beta`).
 */
export const tokens = {
  clickbounds,
  colors,
  elevation,
  interactions,
  shape,
  typography,
  spacings,
}
