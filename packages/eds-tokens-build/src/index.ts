import StyleDictionary, { TransformedToken } from 'style-dictionary-utils'
import Color from 'colorjs.io'
import { readJsonFiles } from '@equinor/eds-tokens-sync'

const TOKENS_DIR = './tokens'
const FILE_KEY_PRIMITIVES = 'cVaqjfgt3gDiqbx10q3Pj8'
const FILE_KEY_THEMES = 'aRgKtCisnm98k9kVy6zasL'
const FILE_KEY_SPACING = 'cpNchKjiIM19dPqTxE0fqg'
const FILE_KEY_TYPOGRAPHY_MODES = 'FQQqyumcpPQoiFRCjdS9GM'
const OKLCH_PRECISION = 3
const outputDirectory = './build'
const cssDistPath = `${outputDirectory}/css`
const tsDistPath = `${outputDirectory}/ts`
const jsonDistPath = `${outputDirectory}/json`

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

    if (darkValue) {
      //it is a reference
      if (String(darkValue).startsWith('{')) {
        //make sure it is not a local variable, in which case it has light-dark set already
        if (token.original.value != darkValue) {
          const outputReferences =
            options?.files?.[0]?.options?.outputReferences
          if (outputReferences) {
            const resolvedReference = resolveReference(
              `${darkValue}`,
              `${options.prefix}`,
            )
            return `light-dark(${token.value}, ${resolvedReference})`
          } else {
            return `light-dark(${token.value}, ${darkValue})`
          }
        }
      } else {
        //the dark value was hardcoded (color with alpha transparency)
        return `light-dark(${token.value}, ${new Color(darkValue as string)
          .to('oklch')
          .toString({ precision: OKLCH_PRECISION })})`
      }
    }

    return `${token.value}`
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

const fileHeader = () => ['Do not edit directly']

StyleDictionary.registerTransform({
  type: 'value',
  transitive: false,
  name: 'eds/css/pxFormatted',
  matcher: (token) => {
    const isDefined = token?.value !== undefined
    if (!isDefined) return false

    const isNumber = token.$type === 'number'
    if (!isNumber) return false

    const pxMatchers = ['tracking-tight', 'tracking-normal', 'tracking-loose']
    return (
      token?.path?.length > 0 &&
      pxMatchers.some((metric) => token.path.includes(metric))
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
  name: `eds/css/pxToRem`,

  matcher: (token) => {
    if (
      token?.value === undefined ||
      token.$type !== 'number' ||
      isNaN(Number(token.value))
    ) {
      return false
    }

    const matchingPathSegments = [
      'font',
      'size',
      'line-height',
      'font-size',
      'sizing',
      'spacing',
    ]

    const isMatch =
      token?.path?.length > 0 &&
      matchingPathSegments.some((segment) => token.path.includes(segment))

    return isMatch
  },
  transformer: (token) => {
    return transformNumberToRem(Number(token.value))
  },
})

StyleDictionary.registerTransform({
  type: `value`,
  transitive: true,
  name: `eds/css/spacing/shorthand`,
  matcher: (token) => {
    const isNumber = token.$type === 'number'
    if (!isNumber) return false

    const isDefined = token?.value !== undefined
    if (!isDefined) return false

    const matchingPathSegments = [
      'stack-squished',
      'stack-squared',
      'stack-stretched',
    ]
    const isMatch =
      token?.path?.length > 0 &&
      matchingPathSegments.some((segment) => token.path.includes(segment))

    return isMatch
  },
  transformer: (token) => {
    const size = token.path[2]
    return `${token.value} var(--eds-spacing-static-inline-${size})`
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
  outputReferences,
}: {
  include?: string[]
  source: string[]
  fileName: string
  dirName: string
  prefix: string
  selector?: string
  filter?: (token: TransformedToken) => boolean
  outputReferences?: boolean
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
          'eds/css/spacing/shorthand',
          'eds/css/pxToRem',
          'eds/css/pxFormatted',
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

const includeTokenFilter = (
  token: TransformedToken,
  filePathSegmentsToInclude?: string[],
) => {
  const namesToExclude = [
    'documentation',
    'padding-centred',
    'padding-baselined',
  ]
  const isExcluded = namesToExclude.some((nameToExclude) =>
    token.name.includes(nameToExclude),
  )
  if (isExcluded) {
    return false
  }

  if (filePathSegmentsToInclude && filePathSegmentsToInclude.length > 0) {
    const isIncludingFilePathSegmentsToInclude = filePathSegmentsToInclude.some(
      (segment) => token.filePath.includes(segment),
    )
    return isIncludingFilePathSegmentsToInclude
  }

  return true
}

export function run({ outputReferences } = { outputReferences: true }) {
  console.info('Running Style Dictionary build script')
  console.info('outputReferences:', outputReferences)

  const systemName = 'eds'
  const colorPrefix = `${systemName}-color`
  const colorDirName = 'color'

  const spacingDirName = 'spacing'

  const COLOR_PRIMITIVE_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_PRIMITIVES}/🎨 Color.Color.json`
  const SPACING_PRIMITIVE_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_SPACING}/👾 Primitives.Value.json`
  const THEME_LIGHT_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_THEMES}/🌗 Themes.Light.json`
  const THEME_DARK_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_THEMES}/🌗 Themes.Dark.json`

  const DENSITY_FIGMA_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_SPACING}/⛔️ Figma.Value.json`
  const DENSITY_SPACIOUS_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_TYPOGRAPHY_MODES}/💎 Density.Spacious.json`
  const DENSITY_COMFORTABLE_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_TYPOGRAPHY_MODES}/💎 Density.Comfortable.json`
  // const DENSITY_COMPACT_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_TYPOGRAPHY_MODES}/💎 Density.Compact.json`

  const primitives = _extend({
    source: [COLOR_PRIMITIVE_SOURCE],
    dirName: colorDirName,
    prefix: colorPrefix,
    fileName: 'primitives',
    outputReferences, // The primitives should not reference other tokens. This can always be false.
  })

  const lightMode = _extend({
    include: [COLOR_PRIMITIVE_SOURCE],
    source: [THEME_LIGHT_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Light']),
    dirName: colorDirName,
    prefix: colorPrefix,
    fileName: 'theme-light',
    outputReferences,
  })
  const darkMode = _extend({
    include: [COLOR_PRIMITIVE_SOURCE],
    source: [THEME_DARK_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Dark']),
    dirName: colorDirName,
    prefix: colorPrefix,
    fileName: 'theme-dark',
    selector: '[data-theme="dark"]',
    outputReferences,
  })
  const spacingPrimitives = _extend({
    source: [SPACING_PRIMITIVE_SOURCE],
    dirName: spacingDirName,
    prefix: systemName,
    fileName: 'primitives',
  })

  const densityComfortable = _extend({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_COMFORTABLE_SOURCE],
    dirName: spacingDirName,
    prefix: systemName,
    fileName: 'comfortable',
    selector: ':root, [data-density="comfortable"]',
    filter: (token) => includeTokenFilter(token, ['Density']),
    outputReferences: true,
  })

  // const densityCompact = _extend({
  // include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
  //   source: [DENSITY_COMPACT_SOURCE],
  //   dirName: spacingDirName,
  //   prefix: systemName,
  //   fileName: 'compact',
  //   selector: '[data-density="compact"]',
  //   filter: (token) => includeTokenFilter(token, ['Density']),
  //   outputReferences,
  // })
  const densitySpacious = _extend({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_SPACIOUS_SOURCE],
    dirName: spacingDirName,
    prefix: systemName,
    fileName: 'spacious',
    selector: '[data-density="Spacious"]',
    filter: (token) => includeTokenFilter(token, ['Density']),
    outputReferences,
  })

  const lightDark = StyleDictionary.extend({
    include: [COLOR_PRIMITIVE_SOURCE],
    source: [THEME_LIGHT_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix: colorPrefix,
        buildPath: `${cssDistPath}/color/`,
        transforms: ['name/cti/kebab', 'color/css', 'color/oklch', 'lightDark'],
        files: [
          {
            filter: (token) => includeTokenFilter(token, ['Light']),
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

  const lightDarkTrimmed = StyleDictionary.extend({
    include: [COLOR_PRIMITIVE_SOURCE],
    source: [THEME_LIGHT_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix: colorPrefix,
        buildPath: `${cssDistPath}/`,
        transforms: ['name/cti/kebab', 'color/css', 'color/oklch', 'lightDark'],
        files: [
          {
            filter: (token) => includeTokenFilter(token, ['Light']),
            destination: 'variables-trimmed.css',
            format: 'css/variables',
            options: {
              fileHeader,
              outputReferences: false, // The trimmed theme should not reference other tokens
            },
          },
        ],
      },
    },
  })

  primitives.buildAllPlatforms()
  lightMode.buildAllPlatforms()
  darkMode.buildAllPlatforms()
  lightDark.buildAllPlatforms()
  lightDarkTrimmed.buildAllPlatforms()
  spacingPrimitives.buildAllPlatforms()
  densityComfortable.buildAllPlatforms()
  densitySpacious.buildAllPlatforms()
  // densityCompact.buildAllPlatforms()
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
