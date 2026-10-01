import { execFileSync, spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect, afterAll } from 'vitest'

/**
 * Covers `scripts/assert-no-duplicate-names.mjs`, the release gate from
 * #5407.
 *
 * The bug it guards: the CSS name transform flattens both `.` and `-`
 * to `-`, so `border.focus` and `border-focus` land on the same custom
 * property. Where one aliased the other, the emitted declaration was
 * self-referential and dropped the beta focus ring on Button and Chip.
 * Tokens Studio resolves by token name and cannot see it, so the check
 * runs on the built CSS — and it only earns its place in the workflow
 * if it actually fails on each shape, which is what these cases pin.
 */

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
)
const scriptPath = path.join(
  packageRoot,
  'scripts/assert-no-duplicate-names.mjs',
)

type RunResult = { status: number; stdout: string; stderr: string }

/** Every fixture tree created by `run`, removed in afterAll. */
const tempRoots: string[] = []

const write = (dir: string, file: string, contents: string) => {
  const target = path.join(dir, file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, contents)
}

/**
 * Runs the script over a fixture tree. `legacy` defaults to `none` so a
 * case opts into the legacy-overlap rule explicitly.
 */
const run = (css: Record<string, string>, legacy?: string): RunResult => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'eds-token-names-'))
  tempRoots.push(root)
  for (const [file, contents] of Object.entries(css))
    write(path.join(root, 'css'), file, contents)

  let legacyArg = 'none'
  if (legacy !== undefined) {
    legacyArg = path.join(root, 'legacy.css')
    fs.writeFileSync(legacyArg, legacy)
  }

  // spawnSync, not execFileSync: the cleared-overlap case warns on
  // stderr while exiting 0, which execFileSync's return value drops
  const { status, stdout, stderr } = spawnSync(
    process.execPath,
    [scriptPath, '--css', path.join(root, 'css'), '--legacy', legacyArg],
    { encoding: 'utf-8' },
  )
  return { status: status ?? 1, stdout, stderr }
}

/** A clean two-layer export: nothing shared across directories. */
const cleanFixture = () => ({
  'primitives/default.css': `:root {
  --eds-primitives-blue-50: #e6f0ff;
}`,
  'semantic/default.css': `:root,
[data-color-scheme] {
  --eds-border-focus: var(--eds-primitives-blue-50);
}`,
})

describe('assert-no-duplicate-names', () => {
  afterAll(() => {
    for (const root of tempRoots)
      fs.rmSync(root, { recursive: true, force: true })
  })

  describe('a clean export', () => {
    it('passes and reports the name count', () => {
      const result = run(cleanFixture())
      expect(result.stderr).toBe('')
      expect(result.status).toBe(0)
      expect(result.stdout).toContain('checked 2 names across 2 files')
    })

    it('ignores the bundle it would otherwise read back as duplicates', () => {
      // variables.css is the concatenation of the other files (ADR-0010)
      const result = run({
        ...cleanFixture(),
        'variables.css': `:root {
  --eds-primitives-blue-50: #e6f0ff;
}`,
      })
      expect(result.status).toBe(0)
    })

    it('accepts the same name repeated within one layer directory', () => {
      // light/dark and the three density modes are the same token in
      // different modes, not a collision
      const result = run({
        'color-scheme/light.css': `:root {
  --eds-bg-default: #ffffff;
}`,
        'color-scheme/dark.css': `[data-color-scheme='dark'] {
  --eds-bg-default: #000000;
}`,
      })
      expect(result.status).toBe(0)
    })
  })

  describe('self-reference (the beta focus-ring shape)', () => {
    const result = run({
      'semantic/default.css': `:root {
  --eds-border-focus: var(--eds-border-focus);
}`,
    })

    it('exits non-zero', () => {
      expect(result.status).toBe(1)
    })

    it('names the token and the line', () => {
      expect(result.stderr).toContain('self-reference')
      expect(result.stderr).toContain('--eds-border-focus')
      expect(result.stderr).toMatch(/semantic\/default\.css:2/)
    })

    it('catches it inside a var() fallback too', () => {
      const fallback = run({
        'semantic/default.css': `:root {
  --eds-border-focus: var(--eds-border-focus, #ff0000);
}`,
      })
      expect(fallback.status).toBe(1)
      expect(fallback.stderr).toContain('self-reference')
    })
  })

  describe('shadowed declaration inside one block', () => {
    // Both halves of a flattening collision landing in the same export
    // set: the layer-directory rule cannot see this one
    const result = run({
      'semantic/default.css': `:root {
  --eds-border-focus: #0000ff;
  --eds-border-focus: #ff0000;
}`,
    })

    it('exits non-zero', () => {
      expect(result.status).toBe(1)
    })

    it('reports both lines', () => {
      expect(result.stderr).toContain('shadowed declaration')
      expect(result.stderr).toMatch(/semantic\/default\.css:3/)
      expect(result.stderr).toContain('first at line 2')
    })

    it('does not fire for the same name in two blocks of one file', () => {
      const result = run({
        'density/compact.css': `[data-density='compact'] {
  --eds-space-md: 4px;
}
[data-density='relaxed'] {
  --eds-space-md: 8px;
}`,
      })
      expect(result.status).toBe(0)
    })
  })

  describe('declared in more than one layer directory', () => {
    const result = run({
      'semantic/default.css': `:root {
  --eds-bg-default: #ffffff;
}`,
      'color-scheme/light.css': `:root {
  --eds-bg-default: #fefefe;
}`,
    })

    it('exits non-zero', () => {
      expect(result.status).toBe(1)
    })

    it('points at both declarations', () => {
      expect(result.stderr).toContain('declared in 2 layer directories')
      expect(result.stderr).toContain('--eds-bg-default')
      expect(result.stderr).toMatch(/semantic\/default\.css:2/)
      expect(result.stderr).toMatch(/color-scheme\/light\.css:2/)
    })
  })

  describe('overlap with the legacy bundle', () => {
    it('fails on a name outside the known list', () => {
      const result = run(
        {
          'semantic/default.css': `:root {
  --eds-text-default: #000000;
}`,
        },
        ':root{--eds-text-default:#111111}',
      )
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('shared with the legacy bundle')
      expect(result.stderr).toContain('--eds-text-default')
    })

    it('accepts a name on the known list', () => {
      const result = run(
        {
          'elevation/default.css': `:root {
  --eds-elevation-high: 0 4px 8px #0003;
}`,
        },
        ':root{--eds-elevation-high:0 4px 8px #0003}',
      )
      expect(result.status).toBe(0)
    })

    it('catches a shadowed declaration with another block in between', () => {
      const result = run(
        {
          'semantic/default.css': `:root {
  --eds-text-default: #000000;
}
[data-color-scheme='dark'] {
  --eds-text-default: #ffffff;
}
:root {
  --eds-text-default: #111111;
}`,
        },
        ':root{--eds-unrelated:1px}',
      )
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('shadowed declaration')
      expect(result.stderr).toContain('--eds-text-default')
    })

    it('reads the last declaration of a minified block', () => {
      // No trailing semicolon before `}` — the legacy bundle is minified
      const result = run(
        {
          'semantic/default.css': `:root {
  --eds-text-default: #000000;
}`,
        },
        ':root{--eds-bg-default:#fff;--eds-text-default:#111111}',
      )
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('--eds-text-default')
    })

    it('warns when the overlap is cleared in the new export, not in legacy', () => {
      // The realistic direction: legacy 2.x is frozen, so a collision
      // goes away by renaming on our side and legacy still declares it
      const result = run(
        {
          'semantic/default.css': `:root {
  --eds-text-default: #000000;
}`,
        },
        ':root{--eds-elevation-high:0 4px 8px #0003}',
      )
      expect(result.status).toBe(0)
      expect(result.stderr).toContain('KNOWN_LEGACY_OVERLAP')
      expect(result.stderr).toContain('--eds-elevation-high')
    })

    it('warns instead of failing when a known overlap is cleared', () => {
      // A fixed collision must not block a release of healthy tokens
      const result = run(
        {
          'semantic/default.css': `:root {
  --eds-text-default: #000000;
}`,
        },
        ':root{--eds-unrelated:1px}',
      )
      expect(result.status).toBe(0)
      expect(result.stderr).toContain('KNOWN_LEGACY_OVERLAP')
      expect(result.stderr).toContain('--eds-elevation-high')
    })
  })

  describe('missing inputs', () => {
    // A guard that skips silently when its input is gone is no guard —
    // `pnpm run clean` removes build/, so this is reachable
    const spawn = (args: string[]) =>
      spawnSync(process.execPath, [scriptPath, ...args], {
        cwd: packageRoot,
        encoding: 'utf-8',
      })

    it('fails with a readable message on a missing css directory', () => {
      const result = spawn(['--css', 'src/tokens/does-not-exist'])
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('cannot read')
      expect(result.stderr).toContain('src/tokens/does-not-exist')
    })

    it('fails with a readable message on a missing legacy bundle', () => {
      const result = spawn(['--legacy', 'build/css/does-not-exist.css'])
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('cannot read')
      expect(result.stderr).toContain('--legacy none')
    })
  })

  describe('the committed export', () => {
    it('has no colliding names', () => {
      // Guards the artifact itself, not just the generate path: this is
      // what ships, and a hand edit or a merge can reintroduce a
      // collision without the release workflow ever running
      const stdout = execFileSync(process.execPath, [scriptPath], {
        cwd: packageRoot,
        encoding: 'utf-8',
        stdio: 'pipe',
      })
      expect(stdout).toContain('no collisions')
    })
  })
})
