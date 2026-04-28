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

  // Replace each `--name: light-dark(L, D);` with the light value alone in
  // its existing :root block. The dark and explicit-light scopes are
  // appended as new rules below.
  const transformed = original.replace(lightDarkPattern, '--$1: $2;')

  const formatDecls = (
    pickValue: (t: DualToken) => string,
    indent: string,
  ): string =>
    dualTokens.map((t) => `${indent}--${t.name}: ${pickValue(t)};`).join('\n')

  const lightDecls = formatDecls((t) => t.light, '  ')
  const darkDecls = formatDecls((t) => t.dark, '  ')
  const darkDeclsIndented = formatDecls((t) => t.dark, '    ')

  // Three appended blocks:
  //
  //   [data-color-scheme="light"] — re-applies light values when an explicit
  //   light scope is nested inside a dark scope (e.g. light callout in dark
  //   sidebar). Without this rule, the inner element would inherit dark.
  //
  //   [data-color-scheme="dark"] — explicit opt-in to dark mode.
  //
  //   @media (prefers-color-scheme: dark) :root:not([data-color-scheme="light"])
  //   — preserves the system-dark-mode behaviour that light-dark() previously
  //   provided implicitly. The :not() guard lets a consumer force light mode
  //   by setting [data-color-scheme="light"] on a wrapper.
  const explicitScopes = `
[data-color-scheme="light"] {
${lightDecls}
}

[data-color-scheme="dark"] {
${darkDecls}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-color-scheme="light"]) {
${darkDeclsIndented}
  }
}
`

  await writeFile(variablesCssPath, transformed + explicitScopes, 'utf8')
  console.log(
    `build-dark-scope: replaced ${dualTokens.length} light-dark() values with explicit [data-color-scheme] scope rules`,
  )
}

export async function run() {
  await buildDarkScope()
}

await run()
