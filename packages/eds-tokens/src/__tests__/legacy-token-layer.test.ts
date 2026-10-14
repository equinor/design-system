import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

/**
 * Guards the one rule that makes the `@layer eds-tokens` wrap (ADR-0014 § 6)
 * do anything in a repository that still ships both token bundles.
 *
 * Unlayered CSS beats any layer whatever the import order, so a page that has
 * the legacy 2.x bundle next to the wrapped Tokens Studio one resolves all ten
 * shared names (`--eds-elevation-low/high` and the eight
 * `--eds-typography-header-*-font-size`) to the legacy value unless legacy
 * sits in a lower layer. Dropping a `layer(…)` reintroduces that silently: the
 * values are close enough that nothing looks broken, and the layer order
 * statement stays intact, so nothing else in the build notices.
 *
 * A stylesheet lands the legacy bundle on such a page two ways, and the rule
 * binds both:
 *
 * 1. It imports both bundles itself. Discovered rather than listed, so a new
 *    one is covered the day it is written instead of the day someone remembers
 *    this file.
 * 2. It is the published EDS 2.0 component entry. `next/index.css` imports
 *    only the legacy bundle, but every app that consumes `/next` is an app on
 *    the new tokens, so it is the mixing page even though the file is not the
 *    mixing stylesheet. This one has to be named: nothing in the file says so.
 *
 * Neither covers a stylesheet that loads the legacy bundle alone on the 2.x
 * line, which is why `eds-tailwind/style.css` and `eds-demo`'s globals are
 * untouched by this: no second bundle, no collision to settle.
 *
 * The test lives in eds-tokens because that is the package whose output the
 * rule protects; the paths it reads belong to other workspaces.
 */

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../..',
)

/** Where stylesheets live in this repo. Keeps the walk off node_modules. */
const SEARCH_ROOTS = [
  'packages/eds-core-react/src',
  'packages/eds-core-react/.storybook',
  'packages/eds-tokens/src',
  'packages/eds-tailwind',
  'apps/design-system-docs/src',
  'apps/eds-demo/src',
]

const COMPONENTS_ENTRY = 'packages/eds-core-react/src/components/next/index.css'

const LAYER_ORDER =
  '@layer eds-tokens-legacy, eds-tokens, eds-elements, eds-components;'

/**
 * `@equinor/eds-tokens/css/variables`, optionally with a layer(). Kept
 * unflagged: a /g regex carries lastIndex between calls, so reusing one for
 * both the detection and the match would skip every other file.
 */
const LEGACY_IMPORT =
  /@import\s+["']@equinor\/eds-tokens\/css\/variables["'][^;]*;/
const LEGACY_IMPORTS = new RegExp(LEGACY_IMPORT.source, 'g')

/**
 * The Tokens Studio bundle, under either name: the published specifier, or
 * the relative path Storybook uses because the ./next/* exports only exist at
 * publish time (ADR-0009).
 */
const STUDIO_IMPORT =
  /@import\s+["'][^"']*(?:@equinor\/eds-tokens\/next\/css\/variables\.css|eds-tokens\/src\/tokens\/css\/variables\.css)["']/

function cssFilesUnder(dir: string): string[] {
  const absolute = path.join(repoRoot, dir)
  if (!fs.existsSync(absolute)) return []

  return fs
    .readdirSync(absolute, { recursive: true, encoding: 'utf-8' })
    .filter((entry) => entry.endsWith('.css'))
    .map((entry) => path.relative(repoRoot, path.join(absolute, entry)))
}

const read = (relative: string) =>
  fs.readFileSync(path.join(repoRoot, relative), 'utf-8')

const bothBundles = SEARCH_ROOTS.flatMap(cssFilesUnder)
  .filter((relative) => {
    const css = read(relative)
    return LEGACY_IMPORT.test(css) && STUDIO_IMPORT.test(css)
  })
  .sort()

const governed = [...new Set([...bothBundles, COMPONENTS_ENTRY])].sort()

describe('stylesheets that put the legacy bundle on a Tokens Studio page', () => {
  it('finds the stylesheets importing both bundles, so a broken walk fails instead of passing empty', () => {
    expect(bothBundles).toEqual([
      'apps/design-system-docs/src/css/theme-variables.css',
      'packages/eds-core-react/.storybook/preview.css',
    ])
  })

  it('still finds the components entry to govern by name', () => {
    expect(fs.existsSync(path.join(repoRoot, COMPONENTS_ENTRY))).toBe(true)
  })

  it.each(governed)(
    '%s imports the legacy bundle into eds-tokens-legacy and declares the layer order',
    (relative) => {
      const css = read(relative)

      for (const statement of css.match(LEGACY_IMPORTS) ?? [])
        expect(statement).toMatch(/layer\(eds-tokens-legacy\)/)

      expect(css.replace(/\/\*[\s\S]*?\*\//g, '')).toContain(LAYER_ORDER)
    },
  )
})
