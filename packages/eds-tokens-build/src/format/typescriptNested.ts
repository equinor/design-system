import type {
  TransformedToken,
  FormatFnArguments,
} from 'style-dictionary/types'

const numberWords: Record<string, string> = {
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
}

/**
 * Convert a path segment to camelCase.
 * Handles space-separated and hyphenated words like "Fill Muted" → "fillMuted",
 * "font-size" → "fontSize", and single words like "Bg" → "bg".
 * Converts numeric-prefixed size keys like "2XL" → "twoXl", "3XS" → "threeXs".
 */
export function toCamelCase(str: string): string {
  // Convert numeric prefix followed by letters (e.g. "2XL" → "two xl")
  const converted = str.replace(/^(\d+)([a-zA-Z]+)/, (_, digits, letters) => {
    const word = numberWords[digits]
    return word ? `${word} ${letters.toLowerCase()}` : `${digits}${letters}`
  })

  const words = converted.split(/[\s-]+/)
  return words
    .map((word, i) =>
      i === 0
        ? word.charAt(0).toLowerCase() + word.slice(1)
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join('')
}

/**
 * Check if a key needs to be quoted in an object literal
 * (e.g. numeric keys like "1", "2")
 */
function needsQuotes(key: string): boolean {
  return /^\d/.test(key) || !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
}

/**
 * Format an object key, quoting if necessary
 */
function formatKey(key: string): string {
  return needsQuotes(key) ? `'${key}'` : key
}

type NestedObject = { [key: string]: NestedObject | string }

/**
 * Build a nested object from Style Dictionary tokens using their path arrays.
 * Each path segment is converted to camelCase.
 */
export function buildNestedObject(tokens: TransformedToken[]): NestedObject {
  const root: NestedObject = {}

  for (const token of tokens) {
    const segments = token.path.map(toCamelCase)
    let current = root

    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i]
      if (!(segment in current) || typeof current[segment] === 'string') {
        current[segment] = {}
      }
      current = current[segment]
    }

    const lastSegment = segments[segments.length - 1]
    current[lastSegment] = `${token.$value ?? token.value}`
  }

  return root
}

/**
 * Serialize a nested object to a TypeScript-compatible string with proper indentation.
 */
function serializeObject(obj: NestedObject, indent = 2): string {
  const entries = Object.entries(obj)
  if (entries.length === 0) return '{}'

  const pad = ' '.repeat(indent)
  const lines: string[] = ['{']

  for (const [key, value] of entries) {
    const formattedKey = formatKey(key)
    if (typeof value === 'string') {
      const isNumeric = value !== '' && isFinite(Number(value))
      const formattedValue = isNumeric ? value : `'${value}'`
      lines.push(`${pad}${formattedKey}: ${formattedValue},`)
    } else {
      lines.push(
        `${pad}${formattedKey}: ${serializeObject(value, indent + 2)},`,
      )
    }
  }

  const closePad = ' '.repeat(indent - 2)
  lines.push(`${closePad}}`)

  return lines.join('\n')
}

/**
 * Custom Style Dictionary format that outputs a nested TypeScript object
 * with camelCase keys mirroring the CSS variable hierarchy.
 *
 * Options:
 * - rootName: the export name (e.g. "color"). Defaults to "tokens".
 */
export function typescriptNestedFormat({
  dictionary,
  options,
}: FormatFnArguments): string {
  const rootName = (options?.rootName as string) ?? 'tokens'
  const nested = buildNestedObject(dictionary.allTokens)

  const header = `/**\n * Do not edit directly, this file was auto-generated.\n */\n`

  return `${header}\nexport const ${rootName} = ${serializeObject(nested)} as const\n`
}

Object.defineProperty(typescriptNestedFormat, 'name', {
  value: 'typescript/nested',
})
