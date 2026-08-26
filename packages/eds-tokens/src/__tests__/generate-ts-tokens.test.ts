import { execFileSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

/**
 * Guards `scripts/generate-ts-tokens.mjs` against new value shapes from
 * the Tokens Studio CSS export.
 *
 * The bug: release v0.0.6 turned `density.corner-radius.rounded-outer`
 * into token math, which the platform's CSS export emits verbatim as
 * `calc(var(--a) + var(--b))` (its formula engine folds colour formulas
 * but not dimension arithmetic). The script only understood a value that
 * was entirely one `var()`, so it exited 1 and the release workflow
 * dropped the whole token release before opening its PR.
 */

const scriptPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../scripts/generate-ts-tokens.mjs',
)

const CALC_OUTER =
  'calc(var(--eds-density-corner-radius-rounded) + var(--eds-primitives-spacing-6))'

/** Minimal stand-in for the real export, one file per dimension slot. */
const cssFixture = (overrides: Record<string, string> = {}) => ({
  'primitives/default.css': `:root {
  --eds-primitives-spacing-6: 1px;
  --eds-primitives-spacing-12: 2px;
  --eds-primitives-spacing-25: 4px;
  --eds-primitives-scale-double: 2;
}`,
  'colors/default.css': `:root {
  --eds-color-neutral-strong: oklch(0.3 0.02 250);
  --eds-color-brand: #ff6600;
  --eds-color-overlay: rgb(0 0 0 / 0.5);
}`,
  'font/default.css': `:root {
  --eds-font-family-ui: Inter;
}`,
  'color-scheme/light.css': `:root {
  --eds-scheme-bg: #ffffff;
}`,
  'color-scheme/dark.css': `:root {
  --eds-scheme-bg: #000000;
}`,
  'density/compact.css': `[data-density='compact'] {
  --eds-density-corner-radius-rounded: var(--eds-primitives-spacing-12);
  --eds-density-corner-radius-rounded-outer: ${CALC_OUTER};
  --eds-density-spacing-md: 4px;
}`,
  'density/comfortable.css': `[data-density='comfortable'] {
  --eds-density-corner-radius-rounded: var(--eds-primitives-spacing-25);
  --eds-density-corner-radius-rounded-outer: ${CALC_OUTER};
  --eds-density-spacing-md: 8px;
}`,
  'semantic/default.css': `:root {
  --eds-corner-radius-rounded-outer: var(--eds-density-corner-radius-rounded-outer);
  --eds-text-default: var(--eds-color-neutral-strong);
  --eds-font-body: var(--eds-font-family-ui);
  --eds-line-height-md: 1.5;
  --eds-space-inline: calc((var(--eds-density-spacing-md) + var(--eds-primitives-spacing-12)) / var(--eds-primitives-scale-double));
}`,
  ...overrides,
})

const leaf = (type: string) => ({ $type: type, $value: 'ignored' })

const dtcgFixture = (overrides: Record<string, unknown> = {}) => ({
  'density/compact.json': {
    density: {
      'corner-radius': {
        rounded: leaf('dimension'),
        'rounded-outer': leaf('dimension'),
      },
      spacing: { md: leaf('dimension') },
    },
  },
  'density/comfortable.json': {
    density: {
      'corner-radius': {
        rounded: leaf('dimension'),
        'rounded-outer': leaf('dimension'),
      },
      spacing: { md: leaf('dimension') },
    },
  },
  'color-scheme/light.json': { scheme: { bg: leaf('color') } },
  'color-scheme/dark.json': { scheme: { bg: leaf('color') } },
  'colors/default.json': {
    color: { brand: leaf('color'), overlay: leaf('color') },
  },
  'semantic/default.json': {
    'corner-radius': { 'rounded-outer': leaf('dimension') },
    text: { default: leaf('color') },
    font: { body: leaf('fontFamily') },
    'line-height': { md: leaf('lineHeight') },
    space: { inline: leaf('dimension') },
  },
  ...overrides,
})

type RunResult = { status: number; stderr: string; outDir: string }

const write = (dir: string, file: string, contents: string) => {
  const target = path.join(dir, file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, contents)
}

const run = (
  css: Record<string, string>,
  dtcg: Record<string, unknown>,
  seedOutDir = false,
): RunResult => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'eds-ts-tokens-'))
  for (const [file, contents] of Object.entries(css))
    write(path.join(root, 'css'), file, contents)
  for (const [file, contents] of Object.entries(dtcg))
    write(path.join(root, 'dtcg'), file, JSON.stringify(contents))

  const outDir = path.join(root, 'ts')
  if (seedOutDir) write(outDir, 'sentinel.ts', '// previous output\n')

  try {
    execFileSync(
      process.execPath,
      [
        scriptPath,
        '--css',
        path.join(root, 'css'),
        '--dtcg',
        path.join(root, 'dtcg'),
        '--out',
        outDir,
      ],
      { encoding: 'utf-8', stdio: 'pipe' },
    )
    return { status: 0, stderr: '', outDir }
  } catch (error) {
    const failure = error as { status: number; stderr: string }
    return { status: failure.status, stderr: failure.stderr, outDir }
  }
}

const readModule = (outDir: string, file: string) =>
  fs.readFileSync(path.join(outDir, file), 'utf-8')

describe('generate-ts-tokens', () => {
  describe('calc() from token math', () => {
    const result = run(cssFixture(), dtcgFixture())

    it('resolves without error', () => {
      expect(result.stderr).toBe('')
      expect(result.status).toBe(0)
    })

    it('folds the expression in each density context', () => {
      // rounded (2px | 4px) + spacing-6 (1px)
      expect(readModule(result.outDir, 'density/compact.ts')).toContain(
        'roundedOuter: 3,',
      )
      expect(readModule(result.outDir, 'density/comfortable.ts')).toContain(
        'roundedOuter: 5,',
      )
    })

    it('folds an expression reached through an alias', () => {
      // the semantic layer aliases the density token, and resolves at
      // the base density (comfortable)
      expect(readModule(result.outDir, 'semantic/default.ts')).toContain(
        'roundedOuter: 5,',
      )
    })

    it('handles nested parentheses, division and unitless operands', () => {
      // (spacing-md 8px + spacing-12 2px) / scale-double 2
      expect(readModule(result.outDir, 'semantic/default.ts')).toContain(
        'inline: 5,',
      )
    })

    it('leaves the existing value shapes untouched', () => {
      const semantic = readModule(result.outDir, 'semantic/default.ts')
      expect(semantic).toContain("default: '#262f38',") // oklch → hex
      expect(semantic).toContain("body: 'Inter',") // font family string
      expect(semantic).toContain('md: 1.5,') // bare number
      const colors = readModule(result.outDir, 'colors/default.ts')
      expect(colors).toContain("brand: '#ff6600',") // hex passthrough
      expect(colors).toContain("overlay: '#00000080',") // rgb → hex + alpha
      expect(readModule(result.outDir, 'color-scheme/light.ts')).toContain(
        "bg: '#ffffff',",
      )
    })
  })

  describe('multiplication and signed operands', () => {
    it('folds `*` and a negative factor', () => {
      const result = run(
        cssFixture({
          'semantic/default.css': `:root {
  --eds-space-inline: calc(var(--eds-primitives-spacing-25) * -2);
}`,
        }),
        dtcgFixture({
          'semantic/default.json': { space: { inline: leaf('dimension') } },
        }),
      )
      expect(result.status).toBe(0)
      expect(readModule(result.outDir, 'semantic/default.ts')).toContain(
        'inline: -8,',
      )
    })

    it('preserves operator precedence when inlining an expression', () => {
      // --eds-space-base is itself a sum; multiplying it must not fold as
      // `4px + 2px * 2`
      const result = run(
        cssFixture({
          'semantic/default.css': `:root {
  --eds-space-base: calc(var(--eds-primitives-spacing-25) + var(--eds-primitives-spacing-12));
  --eds-space-inline: calc(var(--eds-space-base) * 2);
}`,
        }),
        dtcgFixture({
          'semantic/default.json': {
            space: { base: leaf('dimension'), inline: leaf('dimension') },
          },
        }),
      )
      expect(result.status).toBe(0)
      expect(readModule(result.outDir, 'semantic/default.ts')).toContain(
        'inline: 12,',
      )
    })

    it('uses the fallback arm when the reference is missing', () => {
      const result = run(
        cssFixture({
          'semantic/default.css': `:root {
  --eds-space-inline: calc(var(--eds-not-exported, 3px) + var(--eds-primitives-spacing-6));
}`,
        }),
        dtcgFixture({
          'semantic/default.json': { space: { inline: leaf('dimension') } },
        }),
      )
      expect(result.status).toBe(0)
      expect(readModule(result.outDir, 'semantic/default.ts')).toContain(
        'inline: 4,',
      )
    })
  })

  describe('invalid values fail loudly', () => {
    it('rejects mismatched units in a sum', () => {
      const result = run(
        cssFixture({
          'semantic/default.css': `:root {
  --eds-space-inline: calc(var(--eds-primitives-spacing-25) + 1rem);
}`,
        }),
        dtcgFixture({
          'semantic/default.json': { space: { inline: leaf('dimension') } },
        }),
      )
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('cannot add mismatched units')
      expect(result.stderr).toContain('--eds-space-inline')
    })

    it('rejects a unit it cannot convert to a number', () => {
      const result = run(
        cssFixture({
          'semantic/default.css': `:root {
  --eds-space-inline: calc(1rem + 1rem);
}`,
        }),
        dtcgFixture({
          'semantic/default.json': { space: { inline: leaf('dimension') } },
        }),
      )
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('unsupported dimension unit "rem"')
    })

    it('rejects division by a dimension', () => {
      const result = run(
        cssFixture({
          'semantic/default.css': `:root {
  --eds-space-inline: calc(4px / var(--eds-primitives-spacing-12));
}`,
        }),
        dtcgFixture({
          'semantic/default.json': { space: { inline: leaf('dimension') } },
        }),
      )
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('cannot divide by a dimension')
    })

    it('still detects a circular var() chain', () => {
      const result = run(
        cssFixture({
          'semantic/default.css': `:root {
  --eds-space-inline: calc(var(--eds-space-loop) + 1px);
  --eds-space-loop: var(--eds-space-inline);
}`,
        }),
        dtcgFixture({
          'semantic/default.json': { space: { inline: leaf('dimension') } },
        }),
      )
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('circular var() chain')
    })

    it('keeps the plain non-numeric message for junk values', () => {
      const result = run(
        cssFixture({
          'semantic/default.css': `:root {
  --eds-space-inline: auto;
}`,
        }),
        dtcgFixture({
          'semantic/default.json': { space: { inline: leaf('dimension') } },
        }),
      )
      expect(result.status).toBe(1)
      expect(result.stderr).toContain(
        'non-numeric dimension for --eds-space-inline: auto',
      )
    })
  })

  describe('failure reporting', () => {
    const result = run(
      cssFixture({
        'semantic/default.css': `:root {
  --eds-space-inline: auto;
  --eds-space-block: 1rem;
}`,
      }),
      dtcgFixture({
        'semantic/default.json': {
          space: { inline: leaf('dimension'), block: leaf('dimension') },
        },
      }),
      true,
    )

    it('reports every bad token in one run, not just the first', () => {
      expect(result.stderr).toContain('--eds-space-inline')
      expect(result.stderr).toContain('--eds-space-block')
      expect(result.stderr).toContain('2 token value(s) could not be converted')
    })

    it('leaves the previous output in place when it fails', () => {
      // a failed unattended run must not wipe the committed modules
      expect(fs.existsSync(path.join(result.outDir, 'sentinel.ts'))).toBe(true)
    })
  })

  describe('export files the script did not know about', () => {
    // v0.0.6 also added an `elevation/` export. buildContext used to
    // hard-code its six input files, so every `--eds-shadow-*` the new
    // file declares was missing from the resolution context.
    const ELEVATION_CSS = `:root {
  --eds-shadow-low-key-x: 0px;
  --eds-shadow-low-key-y: 1px;
  --eds-shadow-low-key-blur: 8px;
  --eds-shadow-low-key-spread: 0px;
  --eds-shadow-low-key-color: var(--eds-elevation-key);
}`

    it('discovers a new dimension-independent export folder', () => {
      const result = run(
        cssFixture({ 'elevation/default.css': ELEVATION_CSS }),
        dtcgFixture({
          'elevation/default.json': {
            shadow: { low: { key: { y: leaf('dimension') } } },
          },
        }),
      )
      expect(result.stderr).toBe('')
      expect(readModule(result.outDir, 'elevation/default.ts')).toContain(
        'y: 1,',
      )
    })

    it('never merges the committed variables.css bundle into a context', () => {
      // the bundle concatenates every dimension variant, and predates the
      // run (the workflow bundles after this script) — merging it would
      // let one density's values leak into another's
      const result = run(
        cssFixture({
          'variables.css': `:root {
  --eds-primitives-spacing-25: 999px;
}`,
        }),
        dtcgFixture(),
      )
      expect(result.status).toBe(0)
      expect(readModule(result.outDir, 'density/comfortable.ts')).toContain(
        'rounded: 4,',
      )
    })

    it('converts a composite shadow to a box-shadow string', () => {
      const result = run(
        cssFixture({
          'elevation/default.css': ELEVATION_CSS,
          'color-scheme/light.css': `:root {
  --eds-scheme-bg: #ffffff;
  --eds-elevation-key: rgb(0 0 0 / 0.2);
}`,
          'color-scheme/dark.css': `:root {
  --eds-scheme-bg: #000000;
  --eds-elevation-key: rgb(0 0 0 / 0.2);
}`,
          'semantic/default.css': `:root {
  --eds-elevation-low: var(--eds-shadow-low-key-x) var(--eds-shadow-low-key-y) var(--eds-shadow-low-key-blur) var(--eds-shadow-low-key-spread) var(--eds-shadow-low-key-color);
}`,
        }),
        dtcgFixture({
          'semantic/default.json': { elevation: { low: leaf('shadow') } },
        }),
      )
      expect(result.stderr).toBe('')
      // lengths keep their units, colours become hex
      expect(readModule(result.outDir, 'semantic/default.ts')).toContain(
        "low: '0px 1px 8px 0px #00000033',",
      )
    })

    it('rejects a shadow colour function it cannot convert', () => {
      const result = run(
        cssFixture({
          'semantic/default.css': `:root {
  --eds-elevation-low: 0px 1px 8px 0px color-mix(in oklch, red, blue);
}`,
        }),
        dtcgFixture({
          'semantic/default.json': { elevation: { low: leaf('shadow') } },
        }),
      )
      expect(result.status).toBe(1)
      expect(result.stderr).toContain(
        'unsupported shadow value for --eds-elevation-low',
      )
    })
  })
})
