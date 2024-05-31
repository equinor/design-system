import StyleDictionary, { TransformedToken } from 'style-dictionary-utils'
import Color from 'colorjs.io'
import { readJsonFiles } from '@equinor/eds-tokens-sync'

const TOKENS_DIR = './tokens'
const FILE_KEY_PRIMITIVES = 'cVaqjfgt3gDiqbx10q3Pj8'
const FILE_KEY_THEMES = 'aRgKtCisnm98k9kVy6zasL'
const FILE_KEY_SPACING = 'cpNchKjiIM19dPqTxE0fqg'
const FILE_KEY_TYPOGRAPHY_MODES = 'FQQqyumcpPQoiFRCjdS9GM'
const OKLCH_PRECISION = 3
const rootVersion1 = './dist/'
const cssDistPath = `${rootVersion1}/css`
const tsDistPath = `${rootVersion1}/ts`
const jsonDistPath = `${rootVersion1}/json`

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
          newValue = `light-dark(${token.value}, ${resolvedReference})`
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

const fileHeader = (defaultMessage: string[]) => [
  ...defaultMessage,
  '@tokens Colors',
  '@presenter Color',
]
const outputReferences = true

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
  type: `value`,
  transitive: true,
  name: `eds/font/pxToRem`,
  matcher: (token) => {
    const isFontMetricInPx =
      token?.path?.includes('font') &&
      (token?.path?.includes('size') || token?.path?.includes('line-height'))
    const isSpacing = token?.path?.includes('spacing')

    return isFontMetricInPx || isSpacing
  },
  transformer: (token) => {
    return `${parseFloat(`${token.value}`) / 16}rem`
  },
})

StyleDictionary.registerTransform({
  type: `value`,
  transitive: true,
  name: `eds/font/quote`,
  matcher: (token) => {
    const isFontMetricInString =
      (token?.path?.includes('font') &&
        (token?.path?.includes('family') || token?.path?.includes('weight'))) ||
      token?.path?.includes('font-family')

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
          'eds/font/pxToRem',
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
  prefix: 'eds-primitives',
})

const typographyDensityComfortable = _extend({
  include: [SPACING_PRIMITIVE_SOURCE],
  source: [
    `./${TOKENS_DIR}/${FILE_KEY_TYPOGRAPHY_MODES}/💎 Density.Comfortable.json`,
  ],
  dirName: 'spacing',
  fileName: 'comfortable',
  prefix: 'eds-semantic',
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
  prefix: 'eds-semantic',
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
  prefix: 'eds-semantic',
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
