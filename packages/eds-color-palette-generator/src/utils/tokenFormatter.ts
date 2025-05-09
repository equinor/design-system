import { ColorValue } from '../types'

export type TokenGroup = {
  [key: string]: string | string[] | number | boolean | TokenGroup
}

export function formatColorsAsTokens(
  lightColors: {
    accent: ColorValue[]
    neutral: ColorValue[]
    success: ColorValue[]
    info: ColorValue[]
    warning: ColorValue[]
    danger: ColorValue[]
  },
  darkColors: {
    accentDark: ColorValue[]
    neutralDark: ColorValue[]
    successDark: ColorValue[]
    infoDark: ColorValue[]
    warningDark: ColorValue[]
    dangerDark: ColorValue[]
  },
): string {
  const tokens = {
    eds: {
      color: {
        neutral: {
          light: formatColorScale(lightColors.neutral, 'neutral'),
          dark: formatColorScale(darkColors.neutralDark, 'neutral'),
        },
        utility: {
          red: {
            light: formatColorScale(lightColors.danger, 'danger'),
            dark: formatColorScale(darkColors.dangerDark, 'danger'),
          },
          yellow: {
            light: formatColorScale(lightColors.warning, 'warning'),
            dark: formatColorScale(darkColors.warningDark, 'warning'),
          },
          green: {
            light: formatColorScale(lightColors.success, 'success'),
            dark: formatColorScale(darkColors.successDark, 'success'),
          },
          blue: {
            light: formatColorScale(lightColors.info, 'info'),
            dark: formatColorScale(darkColors.infoDark, 'info'),
          },
        },
        brand: {
          'moss-green': {
            light: formatColorScale(lightColors.accent, 'accent'),
            dark: formatColorScale(darkColors.accentDark, 'accent'),
          },
        },
      },
    },
  }

  return JSON.stringify(tokens, null, 2)
}

function formatColorScale(colors: ColorValue[], name: string): TokenGroup {
  const result: TokenGroup = {}

  const start = colors.slice(0, 8)
  const textColors = colors.slice(8, 10)
  const solidColors = colors.slice(10, 13)

  const newArray = [...start, ...solidColors, ...textColors]

  newArray.forEach((color, index) => {
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
