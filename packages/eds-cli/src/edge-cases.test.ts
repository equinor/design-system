import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { main } from './main.js'
import { capture, componentData, makeProject } from './test-utils.js'
import { parseTokens, searchTokens, tokenHints } from './tokens.js'
import type { Component, ComponentData } from './types.js'

function run(argv: string[], cwd = makeProject()) {
  const io = capture(cwd)
  const code = main(argv, io)
  return { code, stdout: io.stdout, stderr: io.stderr }
}

const tempFile = (name: string, content: string) => {
  const file = join(mkdtempSync(join(tmpdir(), 'eds-cli-')), name)
  writeFileSync(file, content)
  return file
}

// Component data with one component changed, written to a file for --data.
const dataWith = (change: Partial<Component>) => {
  const data: ComponentData = {
    ...componentData,
    components: [{ ...componentData.components[0], ...change }],
  }
  return tempFile('components.json', JSON.stringify(data))
}

const tokenOptions = {
  scheme: 'light',
  density: 'comfortable',
  all: false,
} as const

describe('eds edge cases', () => {
  describe('resolving the token bundle', () => {
    it('lets Node resolve the exports, so an exact key wins over a pattern', () => {
      const project = makeProject()
      const manifest = join(
        project,
        'node_modules/@equinor/eds-tokens/package.json',
      )
      const pkg = JSON.parse(readFileSync(manifest, 'utf8')) as {
        exports: Record<string, string>
      }
      // A pattern listed first that points nowhere useful.
      pkg.exports = {
        './*': './missing/*',
        './next/css/variables.css': './src/tokens/css/variables.css',
      }
      writeFileSync(manifest, JSON.stringify(pkg))
      expect(run(['tokens'], project).code).toBe(0)
    })
  })

  describe('broken input', () => {
    it('says --data and --css point to a folder', () => {
      const folder = mkdtempSync(join(tmpdir(), 'eds-cli-'))
      expect(run(['list', '--data', folder]).stderr).toContain(
        'is a folder, not a file.',
      )
      expect(run(['tokens', '--css', folder]).stderr).toContain(
        'is a folder, not a file.',
      )
    })

    it('says a --css file without semantic tokens is not the beta bundle', () => {
      const css = tempFile('variables.css', ':root { --eds_old: #000; }')
      const { code, stderr } = run(['tokens', '--css', css])
      expect(code).toBe(1)
      expect(stderr).toContain('has no semantic beta tokens')
    })

    it('reports a package.json that is not valid JSON', () => {
      const project = makeProject()
      writeFileSync(
        join(project, 'node_modules/@equinor/eds-core-react/package.json'),
        '{ "name":',
      )
      const { code, stderr } = run(['list'], project)
      expect(code).toBe(1)
      expect(stderr).toMatch(
        /Could not read .*package\.json: it is not valid JSON/,
      )
    })
  })

  describe('text output', () => {
    it('takes the first sentence across line breaks and past "e.g."', () => {
      const data = dataWith({
        description:
          'Button triggers an action,\nsuch as saving, e.g. a form. More text.',
      })
      expect(run(['list', '--data', data]).stdout).toContain(
        'Button  Button triggers an action, such as saving, e.g. a form.\n',
      )
    })

    it('does not stop at "E.g." at the start of a description', () => {
      const data = dataWith({ description: 'E.g. a form button. More text.' })
      expect(run(['list', '--data', data]).stdout).toContain(
        'Button  E.g. a form button.\n',
      )
    })

    it('indents every line of a multi-line caption', () => {
      const data = dataWith({
        examples: [
          {
            title: 'Sizes',
            caption: 'Pick a size.\n| Size | px |\n| sm | 16 |',
            code: '<Button />',
          },
        ],
      })
      expect(
        run(['show', 'Button', '--section', 'examples', '--data', data]).stdout,
      ).toContain('  Sizes: Pick a size.\n    | Size | px |\n    | sm | 16 |\n')
    })

    it('says which props take the type of a generic component', () => {
      const data = dataWith({
        typeParameters: ['T = string'],
        props: [
          { name: 'options', optional: false, type: 'T[]', description: '' },
          { name: 'label', optional: false, type: 'string', description: '' },
        ],
      })
      expect(
        run(['show', 'Button', '--section', 'props', '--data', data]).stdout,
      ).toContain(
        'Props\n  Generic over T = string: pass your own type in options.\n',
      )
    })

    it('shows a hook with its component and finds the component by it', () => {
      const data = dataWith({
        hooks: [
          {
            name: 'useButtonIds',
            description: 'IDs for a button.',
            importLine:
              "import { useButtonIds } from '@equinor/eds-core-react/next'",
            signature: 'useButtonIds(id?: string): ButtonIds',
            returns: [
              {
                name: 'buttonId',
                optional: false,
                type: 'string',
                description: 'ID for the button',
              },
            ],
          },
        ],
      })
      const { stdout } = run([
        'show',
        'useButtonIds',
        '--section',
        'props',
        '--data',
        data,
      ])
      expect(stdout).toContain(
        "\nHook useButtonIds(id?: string): ButtonIds\n  IDs for a button.\n  import { useButtonIds } from '@equinor/eds-core-react/next'\n  buttonId: string\n    ID for the button\n",
      )
      expect(run(['search', 'usebuttonids', '--data', data]).stdout).toMatch(
        /^Button /,
      )
    })

    it('marks a utility in the list and in show', () => {
      const data = dataWith({ kind: 'utility' })
      expect(run(['list', '--data', data]).stdout).toContain('(utility)')
      expect(run(['show', 'Button', '--data', data]).stdout).toContain(
        'A utility for building components, not a UI component.',
      )
    })

    it('lists sizes in the order of the scale', () => {
      const sheet = parseTokens(`[data-density] {
  --eds-spacing-2xl: 32px;
  --eds-spacing-xs: 4px;
  --eds-spacing-lg: 16px;
  --eds-spacing-md: 12px;
  --eds-spacing-none: 0px;
}`)
      expect(
        searchTokens(sheet, 'spacing', tokenOptions).map((t) => t.name),
      ).toEqual([
        '--eds-spacing-none',
        '--eds-spacing-xs',
        '--eds-spacing-md',
        '--eds-spacing-lg',
        '--eds-spacing-2xl',
      ])
    })

    it('lists numbered tokens in number order', () => {
      const sheet = parseTokens(`[data-density] {
  --eds-chart-10: red;
  --eds-chart-2: green;
  --eds-chart-1: blue;
}`)
      expect(
        searchTokens(sheet, 'chart', tokenOptions).map((t) => t.name),
      ).toEqual(['--eds-chart-1', '--eds-chart-2', '--eds-chart-10'])
    })

    it('names token groups by the words their tokens share', () => {
      const sheet = parseTokens(`[data-density] {
  --eds-corner-radius-rounded: 4px;
  --eds-corner-radius-pill: 999px;
  --eds-font-family-ui: Inter;
  --eds-font-weight-bold: 700;
  --eds-overlay-scrim: black;
}`)
      expect(tokenHints(sheet, 'x').groups).toEqual([
        'corner-radius',
        'font',
        'overlay',
      ])
    })

    it('says which attributes the token values follow', () => {
      expect(
        run(['tokens', 'spacing', '--scheme', 'dark', '--density', 'compact'])
          .stdout,
      ).toContain(
        '→ The values follow data-color-scheme="dark" and data-density="compact" on an ancestor element.\n',
      )
    })

    it('points from typography to the family and weight tokens', () => {
      const css = tempFile(
        'variables.css',
        `[data-density] {
  --eds-typography-header-xl-font-size: 32px;
  --eds-spacing-md: 12px;
}`,
      )
      expect(run(['tokens', 'header', '--css', css]).stdout).toContain(
        '→ Family and weight: eds tokens font',
      )
      expect(run(['tokens', 'spacing', '--css', css]).stdout).not.toContain(
        'Family and weight',
      )
    })

    it('allows one typo in token search when nothing matches exactly', () => {
      expect(run(['tokens', 'spcing']).stdout).toMatch(/--eds-spacing-md +12px/)
    })

    it('allows one typo in a hyphenated word', () => {
      expect(run(['tokens', 'interactive-acent']).stdout).toContain(
        '--eds-background-interactive-accent-emphasis-default',
      )
    })

    it('keeps exact matches for the other words in a search with a typo', () => {
      expect(run(['tokens', 'spcing', 'md']).stdout).toMatch(
        /--eds-spacing-md +12px/,
      )
    })
  })

  describe('JSON with --section', () => {
    it('keeps only the name and the requested part', () => {
      const { stdout } = run(['show', 'Button', '--section', 'props', '--json'])
      const [button] = JSON.parse(stdout) as Record<string, unknown>[]
      expect(Object.keys(button)).toEqual([
        'name',
        'props',
        'baseTypes',
        'subComponents',
      ])
      // typeParameters and hooks are left out when the data has none.
    })

    it('keeps the props of sub-components', () => {
      const { stdout } = run(['show', 'Field', '--section', 'props', '--json'])
      const [field] = JSON.parse(stdout) as Component[]
      expect(field.subComponents.map((sub) => sub.name)).toEqual([
        'Field.Label',
      ])
      expect(field.subComponents[0].props[0].name).toBe('indicator')
    })

    it('gives null for a guidance section with no content', () => {
      const { stdout } = run([
        'show',
        'TextField',
        '--section',
        'usage',
        '--json',
      ])
      expect(JSON.parse(stdout)).toEqual([
        { name: 'TextField', guidance: { usage: null } },
      ])
    })

    it('keeps one guidance section', () => {
      const { stdout } = run(['show', 'Button', '--section', 'usage', '--json'])
      expect(JSON.parse(stdout)).toEqual([
        {
          name: 'Button',
          guidance: { usage: 'Use one primary button per view.' },
        },
      ])
    })
  })
})
