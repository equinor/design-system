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

// Matches an opening `:root {` selector that's not part of a selector list
// (i.e. `:root` immediately followed by whitespace and `{`, with a non-name
// character before it). The non-name character ensures we don't match
// substrings like `something:root`. We use this to find `:root` blocks whose
// selector should be widened to also match [data-color-scheme="light"].
const rootOpenerPattern = /(^|[\s,;{}])(:root)(\s*\{)/g

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
  rootOpenerPattern.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = rootOpenerPattern.exec(css)) !== null) {
    const selectorStart = match.index + match[1].length
    const openBraceEnd = match.index + match[0].length

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

  // Identify each `:root { … }` block whose body contains a `light-dark(`
  // declaration. Those blocks need their selector widened so that an explicit
  // `[data-color-scheme="light"]` element nested inside a dark scope re-applies
  // the light values instead of inheriting dark from its ancestor.
  const dualBearingBlocks = findRootBlocks(original).filter((b) =>
    original.slice(b.openBraceEnd, b.closeBracePos).includes('light-dark('),
  )

  // Apply selector widening from back to front so earlier offsets stay valid.
  let modified = original
  for (const blk of [...dualBearingBlocks].reverse()) {
    modified =
      modified.slice(0, blk.selectorStart) +
      ':root, [data-color-scheme="light"]' +
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
    `build-dark-scope: widened ${dualBearingBlocks.length} :root selector(s) to also match [data-color-scheme="light"], replaced ${dualTokens.length} light-dark() values, appended explicit dark scope + prefers-color-scheme fallback`,
  )
}

export async function run() {
  await buildDarkScope()
}

await run()
