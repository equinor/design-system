import { StyleDictionary } from 'style-dictionary-utils'
import type { TransformedToken } from 'style-dictionary/types'
import path from 'path'
import { typescriptNestedFormat } from '../format/typescriptNested'

const outputDirectory = path.resolve(process.cwd(), 'build')
export const cssBuildPath = path.join(outputDirectory, 'css')
export const jsBuildPath = path.join(outputDirectory, 'js')
export const jsonBuildPath = path.join(outputDirectory, 'json')
export const tsBuildPath = path.join(outputDirectory, 'ts')

export function toFixedWithoutTrailingZeroes(
  value: number,
  fractionDigits = 3,
) {
  const valueWithTwoDigitsAfterDecimal = value.toFixed(fractionDigits)
  const valueWithoutTrailingZeroes = parseFloat(
    `${valueWithTwoDigitsAfterDecimal}`,
  )
  return valueWithoutTrailingZeroes
}

export function transformNumberToRem(value: number): string {
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

// manually convert reference into custom property
export const resolveReference = (value: string, prefix: string): string => {
  if (!value) return ''

  const valueFormatted = value
    .toLowerCase()
    .replace('{', '')
    .replace('}', '')
    .replaceAll(' ', '-')
    .replaceAll('.', '-')

  return `var(--${prefix}-${valueFormatted})`
}

export const _extend = ({
  source,
  fileName,
  buildPath,
  prefix,
  selector,
  filter,
  include,
  outputReferences,
  transforms,
  rootName,
}: {
  include?: string[]
  source: string[]
  fileName: string
  buildPath: string
  prefix?: string
  selector?: string
  filter?: (token: TransformedToken) => boolean
  outputReferences?: boolean
  transforms?: string[]
  rootName?: string
}) => {
  const cssFileNameOutputVersion = outputReferences ? 'verbose' : 'trimmed'
  const cssDestinationFileName = `${fileName}-${cssFileNameOutputVersion}.css`

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return new StyleDictionary({
    include,
    source,
    log: {
      warnings: 'warn',
      verbosity: 'verbose',
    },
    hooks: {
      formats: {
        'typescript/nested': typescriptNestedFormat,
      },
    },
    platforms: {
      css: {
        transformGroup: 'css',
        prefix,
        buildPath: `${cssBuildPath}/${buildPath}`,
        transforms,
        files: [
          {
            filter,
            destination: cssDestinationFileName,
            format: 'css/variables',
            options: {
              selector,
              outputReferences,
            },
          },
        ],
      },
      ts: {
        transforms: ['name/constant'],
        buildPath: `${jsBuildPath}/${buildPath}`,
        files: [
          {
            filter,
            destination: `${fileName}.js`,
            format: 'javascript/es6',
          },
          {
            filter,
            format: 'typescript/es6-declarations',
            destination: `${fileName}.d.ts`,
          },
        ],
      },
      tsNested: {
        buildPath: `${tsBuildPath}/${buildPath}`,
        files: [
          {
            filter,
            destination: `${fileName}.ts`,
            format: 'typescript/nested',
            options: {
              rootName: rootName ?? 'tokens',
            },
          },
        ],
      },
      json: {
        buildPath: `${jsonBuildPath}/${buildPath}`,
        transforms: ['name/kebab'],
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
