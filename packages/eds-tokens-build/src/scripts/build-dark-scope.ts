import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

type DualToken = { name: string; light: string; dark: string }

// Matches `--name: light-dark(LIGHT, DARK);` declarations.
// Argument matcher allows simple values (hex, keywords) and one level of
// nested parens — sufficient for `var(--ref)` references emitted by the
// light-dark transform. Does not support nested var() fallbacks.
const lightDarkPattern =
  /--([a-zA-Z0-9_-]+)\s*:\s*light-dark\(\s*((?:[^,()]|\([^()]*\))+)\s*,\s*((?:[^,()]|\([^()]*\))+)\s*\)\s*;/g

// Matches `:root` as a selector (start of file or after whitespace/punctuation),
// followed by `,` or `{` with optional whitespace. Lookahead so the match itself
// is just `:root` plus its leading boundary character — the closing `,`/`{` is
// located separately so the regex covers both `:root {` and compound selectors
// like `:root, [data-color-appearance="neutral"] {`.
const rootSelectorPattern = /(^|[\s,;{}])(:root)(?=\s*[,{])/g

type RootBlock = {
  // Index of the `:` of `:root` in the source.
  selectorStart: number
  // Index immediately after the opening `{`.
  openBraceEnd: number
  // Index of the matching `}`.
  closeBracePos: number
}

const findRootBlocks = (css: string): RootBlock[] => {
  const blocks: RootBlock[] = []
  rootSelectorPattern.lastIndex = 0
  const seenSelectorStarts = new Set<number>()
  let match: RegExpExecArray | null
  while ((match = rootSelectorPattern.exec(css)) !== null) {
    const selectorStart = match.index + match[1].length

    // Compound selectors may contain `:root` at multiple positions but they
    // all belong to the same rule; record only the first occurrence per rule.
    if (seenSelectorStarts.has(selectorStart)) continue

    // Locate the opening `{` for this rule (may be after additional selectors).
    const braceIdx = css.indexOf('{', selectorStart)
    if (braceIdx === -1) continue

    // Sanity: no `}` between :root and `{` (would mean :root is in a different
    // rule's body, which shouldn't happen for legitimate CSS).
    if (css.slice(selectorStart, braceIdx).includes('}')) continue

    const openBraceEnd = braceIdx + 1
    seenSelectorStarts.add(selectorStart)

    // Find matching `}` via brace-depth tracking.
    let depth = 1
    let i = openBraceEnd
    while (i < css.length && depth > 0) {
      const c = css[i]
      if (c === '{') depth++
      else if (c === '}') depth--
      i++
    }

    if (depth === 0) {
      blocks.push({ selectorStart, openBraceEnd, closeBracePos: i - 1 })
    }
  }
  return blocks
}

async function buildDarkScope() {
  const variablesCssPath = path.resolve('build', 'css', 'variables.css')

  if (!existsSync(variablesCssPath)) {
    console.error(
      `variables.css not found at ${variablesCssPath} — run _build:css:variables first`,
    )
    process.exit(1)
  }

  const original = await readFile(variablesCssPath, 'utf8')

  const dualTokens: DualToken[] = []
  for (const match of original.matchAll(lightDarkPattern)) {
    const [, name, light, dark] = match
    dualTokens.push({ name, light: light.trim(), dark: dark.trim() })
  }

  if (dualTokens.length === 0) {
    console.warn(
      'build-dark-scope: no light-dark() declarations found in variables.css',
    )
    return
  }

  // Classify each `:root`-bearing block by its contents:
  //
  // - Primitive: contains `light-dark(` — has literal light/dark values that
  //   differ between modes. Widen to also match `[data-color-scheme="light"]`
  //   so a light-scoped element re-declares the light values. The dark scope
  //   is handled by the appended `[data-color-scheme="dark"]` block below.
  //
  // - Semantic: contains `var(--eds-color-` references but no `light-dark()`.
  //   The value is a `var()` expression that re-resolves at the matching
  //   element using whichever primitive value is in scope. Widen to match
  //   BOTH `[data-color-scheme="light"]` and `[data-color-scheme="dark"]` so
  //   that wrappers in either scope re-declare the semantic tokens and the
  //   var() references pick up the local primitive values from the wrapper
  //   (light primitives for light wrapper, dark primitives for dark wrapper).
  //
  // Without this, `[data-color-scheme]` wrappers inherit semantic tokens
  // resolved at `:root` — which carry the OS-preference values from the
  // media query, not the wrapper's intended scope. See lightningcss#821.
  const allBlocks = findRootBlocks(original)
  const primitiveBlocks: RootBlock[] = []
  const semanticBlocks: RootBlock[] = []
  for (const blk of allBlocks) {
    const body = original.slice(blk.openBraceEnd, blk.closeBracePos)
    if (body.includes('light-dark(')) {
      primitiveBlocks.push(blk)
    } else if (body.includes('var(--eds-color-')) {
      semanticBlocks.push(blk)
    }
  }

  // Apply selector widening from back to front so earlier offsets stay valid.
  // Combine both lists and sort by descending selectorStart.
  const widenings: Array<{ blk: RootBlock; insertion: string }> = [
    ...primitiveBlocks.map((blk) => ({
      blk,
      insertion: ':root, [data-color-scheme="light"]',
    })),
    ...semanticBlocks.map((blk) => ({
      blk,
      insertion:
        ':root, [data-color-scheme="light"], [data-color-scheme="dark"]',
    })),
  ].sort((a, b) => b.blk.selectorStart - a.blk.selectorStart)

  let modified = original
  for (const { blk, insertion } of widenings) {
    modified =
      modified.slice(0, blk.selectorStart) +
      insertion +
      modified.slice(blk.selectorStart + ':root'.length)
  }

  // Replace each `light-dark(L, D)` with the light value, in place.
  modified = modified.replace(lightDarkPattern, '--$1: $2;')

  const formatDecls = (
    pickValue: (t: DualToken) => string,
    indent: string,
  ): string =>
    dualTokens.map((t) => `${indent}--${t.name}: ${pickValue(t)};`).join('\n')

  const darkDecls = formatDecls((t) => t.dark, '  ')
  const darkDeclsIndented = formatDecls((t) => t.dark, '    ')

  // Two appended blocks — light scope is handled by widening :root above:
  //
  //   [data-color-scheme="dark"] — explicit opt-in to dark mode.
  //
  //   @media (prefers-color-scheme: dark) :root:not([data-color-scheme="light"])
  //   — preserves the system-dark-mode behaviour that light-dark() previously
  //   provided implicitly. The :not() guard lets a consumer force light mode by
  //   setting [data-color-scheme="light"] on a wrapper. Values must duplicate
  //   the explicit-dark block: an attribute selector and a media-query selector
  //   cannot be combined into one rule.
  const explicitScopes = `
[data-color-scheme="dark"] {
${darkDecls}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-color-scheme="light"]) {
${darkDeclsIndented}
  }
}
`

  await writeFile(variablesCssPath, modified + explicitScopes, 'utf8')
  console.log(
    `build-dark-scope: widened ${primitiveBlocks.length} primitive :root block(s) to match [data-color-scheme="light"], widened ${semanticBlocks.length} semantic :root block(s) to match both [data-color-scheme="light"] and [data-color-scheme="dark"], replaced ${dualTokens.length} light-dark() values, appended explicit dark scope + prefers-color-scheme fallback`,
  )
}

export async function run() {
  await buildDarkScope()
}

await run()
