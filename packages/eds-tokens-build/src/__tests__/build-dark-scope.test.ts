import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import {
  setupTestWorkspace,
  cleanupTestWorkspace,
  runScript,
} from './test-utils'

const writeVariables = (workspace: string, content: string) => {
  const cssDir = path.join(workspace, 'build/css')
  mkdirSync(cssDir, { recursive: true })
  writeFileSync(path.join(cssDir, 'variables.css'), content, 'utf8')
}

const readVariables = (workspace: string): string =>
  readFileSync(path.join(workspace, 'build/css/variables.css'), 'utf8')

describe('build-dark-scope', () => {
  let testWorkspace: string

  beforeEach(() => {
    testWorkspace = setupTestWorkspace()
  })

  afterEach(() => {
    cleanupTestWorkspace(testWorkspace)
  })

  it('widens the :root selector and replaces light-dark() with the light value', () => {
    writeVariables(
      testWorkspace,
      `:root {
  --eds-color-bg-floating: light-dark(#fff, #202223);
  --eds-color-bg-input: light-dark(#f5f5f5, #0b0b0b);
  --eds-color-static-light-only: #abcdef;
}
`,
    )

    runScript('build-dark-scope.js', testWorkspace)

    const out = readVariables(testWorkspace)

    // No light-dark() literals remain anywhere
    expect(out).not.toContain('light-dark(')

    // The :root selector is widened to also match [data-color-scheme="light"],
    // so explicit-light-scope nesting (e.g. light-inside-dark) re-applies the
    // light values rather than inheriting dark.
    expect(out).toMatch(/:root,\s*\[data-color-scheme="light"\]\s*\{/)

    // Light values stay in the original (now widened) block
    expect(out).toContain('--eds-color-bg-floating: #fff;')
    expect(out).toContain('--eds-color-bg-input: #f5f5f5;')
    // Static (non-dual) tokens in the same block are untouched
    expect(out).toContain('--eds-color-static-light-only: #abcdef;')

    // Two appended blocks: explicit dark + prefers-color-scheme media
    expect(out).toContain('[data-color-scheme="dark"] {')
    expect(out).toMatch(/@media\s*\(\s*prefers-color-scheme:\s*dark\s*\)/)
    expect(out).toContain(':root:not([data-color-scheme="light"])')

    // No standalone [data-color-scheme="light"] block — light values are
    // covered by the widened :root selector instead, avoiding duplication.
    expect(out).not.toMatch(/^\s*\[data-color-scheme="light"\]\s*\{/m)

    // Dark block contains the dark values; static-only token is NOT there
    const darkBlockMatch = out.match(
      /\[data-color-scheme="dark"\]\s*\{([\s\S]*?)\}/,
    )
    expect(darkBlockMatch).not.toBeNull()
    expect(darkBlockMatch![1]).toContain('--eds-color-bg-floating: #202223;')
    expect(darkBlockMatch![1]).toContain('--eds-color-bg-input: #0b0b0b;')
    expect(darkBlockMatch![1]).not.toContain('static-light-only')
  })

  it('handles var(--ref) references inside light-dark() arguments', () => {
    writeVariables(
      testWorkspace,
      `:root {
  --eds-color-bg-floating: light-dark(var(--eds-color-neutral-1), var(--eds-color-neutral-15));
}
`,
    )

    runScript('build-dark-scope.js', testWorkspace)

    const out = readVariables(testWorkspace)

    expect(out).not.toContain('light-dark(')
    // Light reference preserved as-is in the widened :root block
    expect(out).toContain(
      '--eds-color-bg-floating: var(--eds-color-neutral-1);',
    )
    // Dark reference placed in dark scope
    const darkBlockMatch = out.match(
      /\[data-color-scheme="dark"\]\s*\{([\s\S]*?)\}/,
    )
    expect(darkBlockMatch![1]).toContain(
      '--eds-color-bg-floating: var(--eds-color-neutral-15);',
    )
  })

  it('leaves the file unchanged when no light-dark() declarations exist', () => {
    const input = `:root {
  --eds-color-static-1: #fff;
  --eds-color-static-2: #000;
}
`
    writeVariables(testWorkspace, input)

    runScript('build-dark-scope.js', testWorkspace)

    expect(readVariables(testWorkspace)).toBe(input)
  })

  it('only widens :root blocks that contain light-dark() declarations', () => {
    writeVariables(
      testWorkspace,
      `:root {
  --eds-color-a: light-dark(#aaa, #111);
}

:root {
  --eds-typography-font-size: 16px;
}
`,
    )

    runScript('build-dark-scope.js', testWorkspace)

    const out = readVariables(testWorkspace)

    // First :root (had light-dark) is widened
    expect(out).toMatch(
      /:root,\s*\[data-color-scheme="light"\]\s*\{[^}]*--eds-color-a/,
    )
    // Second :root (no dual tokens) is left as plain :root
    expect(out).toMatch(/:root\s*\{[^}]*--eds-typography-font-size/)
    expect(out).not.toMatch(
      /:root,\s*\[data-color-scheme="light"\]\s*\{[^}]*--eds-typography/,
    )
  })

  it('emits the same set of dark values in both the explicit-dark block and the prefers-color-scheme media block', () => {
    writeVariables(
      testWorkspace,
      `:root {
  --eds-color-a: light-dark(#aaa, #111);
  --eds-color-b: light-dark(#bbb, #222);
}
`,
    )

    runScript('build-dark-scope.js', testWorkspace)

    const out = readVariables(testWorkspace)

    const explicitDark = out.match(
      /\[data-color-scheme="dark"\]\s*\{([\s\S]*?)\}/,
    )?.[1]
    const mediaDark = out.match(
      /@media[^{]*\{\s*:root:not\(\[data-color-scheme="light"\]\)\s*\{([\s\S]*?)\}/,
    )?.[1]

    expect(explicitDark).toBeDefined()
    expect(mediaDark).toBeDefined()

    for (const decl of ['--eds-color-a: #111;', '--eds-color-b: #222;']) {
      expect(explicitDark).toContain(decl)
      expect(mediaDark).toContain(decl)
    }
  })
})
