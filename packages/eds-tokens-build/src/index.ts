import StyleDictionary, { TransformedToken } from 'style-dictionary-utils'
import { readJsonFiles } from '@equinor/eds-tokens-sync'

const TOKENS_DIR = './tokens'
const FILE_KEY_PRIMITIVES = 'cVaqjfgt3gDiqbx10q3Pj8'
const FILE_KEY_COLORS = 'aRgKtCisnm98k9kVy6zasL'
const FILE_KEY_SPACING = 'cpNchKjiIM19dPqTxE0fqg'
const FILE_KEY_TYPOGRAPHY_MODES = 'FQQqyumcpPQoiFRCjdS9GM'

const {
  filter: { isColor, isNumber },
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

const darkColorSchemeCollectionFile = '🌗 Colour scheme.Dark.json'
const lightColorSchemeCollectionFile = '🌗 Colour scheme.Light.json'

const darkTokens = readJsonFiles([
  `./${TOKENS_DIR}/${FILE_KEY_COLORS}/${darkColorSchemeCollectionFile}`,
])
const spacingComfortableTokens = readJsonFiles([
  `./${TOKENS_DIR}/${FILE_KEY_TYPOGRAPHY_MODES}/💎 Density.Comfortable.json`,
])

const lightDarkTransform: StyleDictionary.Transform = {
  type: 'value',
  transitive: true,
  matcher: isColor,
  transformer: (token: StyleDictionary.TransformedToken, options) => {
    const path = token.path.join('/')
    const darkValue =
      darkTokens[darkColorSchemeCollectionFile]?.[`${path}`]?.['$value']

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
        return `light-dark(${token.value}, ${darkValue})`
      }
    }

    return `${token.value}`
  },
}

//@todo: rewrite to include compact when those tokens are ready
const densitySpaceToggleTransform: StyleDictionary.Transform = {
  type: 'value',
  transitive: true,
  matcher: isNumber,
  transformer: (token: StyleDictionary.TransformedToken, options) => {
    const path = token.path.join('/')
    const comfortableValue =
      spacingComfortableTokens['💎 Density.Comfortable.json']?.[`${path}`]?.[
        '$value'
      ]

    if (comfortableValue) {
      //it is a reference
      if (String(comfortableValue).startsWith('{')) {
        //make sure it is not a local variable
        if (token.original.value != comfortableValue) {
          const outputReferences =
            options?.files?.[0]?.options?.outputReferences
          if (outputReferences) {
            const resolvedReference = resolveReference(
              `${comfortableValue}`,
              `${options.prefix}`,
            )
            return `var(--eds--spacious, ${token.value}) var(--eds--comfortable, ${resolvedReference})`
          } else {
            return `var(--eds--spacious, ${token.value}) var(--eds--comfortable, ${comfortableValue})`
          }
        }
      } else {
        return `var(--eds--spacious, ${
          token.value
        }) var(--eds--comfortable, ${transformNumberToRem(
          Number(comfortableValue),
        )})`
      }
    }

    return `${token.value}`
  },
}

StyleDictionary.registerTransform({
  name: 'lightDark',
  ...lightDarkTransform,
})
StyleDictionary.registerTransform({
  name: 'densitySpaceToggle',
  ...densitySpaceToggleTransform,
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
  transitive: true,
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

//This is not used for now, we need to rethink how to implement shorthand if it is even needed
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
  transformer: (token, options) => {
    const outputReferences = options?.files?.[0]?.options?.outputReferences
    const size = token.path[2]

    if (outputReferences) {
      return `${token.value} var(--eds-spacing-static-inline-${size})`
    }

    // Determine the density of the current token using the filePath
    // because we need to know where to look for the raw value of the current spacing
    // the current token for the current density mode.
    const density = token.filePath.includes('Spacious')
      ? 'spacious'
      : 'comfortable'

    const densityFilePath =
      density === 'spacious'
        ? DENSITY_SPACIOUS_SOURCE
        : DENSITY_COMFORTABLE_SOURCE

    const spacingTokens = readJsonFiles([densityFilePath])

    const path = `spacing/inset/${size}/inline`

    const collectionName =
      density === 'spacious'
        ? '💎 Density.Spacious.json'
        : '💎 Density.Comfortable.json'

    const value = spacingTokens[collectionName]?.[path]?.['$value']

    return `${token.value} ${value}`
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

const cssTransforms = [
  'name/cti/kebab',
  'eds/css/pxToRem',
  'eds/css/pxFormatted',
  'eds/font/quote',
]
const outputDirectory = './build'
const cssBuildPath = `${outputDirectory}/css`
const jsBuildPath = `${outputDirectory}/js`
const jsonBuildPath = `${outputDirectory}/json`

const _extend = ({
  source,
  fileName,
  buildPath,
  prefix,
  selector,
  filter,
  include,
  outputReferences,
}: {
  include?: string[]
  source: string[]
  fileName: string
  buildPath: string
  prefix: string
  selector?: string
  filter?: (token: TransformedToken) => boolean
  outputReferences?: boolean
}): StyleDictionary.Core => {
  const cssFileNameOutputVersion = outputReferences ? 'verbose' : 'trimmed'
  const cssDestinationFileName = `${fileName}-${cssFileNameOutputVersion}.css`

  return StyleDictionary.extend({
    include,
    source,
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: `${cssBuildPath}/${buildPath}/`,
        transforms: cssTransforms,
        files: [
          {
            filter,
            destination: cssDestinationFileName,
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
        buildPath: `${jsBuildPath}/${buildPath}/`,
        files: [
          {
            filter,
            destination: `${fileName}.js`,
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
        buildPath: `${jsonBuildPath}/${buildPath}/`,
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
    'cap-height',
    'cap-rounded',
    'container',
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

const COLOR_PRIMITIVE_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_PRIMITIVES}/🎨 Color.Color.json`
const COLOR_SIMPLE_SEMANTIC_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_COLORS}/🗣️ Simple semantic.Mode 1.json`
const SPACING_PRIMITIVE_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_SPACING}/👾 Primitives.Value.json`
const COLOR_LIGHT_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_COLORS}/${lightColorSchemeCollectionFile}`
const COLOR_DARK_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_COLORS}/${darkColorSchemeCollectionFile}`

const DENSITY_FIGMA_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_SPACING}/⛔️ Figma.Value.json`
const DENSITY_SPACIOUS_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_TYPOGRAPHY_MODES}/💎 Density.Spacious.json`
const DENSITY_COMFORTABLE_SOURCE = `./${TOKENS_DIR}/${FILE_KEY_TYPOGRAPHY_MODES}/💎 Density.Comfortable.json`

export function run({ outputReferences } = { outputReferences: true }) {
  console.info('Running Style Dictionary build script')
  console.info('outputReferences:', outputReferences)

  const prefix = 'eds'
  const colorBuildPath = 'color/'
  const spacingBuildPath = 'spacing/'

  const primitives = _extend({
    source: [COLOR_PRIMITIVE_SOURCE],
    buildPath: colorBuildPath,
    prefix,
    fileName: 'primitives',
    outputReferences: false, // The primitives should not reference other tokens. This can always be false.
  })

  const simpleSemantic = _extend({
    source: [COLOR_PRIMITIVE_SOURCE, COLOR_SIMPLE_SEMANTIC_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Simple semantic']),
    buildPath: colorBuildPath,
    prefix,
    fileName: 'simple-semantic',
    outputReferences,
  })

  const lightMode = _extend({
    include: [COLOR_PRIMITIVE_SOURCE, COLOR_SIMPLE_SEMANTIC_SOURCE],
    source: [COLOR_LIGHT_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Light']),
    buildPath: colorBuildPath,
    prefix,
    fileName: 'light',
    selector: ':root, [data-color-scheme="light"]',
    outputReferences,
  })

  const darkMode = _extend({
    include: [COLOR_PRIMITIVE_SOURCE, COLOR_SIMPLE_SEMANTIC_SOURCE],
    source: [COLOR_DARK_SOURCE],
    filter: (token) => includeTokenFilter(token, ['Dark']),
    buildPath: colorBuildPath,
    prefix,
    fileName: 'dark',
    selector: '[data-color-scheme="dark"]',
    outputReferences,
  })

  const spacingPrimitives = _extend({
    source: [SPACING_PRIMITIVE_SOURCE],
    buildPath: spacingBuildPath,
    prefix,
    fileName: 'primitives',
    filter: (token) => includeTokenFilter(token),
  })

  const densityComfortable = _extend({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_COMFORTABLE_SOURCE],
    buildPath: spacingBuildPath,
    prefix,
    fileName: 'comfortable',
    selector: '[data-density="comfortable"]',
    filter: (token) => includeTokenFilter(token, ['Density']),
    outputReferences,
  })

  const densitySpacious = _extend({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_SPACIOUS_SOURCE],
    buildPath: spacingBuildPath,
    prefix,
    fileName: 'spacious',
    selector: ':root, [data-density="spacious"]',
    filter: (token) => includeTokenFilter(token, ['Density']),
    outputReferences,
  })

  const densityAllTrimmed = StyleDictionary.extend({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_SPACIOUS_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: `${cssBuildPath}/spacing/`,
        transforms: [
          'name/cti/kebab',
          'eds/css/pxToRem',
          'eds/css/pxFormatted',
          'eds/font/quote',
          'densitySpaceToggle',
        ],
        files: [
          {
            filter: (token) => includeTokenFilter(token, ['Density']),
            destination: 'spacing-trimmed.css',
            format: 'css/variables',
            options: {
              fileHeader,
              selector: ':root, [data-density]',
              outputReferences: false,
            },
          },
        ],
      },
    },
  })

  const densityAllVerbose = StyleDictionary.extend({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_SPACIOUS_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: `${cssBuildPath}/spacing/`,
        transforms: [
          'name/cti/kebab',
          'eds/css/pxToRem',
          'eds/css/pxFormatted',
          'eds/font/quote',
          'densitySpaceToggle',
        ],
        files: [
          {
            filter: (token) => includeTokenFilter(token, ['Density']),
            destination: 'spacing-verbose.css',
            format: 'css/variables',
            options: {
              fileHeader,
              selector: ':root, [data-density]',
              outputReferences: true,
            },
          },
        ],
      },
    },
  })

  const densitySpaciousTrimmed = StyleDictionary.extend({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_SPACIOUS_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: `${cssBuildPath}/${spacingBuildPath}`,
        transforms: cssTransforms,
        files: [
          {
            filter: (token) =>
              includeTokenFilter(token, ['Density', 'Spacious']),
            destination: 'spacious-trimmed.css',
            format: 'css/variables',
            options: {
              fileHeader,
              selector: ':root, [data-density="spacious"]',
              outputReferences: false,
            },
          },
        ],
      },
    },
  })

  const densityComfortableTrimmed = StyleDictionary.extend({
    include: [SPACING_PRIMITIVE_SOURCE, DENSITY_FIGMA_SOURCE],
    source: [DENSITY_COMFORTABLE_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: `${cssBuildPath}/${spacingBuildPath}`,
        transforms: cssTransforms,
        files: [
          {
            filter: (token) =>
              includeTokenFilter(token, ['Density', 'Comfortable']),
            destination: 'comfortable-trimmed.css',
            format: 'css/variables',
            options: {
              selector: '[data-density="comfortable"]',
              outputReferences: false,
              fileHeader,
            },
          },
        ],
      },
    },
  })

  const lightDarkColorsVerbose = StyleDictionary.extend({
    include: [COLOR_PRIMITIVE_SOURCE, COLOR_SIMPLE_SEMANTIC_SOURCE],
    source: [COLOR_LIGHT_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: `${cssBuildPath}/color/`,
        transforms: ['name/cti/kebab', 'color/css', 'lightDark'],
        files: [
          {
            filter: (token) => includeTokenFilter(token, ['Light']),
            destination: 'colors-verbose.css',
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

  const lightDarkColorsTrimmed = StyleDictionary.extend({
    include: [COLOR_PRIMITIVE_SOURCE, COLOR_SIMPLE_SEMANTIC_SOURCE],
    source: [COLOR_LIGHT_SOURCE],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: `${cssBuildPath}/color/`,
        transforms: ['name/cti/kebab', 'color/css', 'lightDark'],
        files: [
          {
            filter: (token) => includeTokenFilter(token, ['Light']),
            destination: 'colors-trimmed.css',
            format: 'css/variables',
            options: {
              fileHeader,
              outputReferences: false, // The trimmed colors should not reference other tokens
            },
          },
        ],
      },
    },
  })

  primitives.buildAllPlatforms()
  simpleSemantic.buildAllPlatforms()
  lightMode.buildAllPlatforms()
  darkMode.buildAllPlatforms()
  lightDarkColorsVerbose.buildAllPlatforms()
  lightDarkColorsTrimmed.buildAllPlatforms()
  spacingPrimitives.buildAllPlatforms()
  densityComfortable.buildAllPlatforms()
  densitySpacious.buildAllPlatforms()
  densitySpaciousTrimmed.buildAllPlatforms()
  densityComfortableTrimmed.buildAllPlatforms()
  densityAllTrimmed.buildAllPlatforms()
  densityAllVerbose.buildAllPlatforms()
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
