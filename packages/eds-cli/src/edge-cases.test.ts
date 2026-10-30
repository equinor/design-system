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

    it('allows one typo in token search when nothing matches exactly', () => {
      expect(run(['tokens', 'spcing']).stdout).toMatch(/--eds-spacing-md +12px/)
    })
  })

  describe('JSON with --section', () => {
    it('keeps only the name and the requested part', () => {
      const { stdout } = run(['show', 'Button', '--section', 'props', '--json'])
      const [button] = JSON.parse(stdout) as Record<string, unknown>[]
      expect(Object.keys(button)).toEqual(['name', 'props', 'baseTypes'])
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
