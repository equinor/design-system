import { existsSync, readFileSync } from 'node:fs'
import { fail } from './errors.js'
import { exportPath, findPackage } from './resolve.js'

const PACKAGE = '@equinor/eds-tokens'
// Where the beta CSS bundle is exported, in order. During the beta it sits
// under the temporary ./next/css/* export; the exit plan of ADR-0009 moves it
// onto ./css/variables.css, where 2.x has its legacy bundle (ADR-0010). A
// file only counts if it sets semantic tokens, so the 2.x bundle is skipped.
const CSS_EXPORTS = ['./next/css/variables.css', './css/variables.css']
const INSTALL = `npm install ${PACKAGE}@beta`

export const SCHEMES = ['light', 'dark'] as const
export const DENSITIES = ['compact', 'comfortable', 'relaxed'] as const
export type Scheme = (typeof SCHEMES)[number]
export type Density = (typeof DENSITIES)[number]

type Declarations = Map<string, string>

/**
 * The custom properties of the token bundle, by the selector that sets them.
 * The semantic tokens, the ones components and products use, are the ones set
 * on `[data-density]`. The rest (primitives, palettes, the per-density and
 * per-scheme values) are internal and only resolve the semantic values.
 */
export type TokenSheet = {
  semantic: Declarations
  root: Declarations
  schemes: Map<string, Declarations>
  densities: Map<string, Declarations>
}

export type Token = {
  name: string
  /** The value as written, often a reference such as var(--eds-accent-9) */
  value: string
  /** The value with every var() resolved for the scheme and density */
  resolved: string
}

/** Reads the CSS from `cssPath`, or else from the installed eds-tokens */
export function loadTokens(cwd: string, cssPath?: string): TokenSheet {
  if (cssPath) {
    if (!existsSync(cssPath)) return fail(`No such file: ${cssPath}`)
    return parseTokens(readFileSync(cssPath, 'utf8'))
  }
  const pkg = findPackage(PACKAGE, cwd)
  if (!pkg) {
    return fail(`${PACKAGE} is not installed in ${cwd}. Run: ${INSTALL}`)
  }
  for (const specifier of CSS_EXPORTS) {
    const file = exportPath(pkg, specifier)
    if (!file || !existsSync(file)) continue
    const sheet = parseTokens(readFileSync(file, 'utf8'))
    if (sheet.semantic.size) return sheet
  }
  return fail(
    `${PACKAGE} ${pkg.version} has no beta tokens (looked for ${CSS_EXPORTS.join(' and ')}). Run: ${INSTALL}`,
  )
}

export function parseTokens(css: string): TokenSheet {
  const sheet: TokenSheet = {
    semantic: new Map(),
    root: new Map(),
    schemes: new Map(),
    densities: new Map(),
  }
  const scoped = (scopes: Map<string, Declarations>, key: string) => {
    if (!scopes.has(key)) scopes.set(key, new Map())
    return scopes.get(key)!
  }

  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '')
  // Innermost rule blocks only, so the @layer wrapper is skipped.
  for (const [, selectorList, body] of withoutComments.matchAll(
    /([^{}]+)\{([^{}]*)\}/g,
  )) {
    const declarations = [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);?/g)]
    for (const selector of selectorList.split(',').map((s) => s.trim())) {
      const density = selector.match(/^\[data-density="(\w+)"\]$/)?.[1]
      const scheme = selector.match(/^\[data-color-scheme="(\w+)"\]$/)?.[1]
      const target =
        selector === '[data-density]'
          ? sheet.semantic
          : density
            ? scoped(sheet.densities, density)
            : scheme
              ? scoped(sheet.schemes, scheme)
              : selector === ':root'
                ? sheet.root
                : null
      if (!target) continue
      for (const [, name, value] of declarations) target.set(name, value.trim())
    }
  }
  return sheet
}

/**
 * Tokens whose name contains every word of `query`, resolved for the scheme
 * and density. `all` includes the internal tokens.
 */
export function searchTokens(
  sheet: TokenSheet,
  query: string,
  { scheme, density, all }: { scheme: Scheme; density: Density; all: boolean },
): Token[] {
  const scopes = [
    sheet.semantic,
    sheet.schemes.get(scheme) ?? new Map<string, string>(),
    sheet.densities.get(density) ?? new Map<string, string>(),
    sheet.root,
  ]
  const lookup = (name: string) =>
    scopes.find((s) => s.has(name))?.get(name) ?? undefined

  const names = all
    ? new Set(scopes.flatMap((s) => [...s.keys()]))
    : new Set(sheet.semantic.keys())
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)

  return [...names]
    .filter((name) => words.every((w) => name.includes(w)))
    .sort()
    .map((name) => {
      const value = lookup(name) ?? ''
      return { name, value, resolved: resolve(value, lookup, new Set([name])) }
    })
}

// Words people and agents search with that are not part of any token name,
// mapped to the word the tokens use. An agent looking for a gap or a padding
// otherwise gets no match and falls back on guessing.
const SYNONYMS: Record<string, string> = {
  gap: 'spacing',
  padding: 'spacing',
  margin: 'spacing',
  space: 'spacing',
  radius: 'corner-radius',
  rounded: 'corner-radius',
  colour: 'background, text, border or icon',
  color: 'background, text, border or icon',
  bg: 'background',
  'font-size': 'typography',
  'line-height': 'typography',
  weight: 'font-weight',
  family: 'font-family',
}

export type TokenHints = {
  /** Words from the query that tokens name differently */
  renamed: { word: string; use: string }[]
  /** The first word of every semantic token name */
  groups: string[]
}

/** Help for a search with no match: better words, and the groups that exist */
export function tokenHints(sheet: TokenSheet, query: string): TokenHints {
  const renamed = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => SYNONYMS[word])
    .map((word) => ({ word, use: SYNONYMS[word] }))
  const groups = [
    ...new Set(
      [...sheet.semantic.keys()].map((name) => name.split('-')[3] ?? name),
    ),
  ].sort()
  return { renamed, groups }
}

// Replaces each var(--x) with the value of --x, recursively. A missing token
// keeps its fallback, or the var() itself if it has none.
function resolve(
  value: string,
  lookup: (name: string) => string | undefined,
  seen: Set<string>,
): string {
  return value.replace(
    /var\((--[\w-]+)\s*(?:,\s*([^()]*))?\)/g,
    (whole, name: string, fallback?: string) => {
      const next = lookup(name)
      if (next === undefined || seen.has(name)) return fallback ?? whole
      return resolve(next, lookup, new Set([...seen, name]))
    },
  )
}
