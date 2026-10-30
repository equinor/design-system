import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CliError, fail } from './errors.js'
import { findPackage, hasExport } from './resolve.js'
import type { Component, ComponentData } from './types.js'

/**
 * The schema versions of components.json this CLI can read. New fields within a
 * schema are additive and ignored by older CLIs, so only a change that breaks
 * existing fields bumps it. Data outside the range names the package that is
 * behind.
 */
export const OLDEST_SCHEMA = 1
export const SUPPORTED_SCHEMA = 1

const PACKAGE = '@equinor/eds-core-react'
const DATA_FILE = 'build/agent/components.json'

// Errors say what is missing and leave upgrades to the developer: moving a
// product from 2.x to the beta is a major upgrade, not something an agent
// should do to get an answer.
export const notInstalled = (pkg: string, cwd: string) =>
  `${pkg} is not installed for ${cwd}. In a monorepo, point to the app that uses EDS with --cwd <folder>.`

/**
 * Reads the component data from `dataPath`, or else from the
 * `@equinor/eds-core-react` installed for `cwd`, so the answers match the
 * version the project uses.
 */
export function loadComponents(cwd: string, dataPath?: string): ComponentData {
  let file = dataPath
  if (!file) {
    const pkg = findPackage(PACKAGE, cwd)
    if (!pkg) return fail(notInstalled(PACKAGE, cwd))
    // Stable 2.x ships the same build/ folder but not the ./next export the
    // import lines use, so its data would give imports that fail.
    if (!hasExport(pkg, './next')) {
      return fail(
        `${PACKAGE} ${pkg.version} has no beta components (no ./next export). The CLI covers the beta components in ${PACKAGE}@beta, and moving to them is a major upgrade for the developer to decide.`,
      )
    }
    file = join(pkg.root, DATA_FILE)
    // No install command here: the project may already have the latest beta,
    // and an agent told to install it would repeat the same failing step.
    if (!existsSync(file)) {
      return fail(
        `${PACKAGE} ${pkg.version} has no component data for agents. The data ships with a later beta. Check for one with \`npm view ${PACKAGE}@beta version\`, and update only if it is newer than ${pkg.version}.`,
      )
    }
  }
  if (!existsSync(file)) return fail(`No such file: ${file}`)

  let data: ComponentData | null
  try {
    data = JSON.parse(readFileSync(file, 'utf8')) as ComponentData | null
  } catch {
    return fail(`Could not read ${file}: it is not valid JSON.`)
  }
  if (
    !data ||
    typeof data.schemaVersion !== 'number' ||
    !Array.isArray(data.components)
  ) {
    return fail(`${file} is not component data for @equinor/eds-cli.`)
  }
  if (data.schemaVersion > SUPPORTED_SCHEMA) {
    fail(
      `${file} uses data schema ${data.schemaVersion}, newer than this version of @equinor/eds-cli reads (${SUPPORTED_SCHEMA}). Update @equinor/eds-cli.`,
    )
  }
  if (data.schemaVersion < OLDEST_SCHEMA) {
    fail(
      `${file} uses data schema ${data.schemaVersion}, older than this version of @equinor/eds-cli reads (${OLDEST_SCHEMA}). Update ${PACKAGE}.`,
    )
  }
  return data
}

/**
 * The named components that exist, and an error for each name that does not,
 * so one wrong guess does not cost the agent the rest of the answer.
 */
export function findComponents(
  data: ComponentData,
  names: string[],
): { found: Component[]; errors: string[] } {
  const found: Component[] = []
  const errors: string[] = []
  for (const name of names) {
    try {
      found.push(findComponent(data, name))
    } catch (error) {
      if (!(error instanceof CliError)) throw error
      errors.push(error.message)
    }
  }
  return { found, errors }
}

/**
 * The component called `name`, ignoring case. An unknown name fails with the
 * closest matches, so an agent that guessed `Textfield` or `Card` learns what
 * exists instead.
 */
export function findComponent(data: ComponentData, name: string): Component {
  const wanted = name.toLowerCase()
  const component = data.components.find((c) => c.name.toLowerCase() === wanted)
  if (component) return component

  const similar = similarNames(data, name)
  const hint = similar.length
    ? ` Did you mean ${similar.join(', ')}?`
    : ' Run `eds list` to see the components.'
  return fail(`No component called ${name}.${hint}`)
}

/**
 * Components where every word of `query` appears in the name, description,
 * sub-components or prop names. Only when nothing matches exactly, one typo is
 * allowed in words of five letters or more, so `date` does not match "data".
 * Matches on the name come first.
 */
export function searchComponents(
  data: ComponentData,
  query: string,
): Component[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const text = (c: Component) =>
    [
      c.name,
      c.description ?? '',
      ...c.props.map((p) => p.name),
      ...c.subComponents.flatMap((sub) => [
        sub.name,
        ...sub.props.map((p) => p.name),
      ]),
    ]
      .join(' ')
      .toLowerCase()
  const exact = (haystack: string, word: string) => haystack.includes(word)
  const typo = (haystack: string, word: string) =>
    exact(haystack, word) ||
    (word.length >= 5 &&
      haystack.split(/[^a-z0-9]+/).some((t) => distance(t, word) <= 1))
  const nameHit = (c: Component) =>
    words.some((w) => c.name.toLowerCase().includes(w)) ? 0 : 1
  const find = (match: typeof exact) =>
    data.components.filter((c) => words.every((w) => match(text(c), w)))

  const matches = find(exact)
  return (matches.length ? matches : find(typo)).sort(
    (a, b) => nameHit(a) - nameHit(b) || a.name.localeCompare(b.name),
  )
}

/**
 * Component names close to `name`: containing it, contained in it, or within
 * two typos of it.
 */
export function similarNames(data: ComponentData, name: string): string[] {
  const wanted = name.toLowerCase()
  // One or two letters are close to everything.
  if (wanted.length < 3) return []
  return data.components
    .filter((c) => {
      const candidate = c.name.toLowerCase()
      return (
        candidate.includes(wanted) ||
        wanted.includes(candidate) ||
        distance(candidate, wanted) <= 2
      )
    })
    .map((c) => c.name)
}

// Levenshtein distance, for "did you mean" on short component names.
function distance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }
    previous = current
  }
  return previous[b.length]
}
