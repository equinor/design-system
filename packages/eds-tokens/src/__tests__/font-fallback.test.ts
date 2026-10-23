import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

/**
 * Regression test for #5701.
 *
 * The Tokens Studio export names a single typeface per family token,
 * `Inter` for UI and `Equinor` for headers. A font stack with no generic
 * family behind it leaves an app that does not load the font on the browser
 * default, which is a serif in Chrome, Firefox, Safari and Edge: every label
 * and body style, most of an interface, renders in Times. The bundler appends
 * `sans-serif` while it concatenates (generate-css-bundle.mjs).
 *
 * It is appended there, in memory, rather than in the export files, because
 * generate-ts-tokens.mjs reads its values from those same files and React
 * Native's `fontFamily` takes one family name. That split is the point of the
 * fix, so it is asserted from both ends here: the bundle carries the fallback,
 * the export and the TS modules do not.
 *
 * The names are read from the bundle rather than listed, so a family added
 * upstream is covered without touching this file; the two known names are
 * asserted separately so a rename cannot leave the sweep passing over nothing.
 */

const dir = path.dirname(fileURLToPath(import.meta.url))
const read = (file: string) =>
  fs
    .readFileSync(path.resolve(dir, file), 'utf-8')
    .replace(/\/\*[\s\S]*?\*\//g, '')

const bundle = read('../tokens/css/variables.css')
const exportedCss = read('../tokens/css/font/default.css')
const exportedTs = read('../tokens/ts/font/default.ts')

const GENERIC_FAMILIES = [
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'math',
  'fangsong',
  'emoji',
]

/** Every `--name: value;` declaration in a stylesheet, last one winning. */
function declarations(css: string) {
  return new Map(
    [...css.matchAll(/(--[\w-]+)\s*:\s*([^;]*);/g)].map((match) => [
      match[1],
      match[2].trim(),
    ]),
  )
}

/** The last comma-separated part of a value, at nesting depth 0. */
function lastFamily(value: string) {
  let depth = 0
  let start = 0
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]
    if (character === '(') depth += 1
    else if (character === ')') depth -= 1
    else if (character === ',' && depth === 0) start = index + 1
  }
  return value
    .slice(start)
    .trim()
    .replace(/^["']|["']$/g, '')
}

/** Substitute `var()` references until the value is literal. */
function resolve(
  name: string,
  declared: Map<string, string>,
  seen = new Set<string>(),
): string {
  const value = declared.get(name)
  expect(value, `${name} is not declared in the bundle`).toBeDefined()
  expect(seen.has(name), `circular var() chain at ${name}`).toBe(false)
  return (value as string).replace(
    /var\(\s*(--[\w-]+)\s*\)/g,
    (_, reference: string) =>
      resolve(reference, declared, new Set([...seen, name])),
  )
}

const bundled = declarations(bundle)
const familyNames = [...bundled.keys()].filter((name) =>
  name.startsWith('--eds-family-'),
)

describe('font family fallback in the committed bundle', () => {
  it('declares the two family tokens the pipeline requires', () => {
    expect(familyNames).toEqual(
      expect.arrayContaining(['--eds-family-header', '--eds-family-ui']),
    )
  })

  it.each(familyNames)('%s ends in a generic family', (name) => {
    expect(GENERIC_FAMILIES).toContain(lastFamily(bundled.get(name) as string))
  })

  it.each(['--eds-font-family-header', '--eds-font-family-ui'])(
    '%s resolves to a stack ending in sans-serif',
    (name) => {
      expect(resolve(name, bundled)).toMatch(/,\s*sans-serif$/)
    },
  )

  it('appends the fallback once, not per layer of the chain', () => {
    for (const name of ['--eds-font-family-header', '--eds-font-family-ui']) {
      const occurrences = resolve(name, bundled).match(/sans-serif/g) ?? []
      expect(occurrences).toHaveLength(1)
    }
  })
})

describe('the exports the fallback must stay out of', () => {
  it('leaves the CSS export file with a bare family name', () => {
    for (const [name, value] of declarations(exportedCss)) {
      if (!name.startsWith('--eds-family-')) continue
      expect(value).not.toMatch(/sans-serif/)
    }
  })

  it('leaves the TypeScript export single-family, for React Native', () => {
    expect(exportedTs).toMatch(/header: 'Equinor',/)
    expect(exportedTs).toMatch(/ui: 'Inter',/)
    expect(exportedTs).not.toMatch(/sans-serif/)
  })
})
