import { ColorValue } from '../types'

export type TokenGroup = {
  [key: string]: string | string[] | number | boolean | TokenGroup
}

export function formatColorsAsTokens(
  colors: Record<string, ColorValue[]>,
): string {
  const tokens: Record<string, TokenGroup> = {}

  // Create tokens for each color in the record
  Object.entries(colors).forEach(([colorName, colorScale]) => {
    tokens[colorName] = formatColorScale(colorScale)
  })

  return JSON.stringify(tokens, null, 2)
}

function formatColorScale(colors: ColorValue[]): TokenGroup {
  const result: TokenGroup = {}

  colors.forEach((color, index) => {
    result[`${index + 1}`] = {
      $type: 'color',
      $value: color,
      $description: '',
      $extensions: {
        'com.figma': {
          hiddenFromPublishing: false,
          scopes: ['ALL_SCOPES'],
          codeSyntax: {},
        },
      },
    }
  })

  return result
}
