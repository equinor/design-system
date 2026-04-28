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

  it('replaces light-dark() with light value and appends explicit scope blocks', () => {
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

    // Original :root retains light values, no light-dark() literals anywhere
    expect(out).not.toContain('light-dark(')
    expect(out).toContain('--eds-color-bg-floating: #fff;')
    expect(out).toContain('--eds-color-bg-input: #f5f5f5;')
    // Static (non-dual) tokens are untouched
    expect(out).toContain('--eds-color-static-light-only: #abcdef;')

    // Three appended scope blocks
    expect(out).toContain('[data-color-scheme="light"] {')
    expect(out).toContain('[data-color-scheme="dark"] {')
    expect(out).toMatch(/@media\s*\(\s*prefers-color-scheme:\s*dark\s*\)/)
    expect(out).toContain(':root:not([data-color-scheme="light"])')

    // Dark block contains the dark values
    const darkBlockMatch = out.match(
      /\[data-color-scheme="dark"\]\s*\{([\s\S]*?)\}/,
    )
    expect(darkBlockMatch).not.toBeNull()
    expect(darkBlockMatch![1]).toContain('--eds-color-bg-floating: #202223;')
    expect(darkBlockMatch![1]).toContain('--eds-color-bg-input: #0b0b0b;')
    // Static-only token is NOT in the dark block
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
    // Light value preserved as-is in :root
    expect(out).toContain(
      '--eds-color-bg-floating: var(--eds-color-neutral-1);',
    )
    // Dark value placed in dark scope
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

    // Both blocks declare the same tokens with the same dark values
    for (const decl of ['--eds-color-a: #111;', '--eds-color-b: #222;']) {
      expect(explicitDark).toContain(decl)
      expect(mediaDark).toContain(decl)
    }
  })
})
