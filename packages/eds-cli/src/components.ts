import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fail } from './errors.js'
import { findPackage } from './resolve.js'
import type { Component, ComponentData } from './types.js'

/** The schema versions of components.json this CLI can read */
export const SUPPORTED_SCHEMA = 1

const PACKAGE = '@equinor/eds-core-react'
const DATA_FILE = 'build/agent/components.json'
const INSTALL = `npm install ${PACKAGE}@beta`

/**
 * Reads the component data from `dataPath`, or else from the
 * `@equinor/eds-core-react` installed for `cwd`, so the answers match the
 * version the project uses.
 */
export function loadComponents(cwd: string, dataPath?: string): ComponentData {
  let file = dataPath
  if (!file) {
    const pkg = findPackage(PACKAGE, cwd)
    if (!pkg) {
      return fail(`${PACKAGE} is not installed in ${cwd}. Run: ${INSTALL}`)
    }
    file = join(pkg.root, DATA_FILE)
    if (!existsSync(file)) {
      return fail(
        `${PACKAGE} ${pkg.version} has no component data for agents. It ships with newer beta releases. Run: ${INSTALL}`,
      )
    }
  }
  if (!existsSync(file)) return fail(`No such file: ${file}`)

  let data: ComponentData
  try {
    data = JSON.parse(readFileSync(file, 'utf8')) as ComponentData
  } catch {
    return fail(`Could not read ${file}: it is not valid JSON.`)
  }
  if (data.schemaVersion !== SUPPORTED_SCHEMA) {
    fail(
      `${file} uses data schema ${data.schemaVersion}, and this version of @equinor/eds-cli reads schema ${SUPPORTED_SCHEMA}. Update @equinor/eds-cli.`,
    )
  }
  return data
}

/** Every named component, failing on the first unknown name */
export function findComponents(
  data: ComponentData,
  names: string[],
): Component[] {
  return names.map((name) => findComponent(data, name))
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
 * sub-components or prop names, allowing one typo in words of four letters or
 * more. Matches on the name come first.
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
      ...c.subComponents,
      ...c.props.map((p) => p.name),
    ]
      .join(' ')
      .toLowerCase()
  const matches = (haystack: string, word: string) =>
    haystack.includes(word) ||
    (word.length >= 4 &&
      haystack.split(/[^a-z0-9]+/).some((t) => distance(t, word) <= 1))
  const nameHit = (c: Component) =>
    words.some((w) => c.name.toLowerCase().includes(w)) ? 0 : 1

  return data.components
    .filter((c) => words.every((w) => matches(text(c), w)))
    .sort((a, b) => nameHit(a) - nameHit(b) || a.name.localeCompare(b.name))
}

/**
 * Component names close to `name`: containing it, contained in it, or within
 * two typos of it.
 */
export function similarNames(data: ComponentData, name: string): string[] {
  const wanted = name.toLowerCase()
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
