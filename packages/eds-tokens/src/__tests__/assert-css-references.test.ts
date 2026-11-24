import { spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

/**
 * Guards `scripts/assert-css-references.mjs`. The TypeScript modules used
 * to be built by a script that resolved every `var()` chain in the CSS
 * export, so a reference to a name nobody declares, or a loop, stopped the
 * release. That script is gone, and this check keeps the guarantee.
 */

const scriptPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../scripts/assert-css-references.mjs',
)

let dir: string

const write = (file: string, css: string) => {
  fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
  fs.writeFileSync(path.join(dir, file), css)
}

const run = () =>
  spawnSync(process.execPath, [scriptPath, '--css', dir], { encoding: 'utf8' })

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eds-css-refs-'))
})

afterEach(() => {
  fs.rmSync(dir, { recursive: true, force: true })
})

describe('assert-css-references', () => {
  it('passes when every reference resolves, across files', () => {
    write(
      'primitives/default.css',
      ':root {\n  --eds-primitives-spacing-6: 4px;\n}',
    )
    write(
      'density/compact.css',
      '[data-density="compact"] {\n  --eds-density-spacing-md: var(--eds-primitives-spacing-6);\n  --eds-density-gap: calc(var(--eds-density-spacing-md) * 2);\n}',
    )
    const result = run()
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('3 custom properties')
  })

  it('fails on a reference to a name no file declares', () => {
    write('semantic/default.css', ':root {\n  --eds-a: var(--eds-missing);\n}')
    const result = run()
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('--eds-a references --eds-missing')
    expect(result.stderr).toContain('never declared')
  })

  it('accepts a missing name when var() has a fallback', () => {
    write(
      'semantic/default.css',
      ':root {\n  --eds-a: var(--eds-missing, 1px);\n}',
    )
    expect(run().status).toBe(0)
  })

  it('fails on a loop inside one file', () => {
    write(
      'semantic/default.css',
      ':root {\n  --eds-a: var(--eds-b);\n  --eds-b: var(--eds-a);\n}',
    )
    const result = run()
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('circular reference')
    expect(result.stderr).toContain('--eds-a -> --eds-b -> --eds-a')
  })

  it('fails on a loop that runs through several files', () => {
    write('a.css', ':root {\n  --eds-a: var(--eds-b);\n}')
    write('b.css', ':root {\n  --eds-b: var(--eds-c);\n}')
    write('c.css', ':root {\n  --eds-c: var(--eds-a);\n}')
    const result = run()
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('circular reference')
  })

  it('fails on a name that references itself', () => {
    write('a.css', ':root {\n  --eds-a: var(--eds-a);\n}')
    const result = run()
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('--eds-a -> --eds-a')
  })

  it('skips the committed variables.css bundle', () => {
    write('a.css', ':root {\n  --eds-a: 1px;\n}')
    write('variables.css', ':root {\n  --eds-b: var(--eds-never-declared);\n}')
    expect(run().status).toBe(0)
  })

  it('fails when there are no CSS files', () => {
    const result = run()
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('no CSS files found')
  })
})
