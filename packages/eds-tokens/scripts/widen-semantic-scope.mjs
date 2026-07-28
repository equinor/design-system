/**
 * Widen the semantic layer's selector from `:root` to
 * `:root, [data-color-scheme]` so semantic tokens re-resolve inside
 * `[data-color-scheme]` subtrees (#5226).
 *
 * The semantic layer references the scale aliases (`--eds-accent-N`,
 * `--eds-neutral-N`, …) that only exist under the
 * `[data-color-scheme="light"|"dark"]` scope rules, and CSS custom
 * properties substitute where they are *declared* — declared only at
 * `:root`, the semantic tokens resolve once at the root and subtree
 * colour-scheme switching never reaches them.
 *
 * Only the semantic layer is widened. The CSS export's `rootSelector`
 * is global across all non-dimensional layers, and widening everything
 * regresses the density cascade: `density/comfortable.css` (the density
 * base) declares the same `--eds-density-*` names as the compact and
 * relaxed variants, so re-declaring it on every `[data-color-scheme]`
 * element clobbers a `[data-density]` ancestor's values for the whole
 * subtree. The export format has no per-layer selector, hence this
 * post-export step. It runs before generate-css-bundle.mjs (chained in
 * the `generate:css-bundle` package script), and the bundler asserts
 * the widening happened (shared pattern in semantic-scope.mjs).
 *
 * Known caveat, tracked in #5221: three names (`border-focus`,
 * `text-disabled`, `border-disabled`) are declared in both the
 * color-scheme layer and the semantic layer. On `[data-color-scheme]`
 * elements the widened semantic block wins those at equal specificity
 * (it sorts last in the bundle) — a token-content bug upstream, not a
 * consequence of this step.
 *
 * Every `semantic/*.css` file is widened, matching the bundler's
 * directory glob — a file the export adds later must not slip through
 * with the narrow selector. Idempotent; fails loudly if a semantic
 * file does not start with either the narrow or the widened selector.
 *
 * Usage: node scripts/widen-semantic-scope.mjs [--dir <path>]
 */
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { NARROW_RE, WIDE, WIDE_RE } from './semantic-scope.mjs'

const args = parseArgs(process.argv.slice(2))
const DIR = args.dir ?? 'src/tokens/css/semantic'

const files = (await readdir(DIR).catch(() => fail(`cannot read ${DIR}`)))
  .filter((file) => file.endsWith('.css'))
  .sort()

if (files.length === 0) fail(`no CSS files found under ${DIR}`)

for (const file of files) {
  const path = join(DIR, file)
  const css = await readFile(path, 'utf8')
  if (WIDE_RE.test(css)) {
    console.log(`widen-semantic-scope: ${path} already widened`)
  } else if (NARROW_RE.test(css)) {
    await writeFile(path, css.replace(NARROW_RE, WIDE))
    console.log(`widen-semantic-scope: widened ${path}`)
  } else {
    fail(
      `${path} does not start with a ":root" selector — the export layout changed, review #5226 before proceeding`,
    )
  }
}

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, '')
    const value = argv[i + 1]
    if (!key || !value) fail(`invalid arguments: ${argv.join(' ')}`)
    out[key] = value
  }
  return out
}

function fail(message) {
  console.error(`widen-semantic-scope: ${message}`)
  process.exit(1)
}
