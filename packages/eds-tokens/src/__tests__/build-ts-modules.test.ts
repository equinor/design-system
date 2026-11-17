import { spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

/**
 * Guards `scripts/build-ts-modules.mjs`, which rebuilds the published
 * by-set TypeScript modules from the platform's TypeScript export (one
 * `theme` file per colour scheme and density) and the DTCG export (which
 * says which groups belong to which set).
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
    elevation: { high: token('shadow') },
  },
  'density/compact.json': {
    density: { spacing: { '2xl': token('dimension'), md: token('dimension') } },
  },
  'density/comfortable.json': {
    density: { spacing: { '2xl': token('dimension'), md: token('dimension') } },
  },
  'colors/default.json': { light: { gray: { '1': token('color') } } },
  'font/default.json': { family: { ui: token('fontFamily') } },
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
  // `elevation` is a name two sets share: ambient belongs to the colour
  // scheme, high to the semantic set
  elevation: { ambient: '#0000001f', high: [layer] },
  density: {
    spacing:
      density === 'compact' ? { '2xl': 24, md: 8 } : { '2xl': 32, md: 12 },
  },
  light: { gray: { '1': '#f8f8f8' } },
  family: { ui: 'Inter' },
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

const listed = (dir: string): string[] => {
  const found: string[] = []
  const walk = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) walk(full)
      else found.push(path.relative(dir, full).split(path.sep).join('/'))
    }
  }
  walk(dir)
  return found.sort()
}

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
    it('writes one module per set, split per scheme only where values differ', () => {
      const result = run()
      expect(result.status).toBe(0)
      expect(listed(dirs.out)).toEqual([
        'color-scheme/dark.ts',
        'color-scheme/light.ts',
        'colors/default.ts',
        'density/comfortable.ts',
        'density/compact.ts',
        'font/default.ts',
        'semantic/dark.ts',
        'semantic/light.ts',
      ])
    })

    it('hoists a self-named root group and renames 2xl style keys', () => {
      run()
      const compact = read('density/compact.ts')
      expect(compact).toContain('export const density = {')
      expect(compact).toContain('twoXl: 24')
      expect(compact).toContain('md: 8')
      expect(compact).not.toContain('density: {')
      expect(compact).toContain('export type Density = typeof density')
    })

    it('takes density modules from the density variants and the rest at the base density', () => {
      run()
      expect(read('density/comfortable.ts')).toContain('twoXl: 32')
      // semantic is picked at the base density, comfortable
      expect(read('semantic/light.ts')).toContain('rounded: 4')
    })

    it('splits a name two sets share by the DTCG tree', () => {
      run()
      const scheme = read('color-scheme/light.ts')
      expect(scheme).toContain("ambient: '#0000001f'")
      expect(scheme).not.toContain('offsetX')
      const semantic = read('semantic/light.ts')
      expect(semantic).toContain('offsetX: 0')
      expect(semantic).not.toContain('ambient')
    })

    it('picks each scheme from its own variant', () => {
      run()
      expect(read('color-scheme/light.ts')).toContain("emphasis: '#111111'")
      expect(read('color-scheme/dark.ts')).toContain("emphasis: '#eeeeee'")
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
      // a failed run leaves the committed modules in place
      expect(fs.existsSync(marker)).toBe(true)
    }

    it('fails when a token in the DTCG export is missing from the TypeScript export', () => {
      writeExport((theme) => {
        delete (theme.background as Json).canvas
      })
      failsWith('background.canvas')
    })

    it('fails on a value that is not evaluated', () => {
      writeExport((theme) => {
        ;(theme.cornerRadius as Json).rounded = 'calc(1px + 2px)'
      })
      failsWith('corner-radius.rounded')
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

    it('fails on a group no DTCG set contains', () => {
      writeExport((theme) => {
        theme.brandNew = { x: 1 }
      })
      failsWith('brandNew')
    })

    it('fails with a hint when a colour scheme and density variant is missing', () => {
      // the density modules come from the first scheme's variants
      fs.rmSync(path.join(dirs.exported, 'dark-compact.cjs'))
      failsWith('selections: included')
    })
  })
})
