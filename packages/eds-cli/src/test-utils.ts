import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import type { ComponentData } from './types.js'
import type { Io } from './main.js'

export const componentData: ComponentData = {
  schemaVersion: 1,
  package: '@equinor/eds-core-react',
  installLine: 'npm install @equinor/eds-core-react@beta',
  components: [
    {
      name: 'Button',
      description:
        'Button triggers an action, such as saving a form. It has three variants.',
      status: 'active',
      importLine: "import { Button } from '@equinor/eds-core-react/next'",
      hasAsChild: true,
      props: [
        {
          name: 'variant',
          optional: true,
          type: "'primary' | 'secondary' | 'ghost'",
          default: "'primary'",
          description: 'Visual style',
        },
      ],
      baseTypes: [
        {
          name: 'ButtonHTMLAttributes<HTMLButtonElement>',
          omitted: ['children'],
        },
      ],
      subComponents: [],
      examples: [1, 2, 3, 4].map((n) => ({
        title: `Example ${n}`,
        code: `<Button>Save ${n}</Button>`,
      })),
      guidance: { usage: 'Use one primary button per view.' },
      links: { docs: 'https://eds.equinor.com/button' },
    },
    {
      name: 'TextField',
      description: null,
      status: 'active',
      importLine: "import { TextField } from '@equinor/eds-core-react/next'",
      hasAsChild: false,
      props: [
        {
          name: 'label',
          optional: false,
          type: 'string',
          description: 'Field label',
        },
      ],
      baseTypes: [
        { name: 'InputHTMLAttributes<HTMLInputElement>', omitted: [] },
      ],
      subComponents: [],
      examples: [],
      guidance: {},
      links: {},
    },
    {
      name: 'Field',
      description: 'Field lays out a label, a control and a message.',
      status: 'deprecated',
      importLine: "import { Field } from '@equinor/eds-core-react/next'",
      hasAsChild: false,
      props: [],
      baseTypes: [{ name: 'HTMLAttributes<HTMLDivElement>', omitted: [] }],
      subComponents: ['Field.Label'],
      examples: [],
      guidance: {},
      links: {},
    },
  ],
}

export const tokenCss = `/* generated */
@layer eds-tokens-legacy, eds-tokens;
@layer eds-tokens {
:root {
  --eds-light-green-9: oklch(0.5 0.1 150);
  --eds-dark-green-9: oklch(0.7 0.1 150);
  --eds-primitives-spacing-75: 12px;
  --eds-primitives-spacing-50: 8px;
}
[data-density="comfortable"] {
  --eds-density-spacing-md: var(--eds-primitives-spacing-75);
}
[data-density="compact"] {
  --eds-density-spacing-md: var(--eds-primitives-spacing-50);
}
[data-density] {
  --eds-background-interactive-accent-emphasis-default: var(--eds-accent-9);
  --eds-spacing-md: var(--eds-density-spacing-md);
  --eds-text-link: var(--eds-missing, blue);
}
[data-color-scheme="dark"] {
  --eds-accent-9: var(--eds-dark-green-9);
}
[data-color-scheme="light"] {
  --eds-accent-9: var(--eds-light-green-9);
}
}
`

function write(file: string, content: string) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

/**
 * A project folder with the two EDS packages installed, as far as the CLI
 * reads them. `options` leaves pieces out to test the error messages.
 */
export function makeProject(
  options: { data?: boolean; css?: boolean; schemaVersion?: number } = {},
): string {
  const { data = true, css = true, schemaVersion = 1 } = options
  const project = mkdtempSync(join(tmpdir(), 'eds-cli-'))
  const modules = join(project, 'node_modules/@equinor')

  write(
    join(modules, 'eds-core-react/package.json'),
    JSON.stringify({
      name: '@equinor/eds-core-react',
      version: '3.0.0-beta.9',
    }),
  )
  if (data) {
    write(
      join(modules, 'eds-core-react/build/agent/components.json'),
      JSON.stringify({ ...componentData, schemaVersion }),
    )
  }
  write(
    join(modules, 'eds-tokens/package.json'),
    JSON.stringify({ name: '@equinor/eds-tokens', version: '3.0.0-beta.9' }),
  )
  if (css) {
    write(join(modules, 'eds-tokens/src/tokens/css/variables.css'), tokenCss)
  }
  return project
}

/** Runs the CLI in `cwd` and collects what it prints */
export function capture(cwd: string): Io & { stdout: string; stderr: string } {
  const io = {
    cwd,
    stdout: '',
    stderr: '',
    out: (text: string) => {
      io.stdout += `${text}\n`
    },
    err: (text: string) => {
      io.stderr += `${text}\n`
    },
  }
  return io
}
