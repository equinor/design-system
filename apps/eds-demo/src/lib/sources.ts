import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { cssFiles, modes, type Sources } from './preferences'

/** Read at build time (the app is a static export), so the CSS stays in
 * normal .css files in the repository. */
const root = process.cwd()

export function readSources(): Sources {
  const read = (path: string) => readFileSync(join(root, path), 'utf8')
  return Object.fromEntries(
    modes.map((mode) => [
      mode,
      Object.fromEntries(
        cssFiles.map((file) => [file, read(`src/css/${mode}/${file}.css`)]),
      ),
    ]),
  ) as Sources
}

/** The token names that are meant for app code, for autocomplete: the
 * semantic names from the beta bundle, without the primitives, the density
 * layer and the other internal names behind them (ADR-0028 point 7). */
const PUBLISHED =
  /^--eds-(background|text|border|icon|spacing|corner-radius|typography|font-family|font-weight|elevation|overlay)-/

export function readTokenNames(): string[] {
  const bundle = readFileSync(
    join(root, 'node_modules/@equinor/eds-tokens/src/tokens/css/variables.css'),
    'utf8',
  )
  const names = new Set<string>()
  for (const match of bundle.matchAll(/(--eds-[a-z0-9-]+)\s*:/g)) {
    if (PUBLISHED.test(match[1])) names.add(match[1])
  }
  return [...names].sort()
}
