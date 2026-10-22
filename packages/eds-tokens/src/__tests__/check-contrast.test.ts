import { spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect, afterAll } from 'vitest'
import { semantic as committedLight } from '../tokens/ts/semantic/light'
import { semantic as committedDark } from '../tokens/ts/semantic/dark'

/**
 * Covers `scripts/check-contrast.mjs` (#5382, ADR-0016 § Confirmation
 * 5): the documented colour pairings fail the run below the WCAG 2.1 AA
 * minimum and are only reported below their APCA target.
 *
 * The first case runs the check over the committed TS modules, so a
 * hand edit or a merge that breaks the minimum fails CI without a
 * release run. The other cases change one value in a copy of the
 * committed modules, so each of them tests one rule against the full
 * pairing list.
 */

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
)
const scriptPath = path.join(packageRoot, 'scripts/check-contrast.mjs')

type Tree = { [key: string]: string | Tree }
type Scheme = 'light' | 'dark'
type RunResult = { status: number; stdout: string; stderr: string }

/** Every fixture tree created by `run`, removed in afterAll. */
const tempRoots: string[] = []

const run = (tsDir: string): RunResult => {
  const { status, stdout, stderr } = spawnSync(
    process.execPath,
    [scriptPath, '--ts', tsDir],
    { encoding: 'utf-8' },
  )
  return { status: status ?? 1, stdout, stderr }
}

/**
 * Runs the check over a copy of the committed modules after `edit` has
 * changed it. Paths use the TS keys (`text.onEmphasis.danger`).
 */
const runEdited = (
  edit: (schemes: Record<Scheme, Tree>) => void,
): RunResult => {
  const schemes = {
    light: structuredClone(committedLight) as unknown as Tree,
    dark: structuredClone(committedDark) as unknown as Tree,
  }
  edit(schemes)

  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'eds-contrast-'))
  tempRoots.push(root)
  fs.mkdirSync(path.join(root, 'semantic'))
  for (const [scheme, tree] of Object.entries(schemes))
    fs.writeFileSync(
      path.join(root, 'semantic', `${scheme}.ts`),
      `export const semantic = ${JSON.stringify(tree, null, 2)} as const\n`,
    )
  return run(root)
}

const parentOf = (tree: Tree, keyPath: string) => {
  const keys = keyPath.split('.')
  const last = keys.pop() as string
  const parent = keys.reduce((node, key) => node[key] as Tree, tree)
  return { parent, last }
}

const set = (tree: Tree, keyPath: string, value: string) => {
  const { parent, last } = parentOf(tree, keyPath)
  parent[last] = value
}

const get = (tree: Tree, keyPath: string) => {
  const { parent, last } = parentOf(tree, keyPath)
  return parent[last] as string
}

const remove = (tree: Tree, keyPath: string) => {
  const { parent, last } = parentOf(tree, keyPath)
  delete parent[last]
}

describe('check-contrast', () => {
  afterAll(() => {
    for (const root of tempRoots)
      fs.rmSync(root, { recursive: true, force: true })
  })

  describe('the committed tokens', () => {
    const result = run(path.join(packageRoot, 'src/tokens/ts'))

    it('meet the minimum on every documented pair outside the exceptions', () => {
      expect(result.stderr).toBe('')
      expect(result.status).toBe(0)
      expect(result.stdout).toContain('132 documented pairs')
    })

    it('report the documented exceptions with their measured values', () => {
      expect(result.stdout).toContain(
        'dark   text.primary on background.interactive.accent.selected.hover  #f8fcff on #439199  3.54:1',
      )
      expect(result.stdout).toContain(
        'light  text.tertiary on background.surface  #a4a4a4 on #ffffff  2.49:1',
      )
    })

    it('mark the APCA targets that the docs do not give', () => {
      expect(result.stdout).toContain(
        'light  icon.primary on background.interactive.accent.selected.hover  #333333 on #6cb2b9  5.24:1 (minimum 3:1)  Lc 49.2 (target Lc 60, assumed)',
      )
    })
  })

  describe('a promised pair below the minimum', () => {
    const result = runEdited(({ dark }) =>
      set(
        dark,
        'text.onEmphasis.danger',
        get(dark, 'background.interactive.danger.emphasis.default'),
      ),
    )

    it('fails the run', () => {
      expect(result.status).toBe(1)
    })

    it('names the scheme, the pair and the measured values', () => {
      expect(result.stderr).toMatch(
        /dark {3}text\.on-emphasis\.danger on background\.interactive\.danger\.emphasis\.default {2}#[0-9a-f]{6} on #[0-9a-f]{6} {2}1\.00:1/,
      )
    })
  })

  it('fails on tertiary in dark, which the exception does not cover', () => {
    const result = runEdited(({ dark }) =>
      set(dark, 'text.tertiary', get(dark, 'background.canvas')),
    )
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('dark   text.tertiary on background.canvas')
  })

  it('fails on a selected fill outside accent hover and pressed', () => {
    const result = runEdited(({ light }) =>
      set(light, 'background.interactive.neutral.selected.default', '#333333'),
    )
    expect(result.status).toBe(1)
    expect(result.stderr).toContain(
      'light  text.primary on background.interactive.neutral.selected.default',
    )
  })

  it('reports a pair below its APCA target without failing', () => {
    // Light text on a dark fill can pass 4.5:1 well under Lc 60: dark
    // tertiary measures 5.48:1 on the surface at Lc 36.5
    const result = runEdited(({ dark }) =>
      set(dark, 'text.secondary', get(dark, 'text.tertiary')),
    )
    expect(result.status).toBe(0)
    expect(result.stdout).toMatch(
      /Below the APCA target[\s\S]*dark {3}text\.secondary on background\.surface {2}#738696 on #030303 {2}5\.48:1 \(minimum 4\.5:1\) {2}Lc 36\.5 \(target Lc 60\)/,
    )
    expect(result.stdout).toContain(
      'dark   text.secondary on background.canvas  #738696 on #191a1a  4.63:1 (minimum 4.5:1)  Lc 35.2 (target Lc 60, assumed)',
    )
  })

  it('fails when a documented token is missing', () => {
    const result = runEdited(({ dark }) => remove(dark, 'text.onMuted.warning'))
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('text.on-muted.warning does not exist')
  })

  it('fails on a colour with alpha, which has no contrast value', () => {
    const result = runEdited(({ light }) =>
      set(light, 'background.surface', '#ffffff80'),
    )
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('not an opaque #rrggbb colour')
  })

  it('warns, and still passes, when an exception is no longer needed', () => {
    const result = runEdited(({ light }) => {
      set(light, 'text.tertiary', '#595959')
      set(light, 'icon.tertiary', '#595959')
    })
    expect(result.status).toBe(0)
    expect(result.stderr).toContain('"tertiary in light" exception')
  })

  it('fails with a hint when the TS modules are missing', () => {
    const result = run(path.join(os.tmpdir(), 'eds-contrast-does-not-exist'))
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('generate:ts-tokens')
  })
})
