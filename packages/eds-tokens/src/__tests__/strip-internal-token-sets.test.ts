import { spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect, afterAll } from 'vitest'

/**
 * Covers `scripts/strip-internal-token-sets.mjs` (#5657), which removes
 * the `foundation` and `input` palette maths from the exports before the
 * TS modules and the bundle are built.
 */

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
)
const scriptPath = path.join(
  packageRoot,
  'scripts/strip-internal-token-sets.mjs',
)

type Fixture = { css?: Record<string, string>; dtcg?: Record<string, string> }
type RunResult = {
  status: number
  stdout: string
  stderr: string
  read: (file: string) => string
}

/** Every fixture tree created by `run`, removed in afterAll. */
const tempRoots: string[] = []

const run = ({ css = {}, dtcg = {} }: Fixture): RunResult => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'eds-strip-sets-'))
  tempRoots.push(root)
  for (const [dir, files] of [
    ['css', css],
    ['dtcg', dtcg],
  ] as const) {
    fs.mkdirSync(path.join(root, dir), { recursive: true })
    for (const [file, contents] of Object.entries(files)) {
      const target = path.join(root, dir, file)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.writeFileSync(target, contents)
    }
  }

  const { status, stdout, stderr } = spawnSync(
    process.execPath,
    [
      scriptPath,
      '--css',
      path.join(root, 'css'),
      '--dtcg',
      path.join(root, 'dtcg'),
    ],
    { encoding: 'utf-8' },
  )
  return {
    status: status ?? 1,
    stdout,
    stderr,
    read: (file) => fs.readFileSync(path.join(root, file), 'utf8'),
  }
}

const schemeCss = `[data-color-scheme="light"] {
  --eds-accent-1: var(--eds-light-moss-green-1);
  --eds-foundation-gaussian-light-1: pow(2.718281828459045, calc(-25 / 2 * pow(calc(0.6 - var(--eds-input-scale-light-1)), 2)));
  --eds-input-scale-light-1: 0.98;
  --eds-neutral-1: var(--eds-light-gray-1);
}
`

// Numeric keys in export order ("1", "10", "2"), which a JSON round trip
// would reorder
const schemeDtcg = `{
  "accent": {
    "1": {
      "$type": "color",
      "$value": "{light.moss-green.1}"
    },
    "10": {
      "$type": "color",
      "$value": "{light.moss-green.10}"
    },
    "2": {
      "$type": "color",
      "$value": "{light.moss-green.2}"
    }
  },
  "foundation": {
    "gaussian": {
      "light": {
        "1": {
          "$type": "number",
          "$value": 0.5
        }
      }
    }
  },
  "input": {
    "scale": {
      "light": {
        "1": {
          "$type": "number",
          "$value": 0.98
        }
      }
    }
  }
}
`

describe('strip-internal-token-sets', () => {
  afterAll(() => {
    for (const root of tempRoots)
      fs.rmSync(root, { recursive: true, force: true })
  })

  describe('CSS', () => {
    const result = run({ css: { 'color-scheme/light.css': schemeCss } })

    it('removes the foundation and input declarations', () => {
      expect(result.status).toBe(0)
      expect(result.read('css/color-scheme/light.css'))
        .toBe(`[data-color-scheme="light"] {
  --eds-accent-1: var(--eds-light-moss-green-1);
  --eds-neutral-1: var(--eds-light-gray-1);
}
`)
    })

    it('fails when another token still references a stripped one', () => {
      const dangling = run({
        css: {
          'semantic/default.css': `:root {
  --eds-bg-canvas: var(--eds-input-palette-gray-anchor);
}
`,
        },
      })
      expect(dangling.status).toBe(1)
      expect(dangling.stderr).toContain('var(--eds-input-palette-gray-anchor)')
    })
  })

  describe('DTCG', () => {
    const result = run({ dtcg: { 'color-scheme/light.json': schemeDtcg } })

    it('removes the top-level groups and keeps the export key order', () => {
      expect(result.status).toBe(0)
      const stripped = result.read('dtcg/color-scheme/light.json')
      expect(Object.keys(JSON.parse(stripped) as object)).toEqual(['accent'])
      expect(stripped).toBe(
        schemeDtcg.slice(0, schemeDtcg.indexOf(',\n  "foundation"')) + '\n}\n',
      )
    })

    it('keeps a nested key that shares a set name', () => {
      // semantic `background.input` is a real token, not the input set
      const semantic = `{
  "background": {
    "input": {
      "$type": "color",
      "$value": "{neutral.1}"
    }
  }
}
`
      const nested = run({ dtcg: { 'semantic/default.json': semantic } })
      expect(nested.status).toBe(0)
      expect(nested.read('dtcg/semantic/default.json')).toBe(semantic)
    })

    it('strips a group that is not the last key without breaking commas', () => {
      const middle = run({
        dtcg: {
          'a.json': `{
  "input": {
    "x": 1
  },
  "accent": {
    "y": 2
  }
}
`,
        },
      })
      expect(middle.status).toBe(0)
      expect(JSON.parse(middle.read('dtcg/a.json'))).toEqual({
        accent: { y: 2 },
      })
    })

    it('fails instead of writing when the format is not understood', () => {
      const minified = '{"accent":{"1":1},"input":{"x":1}}'
      const result = run({ dtcg: { 'a.json': minified } })
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('export format changed')
      expect(result.read('dtcg/a.json')).toBe(minified)
    })
  })

  describe('nothing to strip', () => {
    const result = run({
      css: { 'primitives/default.css': ':root {\n  --eds-x: 1px;\n}\n' },
      dtcg: { 'primitives/default.json': '{\n  "x": {}\n}\n' },
    })

    it('warns and still exits 0, so a healthy export opens its PR', () => {
      expect(result.status).toBe(0)
      expect(result.stderr).toContain('no foundation or input tokens found')
    })
  })
})
