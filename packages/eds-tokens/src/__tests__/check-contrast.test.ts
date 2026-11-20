import { spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import { theme as committedLight } from '../tokens/ts/light-comfortable'
import { theme as committedDark } from '../tokens/ts/dark-comfortable'

/**
 * Covers `scripts/check-contrast.mjs` (#5382, ADR-0016 § Confirmation
 * 5): the documented colour pairings fail the run below the WCAG 2.1 AA
 * minimum and are only reported below their APCA target.
 *
 * The first case runs the check over the committed TS modules, so a
 * hand edit or a merge that breaks the minimum fails CI without a
 * release run. It asserts nothing about the values themselves: the
 * Tokens Studio release PR gets no CI, so a test that pinned today's
 * colours would break every later PR after a release moved them.
 *
 * The other cases set the colours they test in a copy of the committed
 * modules and assert on those, so each one tests one rule against the
 * full pairing list. The copies start from categorical data visualisation
 * colours that pass (see `runEdited`), so a categorical value in the
 * committed tokens cannot decide a case about another rule.
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
  for (const tree of Object.values(schemes)) passingCategorical(tree)
  edit(schemes)

  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'eds-contrast-'))
  tempRoots.push(root)
  for (const [scheme, tree] of Object.entries(schemes))
    fs.writeFileSync(
      path.join(root, `${scheme}-comfortable.ts`),
      `export const theme = ${JSON.stringify(tree, null, 2)} as const\n`,
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

const accentSelected = 'background.interactive.accent.selected'

const categories = Array.from({ length: 10 }, (_, index) => index + 1)

/**
 * Categorical colours that meet every categorical pair and chart goal:
 * steps 1 and 2 take the surface colour, which text.primary is measured
 * on, and steps 3 to 5 take text.primary, which stands out on the canvas
 * and the surface.
 */
const passingCategorical = (tree: Tree) => {
  const surface = get(tree, 'background.surface')
  const text = get(tree, 'text.primary')
  for (const category of categories)
    for (const step of [1, 2, 3, 4, 5])
      set(
        tree,
        `dataVisualization.cat.${category}.${step}`,
        step <= 2 ? surface : text,
      )
}

describe('check-contrast', () => {
  afterAll(() => {
    for (const root of tempRoots)
      fs.rmSync(root, { recursive: true, force: true })
  })

  describe('the committed tokens', () => {
    let result: RunResult
    beforeAll(() => {
      result = run(path.join(packageRoot, 'src/tokens/ts'))
    })

    it('meet the minimum on every documented and categorical pair outside the exceptions', () => {
      expect(result.status).toBe(0)
      expect(result.stdout).toContain('134 documented pairs')
      expect(result.stdout).toContain('40 categorical data visualisation pairs')
      expect(result.stdout).toContain('20 chart goals')
    })

    it('measure primary, secondary and tertiary against the surface only', () => {
      // ADR-0016 Confirmation 5: the canvas is not a reference backdrop
      expect(result.stdout).not.toContain('background.canvas')
    })
  })

  describe('a promised pair below the minimum', () => {
    let result: RunResult
    beforeAll(() => {
      result = runEdited(({ dark }) =>
        set(
          dark,
          'text.onEmphasis.danger',
          get(dark, 'background.interactive.danger.emphasis.default'),
        ),
      )
    })

    it('fails the run', () => {
      expect(result.status).toBe(1)
    })

    it('names the scheme, the pair and the measured values', () => {
      expect(result.stderr).toMatch(
        /dark {3}text\.on-emphasis\.danger on background\.interactive\.danger\.emphasis\.default {2}#[0-9a-f]{6} on #[0-9a-f]{6} {2}1\.00:1/,
      )
    })
  })

  describe('the dedicated roles', () => {
    let result: RunResult
    beforeAll(() => {
      result = runEdited(({ light, dark }) => {
        set(light, 'text.inverted', get(light, 'background.inverted'))
        set(
          dark,
          'icon.interactive.link.hover',
          get(dark, 'background.surface'),
        )
      })
    })

    it('fail the run when inverted drops below the minimum on background.inverted', () => {
      expect(result.status).toBe(1)
      expect(result.stderr).toContain(
        'light  text.inverted on background.inverted',
      )
    })

    it('fail the run when a link state drops below the minimum on the surface', () => {
      expect(result.stderr).toContain(
        'dark   icon.interactive.link.hover on background.surface',
      )
    })
  })

  describe('the documented exceptions', () => {
    it('reports a listed pair below the minimum without failing', () => {
      // Near-white text on #439199 is about 3.5:1: below 4.5:1 for text,
      // above 3:1 for the unlisted icon.primary on the same fill
      const result = runEdited(({ dark }) =>
        set(dark, `${accentSelected}.hover`, '#439199'),
      )
      expect(result.status).toBe(0)
      expect(result.stdout).toMatch(
        /Documented exceptions below the minimum[\s\S]*dark {3}text\.primary on background\.interactive\.accent\.selected\.hover {2}#[0-9a-f]{6} on #439199 {2}\d\.\d{2}:1 \(minimum 4\.5:1\)[^\n]*\[primary on accent selected\]/,
      )
    })

    it('fails on a state the docs do not list as an exception', () => {
      // Light hover is not listed: dark text on #3c959e is about 3.6:1
      const result = runEdited(({ light }) =>
        set(light, `${accentSelected}.hover`, '#3c959e'),
      )
      expect(result.status).toBe(1)
      expect(result.stderr).toContain(
        'light  text.primary on background.interactive.accent.selected.hover',
      )
    })

    it('fails on tertiary in dark, which the exception does not cover', () => {
      const result = runEdited(({ dark }) =>
        set(dark, 'text.tertiary', get(dark, 'background.surface')),
      )
      expect(result.status).toBe(1)
      expect(result.stderr).toContain(
        'dark   text.tertiary on background.surface',
      )
    })

    it('fails on a selected fill that no exception lists', () => {
      const result = runEdited(({ light }) =>
        set(
          light,
          'background.interactive.neutral.selected.default',
          '#333333',
        ),
      )
      expect(result.status).toBe(1)
      expect(result.stderr).toContain(
        'light  text.primary on background.interactive.neutral.selected.default',
      )
    })

    it('warns for each listed pair that now meets the minimum, and still passes', () => {
      const result = runEdited(({ light, dark }) => {
        set(light, 'text.tertiary', '#595959')
        set(dark, `${accentSelected}.hover`, '#1f2626')
      })
      expect(result.status).toBe(0)
      expect(result.stderr).toContain('now meet the minimum')
      expect(result.stderr).toMatch(
        /light {2}text\.tertiary on background\.surface {2}#595959 on #[0-9a-f]{6}[^\n]*\[tertiary in light\]/,
      )
      expect(result.stderr).toMatch(
        /dark {3}text\.primary on background\.interactive\.accent\.selected\.hover {2}#[0-9a-f]{6} on #1f2626[^\n]*\[primary on accent selected\]/,
      )
      // icon.tertiary was not changed, so it is still an exception
      expect(result.stderr).not.toContain('icon.tertiary')
    })
  })

  describe('a pair below its APCA target', () => {
    let result: RunResult
    beforeAll(() => {
      // Light grey on the near-black dark surface is above 4.5:1 but far
      // below Lc 60
      result = runEdited(({ dark }) => {
        set(dark, 'text.secondary', '#7a7a7a')
        set(dark, 'icon.secondary', '#7a7a7a')
      })
    })

    it('is reported without failing', () => {
      expect(result.status).toBe(0)
      expect(result.stdout).toMatch(
        /Below the APCA target[\s\S]*dark {3}text\.secondary on background\.surface {2}#7a7a7a on #[0-9a-f]{6} {2}\d+\.\d{2}:1 \(minimum 4\.5:1\) {2}Lc [\d.]+ \(target Lc 60\)/,
      )
    })

    it('marks the targets that the docs do not give', () => {
      expect(result.stdout).toMatch(
        /dark {3}icon\.secondary on background\.surface {2}#7a7a7a on #[0-9a-f]{6}[^\n]*\(target Lc 60, assumed\)/,
      )
    })
  })

  describe('the categorical data visualisation colours', () => {
    it('fail the run when neither text colour meets 4.5:1 on a fill', () => {
      // Mid grey is about 3.2:1 with near-black text and 3.7:1 with near
      // white text
      const result = runEdited(({ light }) =>
        set(light, 'dataVisualization.cat.3.2', '#808080'),
      )
      expect(result.status).toBe(1)
      expect(result.stderr).toMatch(
        /light {2}text\.primary or text\.inverted on data-visualization\.cat\.3\.2 {2}text\.(primary|inverted) #[0-9a-f]{6} on #808080 {2}\d\.\d{2}:1 \(minimum 4\.5:1\)[^\n]*\(other: text\.(primary|inverted)/,
      )
    })

    it('pass when only one of the two text colours meets 4.5:1, on both steps', () => {
      // text.primary on its own colour is 1:1, text.inverted is far above
      const result = runEdited(({ light }) => {
        set(light, 'dataVisualization.cat.3.1', get(light, 'text.primary'))
        set(light, 'dataVisualization.cat.3.2', get(light, 'text.primary'))
      })
      expect(result.status).toBe(0)
      expect(result.stderr).not.toContain('data-visualization.cat.3')
    })

    it('fail the run when no single text colour meets 4.5:1 on both steps', () => {
      // Step 1 keeps the surface colour, where only text.primary passes;
      // on step 2, text.primary's own colour, only text.inverted passes
      const result = runEdited(({ light }) =>
        set(light, 'dataVisualization.cat.3.2', get(light, 'text.primary')),
      )
      expect(result.status).toBe(1)
      expect(result.stderr).toMatch(
        /light {2}text\.primary or text\.inverted on data-visualization\.cat\.3\.1 and data-visualization\.cat\.3\.2: no single text colour reaches 4\.5:1 on both steps \(text\.primary #[0-9a-f]{6} \d+\.\d{2}:1 and 1\.00:1, text\.inverted #[0-9a-f]{6} \d+\.\d{2}:1 and \d+\.\d{2}:1\)/,
      )
      // Each step on its own passes, so neither is reported as a pair
      expect(result.stderr).not.toContain('on data-visualization.cat.3.2  ')
    })

    it('report the text colour used when it is below Lc 60', () => {
      // In dark, only the dark text.inverted meets 4.5:1 on #a28200, at
      // about Lc 38. Step 1 takes a pale colour so that text.inverted also
      // passes there, as one text colour has to work on both steps.
      const result = runEdited(({ dark }) => {
        set(dark, 'dataVisualization.cat.2.1', '#f9eab5')
        set(dark, 'dataVisualization.cat.2.2', '#a28200')
      })
      expect(result.status).toBe(0)
      expect(result.stdout).toMatch(
        /Below the APCA target[\s\S]*dark {3}text\.primary or text\.inverted on data-visualization\.cat\.2\.2 {2}text\.inverted #[0-9a-f]{6} on #a28200 {2}\d\.\d{2}:1 \(minimum 4\.5:1\) {2}Lc [\d.]+ \(target Lc 60, assumed\) {2}\(other: text\.primary/,
      )
    })

    it('fail the run when step 4 is below 3:1 against the canvas or the surface', () => {
      const result = runEdited(({ light }) =>
        set(
          light,
          'dataVisualization.cat.5.4',
          get(light, 'background.canvas'),
        ),
      )
      expect(result.status).toBe(1)
      expect(result.stderr).toContain(
        'light  data-visualization.cat.5.4 on background.canvas',
      )
      expect(result.stderr).toContain(
        'light  data-visualization.cat.5.4 on background.surface',
      )
    })

    it('report the chart goals without failing', () => {
      const result = runEdited(({ light, dark }) => {
        set(
          light,
          'dataVisualization.cat.2.3',
          get(light, 'background.surface'),
        )
        // In dark, #ca7b7a is above 3:1 on the surface but below Lc 45
        set(dark, 'dataVisualization.cat.7.4', '#ca7b7a')
      })
      expect(result.status).toBe(0)
      expect(result.stdout).toMatch(
        /Chart goals not met[\s\S]*light {2}data-visualization\.cat\.2\.3 on background\.surface {2}#[0-9a-f]{6} on #[0-9a-f]{6} {2}1\.00:1 \(goal 3:1\) {2}Lc [\d.]+ \(goal Lc 30\)/,
      )
      expect(result.stdout).toMatch(
        /dark {3}data-visualization\.cat\.7\.4 on background\.surface {2}#ca7b7a on #[0-9a-f]{6} {2}\d\.\d{2}:1 \(goal 3:1\) {2}Lc [\d.]+ \(goal Lc 45\)/,
      )
    })
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

  it('fails with a hint when the TS modules are missing', () => {
    const result = run(path.join(os.tmpdir(), 'eds-contrast-does-not-exist'))
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('build:ts-modules')
  })
})
