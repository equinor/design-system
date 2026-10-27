import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseArgs } from 'node:util'
import {
  findComponents,
  loadComponents,
  searchComponents,
  similarNames,
} from './components.js'
import { CliError, fail } from './errors.js'
import {
  formatComponents,
  formatList,
  formatSearch,
  formatTokens,
  SECTIONS,
  type Section,
} from './format.js'
import { findPackage } from './resolve.js'
import {
  DENSITIES,
  loadTokens,
  SCHEMES,
  searchTokens,
  tokenHints,
  type Density,
  type Scheme,
} from './tokens.js'

const HELP = `eds: look up the Equinor Design System beta components and tokens installed in this project

Usage
  eds list                  The components, with a one-line description
  eds show <Component>...   Import line, props, examples and guidance, for one or more components
  eds search <text>         Components whose name, description or props match
  eds tokens [text]         Semantic tokens whose name contains every word

Options
  --json                    Print JSON instead of text
  --section <name>          show: only ${SECTIONS.join(', ')}
  --scheme <name>           tokens: ${SCHEMES.join(' or ')} (default light)
  --density <name>          tokens: ${DENSITIES.join(', ')} (default comfortable)
  --all                     tokens: include the internal tokens, which components must not use
  --cwd <dir>               Read the packages installed for this directory
  --data <file>             Read this components.json instead of the installed package
  --css <file>              Read this token CSS instead of the installed package
  -v, --version             Versions of the CLI and the installed EDS packages
  -h, --help                This help

Answers come from the installed @equinor/eds-core-react and @equinor/eds-tokens,
so they match the versions the project uses.`

export type Io = {
  cwd: string
  out: (text: string) => void
  err: (text: string) => void
}

const OPTIONS = {
  json: { type: 'boolean' },
  section: { type: 'string' },
  scheme: { type: 'string' },
  density: { type: 'string' },
  all: { type: 'boolean' },
  cwd: { type: 'string' },
  data: { type: 'string' },
  css: { type: 'string' },
  version: { type: 'boolean', short: 'v' },
  help: { type: 'boolean', short: 'h' },
} as const

function oneOf<T extends string>(
  option: string,
  value: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  if (value === undefined) return fallback
  if ((allowed as readonly string[]).includes(value)) return value as T
  return fail(`--${option} must be one of ${allowed.join(', ')}`)
}

function versions(cwd: string) {
  const own = JSON.parse(
    readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
  ) as { version: string }
  const lines = [`@equinor/eds-cli ${own.version}`]
  for (const name of ['@equinor/eds-core-react', '@equinor/eds-tokens']) {
    const pkg = findPackage(name, cwd)
    lines.push(`${name} ${pkg ? pkg.version : 'not installed'}`)
  }
  return lines.join('\n')
}

/** Runs the CLI and returns the exit code */
export function main(argv: string[], io: Io): number {
  try {
    const { values, positionals } = parseArgs({
      args: argv,
      options: OPTIONS,
      allowPositionals: true,
    })
    const cwd = resolve(io.cwd, values.cwd ?? '.')
    const [command, ...rest] = positionals
    const text = rest.join(' ')
    const print = (json: unknown, plain: () => string) =>
      io.out(values.json ? JSON.stringify(json, null, 2) : plain())

    if (values.version) {
      io.out(versions(cwd))
      return 0
    }
    if (values.help || !command) {
      io.out(HELP)
      return 0
    }

    switch (command) {
      case 'list': {
        const data = loadComponents(cwd, values.data)
        print(
          data.components.map(({ name, description, status }) => ({
            name,
            description,
            status,
          })),
          () => formatList(data),
        )
        return 0
      }
      case 'show': {
        if (!rest.length) fail('Which component? For example: eds show Button')
        const section =
          values.section === undefined
            ? undefined
            : oneOf<Section>('section', values.section, SECTIONS, 'props')
        // Component names have no spaces, so each word is one component and an
        // agent gets everything it needs for a form in one call.
        const components = findComponents(
          loadComponents(cwd, values.data),
          rest,
        )
        print(components.length === 1 ? components[0] : components, () =>
          formatComponents(components, section),
        )
        return 0
      }
      case 'search': {
        if (!text) fail('Search for what? For example: eds search date')
        const data = loadComponents(cwd, values.data)
        const matches = searchComponents(data, text)
        print(
          matches.map(({ name, description, status }) => ({
            name,
            description,
            status,
          })),
          () =>
            formatSearch(
              text,
              matches,
              matches.length ? [] : rest.flatMap((w) => similarNames(data, w)),
            ),
        )
        return 0
      }
      case 'tokens': {
        const options = {
          scheme: oneOf<Scheme>('scheme', values.scheme, SCHEMES, 'light'),
          density: oneOf<Density>(
            'density',
            values.density,
            DENSITIES,
            'comfortable',
          ),
          all: values.all ?? false,
        }
        const sheet = loadTokens(cwd, values.css)
        const tokens = searchTokens(sheet, text, options)
        print(tokens, () =>
          formatTokens(tokens, {
            ...options,
            query: text,
            hints: tokenHints(sheet, text),
          }),
        )
        return 0
      }
      default:
        return fail(`Unknown command ${command}. Run \`eds --help\`.`)
    }
  } catch (error) {
    // parseArgs throws TypeErrors with a code for unknown or malformed options.
    const fromArgs =
      error instanceof TypeError &&
      'code' in error &&
      typeof error.code === 'string' &&
      error.code.startsWith('ERR_PARSE_ARGS')
    if (!(error instanceof CliError) && !fromArgs) throw error
    io.err(`eds: ${(error as Error).message}`)
    return 1
  }
}
