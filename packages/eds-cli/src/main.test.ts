import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { main } from './main.js'
import { parseTokens } from './tokens.js'
import { capture, makeProject } from './test-utils.js'
import type { Component } from './types.js'

function run(argv: string[], cwd = makeProject()) {
  const io = capture(cwd)
  const code = main(argv, io)
  return { code, stdout: io.stdout, stderr: io.stderr }
}

describe('eds', () => {
  describe('list', () => {
    it('prints each component with its first sentence', () => {
      const { code, stdout } = run(['list'])
      expect(code).toBe(0)
      expect(stdout).toContain(
        'Button     Button triggers an action, such as saving a form.\n',
      )
      expect(stdout).toContain('(deprecated)')
      expect(stdout).toContain('3 components.')
    })

    it('prints JSON with --json', () => {
      const { stdout } = run(['list', '--json'])
      expect(JSON.parse(stdout)).toContainEqual({
        name: 'TextField',
        description: null,
        status: 'active',
      })
    })
  })

  describe('show', () => {
    it('prints the import, props, base type and guidance', () => {
      const { code, stdout } = run(['show', 'Button'])
      expect(code).toBe(0)
      expect(stdout).toContain(
        "import { Button } from '@equinor/eds-core-react/next'",
      )
      expect(stdout).toContain(
        "variant?: 'primary' | 'secondary' | 'ghost' = 'primary'",
      )
      expect(stdout).toContain(
        'Also accepts the props of ButtonHTMLAttributes<HTMLButtonElement>, except children.',
      )
      expect(stdout).toContain('Supports asChild')
      expect(stdout).toContain('Use one primary button per view.')
    })

    it('shows three examples and says how to get the rest', () => {
      const { stdout } = run(['show', 'Button'])
      expect(stdout).toContain('Save 3')
      expect(stdout).not.toContain('Save 4')
      expect(stdout).toContain('1 more: `eds show Button --section examples`')
    })

    it('prints only the requested section', () => {
      const { stdout } = run(['show', 'Button', '--section', 'examples'])
      expect(stdout).toContain('Save 4')
      expect(stdout).not.toContain('Props')
    })

    it('says when a section has no content', () => {
      expect(run(['show', 'TextField', '--section', 'usage']).stdout).toBe(
        'TextField has no usage guidance yet.\n',
      )
      expect(run(['show', 'TextField', '--section', 'examples']).stdout).toBe(
        'TextField has no examples yet.\n',
      )
      expect(run(['show', 'TextField', '--section', 'links']).stdout).toBe(
        'TextField has no links yet.\n',
      )
    })

    it('ignores case in the component name', () => {
      expect(run(['show', 'textfield']).stdout).toMatch(/^TextField/)
    })

    it('suggests close names for an unknown component', () => {
      const { code, stderr } = run(['show', 'Buton'])
      expect(code).toBe(1)
      expect(stderr).toBe(
        'eds: No component called Buton. Did you mean Button?\n',
      )
    })

    it('shows several components in one call', () => {
      const { code, stdout } = run(['show', 'Button', 'TextField'])
      expect(code).toBe(0)
      expect(stdout).toMatch(/^Button\n[\s\S]*\n---\n\nTextField\n/)
    })

    it('ends with the command for tokens', () => {
      expect(run(['show', 'Button']).stdout).toContain(
        '→ Tokens for the layout around it: eds tokens <words>',
      )
      expect(
        run(['show', 'Button', '--section', 'props']).stdout,
      ).not.toContain('→ Tokens')
    })

    it('prints an array for several components with --json', () => {
      const { stdout } = run(['show', 'Button', 'Field', '--json'])
      const components = JSON.parse(stdout) as Component[]
      expect(components.map((c) => c.name)).toEqual(['Button', 'Field'])
    })

    it('prints the whole component as JSON, in an array for one name too', () => {
      const { stdout } = run(['show', 'Button', '--json'])
      const components = JSON.parse(stdout) as Component[]
      expect(components).toHaveLength(1)
      expect(components[0].examples).toHaveLength(4)
    })
  })

  describe('search', () => {
    it('matches names, descriptions and props, name matches first', () => {
      expect(run(['search', 'field']).stdout).toMatch(
        /^Field [^\n]*\n(?:.*\n)*?TextField /,
      )
      expect(run(['search', 'label']).stdout).toMatch(
        /^Field [^\n]*\n(?:.*\n)*?TextField /,
      )
    })

    it('gives counts and the command to run next for each match', () => {
      const { stdout } = run(['search', 'field'])
      expect(stdout).toContain('Field (0 props, 0 examples) deprecated\n')
      expect(stdout).toContain('TextField (1 prop, 0 examples)\n')
      expect(stdout).toContain('  → eds show TextField\n')
      expect(stdout).toContain('→ Several at once: eds show Field TextField')
    })

    it('allows one typo in longer words', () => {
      expect(run(['search', 'buton']).stdout).toMatch(/^Button /)
      expect(run(['search', 'variamt']).stdout).toMatch(/^Button /)
    })

    it('suggests close names when nothing matches', () => {
      expect(run(['search', 'calendar']).stdout).toBe(
        'No component matches "calendar". Run `eds list` to see them all.\n',
      )
      expect(run(['search', 'Buttn', 'xyz']).stdout).toContain(
        'Did you mean Button?\n→ eds show Button',
      )
    })

    it('names each suggestion once when several words are close to it', () => {
      expect(run(['search', 'Buttn', 'Buton', 'xyz']).stdout).toContain(
        'Did you mean Button?\n',
      )
    })
  })

  describe('tokens', () => {
    it('lists the semantic tokens resolved for light and comfortable', () => {
      const { stdout } = run(['tokens'])
      expect(stdout).toMatch(
        /--eds-background-interactive-accent-emphasis-default +oklch\(0\.5 0\.1 150\) +\(var\(--eds-accent-9\)\)/,
      )
      expect(stdout).toMatch(/--eds-spacing-md +12px/)
      expect(stdout).not.toContain('--eds-primitives')
      expect(stdout).toContain('3 tokens, values for light colour scheme')
    })

    it('filters by every word and follows scheme and density', () => {
      const { stdout } = run([
        'tokens',
        'accent',
        'background',
        '--scheme',
        'dark',
      ])
      expect(stdout).toContain('oklch(0.7 0.1 150)')
      expect(stdout).not.toContain('--eds-spacing-md')
      expect(run(['tokens', 'spacing', '--density', 'compact']).stdout).toMatch(
        /--eds-spacing-md +8px/,
      )
    })

    it('keeps the fallback of a reference that does not resolve', () => {
      const { stdout } = run(['tokens', 'link'])
      expect(stdout).toMatch(/--eds-text-link +blue/)
      expect(stdout).toContain('1 token, values for')
    })

    it('reads the bundle from ./css/variables.css after the ADR-0009 flip', () => {
      const { code, stdout } = run(['tokens'], makeProject({ tokens: 'final' }))
      expect(code).toBe(0)
      expect(stdout).toContain('3 tokens, values for')
    })

    it('reads --css and --data relative to --cwd', () => {
      const project = makeProject()
      const parent = join(project, '..')
      const relative = (path: string) => join(basename(project), path)
      const css = relative(
        'node_modules/@equinor/eds-tokens/src/tokens/css/variables.css',
      )
      const data = relative(
        'node_modules/@equinor/eds-core-react/build/agent/components.json',
      )
      const elsewhere = mkdtempSync(join(tmpdir(), 'eds-cli-elsewhere-'))
      expect(
        run(['tokens', '--cwd', parent, '--css', css], elsewhere).code,
      ).toBe(0)
      expect(
        run(['list', '--cwd', parent, '--data', data], elsewhere).code,
      ).toBe(0)
    })

    it('points a search with no match to the words tokens use', () => {
      const { code, stdout } = run(['tokens', 'gap'])
      expect(code).toBe(0)
      expect(stdout).toContain('No token matches "gap".')
      expect(stdout).toContain('Tokens do not use "gap": try spacing.')
      expect(stdout).toContain(
        'Semantic token names start with: background, spacing, text.',
      )
    })

    it('includes the internal tokens with --all', () => {
      expect(run(['tokens', 'primitives', '--all']).stdout).toContain(
        '--eds-primitives-spacing-75',
      )
    })

    it('rejects an unknown scheme', () => {
      const { code, stderr } = run(['tokens', '--scheme', 'blue'])
      expect(code).toBe(1)
      expect(stderr).toContain('--scheme must be one of light, dark')
    })
  })

  describe('errors', () => {
    it('tells the user to install eds-core-react', () => {
      const empty = mkdtempSync(join(tmpdir(), 'eds-cli-empty-'))
      const { code, stderr } = run(['list'], empty)
      expect(code).toBe(1)
      expect(stderr).toContain('@equinor/eds-core-react is not installed')
    })

    it('finds packages installed in a parent folder, as Node does', () => {
      const nested = join(makeProject(), 'apps/web')
      mkdirSync(nested, { recursive: true })
      expect(run(['list'], nested).code).toBe(0)
    })

    it('explains an installed version without component data', () => {
      const { code, stderr } = run(['list'], makeProject({ data: false }))
      expect(code).toBe(1)
      expect(stderr).toContain(
        '@equinor/eds-core-react 3.0.0-beta.9 has no component data for agents',
      )
      // Installing @beta again would not help when it is already the latest.
      expect(stderr).toContain(
        'Check for one with `npm view @equinor/eds-core-react@beta version`, and update only if it is newer than 3.0.0-beta.9.',
      )
      expect(stderr).not.toContain('npm install')
    })

    it('refuses data with another schema version', () => {
      const { stderr } = run(['list'], makeProject({ schemaVersion: 2 }))
      expect(stderr).toContain('uses data schema 2')
    })

    it('explains eds-tokens without the beta CSS', () => {
      const { stderr } = run(['tokens'], makeProject({ tokens: 'none' }))
      expect(stderr).toContain(
        '@equinor/eds-tokens 3.0.0-beta.9 has no beta tokens',
      )
    })

    it('does not mistake the 2.x bundle for the beta tokens', () => {
      const { code, stderr } = run(
        ['tokens'],
        makeProject({ tokens: 'legacy' }),
      )
      expect(code).toBe(1)
      expect(stderr).toContain('@equinor/eds-tokens 2.3.2 has no beta tokens')
    })

    it('explains component data that is not valid JSON', () => {
      const broken = join(mkdtempSync(join(tmpdir(), 'eds-cli-')), 'data.json')
      writeFileSync(broken, '{ "schemaVersion": 1,')
      const { code, stderr } = run(['list', '--data', broken])
      expect(code).toBe(1)
      expect(stderr).toContain('it is not valid JSON')
    })

    it('rejects an unknown command and an unknown option', () => {
      expect(run(['make']).stderr).toContain('Unknown command make')
      expect(run(['list', '--colour']).stderr).toContain(
        "Unknown option '--colour'",
      )
    })
  })

  describe('the real token bundle', () => {
    it('finds the semantic tokens and every scheme and density scope', () => {
      const css = readFileSync(
        new URL(
          '../../eds-tokens/src/tokens/css/variables.css',
          import.meta.url,
        ),
        'utf8',
      )
      const sheet = parseTokens(css)
      expect(sheet.semantic.size).toBeGreaterThan(0)
      expect(
        [...sheet.semantic.keys()].every((n) => n.startsWith('--eds-')),
      ).toBe(true)
      expect([...sheet.densities.keys()].sort()).toEqual([
        'comfortable',
        'compact',
        'relaxed',
      ])
      expect([...sheet.schemes.keys()].sort()).toEqual(['dark', 'light'])
      expect(sheet.root.size).toBeGreaterThan(0)
    })
  })

  describe('help and version', () => {
    it('prints help without a command', () => {
      expect(run([]).stdout).toContain('eds show <Component>')
    })

    it('prints the versions of the installed packages', () => {
      const { stdout } = run(['--version'])
      expect(stdout).toMatch(/^@equinor\/eds-cli \d/)
      expect(stdout).toContain('@equinor/eds-core-react 3.0.0-beta.9')
      expect(stdout).toContain('@equinor/eds-tokens 3.0.0-beta.9')
    })
  })
})
