import { makeColorToken } from './color.js'
import { makeSpacingTokens } from './spacing.js'
import { makeElevationTokens } from './elevation.js'
import { makeClickboundsTokens } from './clickbounds.js'
import { makeTextTokens } from './typography.js'
import { makeShapeTokens } from './shape.js'
import { makeInteractionsTokens } from './interactions.js'
import { fixPageName } from '../../functions/utils.js'

export const makeTokens = (figmaFile) => {
  const tokens = []
  const { pages, getStyle } = figmaFile

  pages.forEach((page) => {
    const fixedPageName = fixPageName(page.name)
    const data = page.children

    switch (fixedPageName) {
      case 'color':
        tokens.push({
          name: 'colors',
          value: makeColorToken(data, getStyle),
        })
        break
      case 'spacing':
        tokens.push({
          name: 'spacings',
          value: makeSpacingTokens(data, getStyle),
        })
        break
      case 'elevation':
        tokens.push({
          name: 'elevation',
          value: makeElevationTokens(data, getStyle),
        })
        break
      case 'clickbounds':
        tokens.push({
          name: 'clickbounds',
          value: makeClickboundsTokens(data, getStyle),
        })
        break
      case 'typography':
        tokens.push({
          name: 'typography',
          value: makeTextTokens(data, getStyle),
        })
        break
      case 'shape':
        tokens.push({
          name: 'shape',
          value: makeShapeTokens(data, getStyle),
        })
        break
      case 'interaction states':
        tokens.push({
          name: 'interactions',
          value: makeInteractionsTokens(data, getStyle),
        })
        break
      default:
        break
    }
  })

  return tokens
}
