import { spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

/**
 * Guards `scripts/build-ts-modules.mjs`, which publishes the platform's
 * TypeScript export as one complete tree per colour scheme and density
 * (ADR-0028 point 4), after checking every variant against the DTCG
 * export, which lists every token with its `$type`.
 *
 * The fixture is a small stand-in for the real exports.
 */

const scriptPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../scripts/build-ts-modules.mjs',
)

type Json = Record<string, unknown>

const token = (type: string, value: unknown = 'x') => ({
  $type: type,
  $value: value,
})

const dtcgFixture = (): Record<string, Json> => ({
  'color-scheme/light.json': {
    accent: { emphasis: token('color') },
    elevation: { ambient: token('color') },
  },
  'color-scheme/dark.json': {
    accent: { emphasis: token('color') },
    elevation: { ambient: token('color') },
  },
  'semantic/default.json': {
    background: { canvas: token('color') },
    'corner-radius': { rounded: token('dimension') },
    spacing: { '2xl': token('dimension'), md: token('dimension') },
    elevation: { high: token('shadow') },
  },
  'density/compact.json': {
    density: { spacing: { '2xl': token('dimension'), md: token('dimension') } },
  },
  'density/comfortable.json': {
    density: { spacing: { '2xl': token('dimension'), md: token('dimension') } },
  },
  'colors/default.json': { light: { gray: { '1': token('color') } } },
  'font/default.json': {
    family: { ui: token('fontFamily') },
    weight: { bold: token('fontWeight') },
    ratio: { double: token('number') },
  },
})

const layer = {
  offsetX: 0,
  offsetY: 4,
  blur: 12,
  spread: 0,
  color: '#00000033',
  inset: false,
}

/** One variant of the platform export: every token, evaluated. */
const themeFixture = (scheme: 'light' | 'dark', density: string): Json => ({
  accent: { emphasis: scheme === 'light' ? '#111111' : '#eeeeee' },
  background: { canvas: scheme === 'light' ? '#ffffff' : '#000000' },
  cornerRadius: { rounded: density === 'compact' ? 2 : 4 },
  spacing: density === 'compact' ? { '2xl': 24, md: 8 } : { '2xl': 32, md: 12 },
  // `elevation` is a name two sets share, and both arrive in the one tree
  elevation: { ambient: '#0000001f', high: [layer] },
  density: {
    spacing:
      density === 'compact' ? { '2xl': 24, md: 8 } : { '2xl': 32, md: 12 },
  },
  light: { gray: { '1': '#f8f8f8' } },
  family: { ui: 'Inter' },
  weight: { bold: 700 },
  ratio: { double: 2 },
  // the internal palette maths, which every export carries
  foundation: { anchor: { hue: 240 } },
  input: { scale: { lightness: 0.5 } },
})

let root: string
let dirs: { exported: string; dtcg: string; out: string }

const write = (file: string, content: string) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

const writeVariant = (name: string, theme: Json) =>
  write(
    path.join(dirs.exported, `${name}.cjs`),
    `module.exports = { theme: ${JSON.stringify(theme)} }\n`,
  )

const writeExport = (edit?: (theme: Json, name: string) => void) => {
  for (const scheme of ['light', 'dark'] as const)
    for (const density of ['compact', 'comfortable']) {
      const theme = themeFixture(scheme, density)
      const name = `${scheme}-${density}`
      edit?.(theme, name)
      writeVariant(name, theme)
    }
}

const run = () =>
  spawnSync(
    process.execPath,
    [
      scriptPath,
      '--export',
      dirs.exported,
      '--dtcg',
      dirs.dtcg,
      '--out',
      dirs.out,
    ],
    { encoding: 'utf8' },
  )

const read = (file: string) =>
  fs.readFileSync(path.join(dirs.out, file), 'utf8')

const listed = (dir: string): string[] =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .map((entry) => entry.name)
    .sort()

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'eds-build-ts-'))
  dirs = {
    exported: path.join(root, 'export'),
    dtcg: path.join(root, 'dtcg'),
    out: path.join(root, 'out'),
  }
  for (const [file, content] of Object.entries(dtcgFixture()))
    write(path.join(dirs.dtcg, file), JSON.stringify(content))
  writeExport()
})

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true })
})

describe('build-ts-modules', () => {
  describe('Layout', () => {
    it('writes one file per colour scheme and density', () => {
      const result = run()
      expect(result.status).toBe(0)
      expect(listed(dirs.out)).toEqual([
        'dark-comfortable.ts',
        'dark-compact.ts',
        'light-comfortable.ts',
        'light-compact.ts',
      ])
    })

    it('writes a complete tree with a theme export and a Theme type', () => {
      run()
      const file = read('light-comfortable.ts')
      expect(file).toContain('export const theme = {')
      expect(file).toContain('export type Theme = typeof theme')
      // the semantic tokens that follow the colour scheme and the density sit side by side
      expect(file).toContain('background: {')
      expect(file).toContain('spacing: {')
    })

    it('renames 2xl style keys and keeps the rest of the key casing', () => {
      run()
      const file = read('light-compact.ts')
      expect(file).toContain('twoXl: 24')
      expect(file).not.toContain("'2xl'")
      expect(file).toContain('cornerRadius: {')
    })

    it('gives every file its own colour scheme and density values', () => {
      run()
      expect(read('light-compact.ts')).toContain("canvas: '#ffffff'")
      expect(read('dark-compact.ts')).toContain("canvas: '#000000'")
      // the semantic spacing and corner radius follow the density in every file
      expect(read('light-compact.ts')).toContain('rounded: 2')
      expect(read('light-compact.ts')).toContain('md: 8')
      expect(read('light-comfortable.ts')).toContain('rounded: 4')
      expect(read('light-comfortable.ts')).toContain('md: 12')
    })

    it('publishes a shadow as CSS text and as its list of layers', () => {
      run()
      const file = read('light-comfortable.ts')
      expect(file).toContain("boxShadow: '0px 4px 12px 0px #00000033'")
      expect(file).toContain('layers: [')
      expect(file).toContain('offsetX: 0')
    })

    it('writes inset and several layers into the CSS text', () => {
      writeExport((theme) => {
        ;(theme.elevation as Json).high = [
          layer,
          { ...layer, offsetY: 12, blur: 16, spread: 6, inset: true },
        ]
      })
      run()
      expect(read('light-comfortable.ts')).toContain(
        "boxShadow: '0px 4px 12px 0px #00000033, inset 0px 12px 16px 6px #00000033'",
      )
    })

    it('publishes only the tokens of the semantic set', () => {
      run()
      const file = read('light-comfortable.ts')
      // the shadow the semantic set holds is in, its loose parts are not
      expect(file).toContain('offsetX: 0')
      expect(file).not.toContain('ambient')
      // the colour ladders, the palettes, the font set and the density group stay out
      expect(file).not.toContain('accent')
      expect(file).not.toContain('gray')
      expect(file).not.toContain('Inter')
      expect(file).not.toContain('density')
    })

    it('leaves the internal palette sets out', () => {
      run()
      for (const file of listed(dirs.out)) {
        expect(read(file)).not.toContain('foundation')
        expect(read(file)).not.toContain('anchor')
      }
    })
  })

  describe('Failures', () => {
    const failsWith = (message: string) => {
      const marker = path.join(dirs.out, 'previous.ts')
      write(marker, 'export const previous = 1\n')
      const result = run()
      expect(result.status).toBe(1)
      expect(result.stderr).toContain(message)
      // a failed run leaves the committed files in place
      expect(fs.existsSync(marker)).toBe(true)
    }

    it('fails when a token in the DTCG export is missing from the TypeScript export', () => {
      writeExport((theme) => {
        delete (theme.background as Json).canvas
      })
      failsWith('background.canvas')
    })

    it('fails on a token the DTCG export does not name', () => {
      writeExport((theme) => {
        ;(theme.accent as Json).extra = '#123456'
      })
      failsWith('accent.extra: in the TypeScript export, but not in the DTCG')
    })

    it('fails on a value that is not evaluated', () => {
      writeExport((theme) => {
        ;(theme.cornerRadius as Json).rounded = 'calc(1px + 2px)'
      })
      failsWith('cornerRadius.rounded')
    })

    it('fails on a colour that is not hex', () => {
      writeExport((theme) => {
        ;(theme.accent as Json).emphasis = 'oklch(0.5 0.1 20)'
      })
      failsWith('accent.emphasis')
    })

    it('fails on a number that is not finite', () => {
      writeExport((theme) => {
        ;((theme.density as Json).spacing as Json).md = Number.NaN
      })
      // NaN does not survive JSON, so the export holds null
      failsWith('density.spacing.md')
    })

    it('fails on a dimension that is a unit string', () => {
      writeExport((theme) => {
        ;(theme.cornerRadius as Json).rounded = '16px'
      })
      failsWith('expected a finite number, got "16px"')
    })

    it('fails on a font weight that is a string', () => {
      writeExport((theme) => {
        ;(theme.weight as Json).bold = '500'
      })
      failsWith('weight.bold: expected a finite number, got "500"')
    })

    it('fails on a number that is a formula', () => {
      writeExport((theme) => {
        ;(theme.ratio as Json).double = 'pow(2, 3)'
      })
      failsWith('ratio.double: expected a finite number, got "pow(2, 3)"')
    })

    it('fails on a shadow layer with a unit string for a number', () => {
      writeExport((theme) => {
        ;((theme.elevation as Json).high as Json[])[0].blur = '8px'
      })
      failsWith('elevation.high[0].blur: expected a finite number, got "8px"')
    })

    it('fails on a shadow layer with a colour that is not hex', () => {
      writeExport((theme) => {
        ;((theme.elevation as Json).high as Json[])[0].color =
          'rgba(0, 0, 0, 0.2)'
      })
      failsWith('elevation.high[0].color: expected a hex colour')
    })

    it('fails on a shadow that is not a list of layers', () => {
      writeExport((theme) => {
        ;(theme.elevation as Json).high = '0px 4px 12px #00000033'
      })
      failsWith('elevation.high: a shadow must be a list of layers')
    })

    it('reports a variant file that does not load as itself, not as a missing file', () => {
      write(
        path.join(dirs.exported, 'light-comfortable.cjs'),
        'module.exports = {\n',
      )
      const result = run()
      expect(result.status).not.toBe(0)
      expect(result.stderr).toContain('SyntaxError')
      expect(result.stderr).not.toContain('selections: included')
    })

    it('fails on a variant the TypeScript export builds but the DTCG export lacks', () => {
      writeVariant('light-relaxed', themeFixture('light', 'relaxed'))
      failsWith('light-relaxed: built by the TypeScript export')
    })

    it('fails on a token with a $type no check covers', () => {
      write(
        path.join(dirs.dtcg, 'timing/default.json'),
        JSON.stringify({ timing: { fast: token('duration') } }),
      )
      writeExport((theme) => {
        theme.timing = { fast: '200ms' }
      })
      failsWith('timing.fast: unknown $type "duration"')
    })

    it('fails on a group no DTCG set contains', () => {
      writeExport((theme) => {
        theme.brandNew = { x: 1 }
      })
      failsWith('brandNew')
    })

    it('fails with a hint when a colour scheme and density variant is missing', () => {
      fs.rmSync(path.join(dirs.exported, 'dark-compact.cjs'))
      failsWith('selections: included')
    })
  })
})
