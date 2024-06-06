import StyleDictionary, { TransformedToken } from 'style-dictionary-utils'
import Color from 'colorjs.io'
import { readJsonFiles } from '@equinor/eds-tokens-sync'

const TOKENS_DIR = './tokens'
const FILE_KEY_PRIMITIVES = 'cVaqjfgt3gDiqbx10q3Pj8'
const FILE_KEY_THEMES = 'aRgKtCisnm98k9kVy6zasL'
const FILE_KEY_SPACING = 'cpNchKjiIM19dPqTxE0fqg'
const FILE_KEY_TYPOGRAPHY_MODES = 'FQQqyumcpPQoiFRCjdS9GM'
const OKLCH_PRECISION = 3
const rootVersion1 = './build/'
const cssDistPath = `${rootVersion1}/css`
const tsDistPath = `${rootVersion1}/ts`
const jsonDistPath = `${rootVersion1}/json`

const outputReferences = true

const {
  filter: { isColor },
} = StyleDictionary

// manually convert reference into custom property
const resolveReference = (value: string, prefix: string): string => {
  if (!value) return ''

  const valueFormatted = value
    .toLowerCase()
    .replace('{', '')
    .replace('}', '')
    .replaceAll(' ', '-')
    .replaceAll('.', '-')

  return `var(--${prefix}-${valueFormatted})`
}

const darkTokens = readJsonFiles([
  `./${TOKENS_DIR}/${FILE_KEY_THEMES}/🌗 Themes.Dark.json`,
])
const lightDarkTransform: StyleDictionary.Transform = {
  type: 'value',
  transitive: true,
  matcher: isColor,
  transformer: (token: StyleDictionary.TransformedToken, options) => {
    const path = token.path.join('/')
    const darkValue = darkTokens['🌗 Themes.Dark.json']?.[`${path}`]?.['$value']
    let newValue = `${token.value}`
    if (darkValue) {
      //it is a reference
      if (String(darkValue).startsWith('{')) {
        const resolvedReference = resolveReference(
          `${darkValue}`,
          `${options.prefix}`,
        )
        //make sure it is not a local variable, in which case it has light-dark set already
        if (token.original.value != darkValue) {
          newValue = `light-dark(${token.value}, ${
            outputReferences ? resolvedReference : darkValue
          })`
        }
      } else {
        //the dark value was hardcoded (color with alpha transparency)
        newValue = `light-dark(${token.value}, ${new Color(darkValue as string)
          .to('oklch')
          .toString({ precision: OKLCH_PRECISION })})`
      }
    }
    return newValue
  },
}

const toOKLCHTransform: StyleDictionary.Transform = {
  type: 'value',
  transitive: true,
  matcher: isColor,
  transformer: (token: StyleDictionary.TransformedToken) => {
    const tokenAsString = `${token.value}`
    //handle partially transformed light-dark values
    if (tokenAsString.startsWith('light')) {
      return tokenAsString
    }
    return new Color(tokenAsString)
      .to('oklch')
      .toString({ precision: OKLCH_PRECISION })
  },
}

StyleDictionary.registerTransform({
  name: 'color/oklch',
  ...toOKLCHTransform,
})
StyleDictionary.registerTransform({
  name: 'lightDark',
  ...lightDarkTransform,
})

/* const fileHeader = (defaultMessage: string[]) => [
  ...defaultMessage,
  '@tokens Colors',
  '@presenter Color',
] */

const fileHeader = () => ['Do not edit directly']

const lightDark = StyleDictionary.extend({
  include: [`./${TOKENS_DIR}/${FILE_KEY_PRIMITIVES}/🎨 Color.Color.json`],
  source: [`./${TOKENS_DIR}/${FILE_KEY_THEMES}/🌗 Themes.Light.json`],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'eds-color',
      buildPath: `${cssDistPath}/color/`,
      transforms: ['name/cti/kebab', 'color/css', 'color/oklch', 'lightDark'],
      files: [
        {
          filter: (token) => token.filePath.includes('Light'),
          destination: 'theme.css',
          format: 'css/variables',
          options: {
            fileHeader,
            outputReferences,
          },
        },
      ],
    },
  },
})

StyleDictionary.registerTransform({
  type: 'value',
  transitive: false,
  name: 'eds/pxFormatted',
  matcher: (token) => {
    const isNumber = token.$type === 'number'
    if (!isNumber) return false

    const isDefined = token?.value !== undefined
    if (!isDefined) return false

    const pxToEmMatchers = [
      'tracking-tight',
      'tracking-normal',
      'tracking-loose',
    ]
    return (
      token?.path?.length > 0 &&
      pxToEmMatchers.some((metric) => token.path.includes(metric))
    )
  },
  transformer: (token) => {
    const fixedValue = toFixedWithoutTrailingZeroes(Number(token.value))
    return `${fixedValue}px`
  },
})

StyleDictionary.registerTransform({
  type: `value`,
  transitive: false,
  name: `eds/pxToRem`,
  matcher: (token) => {
    const isNumber = token.$type === 'number'
    if (!isNumber) return false

    const isDefined = token?.value !== undefined
    if (!isDefined) return false

    const pxToRemMatchers = ['font', 'size', 'line-height', 'font-size']
    const isFontMetricInPx =
      token?.path?.length > 0 &&
      pxToRemMatchers.some((metric) => token.path.includes(metric))

    const isSpacing = token?.path?.includes('spacing')

    return isFontMetricInPx || isSpacing
  },
  transformer: (token) => {
    return transformNumberToRem(Number(token.value))
  },
})

StyleDictionary.registerTransform({
  type: `value`,
  transitive: false,
  name: `eds/font/quote`,
  matcher: (token) => {
    const fontMetricsInString = ['font', 'family', 'weight', 'font-family']

    const isFontMetricInString =
      token?.path?.length > 0 &&
      fontMetricsInString.some((metric) => token.path.includes(metric))

    return isFontMetricInString
  },
  transformer: (token) => {
    return `"${token.value}"`
  },
})

const _extend = ({
  source,
  fileName,
  dirName,
  prefix,
  selector,
  filter,
  include,
}: {
  include?: string[]
  source: string[]
  fileName: string
  dirName: string
  prefix: string
  selector?: string
  filter?: (token: TransformedToken) => boolean
}): StyleDictionary.Core => {
  return StyleDictionary.extend({
    include,
    source,
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: `${cssDistPath}/${dirName}/`,
        transforms: [
          'name/cti/kebab',
          'eds/pxToRem',
          'eds/pxFormatted',
          'eds/font/quote',
          'color/oklch',
        ],
        files: [
          {
            filter,
            destination: `${fileName}.css`,
            format: 'css/variables',
            options: {
              selector,
              outputReferences,
              fileHeader,
            },
          },
        ],
      },
      ts: {
        transformGroup: 'js',
        transforms: ['name/cti/constant'],
        buildPath: `${tsDistPath}/${dirName}/`,
        files: [
          {
            filter,
            destination: `${fileName}.ts`,
            options: {
              fileHeader,
              outputReferences,
            },
            format: 'javascript/es6',
          },
          {
            filter,
            format: 'typescript/es6-declarations',
            options: {
              fileHeader,
              outputReferences,
            },
            destination: `${fileName}.d.ts`,
          },
        ],
      },
      json: {
        buildPath: `${jsonDistPath}/${dirName}/`,
        transforms: ['name/cti/kebab'],
        files: [
          {
            filter,
            destination: `flat/${fileName}.json`,
            format: 'json/flat',
          },
          {
            filter,
            destination: `nested/${fileName}.json`,
            format: 'json/nested',
          },
        ],
      },
    },
  })
}

const COLOR_PRIMITIVE_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_PRIMITIVES}/🎨 Color.Color.json`

const primitives = _extend({
  source: [COLOR_PRIMITIVE_SOURCE],
  dirName: 'color',
  fileName: 'primitives',
  prefix: 'eds-color',
})

const lightMode = _extend({
  include: [COLOR_PRIMITIVE_SOURCE],
  source: [`./${TOKENS_DIR}/${FILE_KEY_THEMES}/🌗 Themes.Light.json`],
  filter: (token) => token.filePath.includes('Light'),
  fileName: 'theme-light',
  dirName: 'color',
  prefix: 'eds-color',
})

const darkMode = _extend({
  include: [COLOR_PRIMITIVE_SOURCE],
  source: [`./${TOKENS_DIR}/${FILE_KEY_THEMES}/🌗 Themes.Dark.json`],
  filter: (token) => token.filePath.includes('Dark'),
  fileName: 'theme-dark',
  dirName: 'color',
  prefix: 'eds-color',
  selector: '[data-theme="dark"]',
})

const SPACING_PRIMITIVE_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_SPACING}/👾 Spacing Primitives.Value.json`

const spacingPrimitives = _extend({
  source: [SPACING_PRIMITIVE_SOURCE],
  dirName: 'spacing',
  fileName: 'primitives',
  prefix: 'eds',
})

const typographyDensityComfortable = _extend({
  include: [SPACING_PRIMITIVE_SOURCE],
  source: [
    `./${TOKENS_DIR}/${FILE_KEY_TYPOGRAPHY_MODES}/💎 Density.Comfortable.json`,
  ],
  dirName: 'spacing',
  fileName: 'comfortable',
  prefix: 'eds',
  selector: ':root, [data-density="comfortable"]',
  filter: (token) => token.filePath.includes('Density'),
})

const typographyDensityCompact = _extend({
  include: [SPACING_PRIMITIVE_SOURCE],
  source: [
    `./${TOKENS_DIR}/${FILE_KEY_TYPOGRAPHY_MODES}/💎 Density.Compact.json`,
  ],
  dirName: 'spacing',
  fileName: 'compact',
  prefix: 'eds',
  selector: '[data-density="compact"]',
  filter: (token) => token.filePath.includes('Density'),
})

const typographyDensitySpacious = _extend({
  include: [SPACING_PRIMITIVE_SOURCE],
  source: [
    `./${TOKENS_DIR}/${FILE_KEY_TYPOGRAPHY_MODES}/💎 Density.Spacious.json`,
  ],
  dirName: 'spacing',
  fileName: 'spacious',
  prefix: 'eds',
  selector: '[data-density="Spacious"]',
  filter: (token) => token.filePath.includes('Density'),
})

export function run() {
  primitives.buildAllPlatforms()
  lightMode.buildAllPlatforms()
  darkMode.buildAllPlatforms()
  lightDark.buildAllPlatforms()
  spacingPrimitives.buildAllPlatforms()
  typographyDensityComfortable.buildAllPlatforms()
  typographyDensityCompact.buildAllPlatforms()
  typographyDensitySpacious.buildAllPlatforms()
}

function transformNumberToRem(value: number): string {
  return transformNumberToUnit(value, 16, 'rem')
}

function transformNumberToUnit(
  value: number,
  rootFontSize: number,
  unit: string,
): string {
  if (value === 0) return `0${unit}`

  const valueWithTwoDigitsAfterDecimal = Number(value.toFixed(3))
  const valueInUnit = valueWithTwoDigitsAfterDecimal / rootFontSize
  const valueWithoutTrailingZeroes = toFixedWithoutTrailingZeroes(valueInUnit)
  const valueWithSuffix = `${valueWithoutTrailingZeroes}${unit}`

  return valueWithSuffix
}

function toFixedWithoutTrailingZeroes(value: number, fractionDigits = 3) {
  const valueWithTwoDigitsAfterDecimal = value.toFixed(fractionDigits)
  const valueWithoutTrailingZeroes = parseFloat(
    `${valueWithTwoDigitsAfterDecimal}`,
  )
  return valueWithoutTrailingZeroes
}
