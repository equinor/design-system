import { makeColorToken } from './color'
import { makeSpacingTokens } from './spacing'
import { makeElevationTokens } from './elevation'
import { makeClickboundsTokens } from './clickbounds'
import { makeTextTokens } from './typography'
import { makeShapeTokens } from './shape'
import { makeInteractionsTokens } from './interactions'
import { fixPageName } from '@utils'

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
